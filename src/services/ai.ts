
import { Card } from "../types";

// Using the provided Gemini API key
const API_KEY = "AIzaSyBv-kNZvs4PXC6XQQfWE9uCu_yMRxfXw_8";

// This is the main function to generate flashcards using Gemini API
export async function generateFlashcardsWithAI(text: string): Promise<Card[]> {
  try {
    // Construct the API request to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create 5 flashcards based on the following text. Format the response as a JSON array of objects, each with 'question' and 'answer' fields. Make the questions challenging but clear, and the answers concise. Text: ${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the AI response
    // The API returns text that contains JSON, so we need to extract and parse it
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find the JSON array in the text response
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from the API response");
    }
    
    // Parse the JSON array
    const cardsData = JSON.parse(jsonMatch[0]);
    
    // Format the cards according to our Card type
    const cards = cardsData.map((card: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      question: card.question,
      answer: card.answer,
      difficulty: "medium",
    }));
    
    return cards;
  } catch (error) {
    console.error("Error generating flashcards with AI:", error);
    return [];
  }
}
