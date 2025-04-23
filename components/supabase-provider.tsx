"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getBrowserSupabaseClient } from "@/lib/supabase"

type SupabaseContextType = {
  subscribeToChannel: (channelName: string, callback: (payload: any) => void) => Promise<RealtimeChannel | null>
  unsubscribeFromChannel: (channel: RealtimeChannel) => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = getBrowserSupabaseClient()
  const [activeChannels, setActiveChannels] = useState<Map<string, RealtimeChannel>>(new Map())

  useEffect(() => {
    // Cleanup function to unsubscribe from all channels
    return () => {
      activeChannels.forEach((channel) => {
        channel.unsubscribe()
      })
    }
  }, [activeChannels])

  const subscribeToChannel = async (channelName: string, callback: (payload: any) => void) => {
    if (!supabase) return null

    try {
      // Check if we already have this channel
      if (activeChannels.has(channelName)) {
        return activeChannels.get(channelName) || null
      }

      const channel = supabase.channel(channelName)

      channel
        .on("broadcast", { event: "message" }, (payload) => {
          callback(payload)
        })
        .subscribe()

      setActiveChannels(new Map(activeChannels.set(channelName, channel)))

      return channel
    } catch (error) {
      console.error(`Error subscribing to channel ${channelName}:`, error)
      return null
    }
  }

  const unsubscribeFromChannel = async (channel: RealtimeChannel) => {
    if (!supabase) return

    try {
      await channel.unsubscribe()

      // Remove from active channels
      const newChannels = new Map(activeChannels)
      activeChannels.forEach((ch, name) => {
        if (ch === channel) {
          newChannels.delete(name)
        }
      })

      setActiveChannels(newChannels)
    } catch (error) {
      console.error("Error unsubscribing from channel:", error)
    }
  }

  const value = {
    subscribeToChannel,
    unsubscribeFromChannel,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
