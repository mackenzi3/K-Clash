-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenge_completions table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenge_completions (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_earned INTEGER NOT NULL,
  UNIQUE(challenge_id, user_id)
);

-- Create sample challenges
INSERT INTO challenges (title, description, points, difficulty)
VALUES 
  ('First Blood', 'Be the first to eliminate an opponent in a match', 100, 'easy'),
  ('Pentakill', 'Eliminate 5 opponents in a single match', 500, 'medium'),
  ('Flawless Victory', 'Win a match without taking any damage', 1000, 'hard')
ON CONFLICT DO NOTHING;
