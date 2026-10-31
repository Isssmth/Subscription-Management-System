package com.brightloop.auth.dto;

import com.brightloop.auth.entity.Role;
import com.brightloop.auth.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;

/** Never contains the password hash. Token is omitted from JSON when null (staff creation). */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthResponse(Long userId, String name, String email, Role role, String token) {

    public static AuthResponse of(User user, String token) {
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token);
    }
}