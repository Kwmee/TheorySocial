package com.theory.backend.dto;

import com.theory.backend.model.Theory;

import java.time.LocalDateTime;

public record TheoryResponse(
        Long id,
        String title,
        String content,
        int score,
        int viewerVote,
        long responseCount,
        LocalDateTime createdAt,
        AuthorSummary author
) {
    public static TheoryResponse from(Theory theory, int viewerVote, long responseCount) {
        return new TheoryResponse(
                theory.getId(),
                theory.getTitle(),
                theory.getContent(),
                theory.getScore(),
                viewerVote,
                responseCount,
                theory.getCreatedAt(),
                new AuthorSummary(
                        theory.getAuthor().getId(),
                        theory.getAuthor().getUsername(),
                        theory.getAuthor().getProfileImageUrl()
                )
        );
    }

    public record AuthorSummary(
            Long id,
            String username,
            String profileImageUrl
    ) {
    }
}
