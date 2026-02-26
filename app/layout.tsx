import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { LangProvider } from "@/lib/hooks/LangContext"
import LanguageSwitcher from "@/components/ui/LanguageSwitcher"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DiaCare - Diabetes Diet Management",
  description: "AI-powered diabetes diet management app.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${workSans.variable} antialiased`}>
        <LangProvider>
          <header className="flex justify-end p-4 border-b">
            <LanguageSwitcher />
          </header>

          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <Toaster position="top-right" />
          </Suspense>
        </LangProvider>
      </body>
    </html>
  )
}
