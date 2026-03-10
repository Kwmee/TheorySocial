package com.theory.backend.dto;

import com.theory.backend.model.User;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String username,
        String profileImageUrl,
        String bio,
        LocalDateTime createdAt
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.getBio(),
                user.getCreatedAt()
        );
    }
}
