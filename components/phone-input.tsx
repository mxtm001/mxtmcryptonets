"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  country?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

const countryPhoneCodes: Record<string, string> = {
  US: "+1",
  BR: "+55",
  CA: "+1",
  GB: "+44",
  DE: "+49",
  FR: "+33",
  IT: "+39",
  ES: "+34",
  PT: "+351",
  NL: "+31",
  BE: "+32",
  CH: "+41",
  AT: "+43",
  SE: "+46",
  NO: "+47",
  DK: "+45",
  FI: "+358",
  PL: "+48",
  CZ: "+420",
  HU: "+36",
  RO: "+40",
  BG: "+359",
  HR: "+385",
  SI: "+386",
  SK: "+421",
  LT: "+370",
  LV: "+371",
  EE: "+372",
  IE: "+353",
  LU: "+352",
  MT: "+356",
  CY: "+357",
  GR: "+30",
  JP: "+81",
  KR: "+82",
  CN: "+86",
  IN: "+91",
  AU: "+61",
  NZ: "+64",
  SG: "+65",
  HK: "+852",
  TW: "+886",
  MY: "+60",
  TH: "+66",
  ID: "+62",
  PH: "+63",
  VN: "+84",
  MX: "+52",
  AR: "+54",
  CL: "+56",
  CO: "+57",
  PE: "+51",
  UY: "+598",
  PY: "+595",
  BO: "+591",
  EC: "+593",
  VE: "+58",
  ZA: "+27",
  NG: "+234",
  KE: "+254",
  GH: "+233",
  EG: "+20",
  MA: "+212",
  TN: "+216",
  DZ: "+213",
  AE: "+971",
  SA: "+966",
  QA: "+974",
  KW: "+965",
  BH: "+973",
  OM: "+968",
  JO: "+962",
  LB: "+961",
  IL: "+972",
  TR: "+90",
  RU: "+7",
  UA: "+380",
}

export function PhoneInput({
  value,
  onChange,
  country = "",
  placeholder = "Enter phone number",
  disabled = false,
  className,
}: PhoneInputProps) {
  const countryCode = country ? countryPhoneCodes[country] || "" : ""

  const displayValue = value.startsWith(countryCode) ? value : `${countryCode} ${value}`.trim()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value

    // Remove country code from input if it exists
    if (countryCode && inputValue.startsWith(countryCode)) {
      inputValue = inputValue.slice(countryCode.length).trim()
    }

    onChange(inputValue)
  }

  return (
    <div className="relative">
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={countryCode ? `${countryCode} ${placeholder}` : placeholder}
        disabled={disabled}
        className={cn(
          "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12",
          className,
        )}
      />
    </div>
  )
}
