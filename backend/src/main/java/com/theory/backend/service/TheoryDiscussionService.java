package com.theory.backend.service;

import com.theory.backend.dto.TheoryReplyResponse;
import com.theory.backend.model.Theory;
import com.theory.backend.model.TheoryReply;
import com.theory.backend.model.TheoryReplyVote;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryReplyRepository;
import com.theory.backend.repository.TheoryReplyVoteRepository;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TheoryDiscussionService {

    private final TheoryReplyRepository theoryReplyRepository;
    private final TheoryReplyVoteRepository theoryReplyVoteRepository;
    private final TheoryRepository theoryRepository;
    private final UserRepository userRepository;

    public TheoryDiscussionService(TheoryReplyRepository theoryReplyRepository,
                                   TheoryReplyVoteRepository theoryReplyVoteRepository,
                                   TheoryRepository theoryRepository,
                                   UserRepository userRepository) {
        this.theoryReplyRepository = theoryReplyRepository;
        this.theoryReplyVoteRepository = theoryReplyVoteRepository;
        this.theoryRepository = theoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TheoryReplyResponse> findByTheoryId(Long theoryId, String username) {
        if (!theoryRepository.existsById(theoryId)) {
            throw new IllegalArgumentException("Theory not found");
        }

        List<TheoryReply> replies = theoryReplyRepository.findAllByTheoryIdOrderByCreatedAtAsc(theoryId);
        Map<Long, Integer> viewerVotes = getViewerVotes(username, replies);

        return replies.stream()
                .map(reply -> TheoryReplyResponse.from(reply, viewerVotes.getOrDefault(reply.getId(), 0)))
                .toList();
    }

    @Transactional
    public TheoryReplyResponse create(Long theoryId, String content, String username) {
        Theory theory = theoryRepository.findById(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TheoryReply reply = new TheoryReply();
        reply.setTheory(theory);
        reply.setAuthor(author);
        reply.setContent(content);

        return TheoryReplyResponse.from(theoryReplyRepository.save(reply), 0);
    }

    @Transactional
    public TheoryReplyResponse update(Long replyId, String content, String username) {
        TheoryReply reply = theoryReplyRepository.findByIdForUpdate(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Response not found"));

        requireAuthor(reply.getAuthor().getUsername(), username);
        reply.setContent(content);
        return TheoryReplyResponse.from(theoryReplyRepository.save(reply), 0);
    }

    @Transactional
    public void delete(Long replyId, String username) {
        TheoryReply reply = theoryReplyRepository.findByIdForUpdate(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Response not found"));

        requireAuthor(reply.getAuthor().getUsername(), username);
        theoryReplyVoteRepository.deleteAllByResponseId(replyId);
        theoryReplyRepository.delete(reply);
    }

    @Transactional
    public TheoryReplyResponse vote(Long replyId, String username, int voteValue) {
        if (voteValue != -1 && voteValue != 0 && voteValue != 1) {
            throw new IllegalArgumentException("Vote value must be 1, 0 or -1");
        }

        TheoryReply reply = theoryReplyRepository.findByIdForUpdate(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Response not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TheoryReplyVote vote = theoryReplyVoteRepository.findByResponseIdAndUserId(replyId, user.getId())
                .orElseGet(() -> {
                    TheoryReplyVote newVote = new TheoryReplyVote();
                    newVote.setResponse(reply);
                    newVote.setUser(user);
                    newVote.setValue(0);
                    return newVote;
                });

        int previousValue = vote.getValue();
        if (previousValue == voteValue) {
            return TheoryReplyResponse.from(reply, previousValue);
        }

        int scoreDelta = voteValue - previousValue;
        reply.setScore(reply.getScore() + scoreDelta);
        if (voteValue == 0) {
            if (vote.getId() != null) {
                theoryReplyVoteRepository.delete(vote);
            }
            return TheoryReplyResponse.from(theoryReplyRepository.save(reply), 0);
        }

        vote.setValue(voteValue);
        theoryReplyVoteRepository.save(vote);
        return TheoryReplyResponse.from(theoryReplyRepository.save(reply), voteValue);
    }

    private Map<Long, Integer> getViewerVotes(String username, List<TheoryReply> replies) {
        if (username == null || replies.isEmpty()) {
            return Map.of();
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return Map.of();
        }

        List<Long> replyIds = replies.stream()
                .map(TheoryReply::getId)
                .toList();

        return theoryReplyVoteRepository.findAllByUserIdAndResponseIdIn(user.getId(), replyIds).stream()
                .collect(Collectors.toMap(vote -> vote.getResponse().getId(), TheoryReplyVote::getValue));
    }

    private void requireAuthor(String authorUsername, String username) {
        if (!authorUsername.equals(username)) {
            throw new AccessDeniedException("You must be the author to modify this content");
        }
    }
}
