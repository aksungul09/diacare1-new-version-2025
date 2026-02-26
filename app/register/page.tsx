"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import Confetti from "react-confetti"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function RegisterPage() {
  const t = useTranslation()
  const r = t.register
  const router = useRouter()

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    activityLevel: "",
  })

  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            username: form.username,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("already registered")) {
          toast(r.emailRegistered || "Already registered. Try to log in.")
          setTimeout(() => router.push("/login"), 2500)
        } else {
          toast.error(signUpError.message)
        }
        setLoading(false)
        return
      }

      const user = data?.user
      if (!user) {
        toast.error(r.registrationError || "Registration failed. Please try again.")
        setLoading(false)
        return
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            username: form.username,
            name: form.name,
            email: form.email,
            phone: form.phone,
            age: form.age,
            weight: form.weight,
            height: form.height,
            sex: form.sex,
            activitylevel: form.activityLevel,
          },
          { onConflict: "id" }
        )

      if (profileError) {
        toast.error(profileError.message || r.profileSaveError || "Error saving profile.")
        setLoading(false)
        return
      }

      setShowConfetti(true)
      toast.success(r.welcomeAccount || "Welcome! Your account has been created.")

      setTimeout(() => {
        setShowConfetti(false)
        router.push("/dashboard")
      }, 3000)
    } catch (err: any) {
      toast.error(err?.message || r.registrationError || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
        />
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      )}

      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white relative z-10">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {r.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{r.username}</Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>{r.fullName}</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>{r.email}</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>{r.phone}</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>{r.password}</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{r.age}</Label>
                <Input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label>{r.weight}</Label>
                <Input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{r.height}</Label>
                <Input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label>{r.sex}</Label>
                <Select
                  value={form.sex}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, sex: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{r.male}</SelectItem>
                    <SelectItem value="female">{r.female}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{r.activityLevel}</Label>
              <Select
                value={form.activityLevel}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, activityLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="sedentary">{r.activityOptions.sedentary}</SelectItem>
                  <SelectItem value="light">{r.activityOptions.light}</SelectItem>
                  <SelectItem value="moderate">{r.activityOptions.moderate}</SelectItem>
                  <SelectItem value="active">{r.activityOptions.active}</SelectItem>
                  <SelectItem value="very_active">{r.activityOptions.very_active}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? r.creatingAccount : r.register}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2">
              {r.alreadyAccount}{" "}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                {r.login}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}