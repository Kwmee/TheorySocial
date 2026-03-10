package com.theory.backend.controller;

import com.theory.backend.controller.AuthController.AuthResponse;
import com.theory.backend.dto.UserProfileResponse;
import com.theory.backend.model.User;
import com.theory.backend.service.AuthService;
import com.theory.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping
    public List<AuthResponse> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{username}")
    public UserProfileResponse getProfile(@PathVariable String username) {
        return userService.findProfile(username);
    }

    @PostMapping("/me/tutorials/swipe/complete")
    public AuthResponse completeSwipeTutorial(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }
        return userService.markSwipeTutorialSeen(principal.getUsername());
    }

    @PutMapping("/me/profile-image")
    public AuthResponse updateProfileImage(@AuthenticationPrincipal UserDetails principal,
                                           @Valid @RequestBody UpdateProfileImageRequest request) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }

        return userService.updateProfileImage(principal.getUsername(), request.profileImageUrl());
    }

    @PostMapping("/me/profile-image/upload")
    public AuthResponse uploadProfileImage(@AuthenticationPrincipal UserDetails principal,
                                           @RequestParam("file") MultipartFile file) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }

        return userService.uploadProfileImage(principal.getUsername(), file);
    }

    @PutMapping("/me/profile")
    public AuthResponse updateProfile(@AuthenticationPrincipal UserDetails principal,
                                      @Valid @RequestBody UpdateProfileRequest request,
                                      HttpServletRequest httpRequest) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }

        User updatedUser = userService.updateProfile(
                principal.getUsername(),
                request.username(),
                request.bio(),
                request.profileImageUrl()
        );
        authService.refreshSession(updatedUser, httpRequest);
        return AuthResponse.from(updatedUser);
    }

    public record UpdateProfileImageRequest(
            @Size(max = 500) String profileImageUrl
    ) {
    }

    public record UpdateProfileRequest(
            @Size(min = 3, max = 80) String username,
            @Size(max = 320) String bio,
            @Size(max = 500) String profileImageUrl
    ) {
    }
}
