package com.theory.backend.dto;

import com.theory.backend.model.User;

public record UserSuggestionResponse(
        Long id,
        String username,
        String profileImageUrl,
        String bio,
        long followerCount,
        long theoryCount,
        boolean followedByViewer
) {
    public static UserSuggestionResponse from(User user, long followerCount, long theoryCount, boolean followedByViewer) {
        return new UserSuggestionResponse(
                user.getId(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.getBio(),
                followerCount,
                theoryCount,
                followedByViewer
        );
    }
}
