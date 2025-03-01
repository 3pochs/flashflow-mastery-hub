
import Navbar from "../components/Navbar";
import DeckList from "../components/DeckList";
import Footer from "../components/Footer";

const DecksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <DeckList />
      </main>
      <Footer />
    </div>
  );
};

export default DecksPage;
