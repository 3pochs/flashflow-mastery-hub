
export interface DeckStat {
  deck_id: string;
  title: string;
  description: string | null;
  category: string | null;
  is_public: boolean;
  user_id: string;
  creator_name: string | null;
  cards_count: number;
  avg_rating: number;
  ratings_count: number;
  created_at: string;
}

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  cards?: Card[];
}

export interface Card {
  id: string;
  deck_id: string;
  question: string;
  answer: string;
  category?: string | null;
  difficulty: "easy" | "medium" | "hard";
  media_url?: string | null;
  last_reviewed?: string | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  stats?: {
    totalCards: number;
    cardsLearned: number;
    streak: number;
  };
}

export interface Rating {
  id: string;
  user_id: string;
  deck_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
}

export interface FriendProfile {
  friend_id: string;
  username: string | null;
  avatar_url: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  is_sender: boolean;
  id: string;
}
