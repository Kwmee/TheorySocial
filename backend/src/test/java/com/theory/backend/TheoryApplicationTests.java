package com.theory.backend;

import com.theory.backend.model.Theory;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mock.web.MockHttpSession;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TheoryApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TheoryRepository theoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }

    @Test
    void getAllTheoriesReturnsSafeDtoWithoutLazySerializationErrors() throws Exception {
        User user = new User();
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setAcceptedTerms(true);
        User savedUser = userRepository.save(user);

        Theory theory = new Theory();
        theory.setTitle("Primera teoria");
        theory.setContent("Contenido de prueba");
        theory.setAuthor(savedUser);
        theoryRepository.save(theory);

        MockHttpSession session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "alice",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getRequest()
                .getSession(false);

        mockMvc.perform(get("/api/theories").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Primera teoria"))
                .andExpect(jsonPath("$[0].author.username").value("alice"))
                .andExpect(jsonPath("$[0].author.email").doesNotExist())
                .andExpect(jsonPath("$[0].author.passwordHash").doesNotExist());
    }
}
