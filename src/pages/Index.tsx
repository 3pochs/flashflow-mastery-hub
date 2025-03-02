
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // If user is logged in, redirect to decks page
  if (user && !isLoading) {
    return <Navigate to="/decks" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero showGetStarted={!user} />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
