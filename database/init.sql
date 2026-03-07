CREATE DATABASE IF NOT EXISTS theory_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE theory_social;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
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

INSERT INTO users (username, email)
SELECT 'admin', 'admin@theory.local'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);
