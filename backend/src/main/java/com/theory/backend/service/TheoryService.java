package com.theory.backend.service;

import com.theory.backend.dto.TheoryResponse;
import com.theory.backend.model.Theory;
import com.theory.backend.model.TheoryVote;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.TheoryVoteRepository;
import com.theory.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TheoryService {

    private final TheoryRepository theoryRepository;
    private final UserRepository userRepository;
    private final TheoryVoteRepository theoryVoteRepository;

    public TheoryService(TheoryRepository theoryRepository,
                         UserRepository userRepository,
                         TheoryVoteRepository theoryVoteRepository) {
        this.theoryRepository = theoryRepository;
        this.userRepository = userRepository;
        this.theoryVoteRepository = theoryVoteRepository;
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findAll(String username) {
        List<Theory> theories = theoryRepository.findAllByOrderByCreatedAtDesc();
        Map<Long, Integer> viewerVotes = getViewerVotesByTheoryId(username, theories);

        return theories.stream()
                .map(theory -> TheoryResponse.from(theory, viewerVotes.getOrDefault(theory.getId(), 0)))
                .toList();
    }

    @Transactional
    public TheoryResponse create(Theory theory, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        theory.setAuthor(author);
        return TheoryResponse.from(theoryRepository.save(theory), 0);
    }

    @Transactional
    public TheoryResponse vote(Long theoryId, String username, int voteValue) {
        if (voteValue != -1 && voteValue != 1) {
            throw new IllegalArgumentException("Vote value must be 1 or -1");
        }

        Theory theory = theoryRepository.findById(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TheoryVote vote = theoryVoteRepository.findByTheoryIdAndUserId(theoryId, user.getId())
                .orElseGet(() -> {
                    TheoryVote newVote = new TheoryVote();
                    newVote.setTheory(theory);
                    newVote.setUser(user);
                    newVote.setValue(0);
                    return newVote;
                });

        int previousValue = vote.getValue();
        vote.setValue(voteValue);
        theory.setScore(theory.getScore() - previousValue + voteValue);

        theoryVoteRepository.save(vote);
        return TheoryResponse.from(theoryRepository.save(theory), voteValue);
    }

    private Map<Long, Integer> getViewerVotesByTheoryId(String username, List<Theory> theories) {
        if (username == null || theories.isEmpty()) {
            return Map.of();
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return Map.of();
        }

        List<Long> theoryIds = theories.stream()
                .map(Theory::getId)
                .toList();

        return theoryVoteRepository.findAllByUserIdAndTheoryIdIn(user.getId(), theoryIds).stream()
                .collect(Collectors.toMap(vote -> vote.getTheory().getId(), TheoryVote::getValue));
    }
}
