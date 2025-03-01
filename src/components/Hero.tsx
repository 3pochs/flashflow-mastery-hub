
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-36 pb-24 md:pt-48 md:pb-32 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 mx-auto">
        <div className="opacity-0 animate-fade-in">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-secondary text-primary animate-pulse-soft">
              A smarter, sleeker way to master anything
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Supercharge Your Learning with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                AI-Powered
              </span>{" "}
              Flashcards
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              FlashFlow combines intelligent spaced repetition, beautiful design, and AI to help you
              learn faster and remember longer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-base py-3 px-8">
                Get Started for Free
              </Link>
              <Link to="/demo" className="btn-outline text-base py-3 px-8 flex items-center gap-2">
                See How It Works <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative mt-16 mx-auto max-w-5xl opacity-0 animate-fade-in animate-delay-300">
            <div className="aspect-[16/9] overflow-hidden rounded-xl card-shadow">
              <div className="glass-dark w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-2xl mx-auto p-8">
                  <div className="flashcard-container">
                    <div className="flashcard bg-white rounded-2xl overflow-hidden card-shadow h-64 relative">
                      <div className="flashcard-front p-6 flex flex-col justify-between h-full">
                        <div className="text-xs font-medium text-muted-foreground">BIOLOGY</div>
                        <div className="text-2xl font-medium">What is the function of mitochondria in a cell?</div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">Tap to flip</div>
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">Medium</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              <div className="h-1.5 w-8 rounded-full bg-primary"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
