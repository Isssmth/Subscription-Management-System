package com.brightloop.auth;

import com.brightloop.auth.entity.Role;
import com.brightloop.auth.entity.User;
import com.brightloop.auth.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    @Test
    @DisplayName("Generates and validates token with Base64 secret")
    void tokenGenerationWithBase64Secret() {
        String base64Secret = "c29tZS1zZWN1cmUtZGVmYXVsdC1qd3Qtc2VjcmV0LWtleS1mb3ItZGV2ZWxvcG1lbnQtb25seS0yNTZiaXQ=";
        JwtService service = new JwtService(base64Secret, 3600000L);

        User user = new User("Jane Doe", "jane@example.com", "hash", Role.CUSTOMER);
        String token = service.generateToken(user);

        assertThat(token).isNotBlank();
        assertThat(service.isTokenValid(token)).isTrue();
        assertThat(service.extractEmail(token)).isEqualTo("jane@example.com");
    }

    @Test
    @DisplayName("Generates and validates token with plain text non-base64 secret")
    void tokenGenerationWithPlainTextSecret() {
        String plainSecret = "this-is-a-plain-text-secret-with-special-characters-!@#$%^&*()";
        JwtService service = new JwtService(plainSecret, 3600000L);

        User user = new User("Admin", "admin@example.com", "hash", Role.ADMIN);
        String token = service.generateToken(user);

        assertThat(token).isNotBlank();
        assertThat(service.isTokenValid(token)).isTrue();
        assertThat(service.extractEmail(token)).isEqualTo("admin@example.com");
    }

    @Test
    @DisplayName("Rejects short secret (< 32 bytes)")
    void rejectsShortSecret() {
        assertThatThrownBy(() -> new JwtService("short-secret", 3600000L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("at least 32 bytes");
    }

    @Test
    @DisplayName("Rejects blank secret")
    void rejectsBlankSecret() {
        assertThatThrownBy(() -> new JwtService("   ", 3600000L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("must not be blank");
    }
}
