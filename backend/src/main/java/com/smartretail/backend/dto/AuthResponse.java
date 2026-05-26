package com.smartretail.backend.dto;

import com.smartretail.backend.entity.Role;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String email;
    private String fullName;
    private Role role;
    private Long userId;
    private String message;

    public AuthResponse() {}

    // Getters
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public Long getUserId() { return userId; }
    public String getMessage() { return message; }

    // Setters
    public void setToken(String token) { this.token = token; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public void setEmail(String email) { this.email = email; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setRole(Role role) { this.role = role; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setMessage(String message) { this.message = message; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuthResponse r = new AuthResponse();

        public Builder token(String token) { r.token = token; return this; }
        public Builder refreshToken(String refreshToken) { r.refreshToken = refreshToken; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder fullName(String fullName) { r.fullName = fullName; return this; }
        public Builder role(Role role) { r.role = role; return this; }
        public Builder userId(Long userId) { r.userId = userId; return this; }
        public Builder message(String message) { r.message = message; return this; }

        public AuthResponse build() { return r; }
    }
}
