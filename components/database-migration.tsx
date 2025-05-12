"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase"

export function DatabaseMigration() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const executeMigration = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      const supabase = getBrowserSupabaseClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Create tournaments table
      const { error: tournamentsError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS tournaments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL,
            game_id UUID,
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
            created_by UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (tournamentsError) {
        throw new Error(`Error creating tournaments table: ${tournamentsError.message}`)
      }

      // Create tournament_participants table
      const { error: participantsError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS tournament_participants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
            user_id UUID,
            registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            status VARCHAR NOT NULL DEFAULT 'registered',
            UNIQUE(tournament_id, user_id)
          );
        `,
      })

      if (participantsError) {
        throw new Error(`Error creating tournament_participants table: ${participantsError.message}`)
      }

      // Create challenge_requests table
      const { error: requestsError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS challenge_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            game_name VARCHAR NOT NULL,
            stake INTEGER NOT NULL,
            description TEXT,
            preferred_time VARCHAR,
            status VARCHAR NOT NULL DEFAULT 'pending',
            admin_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (requestsError) {
        throw new Error(`Error creating challenge_requests table: ${requestsError.message}`)
      }

      // Create challenges table
      const { error: challengesError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS challenges (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            request_id UUID REFERENCES challenge_requests(id),
            game_name VARCHAR NOT NULL,
            creator_id UUID,
            creator_name VARCHAR NOT NULL,
            stake INTEGER NOT NULL,
            time_availability VARCHAR,
            players VARCHAR NOT NULL DEFAULT '1v1',
            level VARCHAR NOT NULL,
            status VARCHAR NOT NULL DEFAULT 'available',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (challengesError) {
        throw new Error(`Error creating challenges table: ${challengesError.message}`)
      }

      // Create clan_creation_requests table
      const { error: clanRequestsError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS clan_creation_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
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
        `,
      })

      if (clanRequestsError) {
        throw new Error(`Error creating clan_creation_requests table: ${clanRequestsError.message}`)
      }

      // Create clans table
      const { error: clansError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS clans (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL,
            tag VARCHAR(10) NOT NULL,
            description TEXT,
            logo_url TEXT,
            created_by UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(name),
            UNIQUE(tag)
          );
        `,
      })

      if (clansError) {
        throw new Error(`Error creating clans table: ${clansError.message}`)
      }

      // Create clan_members table
      const { error: clanMembersError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS clan_members (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
            user_id UUID,
            role VARCHAR NOT NULL DEFAULT 'member',
            joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(clan_id, user_id)
          );
        `,
      })

      if (clanMembersError) {
        throw new Error(`Error creating clan_members table: ${clanMembersError.message}`)
      }

      // Create platform_settings table
      const { error: settingsError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS platform_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            key VARCHAR NOT NULL UNIQUE,
            value JSONB NOT NULL,
            description TEXT,
            updated_by UUID,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Insert default settings if they don't exist
          INSERT INTO platform_settings (key, value, description)
          VALUES 
            ('general', '{"maintenance_mode": false, "registration_enabled": true, "platform_name": "K-Clash"}', 'General platform settings'),
            ('moderation', '{"auto_moderation": true, "content_approval": false, "filtered_words": []}', 'Content moderation settings'),
            ('premium', '{"enabled": true, "price": 500, "billing_cycle": "monthly"}', 'Premium subscription settings')
          ON CONFLICT (key) DO NOTHING;
        `,
      })

      if (settingsError) {
        throw new Error(`Error creating platform_settings table: ${settingsError.message}`)
      }

      // Create function to increment tournament participants
      const { error: functionError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE OR REPLACE FUNCTION increment_tournament_participants(tournament_id UUID)
          RETURNS void AS $$
          BEGIN
            UPDATE tournaments
            SET current_participants = current_participants + 1
            WHERE id = tournament_id;
          END;
          $$ LANGUAGE plpgsql;
        `,
      })

      if (functionError) {
        throw new Error(`Error creating increment_tournament_participants function: ${functionError.message}`)
      }

      // Create updated_at triggers
      const { error: triggerError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ language 'plpgsql';

          DROP TRIGGER IF EXISTS update_tournaments_updated_at ON tournaments;
          CREATE TRIGGER update_tournaments_updated_at
          BEFORE UPDATE ON tournaments
          FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

          DROP TRIGGER IF EXISTS update_challenge_requests_updated_at ON challenge_requests;
          CREATE TRIGGER update_challenge_requests_updated_at
          BEFORE UPDATE ON challenge_requests
          FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

          DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
          CREATE TRIGGER update_challenges_updated_at
          BEFORE UPDATE ON challenges
          FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

          DROP TRIGGER IF EXISTS update_clan_creation_requests_updated_at ON clan_creation_requests;
          CREATE TRIGGER update_clan_creation_requests_updated_at
          BEFORE UPDATE ON clan_creation_requests
          FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

          DROP TRIGGER IF EXISTS update_platform_settings_updated_at ON platform_settings;
          CREATE TRIGGER update_platform_settings_updated_at
          BEFORE UPDATE ON platform_settings
          FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        `,
      })

      if (triggerError) {
        throw new Error(`Error creating triggers: ${triggerError.message}`)
      }

      setResult({
        success: true,
        message: "Database migration executed successfully. All tables and functions have been created.",
      })
    } catch (error) {
      console.error("Migration error:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred during migration",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Migration</CardTitle>
        <CardDescription>
          Execute database migration to create necessary tables for tournaments, challenges, and clans
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground mb-4">This will create the following tables if they don't exist:</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
          <li>tournaments</li>
          <li>tournament_participants</li>
          <li>challenge_requests</li>
          <li>challenges</li>
          <li>clan_creation_requests</li>
          <li>clans</li>
          <li>clan_members</li>
          <li>platform_settings</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Click the button below to execute the migration. This may take a few moments.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={executeMigration} disabled={isExecuting}>
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing Migration...
            </>
          ) : result?.success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Migration Successful
            </>
          ) : (
            "Execute Migration"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
