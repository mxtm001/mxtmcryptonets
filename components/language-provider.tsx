"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getLanguageByCountry, getTranslations, type Language } from "@/lib/languages"

interface LanguageContextType {
  language: Language
  translations: any
  setLanguage: (lang: Language) => void
  setCountry: (country: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState(getTranslations("en"))

  useEffect(() => {
    // Load saved language or detect from browser
    const savedLanguage = localStorage.getItem("preferredLanguage") as Language
    if (savedLanguage && savedLanguage in getTranslations) {
      setLanguage(savedLanguage)
      setTranslations(getTranslations(savedLanguage))
    } else {
      // Auto-detect from browser language
      const browserLang = navigator.language.split("-")[0]
      const detectedLang = ["en", "es", "fr", "de", "pt", "ar", "zh"].includes(browserLang) ? browserLang : "en"
      setLanguage(detectedLang)
      setTranslations(getTranslations(detectedLang))
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    setTranslations(getTranslations(lang))
    localStorage.setItem("preferredLanguage", lang)
  }

  const handleSetCountry = (countryCode: string) => {
    const detectedLang = getLanguageByCountry(countryCode)
    if (detectedLang !== language) {
      handleSetLanguage(detectedLang)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations,
        setLanguage: handleSetLanguage,
        setCountry: handleSetCountry,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
