const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Baked-in prompt
const bakedPrompt = `You are required to generate some random product feedback to help populate a database with sample data to test. The product is a video testimonials product where customers can create videos and upload them upon request from the product team.

Generate a piece of random sample feedback, either positive, negative or neutral which is either of:
1. A random chat of 3-4 messages between the customer and support, giving some feedback and asking questions
2. A support message into the email account, asking for an answer and providing feedback`;

// API route for generating feedback
app.get("/generate-feedback", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: bakedPrompt }],
    });

    const generatedFeedback = completion.choices[0].message.content;

    console.log("feedback: " + generatedFeedback);
    res.json({ feedback: generatedFeedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: "An error occurred while generating feedback" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
