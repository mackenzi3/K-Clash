-- Create clans table if it doesn't exist
CREATE TABLE IF NOT EXISTS clans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 1
);

-- Create clan_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS clan_members (
  id SERIAL PRIMARY KEY,
  clan_id INTEGER NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(clan_id, user_id)
);

-- Create sample clans
INSERT INTO clans (name, description, member_count)
VALUES 
  ('Alpha Squad', 'The original gaming clan', 5),
  ('Omega Team', 'Elite players only', 3),
  ('Ninja Warriors', 'Stealth and precision', 7)
ON CONFLICT (name) DO NOTHING;
