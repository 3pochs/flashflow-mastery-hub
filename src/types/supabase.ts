
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
          media_url: string | null
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
          media_url?: string | null
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
          media_url?: string | null
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
      friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
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
      find_user_by_username: {
        Args: {
          search_username: string
        }
        Returns: {
          id: string
          username: string
          avatar_url: string
        }[]
      }
      get_user_friends: {
        Args: {
          user_uuid: string
        }
        Returns: {
          friend_id: string
          username: string
          avatar_url: string
          status: string
          is_sender: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
