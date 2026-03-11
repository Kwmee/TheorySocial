package com.theory.backend.service;

import com.theory.backend.dto.TheoryResponse;
import com.theory.backend.model.Theory;
import com.theory.backend.model.TheoryFavorite;
import com.theory.backend.model.TheoryVote;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryFavoriteRepository;
import com.theory.backend.repository.TheoryReplyRepository;
import com.theory.backend.repository.TheoryReplyVoteRepository;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.TheoryVoteRepository;
import com.theory.backend.repository.UserFollowRepository;
import com.theory.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TheoryService {

    private final TheoryRepository theoryRepository;
    private final UserRepository userRepository;
    private final TheoryVoteRepository theoryVoteRepository;
    private final TheoryFavoriteRepository theoryFavoriteRepository;
    private final TheoryReplyRepository theoryReplyRepository;
    private final TheoryReplyVoteRepository theoryReplyVoteRepository;
    private final NotificationService notificationService;
    private final UserFollowRepository userFollowRepository;
    private final UserService userService;

    public TheoryService(TheoryRepository theoryRepository,
                         UserRepository userRepository,
                         TheoryVoteRepository theoryVoteRepository,
                         TheoryFavoriteRepository theoryFavoriteRepository,
                         TheoryReplyRepository theoryReplyRepository,
                         TheoryReplyVoteRepository theoryReplyVoteRepository,
                         NotificationService notificationService,
                         UserFollowRepository userFollowRepository,
                         UserService userService) {
        this.theoryRepository = theoryRepository;
        this.userRepository = userRepository;
        this.theoryVoteRepository = theoryVoteRepository;
        this.theoryFavoriteRepository = theoryFavoriteRepository;
        this.theoryReplyRepository = theoryReplyRepository;
        this.theoryReplyVoteRepository = theoryReplyVoteRepository;
        this.notificationService = notificationService;
        this.userFollowRepository = userFollowRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findAll(String username) {
        List<Theory> theories = theoryRepository.findAllByOrderByCreatedAtDesc();
        return buildTheoryResponses(username, theories);
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findMine(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return findByAuthor(username, user.getUsername());
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findByAuthor(String viewerUsername, String authorUsername) {
        User user = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Theory> theories = theoryRepository.findAllByAuthorIdOrderByCreatedAtDesc(user.getId());
        return buildTheoryResponses(viewerUsername, theories);
    }

    @Transactional(readOnly = true)
    public TheoryResponse findById(Long theoryId, String username) {
        Theory theory = theoryRepository.findWithAuthorById(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));

        int viewerVote = getViewerVote(username, theoryId);
        long responseCount = countResponses(theoryId);
        return TheoryResponse.from(theory, viewerVote, isBookmarked(username, theoryId), responseCount);
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<TheoryFavorite> favorites = theoryFavoriteRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());
        List<Theory> theories = favorites.stream()
                .map(TheoryFavorite::getTheory)
                .toList();
        return buildTheoryResponses(username, theories);
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findFollowing(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Long> followedIds = userFollowRepository.findAllByFollowerId(user.getId()).stream()
                .map(follow -> follow.getFollowed().getId())
                .toList();

        if (followedIds.isEmpty()) {
            return List.of();
        }

        List<Theory> theories = theoryRepository.findAllByAuthorIdInOrderByCreatedAtDesc(followedIds);
        return buildTheoryResponses(username, theories);
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findTop(String username, int limit) {
        List<Theory> theories = theoryRepository.findAllByOrderByCreatedAtDesc().stream()
                .sorted(Comparator.comparingInt(Theory::getScore).reversed()
                        .thenComparing(Theory::getCreatedAt, Comparator.reverseOrder()))
                .limit(limit)
                .toList();
        return buildTheoryResponses(username, theories);
    }

    @Transactional(readOnly = true)
    public List<TheoryResponse> findPopular(String username, int days, int limit) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        List<Long> theoryIds = theoryVoteRepository.findPopularTheoryIdsForUser(user.getId(), cutoff, limit);

        if (theoryIds.isEmpty()) {
            return List.of();
        }

        Map<Long, Integer> positions = buildPositions(theoryIds);
        List<Theory> theories = theoryRepository.findAllByIdIn(theoryIds);
        Map<Long, Long> responseCounts = getResponseCounts(theories);
        Set<Long> bookmarkedTheoryIds = getBookmarkedTheoryIds(user.getUsername(), theories);
        return theories.stream()
                .sorted(Comparator.comparingInt(theory -> positions.getOrDefault(theory.getId(), Integer.MAX_VALUE)))
                .map(theory -> TheoryResponse.from(
                        theory,
                        0,
                        bookmarkedTheoryIds.contains(theory.getId()),
                        responseCounts.getOrDefault(theory.getId(), 0L)
                ))
                .toList();
    }

    @Transactional
    public TheoryResponse create(Theory theory, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        theory.setAuthor(author);
        return TheoryResponse.from(theoryRepository.save(theory), 0, false, 0);
    }

    @Transactional
    public TheoryResponse update(Long theoryId, String title, String content, String username) {
        Theory theory = theoryRepository.findByIdForUpdate(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));

        if (!theory.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("You must be the author to modify this content");
        }

        theory.setTitle(title);
        theory.setContent(content);
        return TheoryResponse.from(
                theoryRepository.save(theory),
                getViewerVote(username, theoryId),
                isBookmarked(username, theoryId),
                countResponses(theoryId)
        );
    }

    @Transactional
    public TheoryResponse vote(Long theoryId, String username, int voteValue) {
        if (voteValue != -1 && voteValue != 0 && voteValue != 1) {
            throw new IllegalArgumentException("Vote value must be 1, 0 or -1");
        }

        Theory theory = theoryRepository.findByIdForUpdate(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        boolean bookmarked = theoryFavoriteRepository.findByTheoryIdAndUserId(theoryId, user.getId()).isPresent();

        TheoryVote vote = theoryVoteRepository.findByTheoryIdAndUserId(theoryId, user.getId())
                .orElseGet(() -> {
                    TheoryVote newVote = new TheoryVote();
                    newVote.setTheory(theory);
                    newVote.setUser(user);
                    newVote.setValue(0);
                    return newVote;
                });

        int previousValue = vote.getValue();
        if (previousValue == voteValue) {
            return TheoryResponse.from(theory, previousValue, bookmarked, countResponses(theoryId));
        }

        int scoreDelta = voteValue - previousValue;
        theory.setScore(theory.getScore() + scoreDelta);
        if (voteValue == 0) {
            if (vote.getId() != null) {
                theoryVoteRepository.delete(vote);
            }
            return TheoryResponse.from(theoryRepository.save(theory), 0, bookmarked, countResponses(theoryId));
        }

        vote.setValue(voteValue);
        theoryVoteRepository.save(vote);
        Theory savedTheory = theoryRepository.save(theory);
        notificationService.notifyTheoryVoteSafely(savedTheory, user, voteValue);
        return TheoryResponse.from(savedTheory, voteValue, bookmarked, countResponses(theoryId));
    }

    @Transactional
    public TheoryResponse toggleFavorite(Long theoryId, String username) {
        Theory theory = theoryRepository.findWithAuthorById(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TheoryFavorite existingFavorite = theoryFavoriteRepository.findByTheoryIdAndUserId(theoryId, user.getId())
                .orElse(null);

        boolean bookmarked;
        if (existingFavorite != null) {
            theoryFavoriteRepository.delete(existingFavorite);
            bookmarked = false;
        } else {
            TheoryFavorite favorite = new TheoryFavorite();
            favorite.setTheory(theory);
            favorite.setUser(user);
            theoryFavoriteRepository.save(favorite);
            bookmarked = true;
        }

        return TheoryResponse.from(theory, getViewerVote(username, theoryId), bookmarked, countResponses(theoryId));
    }

    @Transactional
    public void delete(Long theoryId, String username) {
        Theory theory = theoryRepository.findByIdForUpdate(theoryId)
                .orElseThrow(() -> new IllegalArgumentException("Theory not found"));

        if (!theory.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("You must be the author to modify this content");
        }

        theoryReplyVoteRepository.deleteAllByResponseTheoryId(theoryId);
        theoryReplyRepository.deleteAllByTheoryId(theoryId);
        theoryVoteRepository.deleteAllByTheoryId(theoryId);
        theoryFavoriteRepository.deleteAllByTheoryId(theoryId);
        notificationService.deleteByTheoryId(theoryId);
        userService.clearPinnedTheoryReferences(theoryId);
        theoryRepository.delete(theory);
    }

    private List<TheoryResponse> buildTheoryResponses(String username, List<Theory> theories) {
        Map<Long, Integer> viewerVotes = getViewerVotesByTheoryId(username, theories);
        Map<Long, Long> responseCounts = getResponseCounts(theories);
        Set<Long> bookmarkedTheoryIds = getBookmarkedTheoryIds(username, theories);

        return theories.stream()
                .map(theory -> TheoryResponse.from(
                        theory,
                        viewerVotes.getOrDefault(theory.getId(), 0),
                        bookmarkedTheoryIds.contains(theory.getId()),
                        responseCounts.getOrDefault(theory.getId(), 0L)
                ))
                .toList();
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

    private Map<Long, Integer> buildPositions(List<Long> theoryIds) {
        return java.util.stream.IntStream.range(0, theoryIds.size())
                .boxed()
                .collect(Collectors.toMap(theoryIds::get, index -> index));
    }

    private int getViewerVote(String username, Long theoryId) {
        if (username == null) {
            return 0;
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return 0;
        }

        return theoryVoteRepository.findByTheoryIdAndUserId(theoryId, user.getId())
                .map(TheoryVote::getValue)
                .orElse(0);
    }

    private Set<Long> getBookmarkedTheoryIds(String username, List<Theory> theories) {
        if (username == null || theories.isEmpty()) {
            return Set.of();
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return Set.of();
        }

        List<Long> theoryIds = theories.stream()
                .map(Theory::getId)
                .toList();

        return theoryFavoriteRepository.findAllByUserIdAndTheoryIdIn(user.getId(), theoryIds).stream()
                .map(favorite -> favorite.getTheory().getId())
                .collect(Collectors.toSet());
    }

    private boolean isBookmarked(String username, Long theoryId) {
        if (username == null) {
            return false;
        }

        User user = userRepository.findByUsername(username).orElse(null);
        return user != null && theoryFavoriteRepository.findByTheoryIdAndUserId(theoryId, user.getId()).isPresent();
    }

    private Map<Long, Long> getResponseCounts(List<Theory> theories) {
        if (theories.isEmpty()) {
            return Map.of();
        }

        List<Long> theoryIds = theories.stream()
                .map(Theory::getId)
                .toList();

        return theoryReplyRepository.countByTheoryIds(theoryIds).stream()
                .collect(Collectors.toMap(
                        TheoryReplyRepository.TheoryReplyCountProjection::getTheoryId,
                        TheoryReplyRepository.TheoryReplyCountProjection::getReplyCount
                ));
    }

    private long countResponses(Long theoryId) {
        return theoryReplyRepository.countByTheoryIds(List.of(theoryId)).stream()
                .findFirst()
                .map(TheoryReplyRepository.TheoryReplyCountProjection::getReplyCount)
                .orElse(0L);
    }
}
