package com.theory.backend.service;

import com.theory.backend.controller.AuthController.AuthResponse;
import com.theory.backend.model.User;
import com.theory.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<AuthResponse> findAll() {
        return userRepository.findAll().stream()
                .map(AuthResponse::from)
                .toList();
    }

    @Transactional
    public AuthResponse markSwipeTutorialSeen(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setSwipeTutorialSeen(true);
        return AuthResponse.from(userRepository.save(user));
    }
}
