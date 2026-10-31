package com.brightloop.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateStaffRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email format is invalid")
        @Size(max = 255, message = "Email must be at most 255 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Pattern(regexp = RegisterRequest.PASSWORD_PATTERN,
                message = "Password must be 9-72 characters and contain an uppercase letter, "
                        + "a lowercase letter and a special character")
        String password) {

    @Override
    public String toString() {
        return "CreateStaffRequest[name=" + name + ", email=" + email + ", password=***]";
    }
}