package com.theory.backend.repository;

import com.theory.backend.model.TheoryReplyVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TheoryReplyVoteRepository extends JpaRepository<TheoryReplyVote, Long> {
    Optional<TheoryReplyVote> findByResponseIdAndUserId(Long responseId, Long userId);

    List<TheoryReplyVote> findAllByUserIdAndResponseIdIn(Long userId, Collection<Long> responseIds);

    void deleteAllByResponseId(Long responseId);
    void deleteAllByResponseTheoryId(Long theoryId);
}
