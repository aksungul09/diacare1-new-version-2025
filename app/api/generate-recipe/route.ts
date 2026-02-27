import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {

  console.log("OPENAI_API_KEY exists?", !!process.env.OPENAI_API_KEY);
  console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length);
  try {
    const formData = await req.json();

    // Build a prompt that includes ALL user inputs from your form
    const prompt = `
Generate a diabetes-friendly recipe considering all user inputs below. The recipe must be ethical, interpretable, clear, and specifically tailored to the user's health goals and cultural/religious needs. Provide safe, accurate, and culturally appropriate recommendations.

**User Inputs:**
- Calories: ${formData.calories}
- Meal Type: ${formData.mealType}
- Servings: ${formData.servings}
- Cooking Time: ${formData.cookingTime}
- Dietary Restrictions: ${formData.dietaryRestrictions?.join(", ") || "None"}
- Cultural Preference: ${formData.culturalPreference || "None"}
- Religious Restriction: ${formData.religiousRestriction || "None"}
- Preferred Cuisine: ${formData.preferredCuisine || "None"}
- Available Ingredients: ${formData.availableIngredients || "Any"}
- Ingredients to Avoid: ${formData.avoidIngredients || "None"}
- Health Goal: ${formData.healthGoal || "Manage blood sugar"}
- Skill Level: ${formData.skillLevel || "Any"}
- Budget: ${formData.budget || "Any"}
- Ramadan Mode: ${formData.isRamadan ? "Yes" : "No"}

Respond ONLY with a valid JSON object in exactly the following format. Ensure the JSON is well-formed:
{
  "title": "Recipe Title",
  "description": "A short, appealing description explaining why it is suitable for a diabetes-friendly diet, adhering strictly to the user's inputs.",
  "glycemicIndex": "Low/Medium/High (estimate based on ingredients)",
  "ethicalDisclaimer": "Disclaimer: This recipe is AI-generated for informational purposes and should not replace professional medical advice.",
  "ingredients": [
    { "item": "1 cup spinach", "reason": "Low in carbs and rich in fiber to prevent blood sugar spikes." }
  ],
  "instructions": ["Step 1...", "Step 2..."],
  "tips": ["Tip 1...", "Tip 2..."],
  "nutritionalInfo": {
    "carbs": "10g",
    "protein": "5g",
    "fat": "2g",
    "calories": 150
  }
}
`;

    console.log("[v1] Sending prompt to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist and chef specializing in diabetes-friendly meals. Your goal is to provide safe, accurate, interpretable, and culturally appropriate recipes. Ensure strict adherence to dietary, ethical, and religious restrictions. Always output valid JSON."
        },
        { role: "user", content: prompt }
      ]
    });

    const responseText = response.choices?.[0]?.message?.content || "{}";
    let recipe;
    try {
      recipe = JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      recipe = {
        title: "Generated Recipe",
        description: responseText,
        glycemicIndex: "Unknown"
      };
    }

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