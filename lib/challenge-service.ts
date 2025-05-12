import { getBrowserSupabaseClient } from "./supabase"

export type ChallengeRequest = {
  id: string
  user_id: string
  game_name: string
  stake: number
  description: string | null
  preferred_time: string | null
  status: "pending" | "approved" | "rejected"
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export type Challenge = {
  id: string
  request_id: string | null
  game_name: string
  creator_id: string
  creator_name: string
  stake: number
  time_availability: string | null
  players: string
  level: string
  status: "available" | "accepted" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export type ChallengeRequestInput = Omit<
  ChallengeRequest,
  "id" | "status" | "admin_notes" | "created_at" | "updated_at"
>

export type ChallengeInput = Omit<Challenge, "id" | "created_at" | "updated_at">

export async function createChallengeRequest(request: ChallengeRequestInput) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("challenge_requests").insert(request).select()

  if (error) {
    console.error("Error creating challenge request:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function getChallengeRequests(status?: string, limit = 10) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  let query = supabase
    .from("challenge_requests")
    .select(
      `
      *,
      user:user_profiles(username, display_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error("Error fetching challenge requests:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function updateChallengeRequest(id: string, updates: Partial<ChallengeRequest>) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("challenge_requests").update(updates).eq("id", id).select()

  if (error) {
    console.error("Error updating challenge request:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function approveChallengeRequest(
  requestId: string,
  challengeDetails: Omit<ChallengeInput, "request_id" | "status">,
) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  // Start a transaction
  const { data: request, error: requestError } = await supabase
    .from("challenge_requests")
    .update({ status: "approved" })
    .eq("id", requestId)
    .select()
    .single()

  if (requestError) {
    console.error("Error approving challenge request:", requestError)
    return { data: null, error: requestError.message }
  }

  // Create the challenge
  const { data: challenge, error: challengeError } = await supabase
    .from("challenges")
    .insert({
      ...challengeDetails,
      request_id: requestId,
      status: "available",
    })
    .select()

  if (challengeError) {
    console.error("Error creating challenge:", challengeError)
    // Revert the request status
    await supabase.from("challenge_requests").update({ status: "pending" }).eq("id", requestId)
    return { data: null, error: challengeError.message }
  }

  return { data: challenge[0], error: null }
}

export async function getChallenges(status?: string, limit = 10) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  let query = supabase
    .from("challenges")
    .select(
      `
      *,
      creator:user_profiles!creator_id(username, display_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error("Error fetching challenges:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function acceptChallenge(challengeId: string, userId: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  // Update the challenge status
  const { data, error } = await supabase
    .from("challenges")
    .update({ status: "accepted" })
    .eq("id", challengeId)
    .select()

  if (error) {
    console.error("Error accepting challenge:", error)
    return { data: null, error: error.message }
  }

  // TODO: Create a match record

  return { data: data[0], error: null }
}
