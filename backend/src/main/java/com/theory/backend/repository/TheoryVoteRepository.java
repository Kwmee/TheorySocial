package com.theory.backend.repository;

import com.theory.backend.model.TheoryVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TheoryVoteRepository extends JpaRepository<TheoryVote, Long> {
    Optional<TheoryVote> findByTheoryIdAndUserId(Long theoryId, Long userId);
    List<TheoryVote> findAllByUserIdAndTheoryIdIn(Long userId, Collection<Long> theoryIds);
    void deleteAllByTheoryId(Long theoryId);

    @Query(
            value = """
                    SELECT t.id
                    FROM theories t
                    LEFT JOIN theory_votes recent
                        ON recent.theory_id = t.id
                       AND recent.updated_at >= :cutoff
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM theory_votes viewer
                        WHERE viewer.theory_id = t.id
                          AND viewer.user_id = :userId
                    )
                    GROUP BY t.id, t.score, t.created_at
                    ORDER BY COALESCE(SUM(recent.vote_value), 0) DESC,
                             COUNT(recent.id) DESC,
                             t.score DESC,
                             t.created_at DESC
                    LIMIT :limit
                    """,
            nativeQuery = true
    )
    List<Long> findPopularTheoryIdsForUser(@Param("userId") Long userId,
                                           @Param("cutoff") LocalDateTime cutoff,
                                           @Param("limit") int limit);
}
