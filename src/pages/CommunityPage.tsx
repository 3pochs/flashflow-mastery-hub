
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Filter, BookOpen, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Deck } from "../types";
import { decks } from "../services/mockData";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  
  const communityDecks: Deck[] = [
    ...decks,
    {
      id: "c1",
      title: "Advanced JavaScript",
      description: "ES6+ features and modern JS patterns",
      cardsCount: 65,
      category: "Programming",
      lastStudied: "2 days ago",
      progress: 45,
    },
    {
      id: "c2",
      title: "Human Anatomy",
      description: "Comprehensive guide to human body systems",
      cardsCount: 112,
      category: "Medicine",
      lastStudied: "1 week ago",
      progress: 30,
    },
    {
      id: "c3",
      title: "Japanese Hiragana",
      description: "Master the Japanese Hiragana writing system",
      cardsCount: 46,
      category: "Language",
      lastStudied: "3 days ago",
      progress: 72,
    },
  ];
  
  const filteredDecks = communityDecks.filter(deck => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
            <button className="btn-outline flex items-center gap-1">
              <Filter size={16} />
              Filter
            </button>
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
                Popular
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "recent"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("recent")}
              >
                Recently Added
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "featured"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("featured")}
              >
                Featured
              </button>
            </div>
          </div>
          
          {/* Community Decks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="glass rounded-lg overflow-hidden card-shadow hover-scale"
              >
                <div className={`h-2 bg-gradient-to-r from-primary to-accent`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{deck.title}</h3>
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {deck.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {deck.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{deck.cardsCount} cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>425 users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <Link
                    to={`/decks/${deck.id}`}
                    className="btn-outline w-full text-center flex items-center justify-center gap-1"
                  >
                    View Deck <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Study Group Promo */}
          <div className="glass rounded-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Join a Study Group</h2>
                <p className="mb-6">
                  Connect with fellow learners, share study materials, and stay motivated together.
                </p>
                <Link 
                  to="/groups"
                  className="bg-white text-primary px-6 py-2 rounded-md font-medium inline-block hover:bg-opacity-90 transition-colors"
                >
                  Find Groups
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
