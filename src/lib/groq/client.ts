import Groq from "groq-sdk";

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Model configuration using a fast, high quality model capable of JSON structure
export const GROQ_CONFIG = {
    model: "llama-3.3-70b-versatile", // High quality, fast, affordable
    temperature: 0.7, // Balance creativity and consistency
    max_tokens: 2000, // Enough for comprehensive profile
};
