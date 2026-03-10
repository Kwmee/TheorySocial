package com.theory.backend.controller;

import com.theory.backend.model.User;
import com.theory.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(@Valid @RequestBody SignupRequest request, HttpServletRequest httpRequest) {
        User user = authService.register(request.username(), request.email(), request.password(), httpRequest);
        return AuthResponse.from(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        User user = authService.login(request.username(), request.password(), httpRequest);
        return AuthResponse.from(user);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = authService.getAuthenticatedUser(principal.getUsername());
        return ResponseEntity.ok(AuthResponse.from(user));
    }

    @PostMapping("/terms/accept")
    public AuthResponse acceptTerms(@AuthenticationPrincipal UserDetails principal) {
        User user = authService.acceptTerms(principal.getUsername());
        return AuthResponse.from(user);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        authService.logout(request);
    }

    public record SignupRequest(
            @NotBlank @Size(min = 3, max = 80) String username,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72) String password
    ) {
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            Long id,
            String username,
            String email,
            String profileImageUrl,
            String bio,
            boolean acceptedTerms,
            boolean swipeTutorialSeen
    ) {
        public static AuthResponse from(User user) {
            return new AuthResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getProfileImageUrl(),
                    user.getBio(),
                    user.isAcceptedTerms(),
                    user.isSwipeTutorialSeen()
            );
        }
    }
}
