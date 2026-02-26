import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    // Build a prompt that includes ALL user inputs from your form
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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist and chef specializing in diabetes-friendly meals."
        },
        { role: "user", content: prompt }
      ]
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

    // Too many requests / rate limit
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Too many requests to OpenAI. Try again later." },
        { status: 429 }
      );
    }

    // Fallback for other errors
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again later." },
      { status: 500 }
    );
  }
}