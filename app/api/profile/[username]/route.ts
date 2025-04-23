import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username
    const supabase = createServerSupabaseClient()

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("username", username)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Fetch social links
    const { data: socialLinks } = await supabase.from("user_social_links").select("*").eq("user_id", profile.id)

    // Fetch achievements
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", profile.id)
      .order("unlocked_at", { ascending: false })

    // Fetch clan
    const { data: clanMember } = await supabase
      .from("clan_members")
      .select("*, clans(*)")
      .eq("user_id", profile.id)
      .single()

    // Fetch stats
    const { data: stats } = await supabase.from("user_stats").select("*").eq("user_id", profile.id).single()

    // Fetch game stats
    const { data: gameStats } = await supabase
      .from("user_game_stats")
      .select(`
        id,
        last_played,
        games(id, name, icon_url)
      `)
      .eq("user_id", profile.id)

    // Fetch game stat details
    const gameStatsWithDetails = await Promise.all(
      (gameStats || []).map(async (gameStat) => {
        const { data: details } = await supabase
          .from("user_game_stat_details")
          .select("*")
          .eq("user_game_stat_id", gameStat.id)

        return {
          ...gameStat,
          stats: details || [],
        }
      }),
    )

    // Fetch recent matches
    const { data: recentMatches } = await supabase
      .from("user_matches")
      .select(`
        *,
        games(name)
      `)
      .eq("user_id", profile.id)
      .order("match_date", { ascending: false })
      .limit(5)

    // Fetch clips
    const { data: clips } = await supabase
      .from("user_clips")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })

    // Fetch coaches
    const { data: coaches } = await supabase.from("coaches").select("*")

    // Fetch coach specialties
    const coachesWithSpecialties = await Promise.all(
      (coaches || []).map(async (coach) => {
        const { data: specialties } = await supabase
          .from("coach_specialties")
          .select("specialty")
          .eq("coach_id", coach.id)

        return {
          ...coach,
          specialties: specialties?.map((s) => s.specialty) || [],
        }
      }),
    )

    // Fetch notification settings
    const { data: notifications } = await supabase
      .from("user_notification_settings")
      .select("*")
      .eq("user_id", profile.id)
      .single()

    // Fetch privacy settings
    const { data: privacy } = await supabase
      .from("user_privacy_settings")
      .select("*")
      .eq("user_id", profile.id)
      .single()

    // Fetch appearance settings
    const { data: appearance } = await supabase
      .from("user_appearance_settings")
      .select("*")
      .eq("user_id", profile.id)
      .single()

    // Fetch payment methods
    const { data: paymentMethods } = await supabase.from("user_payment_methods").select("*").eq("user_id", profile.id)

    // Fetch connected accounts
    const { data: connectedAccounts } = await supabase
      .from("user_connected_accounts")
      .select("*")
      .eq("user_id", profile.id)

    // Format social links into an object
    const socialLinksObj = (socialLinks || []).reduce(
      (acc, link) => {
        acc[link.platform] = link.username
        return acc
      },
      {} as Record<string, string>,
    )

    // Format clan data
    const clan = clanMember
      ? {
          name: clanMember.clans.name,
          tag: clanMember.clans.tag,
          logo: clanMember.clans.logo_url,
          members: 12, // This would need to be calculated from actual members
          points: 5678, // This would need to be calculated or stored
          role: clanMember.role,
        }
      : null

    // Format game stats
    const formattedGameStats = gameStatsWithDetails.map((gameStat) => ({
      game: gameStat.games.name,
      icon: gameStat.games.icon_url,
      lastPlayed: formatTimeAgo(gameStat.last_played),
      stats: gameStat.stats,
    }))

    // Format matches
    const formattedMatches = (recentMatches || []).map((match) => ({
      id: match.id,
      game: match.games?.name || "Unknown Game",
      opponent: match.opponent,
      result: match.result,
      score: match.score,
      prize: match.prize,
      date: formatTimeAgo(match.match_date),
    }))

    // Combine all data
    const profileData = {
      username: profile.username,
      displayName: profile.display_name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      birthdate: profile.birthdate,
      avatar: profile.avatar_url,
      banner: profile.banner_url,
      bio: profile.bio,
      followers: profile.followers_count,
      following: profile.following_count,
      isPremium: profile.is_premium,
      premiumTier: profile.premium_tier,
      premiumSince: profile.premium_since,
      socialLinks: socialLinksObj,
      achievements: achievements || [],
      clan: clan,
      stats: stats || {},
      gameStats: formattedGameStats,
      recentMatches: formattedMatches,
      clips: clips || [],
      coaches: coachesWithSpecialties || [],
      notifications: notifications || {},
      privacy: privacy || {},
      appearance: appearance || {},
      paymentMethods: paymentMethods || [],
      connectedAccounts: connectedAccounts || [],
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 })
  }
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  if (!dateString) return "Unknown"

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
}

// API route to update profile settings
export async function PUT(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = params.username
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Verify user exists
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("username", username)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const userId = profile.id

    // Update profile information
    if (body.profile) {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          display_name: body.profile.displayName,
          username: body.profile.username,
          email: body.profile.email,
          phone: body.profile.phone,
          location: body.profile.location,
          bio: body.profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
      }
    }

    // Update notification settings
    if (body.notifications) {
      const { error } = await supabase
        .from("user_notification_settings")
        .update({
          match_invites: body.notifications.matchInvites,
          friend_requests: body.notifications.friendRequests,
          clan_invites: body.notifications.clanInvites,
          direct_messages: body.notifications.directMessages,
          system_announcements: body.notifications.systemAnnouncements,
          marketing_emails: body.notifications.marketingEmails,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) {
        return NextResponse.json({ error: "Failed to update notification settings" }, { status: 500 })
      }
    }

    // Update privacy settings
    if (body.privacy) {
      const { error } = await supabase
        .from("user_privacy_settings")
        .update({
          profile_visibility: body.privacy.profileVisibility,
          online_status: body.privacy.onlineStatus,
          game_activity: body.privacy.gameActivity,
          match_history: body.privacy.matchHistory,
          clip_visibility: body.privacy.clipVisibility,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) {
        return NextResponse.json({ error: "Failed to update privacy settings" }, { status: 500 })
      }
    }

    // Update appearance settings
    if (body.appearance) {
      const { error } = await supabase
        .from("user_appearance_settings")
        .update({
          theme: body.appearance.theme,
          ui_sounds: body.appearance.uiSounds,
          notification_sounds: body.appearance.notificationSounds,
          achievement_sounds: body.appearance.achievementSounds,
          background_music: body.appearance.backgroundMusic,
          volume_level: body.appearance.volumeLevel,
          reduce_animations: body.appearance.reduceAnimations,
          low_quality_mode: body.appearance.lowQualityMode,
          data_saver: body.appearance.dataSaver,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) {
        return NextResponse.json({ error: "Failed to update appearance settings" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile data" }, { status: 500 })
  }
}
