
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged in, redirect to decks page
    if (user && !isLoading) {
      navigate("/decks", { replace: true });
    }
  }, [user, isLoading, navigate]);
  
  // If still loading or user is logged in but redirect hasn't happened yet, return null
  if (isLoading || user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
