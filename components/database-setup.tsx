"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, Settings, Users, Trophy, Flag } from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase"

export function DatabaseSetup() {
  const [activeTab, setActiveTab] = useState("settings")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const runSettingsMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase
        .from("system_settings")
        .select("count", { count: "exact", head: true })

      // Create table if it doesn't exist
      if (checkError && checkError.message.includes("does not exist")) {
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql_string: `
            CREATE TABLE IF NOT EXISTS system_settings (
              id SERIAL PRIMARY KEY,
              key TEXT NOT NULL UNIQUE,
              value TEXT NOT NULL,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create trigger for updated_at
            CREATE OR REPLACE FUNCTION update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
            CREATE TRIGGER update_system_settings_updated_at
            BEFORE UPDATE ON system_settings
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
          `,
        })

        if (createError) {
          throw new Error(`Failed to create system_settings table: ${createError.message}`)
        }
      }

      // Insert default settings
      const defaultSettings = [
        {
          key: "maintenance_mode",
          value: "false",
          description: "Whether the site is in maintenance mode",
        },
        {
          key: "registration_open",
          value: "true",
          description: "Whether new user registration is open",
        },
        {
          key: "platform_name",
          value: "K-Clash",
          description: "The name of the platform",
        },
        {
          key: "platform_version",
          value: "1.0.0",
          description: "The current version of the platform",
        },
      ]

      // Insert settings one by one, ignoring conflicts
      for (const setting of defaultSettings) {
        const { error: insertError } = await supabase.from("system_settings").upsert(setting, { onConflict: "key" })

        if (insertError) {
          console.error(`Failed to insert setting ${setting.key}:`, insertError)
        }
      }

      setSuccess("System settings migration completed successfully")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runClansMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from("clans").select("count", { count: "exact", head: true })

      // Create table if it doesn't exist
      if (checkError && checkError.message.includes("does not exist")) {
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql_string: `
            CREATE TABLE IF NOT EXISTS clans (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL UNIQUE,
              description TEXT,
              logo_url TEXT,
              banner_url TEXT,
              member_count INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create trigger for updated_at
            DROP TRIGGER IF EXISTS update_clans_updated_at ON clans;
            CREATE TRIGGER update_clans_updated_at
            BEFORE UPDATE ON clans
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
            
            -- Create clan_members table
            CREATE TABLE IF NOT EXISTS clan_members (
              id SERIAL PRIMARY KEY,
              clan_id INTEGER REFERENCES clans(id) ON DELETE CASCADE,
              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
              role TEXT DEFAULT 'member',
              joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(clan_id, user_id)
            );
          `,
        })

        if (createError) {
          throw new Error(`Failed to create clans tables: ${createError.message}`)
        }
      }

      // Insert sample clans
      const sampleClans = [
        {
          name: "Nairobi Ninjas",
          description: "The elite gaming squad from Nairobi",
          member_count: 12,
        },
        {
          name: "Mombasa Mavericks",
          description: "Coastal gaming legends",
          member_count: 8,
        },
        {
          name: "Kisumu Kings",
          description: "Lakeside gaming royalty",
          member_count: 10,
        },
      ]

      // Insert clans one by one, ignoring conflicts
      for (const clan of sampleClans) {
        const { error: insertError } = await supabase.from("clans").upsert(clan, { onConflict: "name" })

        if (insertError) {
          console.error(`Failed to insert clan ${clan.name}:`, insertError)
        }
      }

      setSuccess("Clans migration completed successfully")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runTournamentsMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from("tournaments").select("count", { count: "exact", head: true })

      // Create table if it doesn't exist
      if (checkError && checkError.message.includes("does not exist")) {
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql_string: `
            CREATE TABLE IF NOT EXISTS tournaments (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              game TEXT NOT NULL,
              start_date TIMESTAMP WITH TIME ZONE NOT NULL,
              end_date TIMESTAMP WITH TIME ZONE NOT NULL,
              registration_deadline TIMESTAMP WITH TIME ZONE,
              max_participants INTEGER,
              prize_pool INTEGER,
              status TEXT DEFAULT 'upcoming',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create trigger for updated_at
            DROP TRIGGER IF EXISTS update_tournaments_updated_at ON tournaments;
            CREATE TRIGGER update_tournaments_updated_at
            BEFORE UPDATE ON tournaments
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
            
            -- Create tournament_participants table
            CREATE TABLE IF NOT EXISTS tournament_participants (
              id SERIAL PRIMARY KEY,
              tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
              registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              status TEXT DEFAULT 'registered',
              UNIQUE(tournament_id, user_id)
            );
            
            -- Create tournament_matches table
            CREATE TABLE IF NOT EXISTS tournament_matches (
              id SERIAL PRIMARY KEY,
              tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
              player1_id UUID REFERENCES auth.users(id),
              player2_id UUID REFERENCES auth.users(id),
              winner_id UUID REFERENCES auth.users(id),
              round INTEGER NOT NULL,
              match_time TIMESTAMP WITH TIME ZONE,
              score TEXT,
              status TEXT DEFAULT 'scheduled',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `,
        })

        if (createError) {
          throw new Error(`Failed to create tournaments tables: ${createError.message}`)
        }
      }

      // Insert sample tournaments
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      const sampleTournaments = [
        {
          name: "Nairobi FIFA Championship",
          description: "The biggest FIFA tournament in Nairobi",
          game: "FIFA 23",
          start_date: nextWeek.toISOString(),
          end_date: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          registration_deadline: new Date(nextWeek.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          max_participants: 32,
          prize_pool: 50000,
          status: "upcoming",
        },
        {
          name: "Call of Duty Warzone Showdown",
          description: "Battle royale tournament for COD players",
          game: "Call of Duty: Warzone",
          start_date: now.toISOString(),
          end_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          registration_deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          max_participants: 50,
          prize_pool: 75000,
          status: "active",
        },
        {
          name: "Valorant Masters Kenya",
          description: "Kenya's premier Valorant tournament",
          game: "Valorant",
          start_date: nextMonth.toISOString(),
          end_date: new Date(nextMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          registration_deadline: new Date(nextMonth.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          max_participants: 16,
          prize_pool: 100000,
          status: "upcoming",
        },
      ]

      // Insert tournaments one by one
      for (const tournament of sampleTournaments) {
        const { error: insertError } = await supabase.from("tournaments").upsert(tournament, { onConflict: "name" })

        if (insertError) {
          console.error(`Failed to insert tournament ${tournament.name}:`, insertError)
        }
      }

      setSuccess("Tournaments migration completed successfully")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runChallengesMigration = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from("challenges").select("count", { count: "exact", head: true })

      // Create table if it doesn't exist
      if (checkError && checkError.message.includes("does not exist")) {
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql_string: `
            CREATE TABLE IF NOT EXISTS challenges (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              description TEXT,
              game TEXT NOT NULL,
              points INTEGER DEFAULT 0,
              difficulty TEXT DEFAULT 'medium',
              requirements TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create trigger for updated_at
            DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
            CREATE TRIGGER update_challenges_updated_at
            BEFORE UPDATE ON challenges
            FOR EACH ROW
            EXECUTE FUNCTION update_modified_column();
            
            -- Create user_challenges table
            CREATE TABLE IF NOT EXISTS user_challenges (
              id SERIAL PRIMARY KEY,
              challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
              status TEXT DEFAULT 'in_progress',
              completed_at TIMESTAMP WITH TIME ZONE,
              proof_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(challenge_id, user_id)
            );
          `,
        })

        if (createError) {
          throw new Error(`Failed to create challenges tables: ${createError.message}`)
        }
      }

      // Insert sample challenges
      const sampleChallenges = [
        {
          title: "Win 5 matches in a row",
          description: "Win 5 consecutive matches in any game mode",
          game: "Any",
          points: 100,
          difficulty: "medium",
          requirements: "Submit screenshots of match results",
        },
        {
          title: "Score 10 goals in a single match",
          description: "Score 10 or more goals in a single FIFA match",
          game: "FIFA 23",
          points: 150,
          difficulty: "hard",
          requirements: "Submit video clip or screenshot of match summary",
        },
        {
          title: "Complete a match with 0 deaths",
          description: "Finish a full match without dying once",
          game: "Valorant",
          points: 200,
          difficulty: "hard",
          requirements: "Submit screenshot of match scoreboard",
        },
        {
          title: "Win a tournament match",
          description: "Win any match in an official K-Clash tournament",
          game: "Any",
          points: 50,
          difficulty: "easy",
          requirements: "Automatic verification",
        },
        {
          title: "Reach level 50",
          description: "Reach player level 50 on your profile",
          game: "K-Clash Platform",
          points: 300,
          difficulty: "medium",
          requirements: "Automatic verification",
        },
      ]

      // Insert challenges one by one
      for (const challenge of sampleChallenges) {
        const { error: insertError } = await supabase.from("challenges").upsert(challenge, { onConflict: "title" })

        if (insertError) {
          console.error(`Failed to insert challenge ${challenge.title}:`, insertError)
        }
      }

      setSuccess("Challenges migration completed successfully")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="clans">
            <Users className="h-4 w-4 mr-2" />
            Clans
          </TabsTrigger>
          <TabsTrigger value="tournaments">
            <Trophy className="h-4 w-4 mr-2" />
            Tournaments
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Flag className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings Migration</CardTitle>
              <CardDescription>Create the system settings table and insert default settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This migration will create the system_settings table and insert default configuration values. Run this
                migration first before other migrations.
              </p>

              <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                <Database className="h-8 w-8 mr-4 text-primary" />
                <div>
                  <h3 className="font-medium">Table: system_settings</h3>
                  <p className="text-sm text-muted-foreground">Stores platform-wide configuration values</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={runSettingsMigration} disabled={isLoading}>
                {isLoading ? "Running Migration..." : "Run Migration"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="clans">
          <Card>
            <CardHeader>
              <CardTitle>Clans Migration</CardTitle>
              <CardDescription>Create clan-related tables and insert sample data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This migration will create the clans and clan_members tables and insert sample clan data.
              </p>

              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: clans</h3>
                    <p className="text-sm text-muted-foreground">Stores clan information</p>
                  </div>
                </div>

                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: clan_members</h3>
                    <p className="text-sm text-muted-foreground">Stores clan membership information</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={runClansMigration} disabled={isLoading}>
                {isLoading ? "Running Migration..." : "Run Migration"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments">
          <Card>
            <CardHeader>
              <CardTitle>Tournaments Migration</CardTitle>
              <CardDescription>Create tournament-related tables and insert sample data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This migration will create the tournaments, tournament_participants, and tournament_matches tables and
                insert sample tournament data.
              </p>

              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: tournaments</h3>
                    <p className="text-sm text-muted-foreground">Stores tournament information</p>
                  </div>
                </div>

                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: tournament_participants</h3>
                    <p className="text-sm text-muted-foreground">Stores tournament registration information</p>
                  </div>
                </div>

                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: tournament_matches</h3>
                    <p className="text-sm text-muted-foreground">Stores tournament match information</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={runTournamentsMigration} disabled={isLoading}>
                {isLoading ? "Running Migration..." : "Run Migration"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Challenges Migration</CardTitle>
              <CardDescription>Create challenge-related tables and insert sample data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This migration will create the challenges and user_challenges tables and insert sample challenge data.
              </p>

              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: challenges</h3>
                    <p className="text-sm text-muted-foreground">Stores challenge information</p>
                  </div>
                </div>

                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Table: user_challenges</h3>
                    <p className="text-sm text-muted-foreground">Stores user challenge progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={runChallengesMigration} disabled={isLoading}>
                {isLoading ? "Running Migration..." : "Run Migration"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
