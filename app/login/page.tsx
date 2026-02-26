"use client"
export const dynamic = 'force-dynamic';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslation()

  // Create namespaces like register page
  const l = t.login || {}       // login translations
  const r = t.register || {}    // register translations (for "Create account" link)

  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1) Quick check in `profiles` table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", form.email)
        .maybeSingle()

      if (profileError) {
        console.error("profiles select error:", profileError)
        toast.error(profileError.message || l.error_check_account || "Error checking account existence.")
        setLoading(false)
        return
      }

      let userExists = !!profileData

      // 2) If no profile, try RPC
      if (!userExists) {
        try {
          const { data: rpcResult, error: rpcError } = await supabase.rpc("check_user_exists", {
            email_input: form.email,
          })

          if (rpcError) {
            console.error("RPC check_user_exists error:", rpcError)
            toast.error(rpcError.message || l.error_rpc || "Error verifying account existence (RPC).")
            setLoading(false)
            return
          }

          userExists = !!rpcResult
        } catch (rpcCatchErr: any) {
          console.error("RPC exception:", rpcCatchErr)
          toast.error(l.error_rpc_exception || "Error verifying account existence. Check server logs.")
          setLoading(false)
          return
        }
      }

      // 3) No account
      if (!userExists) {
        toast(l.no_account || "No account found with that email. Redirecting to registration...", { icon: "ℹ️" })
        setTimeout(() => router.push("/register"), 2000)
        setLoading(false)
        return
      }

      // 4) Try signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (signInError) {
        const msg = signInError.message.toLowerCase()
        if (msg.includes("invalid login credentials") || msg.includes("invalid")) {
          toast.error(l.incorrect_password || "Incorrect password. Please try again or reset your password.")
        } else {
          toast.error(signInError.message)
        }
        setLoading(false)
        return
      }

      // 5) Success
      toast.success(l.success || "Welcome back 👋")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      toast.error(err?.message || l.unexpected_error || "Unexpected error during login.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!form.email) {
      toast.error(l.reset_enter_email || "Please enter your email first.")
      return
    }

    setResetting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(l.reset_email_sent || "📩 Password reset email sent! Check your inbox.")
    }
    setResetting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {l.welcome || "Welcome Back to DiaCare"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{l.email || "Email"}</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>{l.password || "Password"}</Label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? l.loading || "Logging in..." : l.button || "Login"}
            </Button>
            <div className="flex items-center justify-between text-sm mt-2">
              <Link href="/register" className="text-blue-600 hover:underline">
                {l.createAccount || "Create an account"}
              </Link>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-blue-600 hover:underline disabled:opacity-50"
                disabled={resetting}
              >
                {resetting ? l.sending || "Sending..." : l.forgot_password || "Forgot password?"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}