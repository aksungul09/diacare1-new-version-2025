import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-to-bypass-build-error", // Ensure build doesn't fail if env var is missing
});