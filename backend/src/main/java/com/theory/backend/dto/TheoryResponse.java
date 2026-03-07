package com.theory.backend.dto;

import com.theory.backend.model.Theory;

import java.time.LocalDateTime;

public record TheoryResponse(
        Long id,
        String title,
        String content,
        int score,
        int viewerVote,
        LocalDateTime createdAt,
        AuthorSummary author
) {
    public static TheoryResponse from(Theory theory, int viewerVote) {
        return new TheoryResponse(
                theory.getId(),
                theory.getTitle(),
                theory.getContent(),
                theory.getScore(),
                viewerVote,
                theory.getCreatedAt(),
                new AuthorSummary(
                        theory.getAuthor().getId(),
                        theory.getAuthor().getUsername()
                )
        );
    }

    public record AuthorSummary(
            Long id,
            String username
    ) {
    }
}
