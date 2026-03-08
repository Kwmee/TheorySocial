package com.theory.backend.controller;

import com.theory.backend.dto.TheoryReplyResponse;
import com.theory.backend.service.TheoryDiscussionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api")
public class TheoryReplyController {

    private final TheoryDiscussionService theoryDiscussionService;

    public TheoryReplyController(TheoryDiscussionService theoryDiscussionService) {
        this.theoryDiscussionService = theoryDiscussionService;
    }

    @GetMapping("/theories/{theoryId}/responses")
    public List<TheoryReplyResponse> getTheoryResponses(@PathVariable Long theoryId,
                                                        @AuthenticationPrincipal UserDetails principal) {
        return theoryDiscussionService.findByTheoryId(theoryId, requireUsername(principal));
    }

    @PostMapping("/theories/{theoryId}/responses")
    @ResponseStatus(HttpStatus.CREATED)
    public TheoryReplyResponse createTheoryResponse(@PathVariable Long theoryId,
                                                    @Valid @RequestBody ReplyRequest request,
                                                    @AuthenticationPrincipal UserDetails principal) {
        return theoryDiscussionService.create(theoryId, request.content(), requireUsername(principal));
    }

    @PutMapping("/responses/{replyId}")
    public TheoryReplyResponse updateTheoryResponse(@PathVariable Long replyId,
                                                    @Valid @RequestBody ReplyRequest request,
                                                    @AuthenticationPrincipal UserDetails principal) {
        return theoryDiscussionService.update(replyId, request.content(), requireUsername(principal));
    }

    @DeleteMapping("/responses/{replyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTheoryResponse(@PathVariable Long replyId,
                                     @AuthenticationPrincipal UserDetails principal) {
        theoryDiscussionService.delete(replyId, requireUsername(principal));
    }

    @PostMapping("/responses/{replyId}/vote")
    public TheoryReplyResponse voteTheoryResponse(@PathVariable Long replyId,
                                                  @Valid @RequestBody VoteRequest request,
                                                  @AuthenticationPrincipal UserDetails principal) {
        return theoryDiscussionService.vote(replyId, requireUsername(principal), request.value());
    }

    private String requireUsername(UserDetails principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }
        return principal.getUsername();
    }

    public record ReplyRequest(@NotBlank String content) {
    }

    public record VoteRequest(int value) {
    }
}
