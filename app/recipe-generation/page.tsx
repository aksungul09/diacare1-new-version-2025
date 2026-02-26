"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useLang } from "@/lib/hooks/LangContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Heart, ChefHat, Clock, Users, Zap, ArrowLeft, Loader2 } from "lucide-react"

export default function GenerateRecipePage() {
  const { lang } = useLang()
  const t = useTranslation()
  const r = t.recipe

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null)

  const [formData, setFormData] = useState({
    calories: "",
    mealType: "",
    servings: "2",
    cookingTime: "",
    dietaryRestrictions: [] as string[],
    preferences: "",

    // Ethical & cultural fields
    culturalPreference: "",
    religiousRestriction: "",
    preferredCuisine: "",
    avoidIngredients: "",
    availableIngredients: "",
    healthGoal: "",
    skillLevel: "",
    budget: "",

    // Ramadan
    isRamadan: false
  })

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Dairy-free",
    "Low-carb",
    "Keto",
    "Mediterranean",
    "Heart-healthy"
  ]


  const toggleRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }))
  }

  const dietaryKeyMap: Record<string, keyof typeof t.DietaryRestrictions> = {
  "Vegetarian": "vegetarian",
  "Vegan": "vegan",
  "Gluten-free": "glutenFree",
  "Dairy-free": "dairyFree",
  "Low-carb": "lowCarb",
  "Keto": "keto",
  "Mediterranean": "mediterranean",
  "Heart-healthy": "heartHealthy"
  }

  const handleGenerateRecipe = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      let data: any = {}
      try {
        // Safely parse JSON
        data = await response.json()
      } catch (parseError) {
        console.warn("Response was not JSON:", parseError)
        throw new Error(r.generateError || "Generation failed (non-JSON response)")
      }

      if (!response.ok) {
        // Use server error if available
        throw new Error(data?.error || r.generateError || "Generation failed")
      }

      // Success — update recipe
      setGeneratedRecipe(data.recipe)
    } catch (err) {
      console.error("Error generating recipe:", err)
      
      // Normalize any error type for alert
      let message = r.generateError || "Error generating recipe"
      if (err instanceof Error) message = err.message
      else if (typeof err === "string") message = err
      else if (err && typeof err === "object" && "message" in err) message = (err as any).message

      alert(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4"/>
              {t.common.backToDashboard}
            </Link>
            <Separator orientation="vertical" className="h-6"/>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary"/>
              <span className="text-lg font-serif font-semibold">DiaCare</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2 flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-primary"/>
            {r.title}
          </h1>
          <p className="text-muted-foreground text-lg">{r.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{r.preferencesTitle}</CardTitle>
              <CardDescription>{r.preferencesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Ramadan Mode */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.isRamadan}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRamadan: checked as boolean, mealType: "" }))}
                />
                <Label>{r.ramadanMode}</Label>
              </div>

              {/* Calories & Servings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{r.targetCalories}</Label>
                  <Input
                    placeholder={r.caloriesPlaceholder}
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{r.servings}</Label>
                  <Select value={formData.servings} onValueChange={(value) => setFormData(prev => ({ ...prev, servings: value }))}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Meal Type */}
              <div>
                <Label>{r.mealType}</Label>
                <Select value={formData.mealType} onValueChange={(value) => setFormData(prev => ({ ...prev, mealType: value }))}>
                  <SelectTrigger><SelectValue placeholder={r.selectMealType}/></SelectTrigger>
                  <SelectContent>
                    {!formData.isRamadan && (
                      <>
                        <SelectItem value="breakfast" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.breakfast}</SelectItem>
                        <SelectItem value="lunch" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.lunch}</SelectItem>
                        <SelectItem value="dinner" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.dinner}</SelectItem>
                        <SelectItem value="snack" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.snack}</SelectItem>
                      </>
                    )}
                    {formData.isRamadan && (
                      <>
                        <SelectItem value="suhoor" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.suhoor}</SelectItem>
                        <SelectItem value="iftar" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.iftar}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Cooking Time */}
              <div>
                <Label>{r.cookingTime}</Label>
                <Input
                  placeholder={r.selectTime}
                  value={formData.cookingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: e.target.value }))}
                />
              </div>

              {/* Dietary Restrictions */}
              {dietaryOptions.map(option => {
                const key = dietaryKeyMap[option]
                return (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.dietaryRestrictions.includes(option)}
                      onCheckedChange={() => toggleRestriction(option)}
                    />
                    <Label>{t.DietaryRestrictions[key]}</Label>
                  </div>
                )
              })}

              {/* Cultural & Ethical Questionnaire */}
              <div>
                <Label>{r.culturalPreference}</Label>
                <Input
                  placeholder={r.culturalPreferencePlaceholder}
                  value={formData.culturalPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalPreference: e.target.value }))}
                />
              </div>

              <div>
                <Label>{r.religiousRestriction}</Label>
                <Input
                  placeholder={r.religiousRestrictionPlaceholder}
                  value={formData.religiousRestriction}
                  onChange={(e) => setFormData(prev => ({ ...prev, religiousRestriction: e.target.value }))}
                />
              </div>

              <div>
                <Label>{r.preferredCuisine}</Label>
                <Input
                  placeholder={r.preferredCuisinePlaceholder}
                  value={formData.preferredCuisine}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredCuisine: e.target.value }))}
                />
              </div>

              <div>
                <Label>{r.availableIngredients}</Label>
                <Textarea
                  placeholder={r.availableIngredientsPlaceholder}
                  value={formData.availableIngredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableIngredients: e.target.value }))}
                />
              </div>

              <div>
                <Label>{r.avoidIngredients}</Label>
                <Input
                  placeholder={r.avoidIngredientsPlaceholder}
                  value={formData.avoidIngredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, avoidIngredients: e.target.value }))}
                />
              </div>

              <div>
                <Label>{r.healthGoal}</Label>
                <Input
                  placeholder={r.healthGoalPlaceholder}
                  value={formData.healthGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthGoal: e.target.value }))}
                />
              </div>

              {/* Skill Level */}
              <div>
                <Label>{r.skillLevel}</Label>
                <Select value={formData.skillLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, skillLevel: value }))}>
                  <SelectTrigger><SelectValue placeholder={r.selectSkillLevel}/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.beginner}</SelectItem>
                    <SelectItem value="intermediate" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.intermediate}</SelectItem>
                    <SelectItem value="advanced" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.advanced}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div>
                <Label>{r.budget}</Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger><SelectValue placeholder={r.selectBudget}/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.lowBudget}</SelectItem>
                    <SelectItem value="medium" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.mediumBudget}</SelectItem>
                    <SelectItem value="high" className="bg-white text-black data-[highlighted]:bg-primary data-[highlighted]:text-white">{r.highBudget}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button onClick={handleGenerateRecipe} disabled={isGenerating || !formData.calories || !formData.mealType} className="w-full">
                {isGenerating ? <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4"/>
                  {r.generating}
                </> : <>
                  <Zap className="mr-2 h-4 w-4"/>
                  {r.generateRecipe}
                </>}
              </Button>

            </CardContent>
          </Card>

          {/* Result */}
          <div>
            {!generatedRecipe && !isGenerating && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                  {t.common.fillPreferences}
                </CardContent>
              </Card>
            )}
            {generatedRecipe && (
              <Card>
                <CardHeader>
                  <CardTitle>{generatedRecipe.title}</CardTitle>
                  <CardDescription>{generatedRecipe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge>{generatedRecipe.glycemicIndex} GI</Badge>
                  {/* You can expand to show ingredients, instructions, nutrition */}
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}