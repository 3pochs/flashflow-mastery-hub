
import { Deck, Card } from "../types";

// Current timestamp for created_at and updated_at fields
const now = new Date().toISOString();

// Mock data for decks
export const decks: Deck[] = [
  {
    id: "1",
    user_id: "user-123",
    title: "Biology 101",
    description: "Introduction to cellular biology",
    category: "Science",
    is_public: true,
    created_at: now,
    updated_at: now,
    cards: [
      {
        id: "1",
        deck_id: "1",
        question: "What is the powerhouse of the cell?",
        answer: "Mitochondria",
        category: "Cell Biology",
        difficulty: "easy",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "2",
        deck_id: "1",
        question: "What is the process by which plants convert light energy to chemical energy?",
        answer: "Photosynthesis",
        category: "Cell Biology",
        difficulty: "medium",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "3",
        deck_id: "1",
        question: "What organelle is responsible for protein synthesis?",
        answer: "Ribosome",
        category: "Cell Biology",
        difficulty: "hard",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "4",
        deck_id: "1",
        question: "What is the name of the semipermeable membrane that surrounds the cell?",
        answer: "Cell membrane or plasma membrane",
        category: "Cell Biology",
        difficulty: "medium",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
    ],
  },
  {
    id: "2",
    user_id: "user-123",
    title: "Spanish Vocabulary",
    description: "Common phrases and words",
    category: "Language",
    is_public: true,
    created_at: now,
    updated_at: now,
    cards: [
      {
        id: "5",
        deck_id: "2",
        question: "How do you say 'hello' in Spanish?",
        answer: "Hola",
        category: "Greetings",
        difficulty: "easy",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "6",
        deck_id: "2",
        question: "How do you say 'goodbye' in Spanish?",
        answer: "Adiós",
        category: "Greetings",
        difficulty: "easy",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "7",
        deck_id: "2",
        question: "How do you say 'thank you' in Spanish?",
        answer: "Gracias",
        category: "Greetings",
        difficulty: "easy",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
    ],
  },
  {
    id: "3",
    user_id: "user-123",
    title: "World History",
    description: "Major events of the 20th century",
    category: "History",
    is_public: true,
    created_at: now,
    updated_at: now,
    cards: [
      {
        id: "8",
        deck_id: "3",
        question: "When did World War I begin?",
        answer: "1914",
        category: "World Wars",
        difficulty: "medium",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "9",
        deck_id: "3",
        question: "When did World War II end?",
        answer: "1945",
        category: "World Wars",
        difficulty: "medium",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "10",
        deck_id: "3",
        question: "Who was the President of the United States during the Cuban Missile Crisis?",
        answer: "John F. Kennedy",
        category: "Cold War",
        difficulty: "hard",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
    ],
  },
  {
    id: "4",
    user_id: "user-123",
    title: "Physics Fundamentals",
    description: "Classical mechanics and thermodynamics",
    category: "Science",
    is_public: true,
    created_at: now,
    updated_at: now,
    cards: [
      {
        id: "11",
        deck_id: "4",
        question: "What is Newton's First Law of Motion?",
        answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an unbalanced force.",
        category: "Classical Mechanics",
        difficulty: "medium",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "12",
        deck_id: "4",
        question: "What is the formula for kinetic energy?",
        answer: "KE = (1/2)mv²",
        category: "Energy",
        difficulty: "medium",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        id: "13",
        deck_id: "4",
        question: "What are the units of force in the International System of Units (SI)?",
        answer: "Newtons (N)",
        category: "Units",
        difficulty: "easy",
        review_count: 0,
        created_at: now,
        updated_at: now
      },
    ],
  },
];

export const getDecks = () => {
  return decks;
};

export const getDeck = (id: string) => {
  return decks.find(deck => deck.id === id);
};

export const saveDeck = (deck: Deck) => {
  const existingDeckIndex = decks.findIndex(d => d.id === deck.id);
  const timestamp = new Date().toISOString();
  
  if (existingDeckIndex >= 0) {
    decks[existingDeckIndex] = { 
      ...decks[existingDeckIndex], 
      ...deck, 
      updated_at: timestamp 
    };
    return decks[existingDeckIndex];
  } else {
    const newDeck = {
      ...deck,
      id: (decks.length + 1).toString(),
      user_id: "user-123", // Mock user ID
      is_public: deck.is_public || false,
      created_at: timestamp,
      updated_at: timestamp,
    };
    decks.push(newDeck);
    return newDeck;
  }
};

// Helper to ensure all cards have the required properties
export const createMockCard = (card: Partial<Card>, deckId: string): Card => {
  const timestamp = new Date().toISOString();
  return {
    id: card.id || Math.random().toString(36).substring(2, 15),
    deck_id: deckId,
    question: card.question || "",
    answer: card.answer || "",
    category: card.category || null,
    difficulty: card.difficulty || "medium",
    review_count: card.review_count || 0,
    created_at: card.created_at || timestamp,
    updated_at: card.updated_at || timestamp,
  };
};
