package com.theory.backend.dto;

import com.theory.backend.model.TheoryReply;

import java.time.LocalDateTime;

public record TheoryReplyResponse(
        Long id,
        Long theoryId,
        String content,
        int score,
        int viewerVote,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        TheoryResponse.AuthorSummary author
) {
    public static TheoryReplyResponse from(TheoryReply reply, int viewerVote) {
        return new TheoryReplyResponse(
                reply.getId(),
                reply.getTheory().getId(),
                reply.getContent(),
                reply.getScore(),
                viewerVote,
                reply.getCreatedAt(),
                reply.getUpdatedAt(),
                new TheoryResponse.AuthorSummary(
                        reply.getAuthor().getId(),
                        reply.getAuthor().getUsername()
                )
        );
    }
}
