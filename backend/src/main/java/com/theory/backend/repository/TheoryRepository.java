package com.theory.backend.repository;

import com.theory.backend.model.Theory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TheoryRepository extends JpaRepository<Theory, Long> {
    @EntityGraph(attributePaths = "author")
    List<Theory> findAllByOrderByCreatedAtDesc();
}
