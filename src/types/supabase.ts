
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      decks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          deck_id: string
          question: string
          answer: string
          category: string | null
          difficulty: string
          last_reviewed: string | null
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          question: string
          answer: string
          category?: string | null
          difficulty?: string
          last_reviewed?: string | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          question?: string
          answer?: string
          category?: string | null
          difficulty?: string
          last_reviewed?: string | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          deck_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deck_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deck_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      deck_stats: {
        Row: {
          deck_id: string
          title: string
          description: string | null
          category: string | null
          is_public: boolean
          user_id: string
          creator_name: string | null
          cards_count: number
          avg_rating: number
          ratings_count: number
          created_at: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
