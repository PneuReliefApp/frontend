-- ============================================================================
-- Supabase Database Schema for PneuRelief App
-- ============================================================================
-- PRESSURE AGGREGATES TABLE
-- ============================================================================
-- Stores processed sensor data aggregates (avg, max, min pressure)
-- This is what the Reports screen will query to display historical data
-- ============================================================================

CREATE TABLE IF NOT EXISTS pressure_aggregates (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    patch_id VARCHAR(20) NOT NULL,
    avg_pressure REAL NOT NULL,
    max_pressure REAL NOT NULL,
    min_pressure REAL NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    sample_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR BETTER QUERY PERFORMANCE
-- ============================================================================
-- These indexes will speed up queries when filtering by user_id and time range
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_pressure_aggregates_user_id 
    ON pressure_aggregates(user_id);

CREATE INDEX IF NOT EXISTS idx_pressure_aggregates_time 
    ON pressure_aggregates(start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_pressure_aggregates_patch 
    ON pressure_aggregates(patch_id);

-- Composite index for common query patterns (user + time range)
CREATE INDEX IF NOT EXISTS idx_pressure_aggregates_user_time 
    ON pressure_aggregates(user_id, start_time, end_time);
