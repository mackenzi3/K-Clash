import { getBrowserSupabaseClient } from "./supabase"

export type ClanCreationRequest = {
  id: string
  user_id: string
  name: string
  tag: string
  description: string | null
  logo_url: string | null
  status: "pending" | "approved" | "rejected"
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export type Clan = {
  id: string
  name: string
  tag: string
  description: string | null
  logo_url: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type ClanCreationRequestInput = Omit<
  ClanCreationRequest,
  "id" | "status" | "admin_notes" | "created_at" | "updated_at"
>

export async function createClanRequest(request: ClanCreationRequestInput) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("clan_creation_requests").insert(request).select()

  if (error) {
    console.error("Error creating clan request:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function getClanRequests(status?: string, limit = 10) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  let query = supabase
    .from("clan_creation_requests")
    .select(
      `
      *,
      user:user_profiles!user_id(username, display_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error("Error fetching clan requests:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function updateClanRequest(id: string, updates: Partial<ClanCreationRequest>) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("clan_creation_requests").update(updates).eq("id", id).select()

  if (error) {
    console.error("Error updating clan request:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function approveClanRequest(requestId: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  // Get the request details
  const { data: request, error: requestError } = await supabase
    .from("clan_creation_requests")
    .select("*")
    .eq("id", requestId)
    .single()

  if (requestError) {
    console.error("Error fetching clan request:", requestError)
    return { data: null, error: requestError.message }
  }

  // Create the clan
  const { data: clan, error: clanError } = await supabase
    .from("clans")
    .insert({
      name: request.name,
      tag: request.tag,
      description: request.description,
      logo_url: request.logo_url,
      created_by: request.user_id,
    })
    .select()

  if (clanError) {
    console.error("Error creating clan:", clanError)
    return { data: null, error: clanError.message }
  }

  // Update the request status
  await supabase.from("clan_creation_requests").update({ status: "approved" }).eq("id", requestId)

  // Add the creator as a clan member with owner role
  const { error: memberError } = await supabase.from("clan_members").insert({
    clan_id: clan[0].id,
    user_id: request.user_id,
    role: "owner",
  })

  if (memberError) {
    console.error("Error adding clan member:", memberError)
    // We don't return an error here because the clan was created successfully
  }

  return { data: clan[0], error: null }
}

export async function getClans(limit = 10) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase
    .from("clans")
    .select(
      `
      *,
      members:clan_members(count),
      owner:user_profiles!created_by(username, display_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching clans:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getClanById(id: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase
    .from("clans")
    .select(
      `
      *,
      members:clan_members(
        user:user_profiles(id, username, display_name, avatar_url),
        role
      ),
      owner:user_profiles!created_by(username, display_name, avatar_url)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching clan:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function joinClan(clanId: string, userId: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  // Check if the user is already a member
  const { data: existingMember, error: checkError } = await supabase
    .from("clan_members")
    .select("*")
    .eq("clan_id", clanId)
    .eq("user_id", userId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 means no rows returned, which is what we want
    console.error("Error checking clan membership:", checkError)
    return { data: null, error: checkError.message }
  }

  if (existingMember) {
    return { data: null, error: "You are already a member of this clan" }
  }

  // Add the user as a member
  const { data, error } = await supabase
    .from("clan_members")
    .insert({
      clan_id: clanId,
      user_id: userId,
      role: "member",
    })
    .select()

  if (error) {
    console.error("Error joining clan:", error)
    return { data: null, error: error.message }
  }

  return { data: data[0], error: null }
}

export async function leaveClan(clanId: string, userId: string) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  // Check if the user is the owner
  const { data: clan, error: clanError } = await supabase.from("clans").select("created_by").eq("id", clanId).single()

  if (clanError) {
    console.error("Error checking clan ownership:", clanError)
    return { success: false, error: clanError.message }
  }

  if (clan.created_by === userId) {
    return { success: false, error: "Clan owners cannot leave their clan. Transfer ownership first." }
  }

  // Remove the user from the clan
  const { error } = await supabase.from("clan_members").delete().eq("clan_id", clanId).eq("user_id", userId)

  if (error) {
    console.error("Error leaving clan:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}
