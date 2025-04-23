-- User Profiles Table - Core table for user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- Link to auth.users table (optional)
  username VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  location VARCHAR,
  birthdate DATE,
  avatar_url TEXT DEFAULT '/placeholder.svg?height=200&width=200',
  banner_url TEXT DEFAULT '/placeholder.svg?height=400&width=1200',
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_tier VARCHAR CHECK (premium_tier IN ('bronze', 'silver', 'gold', NULL)),
  premium_since TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Social Links Table
CREATE TABLE IF NOT EXISTS user_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Clans Table
CREATE TABLE IF NOT EXISTS clans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  tag VARCHAR(10) UNIQUE NOT NULL,
  logo_url TEXT DEFAULT '/placeholder.svg?height=60&width=60',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Clan Memberships Table
CREATE TABLE IF NOT EXISTS clan_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL CHECK (role IN ('Leader', 'Co-Leader', 'Elder', 'Member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clan_id, user_id)
);

-- User Stats Table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  matches_count INTEGER DEFAULT 0,
  wins_count INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  hours_played INTEGER DEFAULT 0,
  tournament_wins INTEGER DEFAULT 0,
  highest_win_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  icon_url TEXT DEFAULT '/placeholder.svg?height=40&width=40',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Game Stats Table
CREATE TABLE IF NOT EXISTS user_game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  last_played TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- User Game Stat Details Table
CREATE TABLE IF NOT EXISTS user_game_stat_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_game_stat_id UUID REFERENCES user_game_stats(id) ON DELETE CASCADE,
  stat_name VARCHAR NOT NULL,
  stat_value VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Matches Table
CREATE TABLE IF NOT EXISTS user_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id),
  opponent VARCHAR,
  result VARCHAR CHECK (result IN ('Win', 'Loss', 'Draw')),
  score VARCHAR,
  prize VARCHAR,
  match_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Clips Table
CREATE TABLE IF NOT EXISTS user_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  thumbnail_url TEXT DEFAULT '/placeholder.svg?height=720&width=1280',
  video_url TEXT DEFAULT '/placeholder.svg?height=720&width=1280',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  game VARCHAR,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Coaches Table
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  avatar_url TEXT DEFAULT '/placeholder.svg?height=40&width=40',
  game VARCHAR NOT NULL,
  price VARCHAR NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach Specialties Table
CREATE TABLE IF NOT EXISTS coach_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  specialty VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Notification Settings Table
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  match_invites BOOLEAN DEFAULT TRUE,
  friend_requests BOOLEAN DEFAULT TRUE,
  clan_invites BOOLEAN DEFAULT TRUE,
  direct_messages BOOLEAN DEFAULT TRUE,
  system_announcements BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Privacy Settings Table
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  profile_visibility VARCHAR DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  online_status VARCHAR DEFAULT 'show' CHECK (online_status IN ('show', 'hide')),
  game_activity VARCHAR DEFAULT 'show' CHECK (game_activity IN ('show', 'hide')),
  match_history VARCHAR DEFAULT 'public' CHECK (match_history IN ('public', 'friends', 'private')),
  clip_visibility VARCHAR DEFAULT 'public' CHECK (clip_visibility IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Appearance Settings Table
CREATE TABLE IF NOT EXISTS user_appearance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  theme VARCHAR DEFAULT 'default' CHECK (theme IN ('default', 'pink', 'blue', 'green', 'orange')),
  ui_sounds BOOLEAN DEFAULT TRUE,
  notification_sounds BOOLEAN DEFAULT TRUE,
  achievement_sounds BOOLEAN DEFAULT FALSE,
  background_music BOOLEAN DEFAULT FALSE,
  volume_level INTEGER DEFAULT 70 CHECK (volume_level BETWEEN 0 AND 100),
  reduce_animations BOOLEAN DEFAULT FALSE,
  low_quality_mode BOOLEAN DEFAULT FALSE,
  data_saver BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Payment Methods Table
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  number VARCHAR NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Connected Accounts Table
CREATE TABLE IF NOT EXISTS user_connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL,
  username VARCHAR,
  connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Create a function to automatically link auth users with profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (auth_id, username, email)
  VALUES (NEW.id, NEW.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies for the tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view any profile"
  ON user_profiles FOR SELECT
  USING (true);
  
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = auth_id);

-- Similar policies for other tables
ALTER TABLE user_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_stat_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connected_accounts ENABLE ROW LEVEL SECURITY;

-- Create functions for common operations

-- Get user profile by auth ID
CREATE OR REPLACE FUNCTION get_profile_by_auth_id(auth_user_id UUID)
RETURNS SETOF user_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_profiles
  WHERE auth_id = auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user profile by username
CREATE OR REPLACE FUNCTION get_profile_by_username(username_param VARCHAR)
RETURNS SETOF user_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_profiles
  WHERE username = username_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user achievements
CREATE OR REPLACE FUNCTION get_user_achievements(user_id_param UUID)
RETURNS SETOF user_achievements AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_achievements
  WHERE user_id = user_id_param
  ORDER BY unlocked_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param UUID)
RETURNS SETOF user_stats AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_stats
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user matches
CREATE OR REPLACE FUNCTION get_user_matches(user_id_param UUID, limit_param INTEGER DEFAULT 10)
RETURNS SETOF user_matches AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_matches
  WHERE user_id = user_id_param
  ORDER BY match_date DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user clips
CREATE OR REPLACE FUNCTION get_user_clips(user_id_param UUID, limit_param INTEGER DEFAULT 10)
RETURNS SETOF user_clips AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM user_clips
  WHERE user_id = user_id_param
  ORDER BY created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user settings (combined)
CREATE OR REPLACE FUNCTION get_user_settings(user_id_param UUID)
RETURNS TABLE(
  notification_settings JSON,
  privacy_settings JSON,
  appearance_settings JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    row_to_json(n) AS notification_settings,
    row_to_json(p) AS privacy_settings,
    row_to_json(a) AS appearance_settings
  FROM 
    (SELECT * FROM user_notification_settings WHERE user_id = user_id_param) n,
    (SELECT * FROM user_privacy_settings WHERE user_id = user_id_param) p,
    (SELECT * FROM user_appearance_settings WHERE user_id = user_id_param) a;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  user_id_param UUID,
  display_name_param VARCHAR DEFAULT NULL,
  location_param VARCHAR DEFAULT NULL,
  birthdate_param DATE DEFAULT NULL,
  bio_param TEXT DEFAULT NULL,
  avatar_url_param TEXT DEFAULT NULL,
  banner_url_param TEXT DEFAULT NULL
)
RETURNS SETOF user_profiles AS $$
BEGIN
  RETURN QUERY
  UPDATE user_profiles
  SET 
    display_name = COALESCE(display_name_param, display_name),
    location = COALESCE(location_param, location),
    birthdate = COALESCE(birthdate_param, birthdate),
    bio = COALESCE(bio_param, bio),
    avatar_url = COALESCE(avatar_url_param, avatar_url),
    banner_url = COALESCE(banner_url_param, banner_url),
    updated_at = NOW()
  WHERE id = user_id_param
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update notification settings
CREATE OR REPLACE FUNCTION update_notification_settings(
  user_id_param UUID,
  match_invites_param BOOLEAN DEFAULT NULL,
  friend_requests_param BOOLEAN DEFAULT NULL,
  clan_invites_param BOOLEAN DEFAULT NULL,
  direct_messages_param BOOLEAN DEFAULT NULL,
  system_announcements_param BOOLEAN DEFAULT NULL,
  marketing_emails_param BOOLEAN DEFAULT NULL
)
RETURNS SETOF user_notification_settings AS $$
DECLARE
  settings_id UUID;
BEGIN
  -- Check if settings exist
  SELECT id INTO settings_id FROM user_notification_settings WHERE user_id = user_id_param;
  
  -- If settings don't exist, create them
  IF settings_id IS NULL THEN
    INSERT INTO user_notification_settings (
      user_id, 
      match_invites, 
      friend_requests, 
      clan_invites, 
      direct_messages, 
      system_announcements, 
      marketing_emails
    )
    VALUES (
      user_id_param,
      COALESCE(match_invites_param, TRUE),
      COALESCE(friend_requests_param, TRUE),
      COALESCE(clan_invites_param, TRUE),
      COALESCE(direct_messages_param, TRUE),
      COALESCE(system_announcements_param, TRUE),
      COALESCE(marketing_emails_param, FALSE)
    )
    RETURNING * INTO settings_id;
  ELSE
    -- Update existing settings
    UPDATE user_notification_settings
    SET 
      match_invites = COALESCE(match_invites_param, match_invites),
      friend_requests = COALESCE(friend_requests_param, friend_requests),
      clan_invites = COALESCE(clan_invites_param, clan_invites),
      direct_messages = COALESCE(direct_messages_param, direct_messages),
      system_announcements = COALESCE(system_announcements_param, system_announcements),
      marketing_emails = COALESCE(marketing_emails_param, marketing_emails),
      updated_at = NOW()
    WHERE user_id = user_id_param;
  END IF;
  
  RETURN QUERY
  SELECT * FROM user_notification_settings WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Similar functions for privacy and appearance settings
