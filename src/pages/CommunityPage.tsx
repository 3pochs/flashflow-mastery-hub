
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Filter, BookOpen, Users, Star, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getDecks, rateDeck } from "../services/deckService";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const CommunityPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  
  // Fetch public decks
  const { data: communityDecks = [], isLoading } = useQuery({
    queryKey: ['communityDecks'],
    queryFn: () => getDecks(),
  });
  
  const filteredDecks = communityDecks.filter(deck => 
    (deck.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.category?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (category ? deck.category === category : true) &&
    (rating ? 
      (rating === "5" && deck.avg_rating >= 5) ||
      (rating === "4" && deck.avg_rating >= 4 && deck.avg_rating < 5) ||
      (rating === "3" && deck.avg_rating >= 3 && deck.avg_rating < 4) ||
      (rating === "below3" && deck.avg_rating < 3)
    : true)
  );
  
  // Sort decks based on active tab
  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (activeTab === "popular") {
      return (b.avg_rating || 0) - (a.avg_rating || 0);
    } else if (activeTab === "trending") {
      // Using ratings count as a proxy for trending
      return (b.ratings_count || 0) - (a.ratings_count || 0);
    } else if (activeTab === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(communityDecks.map(deck => deck.category).filter(Boolean)));
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Community Decks</h1>
            <p className="text-muted-foreground">
              Discover and use high-quality flashcard decks created by the FlashFlow community
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="glass rounded-lg p-4 mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search decks by title, description, or category..."
                className="input-field w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field sm:w-48"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="input-field sm:w-48"
                aria-label="Filter by rating"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="below3">Below 3 Stars</option>
              </select>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex">
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "popular"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("popular")}
              >
                <div className="flex items-center gap-1">
                  <Star size={16} />
                  <span>Highest Rated</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "trending"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("trending")}
              >
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>Trending</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "recent"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("recent")}
              >
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Recently Added</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Community Decks */}
          {sortedDecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sortedDecks.map((deck) => (
                <div
                  key={deck.deck_id}
                  className="glass rounded-lg overflow-hidden card-shadow hover-scale"
                >
                  <div className={`h-2 bg-gradient-to-r from-primary to-accent`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{deck.title}</h3>
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        {deck.category || "Uncategorized"}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {deck.description || "No description"}
                    </p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{deck.cards_count} cards</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>By {deck.creator_name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{deck.avg_rating ? deck.avg_rating.toFixed(1) : "N/A"}</span>
                      </div>
                    </div>
                    <Link
                      to={`/decks/${deck.deck_id}`}
                      className="btn-outline w-full text-center flex items-center justify-center gap-1"
                    >
                      View Deck <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground mb-4">No decks found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setCategory("");
                  setRating("");
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {/* Study Group Promo */}
          <div className="glass rounded-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Create Your Own Deck</h2>
                <p className="mb-6">
                  Share your knowledge with the community and help others learn.
                </p>
                <Link 
                  to="/create"
                  className="bg-white text-primary px-6 py-2 rounded-md font-medium inline-block hover:bg-opacity-90 transition-colors"
                >
                  Create Deck
                </Link>
              </div>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="bg-secondary/30 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Tips for Creating Great Flashcards</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>Keep questions clear and focused on a single concept</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>Use images, diagrams, and mnemonics when appropriate</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>Make answers concise and memorable</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <span>Use AI suggestions but always review for accuracy</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
