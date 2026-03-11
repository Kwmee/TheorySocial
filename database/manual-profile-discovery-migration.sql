ALTER TABLE users
    ADD COLUMN IF NOT EXISTS pinned_theory_id BIGINT NULL;

ALTER TABLE users
    ADD CONSTRAINT fk_users_pinned_theory
        FOREIGN KEY (pinned_theory_id) REFERENCES theories(id) ON DELETE SET NULL;
