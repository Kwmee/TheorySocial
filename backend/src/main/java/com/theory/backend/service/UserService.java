package com.theory.backend.service;

import com.theory.backend.controller.AuthController.AuthResponse;
import com.theory.backend.dto.UserProfileResponse;
import com.theory.backend.dto.UserSuggestionResponse;
import com.theory.backend.model.UserFollow;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.UserFollowRepository;
import com.theory.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserFollowRepository userFollowRepository;
    private final TheoryRepository theoryRepository;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository userRepository,
                       UserFollowRepository userFollowRepository,
                       TheoryRepository theoryRepository,
                       FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.userFollowRepository = userFollowRepository;
        this.theoryRepository = theoryRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<AuthResponse> findAll() {
        return userRepository.findAll().stream()
                .map(AuthResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserProfileResponse findProfile(String viewerUsername, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildProfileResponse(user, viewerUsername);
    }

    @Transactional(readOnly = true)
    public List<UserSuggestionResponse> findSuggestions(String viewerUsername) {
        User viewer = userRepository.findByUsername(viewerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Set<Long> excludedIds = userFollowRepository.findAllByFollowerId(viewer.getId()).stream()
                .map(follow -> follow.getFollowed().getId())
                .collect(Collectors.toSet());
        excludedIds.add(viewer.getId());

        List<User> candidates = excludedIds.isEmpty()
                ? userRepository.findAll().stream()
                    .filter(candidate -> !candidate.getId().equals(viewer.getId()))
                    .toList()
                : userRepository.findAllByIdNotInOrderByCreatedAtDesc(excludedIds);

        return candidates.stream()
                .limit(6)
                .map(candidate -> UserSuggestionResponse.from(
                        candidate,
                        userFollowRepository.countByFollowedId(candidate.getId()),
                        theoryRepository.findAllByAuthorIdOrderByCreatedAtDesc(candidate.getId()).size(),
                        false
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSuggestionResponse> searchUsers(String viewerUsername, String query) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.isBlank()) {
            return List.of();
        }

        User viewer = userRepository.findByUsername(viewerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return userRepository.findTop8ByUsernameContainingIgnoreCaseOrBioContainingIgnoreCaseOrderByCreatedAtDesc(
                        normalizedQuery,
                        normalizedQuery
                ).stream()
                .filter(candidate -> !candidate.getId().equals(viewer.getId()))
                .map(candidate -> UserSuggestionResponse.from(
                        candidate,
                        userFollowRepository.countByFollowedId(candidate.getId()),
                        theoryRepository.findAllByAuthorIdOrderByCreatedAtDesc(candidate.getId()).size(),
                        userFollowRepository.existsByFollowerIdAndFollowedId(viewer.getId(), candidate.getId())
                ))
                .toList();
    }

    @Transactional
    public UserProfileResponse follow(String viewerUsername, String targetUsername) {
        User viewer = userRepository.findByUsername(viewerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (viewer.getId().equals(target.getId())) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        if (userFollowRepository.existsByFollowerIdAndFollowedId(viewer.getId(), target.getId())) {
            return buildProfileResponse(target, viewerUsername);
        }

        UserFollow follow = new UserFollow();
        follow.setFollower(viewer);
        follow.setFollowed(target);
        userFollowRepository.save(follow);
        return buildProfileResponse(target, viewerUsername);
    }

    @Transactional
    public UserProfileResponse unfollow(String viewerUsername, String targetUsername) {
        User viewer = userRepository.findByUsername(viewerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        userFollowRepository.findByFollowerIdAndFollowedId(viewer.getId(), target.getId())
                .ifPresent(userFollowRepository::delete);

        return buildProfileResponse(target, viewerUsername);
    }

    @Transactional
    public UserProfileResponse pinTheory(String username, Long theoryId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        var theory = theoryRepository.findWithAuthorById(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));

        if (!theory.getAuthor().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only pin your own theory");
        }

        user.setPinnedTheory(theory);
        return buildProfileResponse(userRepository.save(user), username);
    }

    @Transactional
    public UserProfileResponse unpinTheory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPinnedTheory(null);
        return buildProfileResponse(userRepository.save(user), username);
    }

    @Transactional
    public void clearPinnedTheoryReferences(Long theoryId) {
        List<User> affectedUsers = userRepository.findAllByPinnedTheoryId(theoryId);
        if (affectedUsers.isEmpty()) {
            return;
        }

        affectedUsers.forEach(user -> user.setPinnedTheory(null));
        userRepository.saveAll(affectedUsers);
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

    private UserProfileResponse buildProfileResponse(User user, String viewerUsername) {
        User viewer = viewerUsername == null ? null : userRepository.findByUsername(viewerUsername).orElse(null);
        long theoryCount = theoryRepository.findAllByAuthorIdOrderByCreatedAtDesc(user.getId()).size();
        long followersCount = userFollowRepository.countByFollowedId(user.getId());
        long followingCount = userFollowRepository.countByFollowerId(user.getId());
        boolean followedByViewer = viewer != null
                && !viewer.getId().equals(user.getId())
                && userFollowRepository.existsByFollowerIdAndFollowedId(viewer.getId(), user.getId());

        return UserProfileResponse.from(user, theoryCount, followersCount, followingCount, followedByViewer);
    }
}
