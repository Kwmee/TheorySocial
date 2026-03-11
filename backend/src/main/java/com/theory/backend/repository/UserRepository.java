package com.theory.backend.repository;

import com.theory.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByUsernameAndIdNot(String username, Long id);
    boolean existsByEmail(String email);
    List<User> findAllByIdNotInOrderByCreatedAtDesc(Collection<Long> ids);
    List<User> findAllByPinnedTheoryId(Long pinnedTheoryId);
    List<User> findTop8ByUsernameContainingIgnoreCaseOrBioContainingIgnoreCaseOrderByCreatedAtDesc(String usernameQuery, String bioQuery);
}
