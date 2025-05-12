import { getBrowserSupabaseClient } from "./supabase"

export type Tournament = {
  id: string
  name: string
  game_name: string
  prize_pool: number
  entry_fee: number
  start_date: string
  registration_deadline: string
  max_participants: number
  current_participants: number
  description: string | null
  rules: string | null
  status: "registering" | "upcoming" | "in_progress" | "completed" | "cancelled"
  created_at: string
}

export type TournamentParticipant = {
  id: string
  tournament_id: string
  user_id: string
  registration_date: string
  status: "registered" | "confirmed" | "cancelled"
}

export type TournamentCreateInput = Omit<Tournament, "id" | "created_at" | "current_participants"> & {
  created_by: string
}

export async function getTournaments(status?: string, limit = 10) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  let query = supabase.from("tournaments").select("*").order("start_date", { ascending: true })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error("Error fetching tournaments:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getTournamentById(id: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching tournament:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function createTournament(tournament: TournamentCreateInput) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("tournaments").insert(tournament).select()

  if (error) {
    console.error("Error creating tournament:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function updateTournament(id: string, updates: Partial<Tournament>) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("tournaments").update(updates).eq("id", id).select()

  if (error) {
    console.error("Error updating tournament:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function deleteTournament(id: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  const { error } = await supabase.from("tournaments").delete().eq("id", id)

  if (error) {
    console.error("Error deleting tournament:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

export async function registerForTournament(tournamentId: string, userId: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  // First, check if the user is already registered
  const { data: existingRegistration, error: checkError } = await supabase
    .from("tournament_participants")
    .select("*")
    .eq("tournament_id", tournamentId)
    .eq("user_id", userId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 means no rows returned, which is what we want
    console.error("Error checking tournament registration:", checkError)
    return { data: null, error: checkError.message }
  }

  if (existingRegistration) {
    return { data: null, error: "You are already registered for this tournament" }
  }

  // Register the user
  const { data, error } = await supabase
    .from("tournament_participants")
    .insert({
      tournament_id: tournamentId,
      user_id: userId,
      status: "registered",
    })
    .select()

  if (error) {
    console.error("Error registering for tournament:", error)
    return { data: null, error: error.message }
  }

  // Update the current_participants count
  await supabase.rpc("increment_tournament_participants", { tournament_id: tournamentId })

  return { data: data[0], error: null }
}
