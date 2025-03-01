
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Flashcard from "../components/Flashcard";
import { ArrowLeft, BarChart3, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getDeckById } from "../services/deckService";
import { updateCardReviewStatus } from "../services/cardService";
import { useAuth } from "../hooks/useAuth";
import { rateDeck } from "../services/deckService";

interface Card {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  difficulty: "easy" | "medium" | "hard";
  last_reviewed: string | null;
  review_count: number;
}

const StudyPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    hard: 0,
    total: 0,
    completed: false,
  });
  const [userRating, setUserRating] = useState<number | null>(null);

  // Fetch deck data
  const { data: deck, isLoading, error } = useQuery({
    queryKey: ['deck', deckId],
    queryFn: () => getDeckById(deckId || ''),
    enabled: !!deckId,
  });

  // Update card review status
  const updateCardMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'correct' | 'incorrect' | 'hard' }) => 
      updateCardReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck', deckId] });
    },
  });

  // Submit deck rating
  const ratingMutation = useMutation({
    mutationFn: ({ rating }: { rating: number }) => 
      rateDeck(user?.id || '', deckId || '', rating),
    onSuccess: () => {
      toast.success("Rating submitted!");
      queryClient.invalidateQueries({ queryKey: ['deck', deckId] });
    },
  });

  useEffect(() => {
    if (deck?.cards) {
      setStats({ ...stats, total: deck.cards.length });
    }
  }, [deck]);

  const handleNextCard = () => {
    if (!deck?.cards) return;
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
    if (!deck?.cards) return;
    
    // Update stats
    setStats({
      ...stats,
      [status]: stats[status as keyof typeof stats] as number + 1,
    });

    // Update card status in the database
    updateCardMutation.mutate({
      id: deck.cards[currentIndex].id,
      status,
    });
  };

  const handleRateDeck = (rating: number) => {
    setUserRating(rating);
    ratingMutation.mutate({ rating });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Deck not found</h2>
            <p className="text-muted-foreground mb-6">The deck you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/decks" className="btn-primary">
              Back to Decks
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!deck.cards || deck.cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No cards in this deck</h2>
            <p className="text-muted-foreground mb-6">This deck doesn't have any cards yet.</p>
            <Link to="/decks" className="btn-primary">
              Back to Decks
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentCard = deck.cards[currentIndex] as Card;

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
              
              {/* Rating section */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">How would you rate this deck?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRateDeck(rating)}
                      className={`p-2 rounded-full transition-colors ${
                        userRating === rating 
                          ? 'text-yellow-500' 
                          : 'text-muted-foreground hover:text-yellow-500'
                      }`}
                    >
                      <Star size={24} fill={userRating !== null && userRating >= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
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
                    setUserRating(null);
                  }}
                  className="btn-primary"
                >
                  Study Again
                </button>
              </div>
            </div>
          ) : (
            <Flashcard
              question={currentCard.question}
              answer={currentCard.answer}
              category={currentCard.category || ""}
              difficulty={currentCard.difficulty || "medium"}
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
