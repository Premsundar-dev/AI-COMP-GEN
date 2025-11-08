// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a client using your API key stored securely in environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, framework } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Build the generation prompt (similar to what your frontend sends)
    const fullPrompt = `
You are an expert frontend developer skilled in creating modern, responsive, and animated UI components.
Now generate a UI component for: ${prompt}
Framework to use: ${framework}

Guidelines:
- Code must be clean, structured, and easy to read.
- Must be responsive and visually appealing.
- Return ONLY the code in Markdown fenced code blocks.
- Do NOT include any extra explanations or comments.
    `;

    // Request response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);

    // Extract text output
    const responseText = result.response.text();

    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Something went wrong",
    });
  }
}
