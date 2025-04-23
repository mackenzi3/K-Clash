import { createServerSupabaseClient } from "@/lib/supabase"
import { getOrCreateUserProfile } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"

// Get current user's profile
export async function GET() {
  try {
    const profile = await getOrCreateUserProfile()

    if (!profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 })
  }
}

// Update current user's profile
export async function PUT(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()

    // Get the user's profile ID
    const { data: profile } = await supabase.from("user_profiles").select("id").eq("user_id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

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
        .eq("id", profile.id)

      if (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
      }
    }

    // Similar updates for other settings...

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile data" }, { status: 500 })
  }
}
