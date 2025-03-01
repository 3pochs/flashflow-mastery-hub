
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { ArrowRight, Brain, BarChart3, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useIntersectionObserver } from "../utils/animations";

const Index = () => {
  // Initialize animations
  useIntersectionObserver(".animate-on-scroll");
  
  // Testimonials data
  const testimonials = [
    {
      quote: "FlashFlow completely changed how I prepare for exams. The AI-generated flashcards save me hours of time.",
      author: "Sarah K.",
      role: "Medical Student",
    },
    {
      quote: "The interface is gorgeous and the spaced repetition system actually makes me want to study consistently.",
      author: "Michael T.",
      role: "Language Learner",
    },
    {
      quote: "I've tried many flashcard apps, but FlashFlow is on another level. The AI suggestions are spot on!",
      author: "James R.",
      role: "Software Engineer",
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <Features />
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How FlashFlow Works</h2>
              <p className="text-muted-foreground text-lg">
                Our simple process makes learning effective and efficient.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 animate-on-scroll">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Create or Generate</h3>
                <p className="text-muted-foreground">
                  Create flashcards manually or let our AI generate them from your notes, textbooks, or any source material.
                </p>
              </div>
              
              <div className="text-center p-6 animate-on-scroll">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Study with Spaced Repetition</h3>
                <p className="text-muted-foreground">
                  Review cards using our optimized spaced repetition system that schedules reviews at the perfect time for maximum retention.
                </p>
              </div>
              
              <div className="text-center p-6 animate-on-scroll">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your learning progress with detailed analytics and insights to optimize your study habits.
                </p>
              </div>
            </div>
            
            <div className="text-center animate-on-scroll">
              <Link to="/demo" className="btn-outline text-base py-3 px-8 inline-flex items-center gap-2">
                See It In Action <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of students and professionals who've transformed their learning.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="glass p-6 rounded-lg card-shadow animate-on-scroll"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mb-4 text-lg">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-primary to-accent text-white">
          <div className="container px-4 mx-auto text-center">
            <div className="max-w-3xl mx-auto animate-on-scroll">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Supercharge Your Learning?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of students and professionals who are mastering new subjects faster than ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="py-3 px-8 rounded-md bg-white text-primary font-medium hover:bg-opacity-90 transition-colors">
                  Get Started for Free
                </Link>
                <Link to="/demo" className="py-3 px-8 rounded-md bg-transparent border border-white font-medium hover:bg-white/10 transition-colors">
                  See a Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
