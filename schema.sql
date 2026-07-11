-- =========================================
-- News Classification Comparison Database
-- =========================================

-- Main results table
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Original article data from CSV
    title TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Ground truth label from CSV (1-4)
    expected_class INTEGER NOT NULL,

    -- Model predictions (1-4)
    modelA_prediction INTEGER,
    modelB_prediction INTEGER,

    -- Correctness flags (1 = correct, 0 = incorrect)
    modelA_correct INTEGER,
    modelB_correct INTEGER,

    -- Optional: raw API responses for debugging
    modelA_raw_response TEXT,
    modelB_raw_response TEXT,

    -- Timestamp for tracking uploads
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- Indexes for faster analytics queries
-- =========================================

CREATE INDEX IF NOT EXISTS idx_expected_class
ON results(expected_class);

CREATE INDEX IF NOT EXISTS idx_modelA_correct
ON results(modelA_correct);

CREATE INDEX IF NOT EXISTS idx_modelB_correct
ON results(modelB_correct);

CREATE INDEX IF NOT EXISTS idx_created_at
ON results(created_at);