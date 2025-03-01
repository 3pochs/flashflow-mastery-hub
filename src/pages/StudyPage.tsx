
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Flashcard from "../components/Flashcard";
import Footer from "../components/Footer";
import { ChevronLeft, BarChart2 } from "lucide-react";

const StudyPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    hard: 0,
    total: 0,
    remaining: 0
  });
  
  // Mock cards data
  const cards = [
    {
      id: "1",
      question: "What is the capital of France?",
      answer: "Paris",
      category: "Geography",
      difficulty: "easy" as const
    },
    {
      id: "2",
      question: "What is the main function of mitochondria in a cell?",
      answer: "Powerhouse of the cell - generates energy in the form of ATP through cellular respiration",
      category: "Biology",
      difficulty: "medium" as const
    },
    {
      id: "3",
      question: "What is the square root of 144?",
      answer: "12",
      category: "Mathematics",
      difficulty: "easy" as const
    },
    {
      id: "4",
      question: "What year did World War II end?",
      answer: "1945",
      category: "History",
      difficulty: "medium" as const
    },
    {
      id: "5",
      question: "What is the chemical symbol for gold?",
      answer: "Au (Aurum)",
      category: "Chemistry",
      difficulty: "easy" as const
    }
  ];
  
  useEffect(() => {
    // Initialize study stats
    setStudyStats({
      correct: 0,
      incorrect: 0,
      hard: 0,
      total: cards.length,
      remaining: cards.length
    });
  }, []);
  
  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  
  const handleMarkCard = (status: "correct" | "incorrect" | "hard") => {
    setStudyStats(prevStats => ({
      ...prevStats,
      [status]: prevStats[status] + 1,
      remaining: prevStats.remaining - 1
    }));
  };
  
  const currentCard = cards[currentCardIndex];
  const progress = Math.round(((studyStats.total - studyStats.remaining) / studyStats.total) * 100);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link to="/decks" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Decks
              </Link>
              <h1 className="text-2xl font-bold">Studying: Biology 101</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {cards.length}
              </div>
              <div className="w-24 bg-secondary/50 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            {currentCard && (
              <Flashcard
                question={currentCard.question}
                answer={currentCard.answer}
                category={currentCard.category}
                difficulty={currentCard.difficulty}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onMark={handleMarkCard}
              />
            )}
          </div>
          
          <div className="max-w-2xl mx-auto glass rounded-lg p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Study Statistics</h2>
              <Link to={`/decks/${deckId}/stats`} className="flex items-center text-sm text-primary">
                <BarChart2 className="h-4 w-4 mr-1" />
                Detailed Stats
              </Link>
            </div>
            
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xl font-medium">{studyStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <div className="text-xl font-medium text-green-800">{studyStats.correct}</div>
                <div className="text-xs text-green-800">Correct</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <div className="text-xl font-medium text-yellow-800">{studyStats.hard}</div>
                <div className="text-xs text-yellow-800">Hard</div>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <div className="text-xl font-medium text-red-800">{studyStats.incorrect}</div>
                <div className="text-xs text-red-800">Incorrect</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyPage;
