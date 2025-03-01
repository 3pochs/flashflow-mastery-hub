
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Repeat, Volume2, Image } from "lucide-react";

interface FlashcardProps {
  question: string;
  answer: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  mediaUrl?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: "correct" | "incorrect" | "hard") => void;
}

const Flashcard = ({
  question,
  answer,
  category = "",
  difficulty = "medium",
  mediaUrl,
  onNext,
  onPrevious,
  onMark,
}: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    hard: "bg-orange-100 text-orange-800",
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setSwipeDirection("left");
      setTimeout(() => {
        onMark && onMark("incorrect");
        onNext && onNext();
        setSwipeDirection(null);
        setIsFlipped(false);
      }, 300);
    } else if (isRightSwipe) {
      setSwipeDirection("right");
      setTimeout(() => {
        onMark && onMark("correct");
        onNext && onNext();
        setSwipeDirection(null);
        setIsFlipped(false);
      }, 300);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Determine if the content is a media URL
  const isMediaContent = (content: string) => {
    return content.startsWith('http') && (
      content.endsWith('.jpg') || 
      content.endsWith('.jpeg') || 
      content.endsWith('.png') || 
      content.endsWith('.gif') ||
      content.endsWith('.mp3') ||
      content.endsWith('.wav')
    );
  };

  // Handle audio playback
  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // Render media content
  const renderMedia = (url: string) => {
    if (!url) return null;
    
    if (url.endsWith('.mp3') || url.endsWith('.wav')) {
      return (
        <button
          onClick={() => playAudio(url)}
          className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <Volume2 className="h-6 w-6 text-primary" />
        </button>
      );
    } else {
      return (
        <img
          src={url}
          alt="Card content"
          className="max-h-40 object-contain mx-auto rounded-md mb-4"
        />
      );
    }
  };

  return (
    <div 
      className={`flashcard-container w-full max-w-2xl mx-auto ${
        swipeDirection === "left" ? "swipe-left" : swipeDirection === "right" ? "swipe-right" : ""
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`flashcard rounded-2xl overflow-hidden card-shadow h-64 sm:h-80 relative cursor-pointer ${
          isFlipped ? "flipped" : ""
        }`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front bg-white p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center">
              <div className="text-xs font-medium text-muted-foreground">{category.toUpperCase()}</div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[difficulty]}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              {mediaUrl && isMediaContent(mediaUrl) && renderMedia(mediaUrl)}
              <div className="text-2xl font-medium text-center">{question}</div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">Tap to flip</div>
          </div>
          
          <div className="flashcard-back bg-white p-6 flex flex-col justify-between h-full">
            <div className="text-xs font-medium text-muted-foreground">{category.toUpperCase()} - ANSWER</div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-xl">{answer}</div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">Tap to flip back</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
            onPrevious && onPrevious();
          }}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Previous card"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMark && onMark("hard");
              onNext && onNext();
              setIsFlipped(false);
            }}
            className="px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
            aria-label="Mark as hard"
          >
            <Repeat className="h-5 w-5" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMark && onMark("incorrect");
              onNext && onNext();
              setIsFlipped(false);
            }}
            className="px-4 py-2 rounded-md bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 transition-colors"
            aria-label="Mark as incorrect"
          >
            Again
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMark && onMark("correct");
              onNext && onNext();
              setIsFlipped(false);
            }}
            className="px-4 py-2 rounded-md bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 transition-colors"
            aria-label="Mark as correct"
          >
            Got it
          </button>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
            onNext && onNext();
          }}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Next card"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
