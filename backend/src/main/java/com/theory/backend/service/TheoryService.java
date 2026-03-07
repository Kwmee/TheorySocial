package com.theory.backend.service;

import com.theory.backend.dto.TheoryResponse;
import com.theory.backend.model.Theory;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TheoryService {

    private final TheoryRepository theoryRepository;
    private final UserRepository userRepository;

    public TheoryService(TheoryRepository theoryRepository, UserRepository userRepository) {
        this.theoryRepository = theoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findAll() {
        return theoryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(TheoryResponse::from)
                .toList();
    }

    @Transactional
    public TheoryResponse create(Theory theory, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        theory.setAuthor(author);
        return TheoryResponse.from(theoryRepository.save(theory));
    }
}
