package com.theory.backend.dto;

import com.theory.backend.model.UserNotification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String type,
        String message,
        boolean read,
        LocalDateTime createdAt,
        TheoryResponse.AuthorSummary actor,
        TheorySummary theory
) {
    public static NotificationResponse from(UserNotification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt(),
                new TheoryResponse.AuthorSummary(
                        notification.getActor().getId(),
                        notification.getActor().getUsername(),
                        notification.getActor().getProfileImageUrl()
                ),
                new TheorySummary(
                        notification.getTheory().getId(),
                        notification.getTheory().getTitle()
                )
        );
    }

    public record TheorySummary(
            Long id,
            String title
    ) {
    }
}
