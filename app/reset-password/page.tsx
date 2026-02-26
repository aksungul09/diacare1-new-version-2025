"use client"
export const dynamic = 'force-dynamic';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function ResetPasswordPage() {
  const t = useTranslation()
  const r = t.resetPassword
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error(r?.fillFields || "Please fill in both fields.")
      return
    }

    if (password !== confirmPassword) {
      toast.error(r?.passwordMismatch || "Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error(error.message || "Error resetting password.")
      } else {
        toast.success(r?.success || "✅ Password reset successful! Please log in again.")
        setTimeout(() => router.push("/login"), 2000)
      }
    } catch (err: any) {
      toast.error(err?.message || "Error resetting password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {r?.title || "Reset Your Password 🔐"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">

            <div>
              <Label>{r?.newPassword || "New Password"}</Label>
              <Input
                type="password"
                placeholder={r?.newPassword || "Enter new password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>{r?.confirmPassword || "Confirm Password"}</Label>
              <Input
                type="password"
                placeholder={r?.confirmPassword || "Re-enter new password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? r?.resetting || "Resetting..." : r?.resetPassword || "Reset Password"}
            </Button>

            <p className="text-center text-sm mt-2 text-gray-500">
              {r?.rememberedPassword || "Remembered your password?"}{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {r?.goToLogin || "Go to Login"}
              </span>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}