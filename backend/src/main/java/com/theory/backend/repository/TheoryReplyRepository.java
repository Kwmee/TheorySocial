package com.theory.backend.repository;

import com.theory.backend.model.TheoryReply;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TheoryReplyRepository extends JpaRepository<TheoryReply, Long> {

    @EntityGraph(attributePaths = {"author", "theory"})
    List<TheoryReply> findAllByTheoryIdOrderByCreatedAtAsc(Long theoryId);

    @EntityGraph(attributePaths = "author")
    List<TheoryReply> findAllByAuthorIdOrderByCreatedAtDesc(Long authorId);

    @Query("select tr.theory.id as theoryId, count(tr.id) as replyCount from TheoryReply tr where tr.theory.id in :theoryIds group by tr.theory.id")
    List<TheoryReplyCountProjection> countByTheoryIds(@Param("theoryIds") Collection<Long> theoryIds);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select tr from TheoryReply tr where tr.id = :id")
    Optional<TheoryReply> findByIdForUpdate(@Param("id") Long id);

    void deleteAllByTheoryId(Long theoryId);

    interface TheoryReplyCountProjection {
        Long getTheoryId();
        long getReplyCount();
    }
}
