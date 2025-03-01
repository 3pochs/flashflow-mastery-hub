
import { useState } from "react";
import { Sparkles, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface FlashcardData {
  question: string;
  answer: string;
}

const FlashcardCreator = () => {
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [category, setCategory] = useState("");
  const [cards, setCards] = useState<FlashcardData[]>([
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [bulkText, setBulkText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleCardChange = (index: number, field: "question" | "answer", value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { question: "", answer: "" }]);
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

  const generateCards = () => {
    // This would normally call an AI API
    setIsGenerating(true);
    
    setTimeout(() => {
      // Simulate AI-generated cards
      const newCards = [
        { 
          question: "What is the capital of France?", 
          answer: "Paris" 
        },
        { 
          question: "Who painted the Mona Lisa?", 
          answer: "Leonardo da Vinci" 
        },
        { 
          question: "What is the largest planet in our solar system?", 
          answer: "Jupiter" 
        },
      ];
      
      setCards(newCards);
      setIsGenerating(false);
      setShowBulkInput(false);
      toast.success("Generated 3 flashcards from your text!");
    }, 1500);
  };

  const handleSaveDeck = () => {
    // Validation
    if (!deckName.trim()) {
      toast.error("Please enter a deck name");
      return;
    }
    
    if (cards.some(card => !card.question.trim() || !card.answer.trim())) {
      toast.error("All cards must have a question and answer");
      return;
    }
    
    // This would save to a database in a real app
    toast.success("Deck saved successfully!");
    
    // Reset form
    setDeckName("");
    setDeckDescription("");
    setCategory("");
    setCards([{ question: "", answer: "" }]);
    setBulkText("");
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
              <option value="science">Science</option>
              <option value="math">Mathematics</option>
              <option value="language">Language</option>
              <option value="history">History</option>
              <option value="arts">Arts</option>
              <option value="other">Other</option>
            </select>
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
            className="btn-primary flex-1"
          >
            Save Deck
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreator;
