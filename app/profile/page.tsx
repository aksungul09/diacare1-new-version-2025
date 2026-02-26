"use client"
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Settings, Shield, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/lib/hooks/useTranslation"

// Helper functions
function calculateBMR(sex: string, weight: number, height: number, age: number) {
  if (sex === "male") return 10 * weight + 6.25 * height - 5 * age + 5
  return 10 * weight + 6.25 * height - 5 * age - 161
}

function calculateDailyCalories(bmr: number, activityLevel: string) {
  const factors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  return Math.round(bmr * (factors[activityLevel] || 1.55))
}

export default function ProfilePage() {
  const t = useTranslation() 
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [changePassword, setChangePassword] = useState({ new: "", confirm: "" })

  // Fetch user and profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) {
        router.push("/login")
        return
      }

      setUser(authData.user)

      const { data: existing, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      if (existing) {
        setProfile({
          ...existing,
          dietaryRestrictions: existing.dietaryRestrictions || [],
        })
      } else {
        const meta = authData.user.user_metadata || {}
        const newProfile = {
          id: authData.user.id,
          name: meta.name || "",
          email: authData.user.email,
          age: meta.age || "",
          weight: meta.weight || "",
          height: meta.height || "",
          sex: meta.sex || "",
          activityLevel: meta.activityLevel || "moderate",
          dietaryRestrictions: meta.dietaryRestrictions || [],
        }
        const { error: insertError } = await supabase.from("profiles").insert(newProfile)
        if (insertError) console.error("Error inserting new profile:", insertError)
        setProfile(newProfile)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  // Auto-calculate BMR and daily calories
  useEffect(() => {
    if (!profile) return
    const { sex, weight, height, age, activityLevel } = profile
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseFloat(age)
    if (!sex || isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) return

    const bmr = calculateBMR(sex, w, h, a)
    const calories = calculateDailyCalories(bmr, activityLevel)

    setProfile((prev: any) => ({
      ...prev,
      bmr: Number(bmr.toFixed(2)),
      targetcalories: calories,
    }))
  }, [profile?.sex, profile?.weight, profile?.height, profile?.age, profile?.activityLevel])

  // Auto-save BMR and calories to Supabase
  useEffect(() => {
    if (!user || profile?.bmr == null || profile?.targetcalories == null) return

    const saveBmr = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          bmr: profile.bmr,
          targetcalories: profile.targetcalories,
        })
        .eq("id", user.id)

      if (error) console.error("Error updating BMR/calories:", error)
      else console.log("BMR/Calories updated:", data)
    }

    saveBmr()
  }, [profile?.bmr, profile?.targetcalories, user])

  // Handlers
  const handleSave = async () => {
    if (!user) return
    setIsEditing(false)
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id)
    if (error) alert(t?.errorSaving || "Error saving profile: " + error.message)
    else alert(t?.profileUpdated || "Profile updated successfully!")
  }

  const handleRestrictionChange = (r: string, checked: boolean) => {
    setProfile((prev: any) => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...(prev.dietaryRestrictions || []), r]
        : prev.dietaryRestrictions.filter((x: string) => x !== r),
    }))
  }

  const handleDeleteAccount = async () => {
    if (!confirm(t?.confirmDelete || "Are you sure you want to delete your account?")) return
    await supabase.from("profiles").delete().eq("id", user.id)
    await supabase.auth.signOut()
    router.push("/register")
  }

  const handlePasswordChange = async () => {
    if (!changePassword.new || changePassword.new !== changePassword.confirm) {
      alert(t?.passwordMismatch || "Passwords do not match")
      return
    }
    const { error } = await supabase.auth.updateUser({ password: changePassword.new })
    if (error) alert(error.message)
    else {
      alert(t?.passwordUpdated || "Password updated successfully!")
      setChangePassword({ new: "", confirm: "" })
    }
  }

  if (loading) return <p className="text-center mt-10">{t?.loadingProfile || "Loading profile..."}</p>

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {t?.backToDashboard || "Back to Dashboard"}
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-semibold">DiaCare</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t?.cancel || "Cancel"}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" /> {t?.save || "Save"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" /> {t?.edit || "Edit"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-6 flex items-center gap-3">
            <User className="h-8 w-8 text-primary" /> {t?.profileSettings || "Profile Settings"}
          </h1>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="personal">{t?.personalTab || "Personal"}</TabsTrigger>
              <TabsTrigger value="health">{t?.healthTab || "Health"}</TabsTrigger>
              <TabsTrigger value="preferences">{t?.dietTab || "Diet"}</TabsTrigger>
              <TabsTrigger value="settings">{t?.settingsTab || "Settings"}</TabsTrigger>
            </TabsList>

            {/* PERSONAL TAB */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>{t?.personalInfo || "Personal Information"}</CardTitle>
                  <CardDescription>{t?.updateDetails || "Update your details"}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>{t?.fullName || "Full Name"}</Label>
                    <Input
                      value={profile.name || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t?.email || "Email"}</Label>
                    <Input value={profile.email || ""} disabled />
                  </div>
                  <div>
                    <Label>{t?.age || "Age"}</Label>
                    <Input
                      type="number"
                      value={profile.age || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t?.sex || "Sex"}</Label>
                    <select
                      className="border border-border rounded-md p-2 w-full text-sm"
                      disabled={!isEditing}
                      value={profile.sex || ""}
                      onChange={(e) => setProfile({ ...profile, sex: e.target.value })}
                    >
                      <option value="">{t?.select || "Select"}</option>
                      <option value="male">{t?.male || "Male"}</option>
                      <option value="female">{t?.female || "Female"}</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* HEALTH TAB */}
            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle>{t?.healthInfo || "Health Information"}</CardTitle>
                  <CardDescription>{t?.trackPhysical || "Track your physical details"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <Label>{t?.weight || "Weight (kg)"}</Label>
                      <Input
                        type="number"
                        value={profile.weight || ""}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{t?.height || "Height (cm)"}</Label>
                      <Input
                        type="number"
                        value={profile.height || ""}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>{t?.activityLevel || "Activity Level"}</Label>
                      <select
                        className="border border-border rounded-md p-2 w-full text-sm"
                        value={profile.activityLevel || "moderate"}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile({ ...profile, activityLevel: e.target.value })
                        }
                      >
                        <option value="sedentary">{t?.sedentary || "Sedentary"}</option>
                        <option value="light">{t?.light || "Light"}</option>
                        <option value="moderate">{t?.moderate || "Moderate"}</option>
                        <option value="active">{t?.active || "Active"}</option>
                        <option value="very_active">{t?.veryActive || "Very Active"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>{t?.bmr || "BMR (kcal/day)"}</Label>
                    <Input value={profile.bmr?.toFixed(2) || ""} disabled />
                  </div>
                  <div>
                    <Label>{t?.dailyCalories || "Daily Calorie Target"}</Label>
                    <Input value={profile.targetcalories || ""} disabled />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DIET TAB */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>{t?.dietaryRestrictions || "Dietary Restrictions"}</CardTitle>
                  <CardDescription>{t?.selectAll || "Select all that apply"}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["vegetarian", "vegan", "gluten-free", "low-sodium", "keto", "heart-healthy", "halal", "other"].map((r) => (
                    <div key={r} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.dietaryRestrictions?.includes(r)}
                        disabled={!isEditing}
                        onCheckedChange={(checked) => handleRestrictionChange(r, checked as boolean)}
                      />
                      <Label className="capitalize">{r.replace("-", " ")}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> {t?.accountSettings || "Account Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t?.newPassword || "New Password"}</Label>
                    <Input
                      type="password"
                      value={changePassword.new}
                      onChange={(e) =>
                        setChangePassword({ ...changePassword, new: e.target.value })
                      }
                    />
                    <Label>{t?.confirmPassword || "Confirm Password"}</Label>
                    <Input
                      type="password"
                      value={changePassword.confirm}
                      onChange={(e) =>
                        setChangePassword({ ...changePassword, confirm: e.target.value })
                      }
                    />
                    <Button onClick={handlePasswordChange}>{t?.changePassword || "Change Password"}</Button>
                  </div>
                  <Separator />
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteAccount}
                  >
                    {t?.deleteAccount || "Delete Account"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}