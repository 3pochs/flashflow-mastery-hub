
import { Brain, Sparkles, Palette, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI-Powered Learning",
      description:
        "Our intelligent system adapts to your learning patterns, automatically adjusting difficulty and frequency to optimize retention.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Smart Flashcards",
      description:
        "Paste any text and our AI will automatically generate high-quality flashcards with questions and answers.",
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Beautiful Interface",
      description:
        "A clean, intuitive design with smooth animations makes studying a pleasure rather than a chore.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community & Sharing",
      description:
        "Share your decks with friends or discover pre-made decks from our growing community of learners.",
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why FlashFlow Works So Well</h2>
          <p className="text-muted-foreground text-lg">
            Our science-based approach combined with cutting-edge AI creates the perfect learning
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg glass card-shadow opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
