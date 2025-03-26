require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini AI
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API key is missing. Please set GOOGLE_API_KEY in .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const conversationHistory = {};

app.get("/", (req, res) => {
  res.send("Gemini AI Agent is running. Use the /chat endpoint to interact.");
});

app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required." });
  }

  // Initialize conversation history for the user
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  // Add user's message to history
  conversationHistory[userId].push({ role: "user", parts: [{text: message}],  });

  try {
    console.log(JSON.stringify(conversationHistory[userId], null, 2));
    
    const result = await model.generateContent({
      contents: { role: "user", parts: [{text: message}] },
    });

    const responseText = result.response.text(); // Corrected response handling

    // Add AI response to history
    conversationHistory[userId].push({ role: "user", parts: [{text: responseText}] });

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
