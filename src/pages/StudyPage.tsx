
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Flashcard from "../components/Flashcard";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Card {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const StudyPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    hard: 0,
    total: 0,
    completed: false,
  });

  // Mock data for the deck
  const [deck, setDeck] = useState({
    id: deckId,
    title: "Biology 101",
    description: "Introduction to cellular biology",
    category: "Science",
    cards: [
      {
        id: "1",
        question: "What is the powerhouse of the cell?",
        answer: "Mitochondria",
        category: "Cell Biology",
        difficulty: "easy" as const,
      },
      {
        id: "2",
        question: "What is the process by which plants convert light energy to chemical energy?",
        answer: "Photosynthesis",
        category: "Cell Biology",
        difficulty: "medium" as const,
      },
      {
        id: "3",
        question: "What organelle is responsible for protein synthesis?",
        answer: "Ribosome",
        category: "Cell Biology",
        difficulty: "hard" as const,
      },
      {
        id: "4",
        question: "What is the name of the semipermeable membrane that surrounds the cell?",
        answer: "Cell membrane or plasma membrane",
        category: "Cell Biology",
        difficulty: "medium" as const,
      },
    ],
  });

  useEffect(() => {
    // In a real app, this would fetch the deck data from a database
    console.log(`Fetching deck with ID: ${deckId}`);
    setStats({ ...stats, total: deck.cards.length });
  }, [deckId]);

  const handleNextCard = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of deck
      setStats({ ...stats, completed: true });
      toast.success("You've completed this deck!");
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkCard = (status: "correct" | "incorrect" | "hard") => {
    // Update stats - Fix: Use type assertion to ensure we're accessing a numeric property
    setStats({
      ...stats,
      [status]: (stats[status as keyof typeof stats] as number) + 1,
    });

    // In a real app, this would update the card's status in the database
    console.log(`Card ${deck.cards[currentIndex].id} marked as ${status}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/decks" className="p-2 hover:bg-secondary rounded-full transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{deck.title}</h1>
                <p className="text-muted-foreground">{deck.description}</p>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="font-medium">{currentIndex + 1}</span> of{" "}
              <span className="font-medium">{deck.cards.length}</span> cards
            </div>
          </div>
          
          {stats.completed ? (
            <div className="glass rounded-lg p-10 text-center max-w-lg mx-auto card-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Deck Completed!</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{stats.correct}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">{stats.hard}</div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">{stats.incorrect}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Link to="/decks" className="btn-outline">
                  Back to Decks
                </Link>
                <button 
                  onClick={() => {
                    setCurrentIndex(0);
                    setStats({
                      correct: 0,
                      incorrect: 0,
                      hard: 0,
                      total: deck.cards.length,
                      completed: false,
                    });
                  }}
                  className="btn-primary"
                >
                  Study Again
                </button>
              </div>
            </div>
          ) : (
            <Flashcard
              question={deck.cards[currentIndex].question}
              answer={deck.cards[currentIndex].answer}
              category={deck.cards[currentIndex].category}
              difficulty={deck.cards[currentIndex].difficulty}
              onNext={handleNextCard}
              onPrevious={handlePreviousCard}
              onMark={handleMarkCard}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyPage;
