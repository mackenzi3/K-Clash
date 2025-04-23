"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import {
  ClientProfileService,
  type UserProfile,
  type UserAchievement,
  type UserStat,
  type UserMatch,
  type UserClip,
} from "@/lib/profile-service"

export function useProfile(username?: string) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [stats, setStats] = useState<UserStat | null>(null)
  const [matches, setMatches] = useState<UserMatch[]>([])
  const [clips, setClips] = useState<UserClip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCurrentUser, setIsCurrentUser] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      setError(null)

      try {
        let profileData: UserProfile | null = null

        if (username) {
          // Load specific user profile
          profileData = await ClientProfileService.getProfileByUsername(username)
          setIsCurrentUser(user?.id === profileData?.auth_id)
        } else if (user) {
          // Load current user profile
          profileData = await ClientProfileService.getCurrentProfile()
          setIsCurrentUser(true)
        }

        if (!profileData) {
          setError(username ? "Profile not found" : "You need to be logged in")
          setIsLoading(false)
          return
        }

        setProfile(profileData)

        // Load related data
        const [achievementsData, statsData, matchesData, clipsData] = await Promise.all([
          ClientProfileService.getUserAchievements(profileData.id),
          ClientProfileService.getUserStats(profileData.id),
          ClientProfileService.getUserMatches(profileData.id),
          ClientProfileService.getUserClips(profileData.id),
        ])

        setAchievements(achievementsData)
        setStats(statsData)
        setMatches(matchesData)
        setClips(clipsData)
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [username, user])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !isCurrentUser) return null

    try {
      const updatedProfile = await ClientProfileService.updateProfile(profile.id, updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
      return updatedProfile
    } catch (err) {
      console.error("Error updating profile:", err)
      return null
    }
  }

  const createClip = async (
    clipData: Omit<UserClip, "id" | "user_id" | "created_at" | "views_count" | "likes_count" | "comments_count">,
  ) => {
    if (!profile || !isCurrentUser) return null

    try {
      const newClip = await ClientProfileService.createClip(profile.id, clipData)
      if (newClip) {
        setClips([newClip, ...clips])
      }
      return newClip
    } catch (err) {
      console.error("Error creating clip:", err)
      return null
    }
  }

  const likeClip = async (clipId: string) => {
    try {
      const success = await ClientProfileService.likeClip(clipId)
      if (success) {
        // Update local state
        setClips(clips.map((clip) => (clip.id === clipId ? { ...clip, likes_count: clip.likes_count + 1 } : clip)))
      }
      return success
    } catch (err) {
      console.error("Error liking clip:", err)
      return false
    }
  }

  return {
    profile,
    achievements,
    stats,
    matches,
    clips,
    isLoading,
    error,
    isCurrentUser,
    updateProfile,
    createClip,
    likeClip,
  }
}
