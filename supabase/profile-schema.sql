-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Insert sample data for testing
INSERT INTO user_profiles (username, display_name, email, phone, location, birthdate, bio, followers_count, following_count, is_premium, premium_tier, premium_since)
VALUES 
('KingSlayer254', 'Alex Kamau', 'alex.kamau@example.com', '+254 712 345 678', 'Nairobi, Kenya', '1995-06-15', 'Professional gamer from Nairobi. Specializing in FPS games. 3x Tournament Champion.', 1243, 356, TRUE, 'gold', '2023-01-15');

-- Insert social links
INSERT INTO user_social_links (user_id, platform, username)
SELECT 
  id, 'twitter', 'kingslayer254'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_social_links (user_id, platform, username)
SELECT 
  id, 'instagram', 'kingslayer254'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_social_links (user_id, platform, username)
SELECT 
  id, 'youtube', 'KingSlayerGaming'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_social_links (user_id, platform, username)
SELECT 
  id, 'twitch', 'kingslayer254'
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert achievements
INSERT INTO user_achievements (user_id, name, description, icon, unlocked_at)
SELECT 
  id, 'First Blood', 'Win your first 1v1 match', '🏆', '2023-01-20'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_achievements (user_id, name, description, icon, unlocked_at)
SELECT 
  id, 'Clan Leader', 'Create a clan with 5+ members', '👑', '2023-02-05'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_achievements (user_id, name, description, icon, unlocked_at)
SELECT 
  id, 'Content Creator', 'Upload 10+ clips', '🎬', '2023-02-28'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_achievements (user_id, name, description, icon, unlocked_at)
SELECT 
  id, 'Tournament Victor', 'Win a tournament', '🥇', '2023-03-15'
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert clan
INSERT INTO clans (name, tag, description)
VALUES ('Nairobi Ninjas', 'NRB', 'Elite gaming clan from Nairobi');

-- Insert clan membership
INSERT INTO clan_members (clan_id, user_id, role)
SELECT 
  c.id, p.id, 'Leader'
FROM clans c, user_profiles p
WHERE c.name = 'Nairobi Ninjas' AND p.username = 'KingSlayer254';

-- Insert user stats
INSERT INTO user_stats (user_id, matches_count, wins_count, win_rate, total_earnings, hours_played, tournament_wins, highest_win_streak)
SELECT 
  id, 342, 187, 54.7, 25400, 876, 3, 12
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert games
INSERT INTO games (name)
VALUES 
('Call of Duty: Warzone'),
('Valorant'),
('FIFA 23'),
('Apex Legends');

-- Insert user game stats
INSERT INTO user_game_stats (user_id, game_id, last_played)
SELECT 
  p.id, g.id, NOW() - INTERVAL '2 hours'
FROM user_profiles p, games g
WHERE p.username = 'KingSlayer254' AND g.name = 'Call of Duty: Warzone';

INSERT INTO user_game_stats (user_id, game_id, last_played)
SELECT 
  p.id, g.id, NOW() - INTERVAL '1 day'
FROM user_profiles p, games g
WHERE p.username = 'KingSlayer254' AND g.name = 'Valorant';

INSERT INTO user_game_stats (user_id, game_id, last_played)
SELECT 
  p.id, g.id, NOW() - INTERVAL '3 days'
FROM user_profiles p, games g
WHERE p.username = 'KingSlayer254' AND g.name = 'FIFA 23';

-- Insert game stat details for Call of Duty
INSERT INTO user_game_stat_details (user_game_stat_id, stat_name, stat_value)
SELECT 
  ugs.id, 'K/D Ratio', '2.34'
FROM user_game_stats ugs
JOIN user_profiles p ON ugs.user_id = p.id
JOIN games g ON ugs.game_id = g.id
WHERE p.username = 'KingSlayer254' AND g.name = 'Call of Duty: Warzone';

INSERT INTO user_game_stat_details (user_game_stat_id, stat_name, stat_value)
SELECT 
  ugs.id, 'Wins', '87'
FROM user_game_stats ugs
JOIN user_profiles p ON ugs.user_id = p.id
JOIN games g ON ugs.game_id = g.id
WHERE p.username = 'KingSlayer254' AND g.name = 'Call of Duty: Warzone';

-- Insert matches
INSERT INTO user_matches (user_id, game_id, opponent, result, score, prize, match_date)
SELECT 
  p.id, g.id, 'SharpShooter', 'Win', '2-1', 'KSh 500', NOW() - INTERVAL '2 hours'
FROM user_profiles p, games g
WHERE p.username = 'KingSlayer254' AND g.name = 'Call of Duty: Warzone';

INSERT INTO user_matches (user_id, game_id, opponent, result, score, prize, match_date)
SELECT 
  p.id, g.id, 'FootballMaster', 'Loss', '1-3', 'KSh 200', NOW() - INTERVAL '1 day'
FROM user_profiles p, games g
WHERE p.username = 'KingSlayer254' AND g.name = 'FIFA 23';

INSERT INTO user_matches (user_id, game_id, opponent, result, score, prize, match_date)
SELECT 
  p.id, g.id, 'AimGod', 'Win', '13-8', 'KSh 300', NOW() - INTERVAL '2 days'
FROM user_profiles p, games g
WHERE p.username = 'KingSlayer254' AND g.name = 'Valorant';

-- Insert clips
INSERT INTO user_clips (user_id, title, views_count, likes_count, comments_count, game, description, created_at)
SELECT 
  id, 'Insane 1v5 Clutch in Valorant', 1243, 89, 12, 'Valorant', 'Pulled off this crazy clutch in a ranked match. Can''t believe I hit those shots!', NOW() - INTERVAL '2 hours'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_clips (user_id, title, views_count, likes_count, comments_count, game, description, created_at)
SELECT 
  id, 'Call of Duty Warzone Best Moments', 876, 54, 8, 'Call of Duty: Warzone', 'Compilation of my best plays this week. That snipe at 0:45 was insane!', NOW() - INTERVAL '5 hours'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_clips (user_id, title, views_count, likes_count, comments_count, game, description, created_at)
SELECT 
  id, 'FIFA 23 Last Minute Winner', 543, 32, 5, 'FIFA 23', '90th minute goal to win the Division Rivals match. What a finish!', NOW() - INTERVAL '1 day'
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_clips (user_id, title, views_count, likes_count, comments_count, game, description, created_at)
SELECT 
  id, 'Apex Legends 20 Kill Game', 1876, 132, 24, 'Apex Legends', 'My personal best - 20 kills and 4K damage with Wraith. Almost lost at the end!', NOW() - INTERVAL '2 days'
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert coaches
INSERT INTO coaches (name, game, price, rating, reviews_count)
VALUES 
('ProCoach', 'Valorant', 'KSh 1,500/hour', 4.8, 24),
('FPSMaster', 'Call of Duty: Warzone', 'KSh 1,200/hour', 4.6, 18);

-- Insert coach specialties
INSERT INTO coach_specialties (coach_id, specialty)
SELECT 
  id, 'Aim Training'
FROM coaches
WHERE name = 'ProCoach';

INSERT INTO coach_specialties (coach_id, specialty)
SELECT 
  id, 'Map Strategy'
FROM coaches
WHERE name = 'ProCoach';

INSERT INTO coach_specialties (coach_id, specialty)
SELECT 
  id, 'Agent Selection'
FROM coaches
WHERE name = 'ProCoach';

INSERT INTO coach_specialties (coach_id, specialty)
SELECT 
  id, 'Positioning'
FROM coaches
WHERE name = 'FPSMaster';

INSERT INTO coach_specialties (coach_id, specialty)
SELECT 
  id, 'Loadout Optimization'
FROM coaches
WHERE name = 'FPSMaster';

INSERT INTO coach_specialties (coach_id, specialty)
SELECT 
  id, 'Team Coordination'
FROM coaches
WHERE name = 'FPSMaster';

-- Insert notification settings
INSERT INTO user_notification_settings (user_id, match_invites, friend_requests, clan_invites, direct_messages, system_announcements, marketing_emails)
SELECT 
  id, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert privacy settings
INSERT INTO user_privacy_settings (user_id, profile_visibility, online_status, game_activity, match_history, clip_visibility)
SELECT 
  id, 'public', 'show', 'show', 'public', 'public'
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert appearance settings
INSERT INTO user_appearance_settings (user_id, theme, ui_sounds, notification_sounds, achievement_sounds, background_music, volume_level, reduce_animations, low_quality_mode, data_saver)
SELECT 
  id, 'default', TRUE, TRUE, FALSE, FALSE, 70, TRUE, FALSE, FALSE
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert payment methods
INSERT INTO user_payment_methods (user_id, type, number, is_default)
SELECT 
  id, 'M-Pesa', '071******78', TRUE
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_payment_methods (user_id, type, number, is_default)
SELECT 
  id, 'Credit Card', '****-****-****-4567', FALSE
FROM user_profiles
WHERE username = 'KingSlayer254';

-- Insert connected accounts
INSERT INTO user_connected_accounts (user_id, platform, username, connected)
SELECT 
  id, 'Steam', 'kingslayer254', TRUE
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_connected_accounts (user_id, platform, username, connected)
SELECT 
  id, 'PlayStation', 'KingSlayer_254', TRUE
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_connected_accounts (user_id, platform, username, connected)
SELECT 
  id, 'Xbox', 'KingSlayer254', FALSE
FROM user_profiles
WHERE username = 'KingSlayer254';

INSERT INTO user_connected_accounts (user_id, platform, username, connected)
SELECT 
  id, 'Epic Games', 'KingSlayer254', TRUE
FROM user_profiles
WHERE username = 'KingSlayer254';
