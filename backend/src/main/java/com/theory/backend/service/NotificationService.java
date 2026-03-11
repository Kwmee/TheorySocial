package com.theory.backend.service;

import com.theory.backend.dto.NotificationResponse;
import com.theory.backend.model.NotificationType;
import com.theory.backend.model.Theory;
import com.theory.backend.model.User;
import com.theory.backend.model.UserNotification;
import com.theory.backend.repository.UserNotificationRepository;
import com.theory.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final UserNotificationRepository userNotificationRepository;
    private final UserRepository userRepository;
    private final TransactionTemplate requiresNewTransaction;

    public NotificationService(UserNotificationRepository userNotificationRepository,
                               UserRepository userRepository,
                               PlatformTransactionManager transactionManager) {
        this.userNotificationRepository = userNotificationRepository;
        this.userRepository = userRepository;
        this.requiresNewTransaction = new TransactionTemplate(transactionManager);
        this.requiresNewTransaction.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> findForUser(String username) {
        User recipient = findUser(username);
        return userNotificationRepository.findTop50ByRecipientIdOrderByCreatedAtDesc(recipient.getId()).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(String username) {
        User recipient = findUser(username);
        return userNotificationRepository.countByRecipientIdAndReadFalse(recipient.getId());
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, String username) {
        User recipient = findUser(username);
        UserNotification notification = userNotificationRepository.findByIdAndRecipientId(notificationId, recipient.getId())
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        notification.setRead(true);
        return NotificationResponse.from(userNotificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(String username) {
        User recipient = findUser(username);
        userNotificationRepository.markAllAsReadByRecipientId(recipient.getId());
    }

    @Transactional
    public void notifyTheoryVote(Theory theory, User actor, int voteValue) {
        if (voteValue == 0 || actor.getId().equals(theory.getAuthor().getId())) {
            return;
        }

        String action = voteValue > 0 ? "ha dado like a tu teoria." : "ha dado dislike a tu teoria.";
        createNotification(theory.getAuthor(), actor, theory, NotificationType.THEORY_VOTE, action);
    }

    @Transactional
    public void notifyTheoryReply(Theory theory, User actor) {
        if (actor.getId().equals(theory.getAuthor().getId())) {
            return;
        }

        createNotification(theory.getAuthor(), actor, theory, NotificationType.THEORY_REPLY, "ha respondido a tu teoria.");
    }

    public void notifyTheoryVoteSafely(Theory theory, User actor, int voteValue) {
        try {
            requiresNewTransaction.executeWithoutResult(status -> notifyTheoryVote(theory, actor, voteValue));
        } catch (RuntimeException exception) {
            log.warn("Skipping theory vote notification for theory {} due to persistence error", theory.getId(), exception);
        }
    }

    public void notifyTheoryReplySafely(Theory theory, User actor) {
        try {
            requiresNewTransaction.executeWithoutResult(status -> notifyTheoryReply(theory, actor));
        } catch (RuntimeException exception) {
            log.warn("Skipping theory reply notification for theory {} due to persistence error", theory.getId(), exception);
        }
    }

    @Transactional
    public void deleteByTheoryId(Long theoryId) {
        userNotificationRepository.deleteAllByTheoryId(theoryId);
    }

    private void createNotification(User recipient,
                                    User actor,
                                    Theory theory,
                                    NotificationType type,
                                    String action) {
        UserNotification notification = new UserNotification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setTheory(theory);
        notification.setType(type);
        notification.setMessage(actor.getUsername() + " " + action);
        userNotificationRepository.save(notification);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
