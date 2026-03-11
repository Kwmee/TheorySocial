package com.theory.backend.controller;

import com.theory.backend.dto.NotificationResponse;
import com.theory.backend.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getNotifications(@AuthenticationPrincipal UserDetails principal) {
        return notificationService.findForUser(requireUsername(principal));
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse getUnreadCount(@AuthenticationPrincipal UserDetails principal) {
        return new UnreadCountResponse(notificationService.countUnread(requireUsername(principal)));
    }

    @PostMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails principal) {
        return notificationService.markAsRead(id, requireUsername(principal));
    }

    @PostMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(@AuthenticationPrincipal UserDetails principal) {
        notificationService.markAllAsRead(requireUsername(principal));
    }

    private String requireUsername(UserDetails principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }
        return principal.getUsername();
    }

    public record UnreadCountResponse(long unreadCount) {
    }
}
