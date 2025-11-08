// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client with your secure API key
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, frameWork } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Initialize Gemini with the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing Gemini API key" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build AI prompt
    const fullPrompt = `
You are an expert frontend developer skilled in creating modern, responsive, and animated UI components.
Generate a complete and high-quality UI component for: ${prompt}
Framework to use: ${frameWork}

Requirements:
- Return only clean, formatted code.
- Include HTML, CSS, and JS in a single file.
- No extra explanations or markdown.
    `;

    const result = await model.generateContent(fullPrompt);
    const code = result.response.text();

    return res.status(200).json({ code });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Something went wrong",
    });
  }
}
