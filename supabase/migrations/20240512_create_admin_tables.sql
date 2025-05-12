-- Create tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    prize_pool INTEGER NOT NULL DEFAULT 0,
    entry_fee INTEGER NOT NULL DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 32,
    description TEXT,
    rules TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'registering',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenge_requests table
CREATE TABLE IF NOT EXISTS public.challenge_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    stake INTEGER NOT NULL DEFAULT 0,
    preferred_time VARCHAR(255),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_name VARCHAR(255) NOT NULL,
    creator_id UUID REFERENCES auth.users(id) NOT NULL,
    creator_name VARCHAR(255) NOT NULL,
    stake INTEGER NOT NULL DEFAULT 0,
    time_availability VARCHAR(255),
    players VARCHAR(50) NOT NULL DEFAULT '1v1',
    level VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    challenger_id UUID REFERENCES auth.users(id),
    challenger_name VARCHAR(255),
    winner_id UUID REFERENCES auth.users(id),
    request_id UUID REFERENCES public.challenge_requests(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clan_creation_requests table
CREATE TABLE IF NOT EXISTS public.clan_creation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(10) NOT NULL,
    description TEXT,
    logo_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clans table
CREATE TABLE IF NOT EXISTS public.clans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(10) NOT NULL,
    description TEXT,
    logo_url TEXT,
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clan_members table
CREATE TABLE IF NOT EXISTS public.clan_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clan_id UUID REFERENCES public.clans(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(clan_id, user_id)
);

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id VARCHAR(50) PRIMARY KEY,
    settings JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.platform_settings (id, settings)
VALUES 
('general', '{"maintenance_mode": false, "registration_enabled": true, "platform_name": "K-Clash"}'::jsonb),
('moderation', '{"auto_moderation": true, "content_approval": false, "filtered_words": []}'::jsonb),
('premium', '{"enabled": true, "price": 500, "billing_cycle": "monthly"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
