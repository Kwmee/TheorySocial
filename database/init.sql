CREATE DATABASE IF NOT EXISTS theory_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE theory_social;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    accepted_terms BOOLEAN NOT NULL DEFAULT FALSE,
    swipe_tutorial_seen BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(180) NOT NULL,
    content TEXT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theories_author FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS theory_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    theory_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vote_value INT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theory_votes_theory FOREIGN KEY (theory_id) REFERENCES theories(id),
    CONSTRAINT fk_theory_votes_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_theory_votes_theory_user UNIQUE (theory_id, user_id),
    INDEX idx_theory_votes_user_theory (user_id, theory_id),
    INDEX idx_theory_votes_updated_theory (updated_at, theory_id)
);

CREATE TABLE IF NOT EXISTS theory_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    theory_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theory_responses_theory FOREIGN KEY (theory_id) REFERENCES theories(id) ON DELETE CASCADE,
    CONSTRAINT fk_theory_responses_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_theory_responses_theory_created (theory_id, created_at),
    INDEX idx_theory_responses_author_created (author_id, created_at)
);

CREATE TABLE IF NOT EXISTS theory_response_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    response_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vote_value INT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theory_response_votes_response FOREIGN KEY (response_id) REFERENCES theory_responses(id) ON DELETE CASCADE,
    CONSTRAINT fk_theory_response_votes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_theory_response_votes_response_user UNIQUE (response_id, user_id),
    INDEX idx_theory_response_votes_user_response (user_id, response_id),
    INDEX idx_theory_response_votes_updated_response (updated_at, response_id)
);
