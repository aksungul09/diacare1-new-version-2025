// app/api/generate-recipe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    // ✅ Create OpenAI client at runtime inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build prompt including all user inputs
    const prompt = `
Generate a diabetes-friendly recipe considering all user inputs:

Calories: ${formData.calories}
Meal Type: ${formData.mealType}
Servings: ${formData.servings}
Cooking Time: ${formData.cookingTime}
Dietary Restrictions: ${formData.dietaryRestrictions.join(", ")}
Preferences: ${formData.preferences}
Cultural Preference: ${formData.culturalPreference}
Religious Restriction: ${formData.religiousRestriction}
Preferred Cuisine: ${formData.preferredCuisine}
Available Ingredients: ${formData.availableIngredients}
Ingredients to Avoid: ${formData.avoidIngredients}
Health Goal: ${formData.healthGoal}
Skill Level: ${formData.skillLevel}
Budget: ${formData.budget}
Ramadan Mode: ${formData.isRamadan ? "Yes" : "No"}
`;

    console.log("[v1] Sending prompt to OpenAI...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if needed
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and chef specializing in diabetes-friendly meals."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const recipe = response.choices?.[0]?.message?.content || "No recipe returned";

    return NextResponse.json({ recipe });

  } catch (error: any) {
    console.error("[v1] Recipe generation error:", error);

    // Quota exceeded
    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI quota exceeded. Please check your plan or billing." },
        { status: 429 }
      );
    }

    // Rate limit
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Too many requests to OpenAI. Try again later." },
        { status: 429 }
      );
    }

    // Fallback
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again later." },
      { status: 500 }
    );
  }
}