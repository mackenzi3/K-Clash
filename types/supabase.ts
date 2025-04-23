export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          auth_id: string | null
          username: string
          display_name: string | null
          email: string | null
          phone: string | null
          location: string | null
          birthdate: string | null
          avatar_url: string
          banner_url: string
          bio: string | null
          followers_count: number
          following_count: number
          is_premium: boolean
          premium_tier: string | null
          premium_since: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          username: string
          display_name?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          birthdate?: string | null
          avatar_url?: string
          banner_url?: string
          bio?: string | null
          followers_count?: number
          following_count?: number
          is_premium?: boolean
          premium_tier?: string | null
          premium_since?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          username?: string
          display_name?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          birthdate?: string | null
          avatar_url?: string
          banner_url?: string
          bio?: string | null
          followers_count?: number
          following_count?: number
          is_premium?: boolean
          premium_tier?: string | null
          premium_since?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string | null
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string | null
          unlocked_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string | null
          unlocked_at?: string
          created_at?: string
        }
      }
      clans: {
        Row: {
          id: string
          name: string
          tag: string
          logo_url: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tag: string
          logo_url?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tag?: string
          logo_url?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clan_members: {
        Row: {
          id: string
          clan_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          clan_id: string
          user_id: string
          role: string
          joined_at?: string
        }
        Update: {
          id?: string
          clan_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          matches_count: number
          wins_count: number
          win_rate: number
          total_earnings: number
          hours_played: number
          tournament_wins: number
          highest_win_streak: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          matches_count?: number
          wins_count?: number
          win_rate?: number
          total_earnings?: number
          hours_played?: number
          tournament_wins?: number
          highest_win_streak?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          matches_count?: number
          wins_count?: number
          win_rate?: number
          total_earnings?: number
          hours_played?: number
          tournament_wins?: number
          highest_win_streak?: number
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          icon_url: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon_url?: string
          created_at?: string
        }
      }
      user_matches: {
        Row: {
          id: string
          user_id: string
          game_id: string | null
          opponent: string | null
          result: string | null
          score: string | null
          prize: string | null
          match_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id?: string | null
          opponent?: string | null
          result?: string | null
          score?: string | null
          prize?: string | null
          match_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string | null
          opponent?: string | null
          result?: string | null
          score?: string | null
          prize?: string | null
          match_date?: string
          created_at?: string
        }
      }
      user_clips: {
        Row: {
          id: string
          user_id: string
          title: string
          thumbnail_url: string
          video_url: string
          views_count: number
          likes_count: number
          comments_count: number
          game: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          thumbnail_url?: string
          video_url?: string
          views_count?: number
          likes_count?: number
          comments_count?: number
          game?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          thumbnail_url?: string
          video_url?: string
          views_count?: number
          likes_count?: number
          comments_count?: number
          game?: string | null
          description?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      get_profile_by_auth_id: {
        Args: { auth_user_id: string }
        Returns: Database["public"]["Tables"]["user_profiles"]["Row"][]
      }
      get_profile_by_username: {
        Args: { username_param: string }
        Returns: Database["public"]["Tables"]["user_profiles"]["Row"][]
      }
      get_user_achievements: {
        Args: { user_id_param: string }
        Returns: Database["public"]["Tables"]["user_achievements"]["Row"][]
      }
      get_user_stats: {
        Args: { user_id_param: string }
        Returns: Database["public"]["Tables"]["user_stats"]["Row"][]
      }
      get_user_matches: {
        Args: { user_id_param: string; limit_param?: number }
        Returns: Database["public"]["Tables"]["user_matches"]["Row"][]
      }
      get_user_clips: {
        Args: { user_id_param: string; limit_param?: number }
        Returns: Database["public"]["Tables"]["user_clips"]["Row"][]
      }
    }
  }
}
