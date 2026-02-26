"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function ForgotPasswordPage() {
  const t = useTranslation();
  const f = t?.forgotPassword || {}; // Use a specific section for this page

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast.error(f?.enter_email || "Please enter your email first.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(f?.reset_email_sent || "📩 Password reset email sent! Check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            {f?.title || "Reset Your Password"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>{f?.email_label || "Email"}</Label>
          <Input
            type="email"
            placeholder={f?.email_placeholder || "Enter your email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleResetPassword} className="w-full" disabled={loading}>
            {loading ? f?.sending || "Sending..." : f?.send_reset_link || "Send Reset Link"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}