package com.theory.backend.repository;

import com.theory.backend.model.Theory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;

import java.util.List;

public interface TheoryRepository extends JpaRepository<Theory, Long> {
    @EntityGraph(attributePaths = "author")
    List<Theory> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = "author")
    List<Theory> findAllByAuthorIdOrderByCreatedAtDesc(Long authorId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Theory t where t.id = :id")
    Optional<Theory> findByIdForUpdate(@Param("id") Long id);

    @EntityGraph(attributePaths = "author")
    List<Theory> findAllByIdIn(Collection<Long> ids);
}
