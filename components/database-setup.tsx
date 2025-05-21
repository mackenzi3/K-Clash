"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, Copy, AlertTriangle, Database } from "lucide-react"
import { executeSql, checkTableExists } from "@/lib/supabase-utils"

// SQL schema for the K-Clash platform
const SQL_SCHEMA = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clans table
CREATE TABLE IF NOT EXISTS clans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE
);

-- Create clan_members table
CREATE TABLE IF NOT EXISTS clan_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clan_id, profile_id)
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_pool NUMERIC(10, 2) DEFAULT 0,
  max_participants INTEGER,
  game_id TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  banner_url TEXT,
  rules TEXT
);

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'registered',
  UNIQUE(tournament_id, profile_id)
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  reward TEXT,
  points INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  difficulty TEXT DEFAULT 'medium',
  game_id TEXT
);

-- Create challenge_completions table
CREATE TABLE IF NOT EXISTS challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  proof_url TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(challenge_id, profile_id)
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  release_date DATE,
  publisher TEXT,
  genre TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clips table
CREATE TABLE IF NOT EXISTS clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  duration INTEGER,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT FALSE
);

-- Insert initial system settings
INSERT INTO system_settings (key, value, description, is_public)
VALUES 
  ('maintenance_mode', '{"enabled": false, "message": "We are currently performing maintenance. Please check back later."}', 'Controls maintenance mode for the platform', true),
  ('feature_flags', '{"clips": true, "tournaments": true, "challenges": true, "clans": true}', 'Feature flags to enable/disable features', true),
  ('platform_stats', '{"users": 0, "clans": 0, "tournaments": 0, "challenges": 0}', 'Platform statistics', true),
  ('landing_content', '{"hero": {"title": "Welcome to K-Clash", "subtitle": "Kenya\'s premier gaming platform"}, "stats": [{"id": 1, "label": "Active Players", "value": "5,000+"}, {"id": 2, "label": "Tournaments", "value": "100+"}, {"id": 3, "label": "Prize Pool", "value": "$50K+"}, {"id": 4, "label": "Games", "value": "20+"}]}', 'Content for the landing page', true);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for public system settings
CREATE POLICY "Public settings are viewable by everyone" ON system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Only admins can modify system settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create function to update profile timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profile_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_clan_timestamp
BEFORE UPDATE ON clans
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tournament_timestamp
BEFORE UPDATE ON tournaments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_challenge_timestamp
BEFORE UPDATE ON challenges
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_game_timestamp
BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_clip_timestamp
BEFORE UPDATE ON clips
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_system_settings_timestamp
BEFORE UPDATE ON system_settings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
`

export function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [tablesExist, setTablesExist] = useState<Record<string, boolean>>({})
  const [isCheckingTables, setIsCheckingTables] = useState(false)

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const result = await executeSql(SQL_SCHEMA)
      setResult(result)

      if (result.success) {
        // If successful, check tables again
        checkTables()
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkTables = async () => {
    setIsCheckingTables(true)

    const tables = [
      "profiles",
      "clans",
      "clan_members",
      "tournaments",
      "tournament_participants",
      "challenges",
      "challenge_completions",
      "games",
      "clips",
      "system_settings",
    ]

    const results: Record<string, boolean> = {}

    for (const table of tables) {
      results[table] = await checkTableExists(table)
    }

    setTablesExist(results)
    setIsCheckingTables(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCHEMA)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>Set up the required database tables for the K-Clash platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="auto">
          <TabsList className="mb-4">
            <TabsTrigger value="auto">Automatic Setup</TabsTrigger>
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
            <TabsTrigger value="status">Database Status</TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Automatic Database Setup</AlertTitle>
              <AlertDescription>
                This will automatically create all required tables in your Supabase database. Make sure you have the
                correct permissions before proceeding.
              </AlertDescription>
            </Alert>

            {result && (
              <Alert
                variant={result.success ? "default" : "destructive"}
                className={result.success ? "bg-green-50 border-green-200" : ""}
              >
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {result.success
                    ? "Database tables created successfully!"
                    : `Failed to create database tables: ${result.error}`}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={runMigration} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up database...
                </>
              ) : (
                "Run Database Setup"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Manual Database Setup</AlertTitle>
              <AlertDescription>Copy the SQL below and run it in your Supabase SQL Editor.</AlertDescription>
            </Alert>

            <div className="relative">
              <pre className="bg-secondary/20 p-4 rounded-md overflow-auto max-h-[400px] text-xs">{SQL_SCHEMA}</pre>
              <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Database Status</AlertTitle>
              <AlertDescription>Check if the required tables exist in your database.</AlertDescription>
            </Alert>

            <div className="space-y-2">
              {Object.keys(tablesExist).length > 0 ? (
                Object.entries(tablesExist).map(([table, exists]) => (
                  <div key={table} className="flex items-center justify-between p-2 bg-secondary/10 rounded-md">
                    <span className="font-mono text-sm">{table}</span>
                    {exists ? (
                      <span className="text-green-500 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" /> Exists
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" /> Missing
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Click the button below to check table status
                </div>
              )}
            </div>

            <Button onClick={checkTables} disabled={isCheckingTables} className="w-full">
              {isCheckingTables ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking tables...
                </>
              ) : (
                "Check Database Tables"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </CardFooter>
    </Card>
  )
}
