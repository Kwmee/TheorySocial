package com.theory.backend.repository;

import com.theory.backend.model.UserFollow;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    Optional<UserFollow> findByFollowerIdAndFollowedId(Long followerId, Long followedId);

    boolean existsByFollowerIdAndFollowedId(Long followerId, Long followedId);

    long countByFollowerId(Long followerId);

    long countByFollowedId(Long followedId);

    List<UserFollow> findAllByFollowerId(Long followerId);

    List<UserFollow> findAllByFollowerIdAndFollowedIdIn(Long followerId, Collection<Long> followedIds);

    @EntityGraph(attributePaths = "followed")
    List<UserFollow> findTop6ByFollowerIdOrderByCreatedAtDesc(Long followerId);
}
