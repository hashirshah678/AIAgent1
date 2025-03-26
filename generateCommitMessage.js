// generateCommitMessage.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Retrieve the Gemini API key from the environment variable
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Missing GOOGLE_API_KEY. Please set it in your environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateCommitMessage() {
  try {
    const result = await model.generateContent({
      messages: [
        { role: "user", content: "Generate an engaging commit message for our repository." }
      ],
    });
    if (!result.response || !result.response.text) {
      console.error("Invalid response from Gemini AI:", result);
      process.exit(1);
    }
    // Output the commit message to stdout so the GitHub Action can capture it
    console.log(result.response.text());
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    process.exit(1);
  }
}

generateCommitMessage();
