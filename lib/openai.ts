import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-to-bypass-build-error", // Ensure build doesn't fail if env var is missing
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Diacare",
  }
});