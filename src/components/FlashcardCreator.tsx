
import { useState } from "react";
import { Sparkles, Plus, Trash, Image, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { generateFlashcardsWithAI } from "../services/ai";
import { createDeck } from "../services/deckService";
import { createCards } from "../services/cardService";
import { useAuth } from "../hooks/useAuth";
import { uploadCardMedia } from "../services/cardService";

interface FlashcardData {
  question: string;
  answer: string;
  media_url?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

const FlashcardCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [cards, setCards] = useState<FlashcardData[]>([
    { question: "", answer: "", difficulty: "medium" },
    { question: "", answer: "", difficulty: "medium" },
  ]);
  const [bulkText, setBulkText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<number | null>(null);

  const handleCardChange = (index: number, field: keyof FlashcardData, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { question: "", answer: "", difficulty: "medium" }]);
  };

  const removeCard = (index: number) => {
    if (cards.length <= 1) {
      toast.error("You need at least one card in your deck");
      return;
    }
    
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const handleMediaUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    
    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 5) {
      toast.error("File size must be less than 5MB");
      return;
    }
    
    // Create a temporary deck ID for organizing uploads
    const tempDeckId = "temp-" + Math.random().toString(36).substring(2, 11);
    const tempCardId = "temp-" + Math.random().toString(36).substring(2, 11);
    
    setUploadingMedia(index);
    
    try {
      const mediaUrl = await uploadCardMedia(file, tempDeckId, tempCardId);
      if (mediaUrl) {
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], media_url: mediaUrl };
        setCards(newCards);
        toast.success("Media uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload media");
    } finally {
      setUploadingMedia(null);
    }
  };

  const generateCards = async () => {
    if (!bulkText.trim()) {
      toast.error("Please enter some text to generate flashcards");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Use the Gemini API to generate flashcards
      const generatedCards = await generateFlashcardsWithAI(bulkText);
      
      if (generatedCards.length > 0) {
        // Convert the AI-generated cards to our FlashcardData format
        const formattedCards = generatedCards.map(card => ({
          question: card.question,
          answer: card.answer,
          difficulty: "medium" as "easy" | "medium" | "hard"
        }));
        
        setCards(formattedCards);
        setShowBulkInput(false);
        toast.success(`Generated ${generatedCards.length} flashcards from your text!`);
      } else {
        toast.error("Failed to generate flashcards. Please try again with different text.");
      }
    } catch (error) {
      console.error("Error generating cards:", error);
      toast.error("Something went wrong while generating flashcards.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDeck = async () => {
    if (!user) {
      toast.error("You must be logged in to create a deck");
      return;
    }
    
    // Validation
    if (!deckName.trim()) {
      toast.error("Please enter a deck name");
      return;
    }
    
    if (cards.some(card => !card.question.trim() || !card.answer.trim())) {
      toast.error("All cards must have a question and answer");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create deck
      const newDeck = await createDeck({
        user_id: user.id,
        title: deckName,
        description: deckDescription,
        category,
        is_public: isPublic,
      });
      
      if (!newDeck) {
        throw new Error("Failed to create deck");
      }
      
      // Format cards for saving
      const cardsForSaving = cards.map(card => ({
        deck_id: newDeck.id,
        question: card.question,
        answer: card.answer,
        category: card.category || null,
        difficulty: card.difficulty || "medium",
        media_url: card.media_url,
      }));
      
      // Save cards
      await createCards(cardsForSaving);
      
      toast.success("Deck saved successfully!");
      
      // Navigate to decks page
      setTimeout(() => {
        navigate("/decks");
      }, 1500);
    } catch (error) {
      console.error("Error saving deck:", error);
      toast.error("Failed to save deck");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="glass rounded-xl p-6 card-shadow mb-8">
        <h1 className="text-2xl font-bold mb-6">Create a New Deck</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <label htmlFor="deckName" className="block text-sm font-medium mb-1">
              Deck Name
            </label>
            <input
              id="deckName"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="input-field w-full"
              placeholder="e.g., Biology 101"
            />
          </div>
          
          <div>
            <label htmlFor="deckDescription" className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              id="deckDescription"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              className="input-field w-full h-20 resize-none"
              placeholder="What is this deck about?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select a category</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Language">Language</option>
                <option value="History">History</option>
                <option value="Arts">Arts</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="isPublic" className="flex items-center cursor-pointer">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm font-medium">
                  Make this deck public (visible to everyone)
                </span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Flashcards</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="btn-outline flex items-center gap-1 text-sm"
            >
              <Sparkles size={16} />
              {showBulkInput ? "Hide AI Generator" : "AI Generator"}
            </button>
          </div>
        </div>
        
        {showBulkInput ? (
          <div className="bg-secondary/50 rounded-lg p-4 mb-6 animate-fade-in">
            <label className="block text-sm font-medium mb-2">
              Paste text and our AI will generate flashcards
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="input-field w-full h-32 resize-none mb-4"
              placeholder="Paste any text, paragraphs, or notes here..."
            />
            <button
              onClick={generateCards}
              disabled={!bulkText.trim() || isGenerating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            {cards.map((card, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50 animate-fade-in">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Card {index + 1}</h3>
                  <button
                    onClick={() => removeCard(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove card"
                  >
                    <Trash size={16} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`question-${index}`} className="block text-sm font-medium mb-1">
                      Question
                    </label>
                    <input
                      id={`question-${index}`}
                      type="text"
                      value={card.question}
                      onChange={(e) => handleCardChange(index, "question", e.target.value)}
                      className="input-field w-full"
                      placeholder="Enter your question"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`answer-${index}`} className="block text-sm font-medium mb-1">
                      Answer
                    </label>
                    <textarea
                      id={`answer-${index}`}
                      value={card.answer}
                      onChange={(e) => handleCardChange(index, "answer", e.target.value)}
                      className="input-field w-full h-20 resize-none"
                      placeholder="Enter the answer"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`difficulty-${index}`} className="block text-sm font-medium mb-1">
                        Difficulty
                      </label>
                      <select
                        id={`difficulty-${index}`}
                        value={card.difficulty}
                        onChange={(e) => handleCardChange(index, "difficulty", e.target.value as "easy" | "medium" | "hard")}
                        className="input-field w-full"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor={`media-${index}`} className="block text-sm font-medium mb-1">
                        Add Media (Optional)
                      </label>
                      <div className="relative">
                        <input
                          id={`media-${index}`}
                          type="file"
                          accept="image/*,audio/*"
                          onChange={(e) => handleMediaUpload(index, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`media-${index}`}
                          className="btn-outline flex items-center justify-center gap-1 w-full cursor-pointer"
                        >
                          {uploadingMedia === index ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          ) : card.media_url ? (
                            <Image size={16} />
                          ) : (
                            <UploadCloud size={16} />
                          )}
                          {card.media_url ? "Change Media" : "Upload"}
                        </label>
                      </div>
                      {card.media_url && (
                        <div className="mt-2 flex justify-center">
                          {card.media_url.endsWith('.mp3') || card.media_url.endsWith('.wav') ? (
                            <audio src={card.media_url} controls className="w-full h-8" />
                          ) : (
                            <img 
                              src={card.media_url} 
                              alt="Card media" 
                              className="h-16 object-contain rounded"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addCard}
            className="btn-outline flex items-center justify-center gap-1"
          >
            <Plus size={16} />
            Add Card
          </button>
          
          <button
            onClick={handleSaveDeck}
            className={`btn-primary flex-1 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              "Save Deck"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreator;
