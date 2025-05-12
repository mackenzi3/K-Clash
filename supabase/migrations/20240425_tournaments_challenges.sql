-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  game_id UUID REFERENCES games(id),
  game_name VARCHAR NOT NULL,
  prize_pool INTEGER NOT NULL,
  entry_fee INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  description TEXT,
  rules TEXT,
  status VARCHAR NOT NULL DEFAULT 'registering',
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR NOT NULL DEFAULT 'registered',
  UNIQUE(tournament_id, user_id)
);

-- Create challenge_requests table
CREATE TABLE IF NOT EXISTS challenge_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  game_name VARCHAR NOT NULL,
  stake INTEGER NOT NULL,
  description TEXT,
  preferred_time VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenges table for approved challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES challenge_requests(id),
  game_name VARCHAR NOT NULL,
  creator_id UUID REFERENCES user_profiles(id),
  creator_name VARCHAR NOT NULL,
  stake INTEGER NOT NULL,
  time_availability VARCHAR,
  players VARCHAR NOT NULL DEFAULT '1v1',
  level VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clan_creation_requests table
CREATE TABLE IF NOT EXISTS clan_creation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  tag VARCHAR(10) NOT NULL,
  description TEXT,
  logo_url TEXT,
  status VARCHAR NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name),
  UNIQUE(tag)
);

-- Add triggers to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tournaments_updated_at
BEFORE UPDATE ON tournaments
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_challenge_requests_updated_at
BEFORE UPDATE ON challenge_requests
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
BEFORE UPDATE ON challenges
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_clan_creation_requests_updated_at
BEFORE UPDATE ON clan_creation_requests
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
