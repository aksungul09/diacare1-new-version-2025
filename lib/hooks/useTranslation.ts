import en from "@/locales/en.json"
import uz from "@/locales/uz.json"
import ru from "@/locales/ru.json"
import { useLang } from "./LangContext"

// force schema from en.json
type TranslationSchema = typeof en

// cast all languages to the same schema
const translations = {
  en: en as TranslationSchema,
  uz: uz as TranslationSchema,
  ru: ru as TranslationSchema,
}

export function useTranslation(): TranslationSchema {
  const { lang } = useLang()
  return translations[lang as keyof typeof translations] || translations.en
}