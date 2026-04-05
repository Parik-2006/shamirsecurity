-- =============================================================================
-- Supabase Migration: Add TOTP and Recovery Session tables
-- Run this in your Supabase SQL Editor
-- =============================================================================

-- 1. TOTP secrets table — stores per-user TOTP base32 secret
CREATE TABLE IF NOT EXISTS totp_secrets (
    id          BIGSERIAL PRIMARY KEY,
    username    TEXT NOT NULL UNIQUE,
    secret      TEXT NOT NULL,
    created_at  DOUBLE PRECISION NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())
);

-- RLS: Only backend service role can read/write
ALTER TABLE totp_secrets ENABLE ROW LEVEL SECURITY;
-- Allow all for anon key (backend uses anon key)
CREATE POLICY "totp_secrets_all" ON totp_secrets
    FOR ALL USING (true) WITH CHECK (true);

-- 2. Recovery sessions table
CREATE TABLE IF NOT EXISTS recovery_sessions (
    id          BIGSERIAL PRIMARY KEY,
    recovery_id TEXT NOT NULL UNIQUE,
    username    TEXT NOT NULL,
    created_at  DOUBLE PRECISION NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()),
    oauth_done  BOOLEAN NOT NULL DEFAULT FALSE,
    totp_done   BOOLEAN NOT NULL DEFAULT FALSE,
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    code_verifier TEXT,
    share1_temp TEXT    -- temporarily stores share1 fetched from Drive during OAuth callback
);

ALTER TABLE recovery_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recovery_sessions_all" ON recovery_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- 3. Ensure pending_registrations has code_verifier column (may already exist)
ALTER TABLE pending_registrations
    ADD COLUMN IF NOT EXISTS code_verifier TEXT;

-- =============================================================================
-- Indexes for performance
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_totp_secrets_username     ON totp_secrets (username);
CREATE INDEX IF NOT EXISTS idx_recovery_sessions_id      ON recovery_sessions (recovery_id);
CREATE INDEX IF NOT EXISTS idx_recovery_sessions_user    ON recovery_sessions (username);
