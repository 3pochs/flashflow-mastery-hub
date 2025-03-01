
import Navbar from "../components/Navbar";
import FlashcardCreator from "../components/FlashcardCreator";
import Footer from "../components/Footer";

const CreatePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <FlashcardCreator />
      </main>
      <Footer />
    </div>
  );
};

export default CreatePage;
