package com.theory.backend.controller;

import com.theory.backend.controller.AuthController.AuthResponse;
import com.theory.backend.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<AuthResponse> getAllUsers() {
        return userService.findAll();
    }

    @PostMapping("/me/tutorials/swipe/complete")
    public AuthResponse completeSwipeTutorial(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }
        return userService.markSwipeTutorialSeen(principal.getUsername());
    }
}
