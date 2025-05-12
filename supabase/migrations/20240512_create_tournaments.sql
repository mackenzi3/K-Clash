-- Create tournaments table if it doesn't exist
CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'upcoming',
  prize_pool DECIMAL(10, 2),
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament_participants table if it doesn't exist
CREATE TABLE IF NOT EXISTS tournament_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'registered',
  UNIQUE(tournament_id, user_id)
);

-- Create sample tournaments
INSERT INTO tournaments (name, description, start_date, end_date, status, prize_pool, max_participants)
VALUES 
  ('Summer Championship', 'Annual summer gaming tournament', NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days', 'upcoming', 1000.00, 64),
  ('Weekly Challenge', 'Weekly competition for all players', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 'active', 250.00, 32),
  ('Pro Circuit Qualifier', 'Qualify for the pro gaming circuit', NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', 'completed', 5000.00, 128)
ON CONFLICT DO NOTHING;
