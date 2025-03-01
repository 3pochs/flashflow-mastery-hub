
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Layers, Brain, BarChart3, Check, X, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const DemoPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const totalSteps = 3;
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setShowAnswer(false);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowAnswer(false);
    }
  };
  
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How FlashFlow Works</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the full learning cycle with our interactive demo
            </p>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2">
              {[...Array(totalSteps)].map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 rounded-full transition-all ${
                    index + 1 === currentStep
                      ? "w-10 bg-primary"
                      : index + 1 < currentStep
                      ? "w-2.5 bg-primary/60"
                      : "w-2.5 bg-secondary"
                  }`}
                  onClick={() => setCurrentStep(index + 1)}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Step Content */}
          <div className="glass rounded-xl p-6 md:p-10 card-shadow mb-8">
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="bg-primary/10 rounded-full p-6 flex-shrink-0">
                    <Brain className="w-16 h-16 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Step 1: Create Your Deck</h2>
                    <div className="space-y-4 text-lg">
                      <p>
                        Start by creating a deck of flashcards on any topic. You can:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Add cards manually by typing questions and answers</li>
                        <li className="font-semibold text-primary">Use our AI to instantly generate cards from your notes or text</li>
                        <li>Import cards from existing sources</li>
                        <li>Organize them by categories and difficulty</li>
                      </ul>
                      <p className="pt-2">
                        Our AI handles the hard work by creating well-structured questions and answers that test your understanding, not just memorization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="bg-primary/10 rounded-full p-6 flex-shrink-0">
                    <Layers className="w-16 h-16 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Step 2: Study with Spaced Repetition</h2>
                    <div className="space-y-4 text-lg">
                      <p>
                        FlashFlow uses spaced repetition to optimize your learning:
                      </p>
                      <div className="mt-8 max-w-xl mx-auto">
                        <div className="flashcard-container mb-6">
                          <div className={`flashcard bg-white rounded-xl overflow-hidden card-shadow h-64 relative ${showAnswer ? "flipped" : ""}`} onClick={toggleAnswer}>
                            <div className="flashcard-front p-6 flex flex-col justify-between h-full">
                              <div className="text-xs font-medium text-muted-foreground">SCIENCE</div>
                              <div className="text-2xl font-medium">What is the process by which plants make their own food?</div>
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-muted-foreground">Tap to flip</div>
                                <div className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">Medium</div>
                              </div>
                            </div>
                            <div className="flashcard-back p-6 flex flex-col justify-between h-full">
                              <div className="text-xs font-medium text-muted-foreground">ANSWER</div>
                              <div className="text-2xl font-medium">Photosynthesis</div>
                              <div className="flex justify-end">
                                <div className="text-xs text-muted-foreground">Rate your recall</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-4">
                          <button className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                            <X size={20} />
                          </button>
                          <button className="p-3 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors">
                            <RotateCcw size={20} />
                          </button>
                          <button className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                            <Check size={20} />
                          </button>
                        </div>
                        <p className="text-sm text-center mt-4 text-muted-foreground">
                          Rate how well you knew the answer to optimize your learning schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="bg-primary/10 rounded-full p-6 flex-shrink-0">
                    <BarChart3 className="w-16 h-16 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Step 3: Track Your Progress</h2>
                    <div className="space-y-4 text-lg">
                      <p>
                        Watch your learning progress through detailed analytics:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>See your retention rates over time</li>
                        <li>Identify your strongest and weakest topics</li>
                        <li>Track your daily study streak</li>
                        <li>Get insights on optimal study times</li>
                      </ul>
                      <div className="bg-secondary/30 rounded-lg p-5 mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Learning Progress</span>
                          <span className="text-sm font-bold text-primary">72%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{width: "72%"}}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Biology Deck (48 cards)</span>
                          <span>Updated today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              className={`btn-outline py-2 px-4 ${currentStep === 1 ? "invisible" : ""}`}
            >
              Previous Step
            </button>
            
            <div className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </div>
            
            {currentStep < totalSteps ? (
              <button onClick={nextStep} className="btn-primary py-2 px-4">
                Next Step
              </button>
            ) : (
              <Link to="/signup" className="btn-primary py-2 px-4">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DemoPage;
