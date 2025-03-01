
export interface Deck {
  id: string;
  title: string;
  description: string;
  cardsCount: number;
  category: string;
  lastStudied: string;
  progress: number;
  cards?: Card[];
}

export interface Card {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: string;
  nextReview?: string;
  reviewCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats?: {
    totalCards: number;
    cardsLearned: number;
    streak: number;
  };
}
