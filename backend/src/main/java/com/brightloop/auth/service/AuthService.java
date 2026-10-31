package com.brightloop.auth.service;

import com.brightloop.auth.dto.AuthResponse;
import com.brightloop.auth.dto.CreateStaffRequest;
import com.brightloop.auth.dto.LoginRequest;
import com.brightloop.auth.dto.RegisterRequest;
import com.brightloop.auth.entity.Role;
import com.brightloop.auth.entity.User;
import com.brightloop.auth.repository.UserRepository;
import com.brightloop.auth.security.JwtService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private static final String INVALID_CREDENTIALS = "Invalid email or password";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    /** Used to keep login timing similar when the email does not exist. */
    private final String dummyHash;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.dummyHash = passwordEncoder.encode("timing-equalizer");
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Role is always CUSTOMER; the request has no role field.
        User user = createUser(request.name(), request.email(), request.password(), Role.CUSTOMER);
        return AuthResponse.of(user, jwtService.generateToken(user));
    }

    @Transactional
    public AuthResponse createStaff(CreateStaffRequest request) {
        User user = createUser(request.name(), request.email(), request.password(), Role.STAFF);
        return AuthResponse.of(user, null); // no token issued on behalf of the new staff member
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email).orElse(null);

        boolean valid = passwordEncoder.matches(request.password(), user != null ? user.getPassword() : dummyHash);
        if (user == null || !valid) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS);
        }
        return AuthResponse.of(user, jwtService.generateToken(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String email) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return AuthResponse.of(user, null);
    }

    private User createUser(String name, String email, String rawPassword, Role role) {
        String normalizedEmail = normalizeEmail(email);
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw emailTaken();
        }
        User user = new User(name.trim(), normalizedEmail, passwordEncoder.encode(rawPassword), role);
        try {
            return userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException ex) {
            // Concurrent registration hit the unique constraint.
            throw emailTaken();
        }
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static ResponseStatusException emailTaken() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
    }
}
