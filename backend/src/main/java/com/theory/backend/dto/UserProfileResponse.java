package com.theory.backend.dto;

import com.theory.backend.model.User;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String username,
        String profileImageUrl,
        String bio,
        LocalDateTime createdAt,
        long theoryCount,
        long followersCount,
        long followingCount,
        boolean followedByViewer,
        PinnedTheorySummary pinnedTheory
) {
    public static UserProfileResponse from(User user,
                                           long theoryCount,
                                           long followersCount,
                                           long followingCount,
                                           boolean followedByViewer) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.getBio(),
                user.getCreatedAt(),
                theoryCount,
                followersCount,
                followingCount,
                followedByViewer,
                user.getPinnedTheory() == null
                        ? null
                        : new PinnedTheorySummary(
                                user.getPinnedTheory().getId(),
                                user.getPinnedTheory().getTitle(),
                                user.getPinnedTheory().getContent()
                        )
        );
    }

    public record PinnedTheorySummary(
            Long id,
            String title,
            String content
    ) {
    }
}
