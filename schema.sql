-- K-Clash Platform - Consolidated Database Schema
-- This file contains all SQL needed for full site functionality
-- Reduces the database from 34 tables to only the essential ones

-- =============================================
-- CLEANUP - Drop existing tables if needed
-- =============================================
DROP TABLE IF EXISTS tournament_participants CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS challenge_participants CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS challenge_requests CASCADE;
DROP TABLE IF EXISTS clan_members CASCADE;
DROP TABLE IF EXISTS clan_creation_requests CASCADE;
DROP TABLE IF EXISTS clans CASCADE;
DROP TABLE IF EXISTS user_clips CASCADE;
DROP TABLE IF EXISTS user_matches CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_social_links CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS landing_content CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS stats CASCADE;

-- =============================================
-- CORE TABLES - Essential for functionality
-- =============================================

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id),
  username VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR,
  location VARCHAR,
  birthdate DATE,
  avatar_url VARCHAR DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  banner_url VARCHAR DEFAULT '/placeholder.svg?height=300&width=1200',
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  premium_tier VARCHAR,
  premium_since TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Social Links
CREATE TABLE IF NOT EXISTS user_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- 3. User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Stats
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  matches_count INTEGER DEFAULT 0,
  wins_count INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  hours_played INTEGER DEFAULT 0,
  tournament_wins INTEGER DEFAULT 0,
  highest_win_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Games
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  icon_url VARCHAR,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Matches
CREATE TABLE IF NOT EXISTS user_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  opponent VARCHAR,
  result VARCHAR CHECK (result IN ('win', 'loss', 'draw')),
  score VARCHAR,
  prize VARCHAR,
  match_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. User Clips
CREATE TABLE IF NOT EXISTS user_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  thumbnail_url VARCHAR,
  video_url VARCHAR,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  game VARCHAR,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Clans
CREATE TABLE IF NOT EXISTS clans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  tag VARCHAR(10) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Clan Members
CREATE TABLE IF NOT EXISTS clan_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clan_id, user_id)
);

-- 10. Clan Creation Requests
CREATE TABLE IF NOT EXISTS clan_creation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  tag VARCHAR(10) NOT NULL,
  description TEXT,
  logo_url VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  game_name VARCHAR NOT NULL,
  prize_pool DECIMAL(10,2) DEFAULT 0,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  description TEXT,
  rules TEXT,
  status VARCHAR NOT NULL CHECK (status IN ('registering', 'upcoming', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tournament Participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
  UNIQUE(tournament_id, user_id)
);

-- 13. Challenge Requests
CREATE TABLE IF NOT EXISTS challenge_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  game_name VARCHAR NOT NULL,
  stake DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  preferred_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES challenge_requests(id) ON DELETE SET NULL,
  game_name VARCHAR NOT NULL,
  creator_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  creator_name VARCHAR NOT NULL,
  stake DECIMAL(10,2) DEFAULT 0,
  time_availability VARCHAR,
  players VARCHAR NOT NULL,
  level VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'accepted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Challenge Participants
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR NOT NULL DEFAULT 'joined' CHECK (status IN ('joined', 'ready', 'completed')),
  UNIQUE(challenge_id, user_id)
);

-- 16. Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Landing Content
CREATE TABLE IF NOT EXISTS landing_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name VARCHAR NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Features
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Stats
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR NOT NULL,
  value VARCHAR NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES - For performance optimization
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_id ON user_profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_social_links_user_id ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_matches_user_id ON user_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_user_clips_user_id ON user_clips(user_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_clan_id ON clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_user_id ON clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user_id ON tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON challenge_participants(user_id);

-- =============================================
-- FUNCTIONS - For database operations
-- =============================================

-- Function to increment tournament participants count
CREATE OR REPLACE FUNCTION increment_tournament_participants(tournament_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tournaments
  SET current_participants = current_participants + 1
  WHERE id = tournament_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement tournament participants count
CREATE OR REPLACE FUNCTION decrement_tournament_participants(tournament_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tournaments
  SET current_participants = GREATEST(0, current_participants - 1)
  WHERE id = tournament_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get profile by auth_id
CREATE OR REPLACE FUNCTION get_profile_by_auth_id(auth_user_id UUID)
RETURNS SETOF user_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_profiles
  WHERE auth_id = auth_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get profile by username
CREATE OR REPLACE FUNCTION get_profile_by_username(username_param VARCHAR)
RETURNS SETOF user_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_profiles
  WHERE username = username_param;
END;
$$ LANGUAGE plpgsql;

-- Function to get user achievements
CREATE OR REPLACE FUNCTION get_user_achievements(user_id_param UUID)
RETURNS SETOF user_achievements AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_achievements
  WHERE user_id = user_id_param
  ORDER BY unlocked_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param UUID)
RETURNS SETOF user_stats AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_stats
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to get user matches
CREATE OR REPLACE FUNCTION get_user_matches(user_id_param UUID, limit_param INTEGER DEFAULT 10)
RETURNS SETOF user_matches AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_matches
  WHERE user_id = user_id_param
  ORDER BY match_date DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Function to get user clips
CREATE OR REPLACE FUNCTION get_user_clips(user_id_param UUID, limit_param INTEGER DEFAULT 10)
RETURNS SETOF user_clips AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_clips
  WHERE user_id = user_id_param
  ORDER BY created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS - For automatic updates
-- =============================================

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at column
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
    AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_updated_at_trigger ON %I;
      CREATE TRIGGER update_updated_at_trigger
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    ', t, t);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INITIAL DATA - Seed data for the platform
-- =============================================

-- Insert initial landing page content
INSERT INTO landing_content (section_name, title, subtitle, content, order_index)
VALUES 
('hero', 'DOMINATE THE BATTLEFIELD', 'Kenya''s premier gaming platform for competitive 1v1 battles, clan wars, and gaming community', NULL, 1),
('about', 'About K-Clash', 'Join Kenya''s fastest growing gaming community', 'K-Clash brings together competitive gamers across Kenya to battle, connect, and grow together.', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert initial features
INSERT INTO features (title, description, icon_name, order_index)
VALUES 
('1v1 Arena', 'Challenge players to 1v1 battles with real money stakes and climb the leaderboards', 'Trophy', 1),
('Clan Wars', 'Form or join clans, participate in clan wars, and earn clan points and rewards', 'Users', 2),
('Chill Hub', 'Hang out in the global chat while listening to music from Spotify playlists', 'MessageSquare', 3),
('Clips', 'Share your best gaming moments as short clips for the community to enjoy', 'Video', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert initial stats
INSERT INTO stats (label, value, order_index)
VALUES 
('Active Gamers', '10K+', 1),
('Daily Matches', '500+', 2),
('Active Clans', '200+', 3),
('Prize Money', 'KSh 1M+', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert initial games
INSERT INTO games (name, icon_url, description)
VALUES
('FIFA 24', '/games/fifa24.png', 'The latest edition of the popular football simulation game.'),
('Call of Duty: Warzone', '/games/warzone.png', 'Free-to-play battle royale game.'),
('Fortnite', '/games/fortnite.png', 'Battle royale game with building mechanics.'),
('PUBG', '/games/pubg.png', 'PlayerUnknown''s Battlegrounds - realistic battle royale game.')
ON CONFLICT (id) DO NOTHING;

-- Insert platform settings
INSERT INTO platform_settings (key, value, description)
VALUES
('general', '{"maintenance_mode": false, "registration_enabled": true, "platform_name": "K-Clash"}', 'General platform settings'),
('moderation', '{"auto_moderation": true, "content_approval": false, "filtered_words": ["spam", "scam", "offensive"]}', 'Content moderation settings'),
('premium', '{"enabled": true, "price": 499, "billing_cycle": "monthly"}', 'Premium subscription settings')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- RLS POLICIES - Row Level Security
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_creation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policies for each table (simplified for brevity)
-- In a production environment, these would be more granular

-- Public read access, authenticated write access
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = auth_id);

-- Similar policies for other tables
-- This is a simplified version - in production, you would create more specific policies

-- Admin policies - allow admins to do everything
CREATE POLICY "Admins can do everything" ON user_profiles USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE auth_id = auth.uid() AND is_admin = true
  )
);

-- Apply similar admin policies to all other tables
