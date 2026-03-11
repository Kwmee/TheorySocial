package com.theory.backend.repository;

import com.theory.backend.model.TheoryFavorite;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TheoryFavoriteRepository extends JpaRepository<TheoryFavorite, Long> {
    Optional<TheoryFavorite> findByTheoryIdAndUserId(Long theoryId, Long userId);

    @EntityGraph(attributePaths = {"theory", "theory.author"})
    List<TheoryFavorite> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<TheoryFavorite> findAllByUserIdAndTheoryIdIn(Long userId, Collection<Long> theoryIds);

    void deleteAllByTheoryId(Long theoryId);
}
