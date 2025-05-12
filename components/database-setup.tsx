"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase"

export function DatabaseSetup() {
  const [activeTab, setActiveTab] = useState("settings")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runSettingsMigration = async () => {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const supabase = getBrowserSupabaseClient()
      
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from('system_settings').select('id').limit(1)
      
      let tableExists = true
      if (checkError && checkError.code === "42P01") { // Table doesn't exist
        tableExists = false
      }

      if (!tableExists) {
        // Create the table
        const { error: createError } = await supabase.from('_migrations').insert({
          name: 'create_system_settings',
          sql: `
            CREATE TABLE IF NOT EXISTS system_settings (
              id SERIAL PRIMARY KEY,
              key VARCHAR(255) NOT NULL UNIQUE,
              value TEXT NOT NULL,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })

        if (createError) throw createError
      }

      // Insert default settings
      const { error: insertError } = await supabase.from('system_settings').upsert([
        { key: 'maintenance_mode', value: 'false', description: 'Whether the site is in maintenance mode' },
        { key: 'registration_open', value: 'true', description: 'Whether new user registration is open' },
        { key: 'platform_name', value: 'K-Clash', description: 'The name of the platform' },
        { key: 'platform_description', value: 'Kenya\'s Premier Gaming Platform', description: 'The description of the platform' },
        { key: 'contact_email', value: 'support@k-clash.com', description: 'The contact email for the platform' },
        { key: 'max_upload_size', value: '10', description: 'Maximum upload size in MB' }
      ], { onConflict: 'key' })

      if (insertError) throw insertError

      setSuccess("System settings table created and default settings added successfully!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runClansMigration = async () => {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const supabase = getBrowserSupabaseClient()
      
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from('clans').select('id').limit(1)
      
      let tableExists = true
      if (checkError && checkError.code === "42P01") { // Table doesn't exist
        tableExists = false
      }

      if (!tableExists) {
        // Create the clans table
        const { error: createClansError } = await supabase.from('_migrations').insert({
          name: 'create_clans',
          sql: `
            CREATE TABLE IF NOT EXISTS clans (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL UNIQUE,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              member_count INTEGER DEFAULT 1
            );
          `
        })

        if (createClansError) throw createClansError

        // Create the clan_members table
        const { error: createMembersError } = await supabase.from('_migrations').insert({
          name: 'create_clan_members',
          sql: `
            CREATE TABLE IF NOT EXISTS clan_members (
              id SERIAL PRIMARY KEY,
              clan_id INTEGER NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
              user_id UUID NOT NULL,
              joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              role VARCHAR(50) DEFAULT 'member',
              UNIQUE(clan_id, user_id)
            );
          `
        })

        if (createMembersError) throw createMembersError
      }

      // Insert sample clans
      const { error: insertError } = await supabase.from('clans').upsert([
        { name: 'Alpha Squad', description: 'The original gaming clan', member_count: 5 },
        { name: 'Omega Team', description: 'Elite players only', member_count: 3 },
        { name: 'Ninja Warriors', description: 'Stealth and precision', member_count: 7 }
      ], { onConflict: 'name' })

      if (insertError) throw insertError

      setSuccess("Clans tables created and sample data added successfully!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runTournamentsMigration = async () => {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const supabase = getBrowserSupabaseClient()
      
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from('tournaments').select('id').limit(1)
      
      let tableExists = true
      if (checkError && checkError.code === "42P01") { // Table doesn't exist
        tableExists = false
      }

      if (!tableExists) {
        // Create the tournaments table
        const { error: createTournamentsError } = await supabase.from('_migrations').insert({
          name: 'create_tournaments',
          sql: `
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
          `
        })

        if (createTournamentsError) throw createTournamentsError

        // Create the tournament_participants table
        const { error: createParticipantsError } = await supabase.from('_migrations').insert({
          name: 'create_tournament_participants',
          sql: `
            CREATE TABLE IF NOT EXISTS tournament_participants (
              id SERIAL PRIMARY KEY,
              tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
              user_id UUID NOT NULL,
              registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              status VARCHAR(50) DEFAULT 'registered',
              UNIQUE(tournament_id, user_id)
            );
          `
        })

        if (createParticipantsError) throw createParticipantsError
      }

      // Insert sample tournaments
      const { error: insertError } = await supabase.from('tournaments').upsert([
        { 
          name: 'Summer Championship', 
          description: 'Annual summer gaming tournament', 
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), 
          status: 'upcoming', 
          prize_pool: 1000.00, 
          max_participants: 64 
        },
        { 
          name: 'Weekly Challenge', 
          description: 'Weekly competition for all players', 
          start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
          end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
          status: 'active', 
          prize_pool: 250.00, 
          max_participants: 32 
        },
        { 
          name: 'Pro Circuit Qualifier', 
          description: 'Qualify for the pro gaming circuit', 
          start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), 
          end_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
          status: 'completed', 
          prize_pool: 5000.00, 
          max_participants: 128 
        }
      ], { onConflict: 'name' })

      if (insertError) throw insertError

      setSuccess("Tournaments tables created and sample data added successfully!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const runChallengesMigration = async () => {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const supabase = getBrowserSupabaseClient()
      
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Check if table exists
      const { error: checkError } = await supabase.from('challenges').select('id').limit(1)
      
      let tableExists = true
      if (checkError && checkError.code === "42P01") { // Table doesn't exist
        tableExists = false
      }

      if (!tableExists) {
        // Create the challenges table
        const { error: createChallengesError } = await supabase.from('_migrations').insert({
          name: 'create_challenges',
          sql: `
            CREATE TABLE IF NOT EXISTS challenges (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              description TEXT,
              points INTEGER NOT NULL,
              difficulty VARCHAR(50) NOT NULL,
              start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              end_date TIMESTAMP WITH TIME ZONE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })

        if (createChallengesError) throw createChallengesError

        // Create the challenge_completions table
        const { error: createCompletionsError } = await supabase.from('_migrations').insert({
          name: 'create_challenge_completions',
          sql: `
            CREATE TABLE IF NOT EXISTS challenge_completions (
              id SERIAL PRIMARY KEY,
              challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
              user_id UUID NOT NULL,
              completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              points_earned INTEGER NOT NULL,
              UNIQUE(challenge_id, user_id)
            );
          `
        })

        if (createCompletionsError) throw createCompletionsError
      }

      // Insert sample challenges
      const { error: insertError } = await supabase.from('challenges').upsert([
        { title: 'First Blood', description: 'Be the first to eliminate an opponent in a match', points: 100, difficulty: 'easy' },
        { title: 'Pentakill', description: 'Eliminate 5 opponents in a single match', points: 500, difficulty: 'medium' },
        { title: 'Flawless Victory', description: 'Win a match without taking any damage', points: 1000, difficulty: 'hard' }
      ], { onConflict: 'title' })

      if (insertError) throw insertError

      setSuccess("Challenges tables created and sample data added successfully!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>Set up your database tables and sample data</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>\
