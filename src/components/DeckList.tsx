
import { useState, useEffect } from "react";
import { Search, Bookmark, Clock, BarChart, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDecks, deleteDeck } from "../services/deckService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const DeckList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Fetch real deck data from Supabase
  const { data: decks = [], isLoading, refetch } = useQuery({
    queryKey: ['decks', user?.id],
    queryFn: () => getDecks(user?.id),
    enabled: !!user,
  });
  
  // Load favorites from localStorage
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites-${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user]);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);
  
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
  
  const handleDeleteDeck = async (deckId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (confirm("Are you sure you want to delete this deck?")) {
      const success = await deleteDeck(deckId);
      if (success) {
        toast.success("Deck deleted successfully");
        refetch();
      }
    }
  };
  
  // Filter decks based on search query and active filter
  const filteredDecks = decks.filter(deck => {
    // Apply search filter
    const matchesSearch = 
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deck.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deck.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply tab filter
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "recent") {
      // Filter decks studied in the last 7 days
      const recentDeckIds = getRecentlyStudiedDeckIds();
      return matchesSearch && recentDeckIds.includes(deck.deck_id);
    }
    if (activeFilter === "favorites") return matchesSearch && favorites.includes(deck.deck_id);
    if (activeFilter === "complete") return matchesSearch && getCompletionRate(deck.deck_id) === 100;
    
    return matchesSearch;
  });
  
  // Helper function to get recently studied deck IDs
  const getRecentlyStudiedDeckIds = () => {
    if (!user) return [];
    
    try {
      const recentStudyData = localStorage.getItem(`recent-study-${user.id}`);
      if (!recentStudyData) return [];
      
      const studyHistory = JSON.parse(recentStudyData);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      return Object.keys(studyHistory).filter(deckId => {
        return studyHistory[deckId] > sevenDaysAgo;
      });
    } catch (error) {
      console.error("Error getting recent decks:", error);
      return [];
    }
  };
  
  // Helper function to get completion rate for a deck
  const getCompletionRate = (deckId: string) => {
    if (!user) return 0;
    
    try {
      const progressData = localStorage.getItem(`progress-${user.id}`);
      if (!progressData) return 0;
      
      const progress = JSON.parse(progressData);
      return progress[deckId] || 0;
    } catch (error) {
      console.error("Error getting deck progress:", error);
      return 0;
    }
  };
  
  const getLastStudiedDate = (deckId: string) => {
    if (!user) return "Never";
    
    try {
      const recentStudyData = localStorage.getItem(`recent-study-${user.id}`);
      if (!recentStudyData) return "Never";
      
      const studyHistory = JSON.parse(recentStudyData);
      const timestamp = studyHistory[deckId];
      
      if (!timestamp) return "Never";
      
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error getting last studied date:", error);
      return "Never";
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
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
              key={deck.deck_id}
              to={`/decks/${deck.deck_id}`}
              className="glass rounded-lg overflow-hidden card-shadow transition-transform hover:translate-y-[-4px]"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/80">
                      {deck.category || "Uncategorized"}
                    </span>
                  </div>
                  <button 
                    className={`transition-colors ${favorites.includes(deck.deck_id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    onClick={(e) => toggleFavorite(deck.deck_id, e)}
                  >
                    <Bookmark size={16} fill={favorites.includes(deck.deck_id) ? "currentColor" : "none"} />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {deck.description || "No description"}
                </p>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={14} />
                    <span>{getLastStudiedDate(deck.deck_id)}</span>
                  </div>
                  <div>{deck.cards_count || 0} cards</div>
                </div>
                
                <div className="w-full bg-secondary/50 rounded-full h-2 mb-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${getCompletionRate(deck.deck_id)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-medium">{getCompletionRate(deck.deck_id)}%</span>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-secondary/30 flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm">
                  <BarChart size={14} />
                  <span>Cards: {deck.cards_count || 0}</span>
                </div>
                <button 
                  className="px-3 py-1 rounded bg-primary text-white text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/decks/${deck.deck_id}`);
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
