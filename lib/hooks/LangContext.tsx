"use client"

import { createContext, useContext, useState } from "react"

export type LangType = "en" | "uz" | "ru"

interface LangContextType {
  lang: LangType
  setLang: (lang: LangType) => void
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LangType>("en")

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error("useLang must be used inside LangProvider")
  }
  return context
}
