
import { useState } from "react";
import { Search, Bookmark, Clock, BarChart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Deck {
  id: string;
  title: string;
  description: string;
  cardsCount: number;
  category: string;
  lastStudied: string;
  progress: number;
}

const DeckList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Mock data
  const decks: Deck[] = [
    {
      id: "1",
      title: "Biology 101",
      description: "Introduction to cellular biology",
      cardsCount: 48,
      category: "Science",
      lastStudied: "Today",
      progress: 68,
    },
    {
      id: "2",
      title: "Spanish Vocabulary",
      description: "Common phrases and words",
      cardsCount: 120,
      category: "Language",
      lastStudied: "Yesterday",
      progress: 42,
    },
    {
      id: "3",
      title: "World History",
      description: "Major events of the 20th century",
      cardsCount: 75,
      category: "History",
      lastStudied: "3 days ago",
      progress: 25,
    },
    {
      id: "4",
      title: "Physics Fundamentals",
      description: "Classical mechanics and thermodynamics",
      cardsCount: 60,
      category: "Science",
      lastStudied: "1 week ago",
      progress: 15,
    },
  ];
  
  const filteredDecks = decks.filter(deck => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Decks</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="search"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 w-full"
          />
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeFilter === "all" ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Decks
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeFilter === "recent" ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"
          }`}
          onClick={() => setActiveFilter("recent")}
        >
          Recently Studied
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeFilter === "favorites" ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"
          }`}
          onClick={() => setActiveFilter("favorites")}
        >
          Favorites
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeFilter === "complete" ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"
          }`}
          onClick={() => setActiveFilter("complete")}
        >
          Completed
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.length > 0 ? (
          filteredDecks.map((deck) => (
            <Link
              key={deck.id}
              to={`/decks/${deck.id}`}
              className="glass rounded-lg overflow-hidden card-shadow transition-transform hover:translate-y-[-4px]"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/80">
                      {deck.category}
                    </span>
                  </div>
                  <button 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle favorite logic would go here
                    }}
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {deck.description}
                </p>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={14} />
                    <span>{deck.lastStudied}</span>
                  </div>
                  <div>{deck.cardsCount} cards</div>
                </div>
                
                <div className="w-full bg-secondary/50 rounded-full h-2 mb-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${deck.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-medium">{deck.progress}%</span>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-secondary/30 flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm">
                  <BarChart size={14} />
                  <span>Due: 12 cards</span>
                </div>
                <button 
                  className="px-3 py-1 rounded bg-primary text-white text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to study page for this deck
                  }}
                >
                  Study
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground mb-2">No decks found</div>
            <p>Try a different search term or create a new deck.</p>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-6 right-6">
        <Link
          to="/create"
          className="btn-primary h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
        >
          <Plus size={24} />
        </Link>
      </div>
    </div>
  );
};

export default DeckList;
