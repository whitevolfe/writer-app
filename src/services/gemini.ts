import { toast } from "sonner";

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export interface GeminiResponse {
  text: string;
  error?: string;
}

export const generateContent = async (
  prompt: string,
  style: string,
  length: string,
  apiKey: string
): Promise<GeminiResponse> => {
  try {
    // Adjust the prompt based on style and length
    const formattedPrompt = `Write a ${length} ${style} about: ${prompt}. 
      Make it engaging and well-structured.
      Length guide: short (300 words), medium (600 words), long (1000 words).`;

    console.log("🔹 Sending request to Gemini API...");
    
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: formattedPrompt }],
          },
        ],
      }),
    });

    console.log("🔹 Received response from API, status:", response.status);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 API Response:", data); // Debugging log

    // Ensure the response format is correct
    if (data.candidates?.length && data.candidates[0]?.content?.parts?.[0]?.text) {
      return { text: data.candidates[0].content.parts[0].text };
    } else {
      throw new Error("Invalid response format from API");
    }
  } catch (error) {
    console.error("❌ Error generating content:", error);
    toast.error("Failed to generate content. Please try again.");
    return { text: "", error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};
