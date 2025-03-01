
import { Deck, Card } from "../types";

// Mock data for decks
export const decks: Deck[] = [
  {
    id: "1",
    title: "Biology 101",
    description: "Introduction to cellular biology",
    cardsCount: 48,
    category: "Science",
    lastStudied: "Today",
    progress: 68,
    cards: [
      {
        id: "1",
        question: "What is the powerhouse of the cell?",
        answer: "Mitochondria",
        category: "Cell Biology",
        difficulty: "easy",
      },
      {
        id: "2",
        question: "What is the process by which plants convert light energy to chemical energy?",
        answer: "Photosynthesis",
        category: "Cell Biology",
        difficulty: "medium",
      },
      {
        id: "3",
        question: "What organelle is responsible for protein synthesis?",
        answer: "Ribosome",
        category: "Cell Biology",
        difficulty: "hard",
      },
      {
        id: "4",
        question: "What is the name of the semipermeable membrane that surrounds the cell?",
        answer: "Cell membrane or plasma membrane",
        category: "Cell Biology",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "2",
    title: "Spanish Vocabulary",
    description: "Common phrases and words",
    cardsCount: 120,
    category: "Language",
    lastStudied: "Yesterday",
    progress: 42,
    cards: [
      {
        id: "1",
        question: "How do you say 'hello' in Spanish?",
        answer: "Hola",
        category: "Greetings",
        difficulty: "easy",
      },
      {
        id: "2",
        question: "How do you say 'goodbye' in Spanish?",
        answer: "Adiós",
        category: "Greetings",
        difficulty: "easy",
      },
      {
        id: "3",
        question: "How do you say 'thank you' in Spanish?",
        answer: "Gracias",
        category: "Greetings",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "3",
    title: "World History",
    description: "Major events of the 20th century",
    cardsCount: 75,
    category: "History",
    lastStudied: "3 days ago",
    progress: 25,
    cards: [
      {
        id: "1",
        question: "When did World War I begin?",
        answer: "1914",
        category: "World Wars",
        difficulty: "medium",
      },
      {
        id: "2",
        question: "When did World War II end?",
        answer: "1945",
        category: "World Wars",
        difficulty: "medium",
      },
      {
        id: "3",
        question: "Who was the President of the United States during the Cuban Missile Crisis?",
        answer: "John F. Kennedy",
        category: "Cold War",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "4",
    title: "Physics Fundamentals",
    description: "Classical mechanics and thermodynamics",
    cardsCount: 60,
    category: "Science",
    lastStudied: "1 week ago",
    progress: 15,
    cards: [
      {
        id: "1",
        question: "What is Newton's First Law of Motion?",
        answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an unbalanced force.",
        category: "Classical Mechanics",
        difficulty: "medium",
      },
      {
        id: "2",
        question: "What is the formula for kinetic energy?",
        answer: "KE = (1/2)mv²",
        category: "Energy",
        difficulty: "medium",
      },
      {
        id: "3",
        question: "What are the units of force in the International System of Units (SI)?",
        answer: "Newtons (N)",
        category: "Units",
        difficulty: "easy",
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
  
  if (existingDeckIndex >= 0) {
    decks[existingDeckIndex] = { ...decks[existingDeckIndex], ...deck };
    return decks[existingDeckIndex];
  } else {
    const newDeck = {
      ...deck,
      id: (decks.length + 1).toString(),
      progress: 0,
      lastStudied: "Never",
      cardsCount: deck.cards?.length || 0,
    };
    decks.push(newDeck);
    return newDeck;
  }
};
