
import { useState, useEffect } from "react";
import { Search, Bookmark, Clock, BarChart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getDecks } from "../services/mockData";
import { Deck } from "../types";
import { toast } from "sonner";

const DeckList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch decks from an API
    setDecks(getDecks());
  }, []);
  
  const toggleFavorite = (deckId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (favorites.includes(deckId)) {
      setFavorites(favorites.filter(id => id !== deckId));
      toast.success("Removed from favorites");
    } else {
      setFavorites([...favorites, deckId]);
      toast.success("Added to favorites");
    }
  };
  
  // Filter decks based on search query and active filter
  const filteredDecks = decks.filter(deck => {
    // Apply search filter
    const matchesSearch = 
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply tab filter
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "recent") return matchesSearch && deck.lastStudied === "Today" || deck.lastStudied === "Yesterday";
    if (activeFilter === "favorites") return matchesSearch && favorites.includes(deck.id);
    if (activeFilter === "complete") return matchesSearch && deck.progress === 100;
    
    return matchesSearch;
  });
  
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
                    className={`transition-colors ${favorites.includes(deck.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    onClick={(e) => toggleFavorite(deck.id, e)}
                  >
                    <Bookmark size={16} fill={favorites.includes(deck.id) ? "currentColor" : "none"} />
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
                    window.location.href = `/decks/${deck.id}/study`;
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
