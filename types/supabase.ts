export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
          role: string
          is_verified: boolean
          last_login: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          role?: string
          is_verified?: boolean
          last_login?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          role?: string
          is_verified?: boolean
          last_login?: string
        }
      }
      clans: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          created_at: string
          updated_at: string
          owner_id: string | null
          member_count: number
          is_verified: boolean
          is_public: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          created_at?: string
          updated_at?: string
          owner_id?: string | null
          member_count?: number
          is_verified?: boolean
          is_public?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          created_at?: string
          updated_at?: string
          owner_id?: string | null
          member_count?: number
          is_verified?: boolean
          is_public?: boolean
        }
      }
      clan_members: {
        Row: {
          id: string
          clan_id: string
          profile_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          clan_id: string
          profile_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          clan_id?: string
          profile_id?: string
          role?: string
          joined_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          prize_pool: number
          max_participants: number | null
          game_id: string | null
          status: string
          created_at: string
          updated_at: string
          created_by: string | null
          banner_url: string | null
          rules: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          prize_pool?: number
          max_participants?: number | null
          game_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          banner_url?: string | null
          rules?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          prize_pool?: number
          max_participants?: number | null
          game_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          banner_url?: string | null
          rules?: string | null
        }
      }
      tournament_participants: {
        Row: {
          id: string
          tournament_id: string
          profile_id: string
          registered_at: string
          status: string
        }
        Insert: {
          id?: string
          tournament_id: string
          profile_id: string
          registered_at?: string
          status?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          profile_id?: string
          registered_at?: string
          status?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string | null
          reward: string | null
          points: number
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          created_by: string | null
          status: string
          difficulty: string
          game_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          reward?: string | null
          points?: number
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          status?: string
          difficulty?: string
          game_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          reward?: string | null
          points?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          status?: string
          difficulty?: string
          game_id?: string | null
        }
      }
      challenge_completions: {
        Row: {
          id: string
          challenge_id: string
          profile_id: string
          completed_at: string
          proof_url: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          challenge_id: string
          profile_id: string
          completed_at?: string
          proof_url?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          challenge_id?: string
          profile_id?: string
          completed_at?: string
          proof_url?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
      }
      games: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image_url: string | null
          release_date: string | null
          publisher: string | null
          genre: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          release_date?: string | null
          publisher?: string | null
          genre?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          release_date?: string | null
          publisher?: string | null
          genre?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      clips: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          created_at: string
          updated_at: string
          profile_id: string
          game_id: string | null
          view_count: number
          like_count: number
          duration: number | null
          is_featured: boolean
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
          profile_id: string
          game_id?: string | null
          view_count?: number
          like_count?: number
          duration?: number | null
          is_featured?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
          profile_id?: string
          game_id?: string | null
          view_count?: number
          like_count?: number
          duration?: number | null
          is_featured?: boolean
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          is_public?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          sql_query: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
