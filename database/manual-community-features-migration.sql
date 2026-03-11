CREATE TABLE IF NOT EXISTS theory_favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    theory_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theory_favorites_theory FOREIGN KEY (theory_id) REFERENCES theories(id) ON DELETE CASCADE,
    CONSTRAINT fk_theory_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_theory_favorites_theory_user UNIQUE (theory_id, user_id),
    INDEX idx_theory_favorites_user_created (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    actor_id BIGINT NOT NULL,
    theory_id BIGINT NOT NULL,
    type VARCHAR(40) NOT NULL,
    message VARCHAR(220) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_theory FOREIGN KEY (theory_id) REFERENCES theories(id) ON DELETE CASCADE,
    INDEX idx_notifications_recipient_created (recipient_id, created_at),
    INDEX idx_notifications_recipient_read (recipient_id, is_read)
);

ALTER TABLE notifications
    CHANGE COLUMN `read` is_read BOOLEAN NOT NULL DEFAULT FALSE;
