package com.theory.backend.controller;

import com.theory.backend.dto.TheoryResponse;
import com.theory.backend.model.Theory;
import com.theory.backend.service.TheoryService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/theories")
public class TheoryController {

    private final TheoryService theoryService;

    public TheoryController(TheoryService theoryService) {
        this.theoryService = theoryService;
    }

    @GetMapping
    public List<TheoryResponse> getAllTheories(@AuthenticationPrincipal UserDetails principal) {
        return theoryService.findAll(requireUsername(principal));
    }

    @GetMapping("/me")
    public List<TheoryResponse> getMyTheories(@AuthenticationPrincipal UserDetails principal) {
        return theoryService.findMine(requireUsername(principal));
    }

    @GetMapping("/by-user/{username}")
    public List<TheoryResponse> getTheoriesByUser(@PathVariable String username,
                                                  @AuthenticationPrincipal UserDetails principal) {
        return theoryService.findByAuthor(requireUsername(principal), username);
    }

    @GetMapping("/popular")
    public List<TheoryResponse> getPopularTheories(@AuthenticationPrincipal UserDetails principal,
                                                   @RequestParam(defaultValue = "7") @Min(1) @Max(30) int days,
                                                   @RequestParam(defaultValue = "12") @Min(1) @Max(50) int limit) {
        return theoryService.findPopular(requireUsername(principal), days, limit);
    }

    @GetMapping("/top")
    public List<TheoryResponse> getTopTheories(@AuthenticationPrincipal UserDetails principal,
                                               @RequestParam(defaultValue = "5") @Min(1) @Max(20) int limit) {
        return theoryService.findTop(requireUsername(principal), limit);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TheoryResponse createTheory(@Valid @RequestBody CreateTheoryRequest request,
                                       @AuthenticationPrincipal UserDetails principal) {
        Theory theory = new Theory();
        theory.setTitle(request.title());
        theory.setContent(request.content());
        return theoryService.create(theory, requireUsername(principal));
    }

    @PostMapping("/{id}/vote")
    public TheoryResponse voteTheory(@PathVariable Long id,
                                     @Valid @RequestBody VoteTheoryRequest request,
                                     @AuthenticationPrincipal UserDetails principal) {
        return theoryService.vote(id, requireUsername(principal), request.value());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTheory(@PathVariable Long id,
                             @AuthenticationPrincipal UserDetails principal) {
        theoryService.delete(id, requireUsername(principal));
    }

    private String requireUsername(UserDetails principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Authentication required");
        }
        return principal.getUsername();
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
