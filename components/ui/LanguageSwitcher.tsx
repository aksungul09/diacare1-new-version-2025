"use client"

import { useLang } from "@/lib/hooks/LangContext"
import { Button } from "@/components/ui/button"

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={lang === "en" ? "default" : "outline"}
        onClick={() => setLang("en")}
      >
        EN
      </Button>

      <Button
        size="sm"
        variant={lang === "uz" ? "default" : "outline"}
        onClick={() => setLang("uz")}
      >
        UZ
      </Button>

      <Button
        size="sm"
        variant={lang === "ru" ? "default" : "outline"}
        onClick={() => setLang("ru")}
      >
        RU
      </Button>
    </div>
  )
}
