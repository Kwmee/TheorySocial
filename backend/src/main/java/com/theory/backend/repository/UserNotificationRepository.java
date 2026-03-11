package com.theory.backend.repository;

import com.theory.backend.model.UserNotification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    @EntityGraph(attributePaths = {"actor", "theory"})
    List<UserNotification> findTop50ByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    long countByRecipientIdAndReadFalse(Long recipientId);

    @EntityGraph(attributePaths = {"actor", "theory"})
    Optional<UserNotification> findByIdAndRecipientId(Long id, Long recipientId);

    @Modifying
    @Query("update UserNotification n set n.read = true where n.recipient.id = :recipientId and n.read = false")
    void markAllAsReadByRecipientId(@Param("recipientId") Long recipientId);

    void deleteAllByTheoryId(Long theoryId);
}
