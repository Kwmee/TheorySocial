package com.theory.backend.controller;

import com.theory.backend.dto.TheoryResponse;
import com.theory.backend.model.Theory;
import com.theory.backend.service.TheoryService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/theories")
public class TheoryController {

    private final TheoryService theoryService;

    public TheoryController(TheoryService theoryService) {
        this.theoryService = theoryService;
    }

    @GetMapping
    public List<TheoryResponse> getAllTheories(@AuthenticationPrincipal UserDetails principal) {
        return theoryService.findAll(principal.getUsername());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TheoryResponse createTheory(@Valid @RequestBody CreateTheoryRequest request,
                                       @AuthenticationPrincipal UserDetails principal) {
        Theory theory = new Theory();
        theory.setTitle(request.title());
        theory.setContent(request.content());
        return theoryService.create(theory, principal.getUsername());
    }

    @PostMapping("/{id}/vote")
    public TheoryResponse voteTheory(@PathVariable Long id,
                                     @Valid @RequestBody VoteTheoryRequest request,
                                     @AuthenticationPrincipal UserDetails principal) {
        return theoryService.vote(id, principal.getUsername(), request.value());
    }

    public record CreateTheoryRequest(
            @NotBlank String title,
            @NotBlank String content
    ) {
    }

    public record VoteTheoryRequest(
            int value
    ) {
    }
}
