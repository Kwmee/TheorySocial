package com.theory.backend.service;

import com.theory.backend.controller.AuthController.AuthResponse;
import com.theory.backend.dto.UserProfileResponse;
import com.theory.backend.model.User;
import com.theory.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<AuthResponse> findAll() {
        return userRepository.findAll().stream()
                .map(AuthResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserProfileResponse findProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return UserProfileResponse.from(user);
    }

    @Transactional
    public AuthResponse markSwipeTutorialSeen(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setSwipeTutorialSeen(true);
        return AuthResponse.from(userRepository.save(user));
    }

    @Transactional
    public AuthResponse updateProfileImage(String username, String profileImageUrl) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setProfileImageUrl(normalizeProfileImageUrl(profileImageUrl));
        return AuthResponse.from(userRepository.save(user));
    }

    @Transactional
    public AuthResponse uploadProfileImage(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setProfileImageUrl(fileStorageService.storeProfileImage(file));
        return AuthResponse.from(userRepository.save(user));
    }

    @Transactional
    public User updateProfile(String currentUsername, String requestedUsername, String bio, String profileImageUrl) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String normalizedUsername = normalizeUsername(requestedUsername);
        if (userRepository.existsByUsernameAndIdNot(normalizedUsername, user.getId())) {
            throw new IllegalArgumentException("Username already in use");
        }

        user.setUsername(normalizedUsername);
        user.setBio(normalizeBio(bio));
        user.setProfileImageUrl(normalizeProfileImageUrl(profileImageUrl));
        return userRepository.save(user);
    }

    private String normalizeProfileImageUrl(String profileImageUrl) {
        if (profileImageUrl == null || profileImageUrl.isBlank()) {
            return null;
        }

        String trimmedUrl = profileImageUrl.trim();

        if (trimmedUrl.startsWith("/uploads/")) {
            return trimmedUrl;
        }

        var parsed = UriComponentsBuilder.fromUriString(trimmedUrl).build().toUri();
        String scheme = parsed.getScheme();

        if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
            throw new IllegalArgumentException("Profile image URL must start with http, https or /uploads/");
        }

        if (parsed.getHost() == null || parsed.getHost().isBlank()) {
            throw new IllegalArgumentException("Profile image URL must include a valid host");
        }

        return trimmedUrl;
    }

    private String normalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }

        String normalized = username.trim();
        if (normalized.length() < 3 || normalized.length() > 80) {
            throw new IllegalArgumentException("Username must be between 3 and 80 characters");
        }

        return normalized;
    }

    private String normalizeBio(String bio) {
        if (bio == null || bio.isBlank()) {
            return null;
        }

        String normalized = bio.trim();
        if (normalized.length() > 320) {
            throw new IllegalArgumentException("Bio must be at most 320 characters");
        }

        return normalized;
    }
}
