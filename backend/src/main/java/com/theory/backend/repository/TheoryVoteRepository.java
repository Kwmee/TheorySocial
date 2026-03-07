package com.theory.backend.repository;

import com.theory.backend.model.TheoryVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TheoryVoteRepository extends JpaRepository<TheoryVote, Long> {
    Optional<TheoryVote> findByTheoryIdAndUserId(Long theoryId, Long userId);
    List<TheoryVote> findAllByUserIdAndTheoryIdIn(Long userId, Collection<Long> theoryIds);
}
