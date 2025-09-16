"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, CheckCircle, Shield, TrendingUp, Users } from "lucide-react"
import { CountrySelector } from "@/components/country-selector"
import { PhoneInput } from "@/components/phone-input"
import { userService } from "@/lib/user-service"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        if (currentUser) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.log("No current user")
      }
    }
    checkUser()
  }, [router])

  const validateStep1 = () => {
    if (!firstName.trim()) return "First name is required"
    if (!lastName.trim()) return "Last name is required"
    if (!email.trim()) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address"
    return null
  }

  const validateStep2 = () => {
    if (!phone.trim()) return "Phone number is required"
    if (phone.length < 8) return "Please enter a valid phone number"
    return null
  }

  const validateStep3 = () => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return "Password must contain uppercase, lowercase and number"
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    if (!agreeToTerms) return "You must agree to the terms and conditions"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateStep3()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await userService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
        country: country || "US", // Default to US if no country selected
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(result.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    let validationError = null

    if (step === 1) {
      validationError = validateStep1()
    } else if (step === 2) {
      validationError = validateStep2()
    }

    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setStep(step + 1)
  }

  const prevStep = () => {
    setError("")
    setStep(step - 1)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9a826]"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#0a1735]/90 backdrop-blur-xl border-[#253256] text-white shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <CheckCircle className="h-20 w-20 text-green-500 relative z-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Welcome to MXTM!
            </h2>
            <p className="text-gray-300 text-center mb-6 leading-relaxed">
              Your account has been created successfully. You're now part of our exclusive investment community.
            </p>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f9a826]"></div>
              <span className="text-[#f9a826] font-medium">Redirecting to dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#f9a826]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#f9a826]/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Marketing Content */}
          <div className="hidden lg:block space-y-8 text-white">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-3 mb-8">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#f9a826]/50">
                  <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  MXTM INVESTMENT
                </span>
              </Link>

              <h1 className="text-5xl font-bold leading-tight">
                Start Your
                <span className="block bg-gradient-to-r from-[#f9a826] to-yellow-500 bg-clip-text text-transparent">
                  Investment Journey
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Join over 50,000+ investors who trust MXTM for secure, profitable cryptocurrency and forex trading.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="bg-[#f9a826]/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-[#f9a826]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bank-Level Security</h3>
                  <p className="text-gray-400">Your investments are protected with military-grade encryption</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Proven Returns</h3>
                  <p className="text-gray-400">Average 8-12% monthly returns with our expert trading team</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-gray-400">Dedicated support team available around the clock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="lg:hidden flex items-center justify-center mb-8">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
                </div>
                <span className="text-xl font-bold text-white">MXTM INVESTMENT</span>
              </Link>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
              <CardHeader className="space-y-2 text-center">
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${step >= i ? "bg-[#f9a826]" : "bg-gray-600"}`}
                      />
                    ))}
                  </div>
                  <div className="w-5" />
                </div>

                <CardTitle className="text-3xl font-bold">
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Contact Details"}
                  {step === 3 && "Security Setup"}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {step === 1 && "Tell us about yourself to get started"}
                  {step === 2 && "We need your phone number to verify your account"}
                  {step === 3 && "Create a secure password for your account"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-200 font-medium">
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12"
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray-200 font-medium">
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200 font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12"
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={nextStep}
                        className="w-full bg-gradient-to-r from-[#f9a826] to-yellow-500 hover:from-[#f9a826]/90 hover:to-yellow-500/90 text-black font-semibold h-12 transition-all hover:scale-105"
                        disabled={loading}
                      >
                        Continue to Contact Details
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Contact Details */}
                  {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-gray-200 font-medium">
                          Country <span className="text-gray-400 text-sm">(Optional)</span>
                        </Label>
                        <CountrySelector
                          value={country}
                          onValueChange={setCountry}
                          placeholder="Select your country (optional)"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-400">Selecting your country helps us provide better service</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-200 font-medium">
                          Phone Number *
                        </Label>
                        <PhoneInput
                          value={phone}
                          onChange={setPhone}
                          country={country}
                          placeholder="Enter your phone number"
                          disabled={loading}
                          className="h-12"
                        />
                        <p className="text-xs text-gray-400">
                          We'll use this to verify your account and send important updates
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex-1 border-white/30 text-white hover:bg-white/10 transition-colors bg-transparent h-12"
                          disabled={loading}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 bg-gradient-to-r from-[#f9a826] to-yellow-500 hover:from-[#f9a826]/90 hover:to-yellow-500/90 text-black font-semibold h-12 transition-all hover:scale-105"
                          disabled={loading}
                        >
                          Continue to Security
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Security Setup */}
                  {step === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-200 font-medium">
                          Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12 pr-12"
                            disabled={loading}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Password must contain:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li className={password.length >= 8 ? "text-green-400" : ""}>At least 8 characters</li>
                            <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>One uppercase letter</li>
                            <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>One lowercase letter</li>
                            <li className={/\d/.test(password) ? "text-green-400" : ""}>One number</li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-200 font-medium">
                          Confirm Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12 pr-12"
                            disabled={loading}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            disabled={loading}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="terms"
                            checked={agreeToTerms}
                            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                            disabled={loading}
                            className="mt-1 border-white/30 data-[state=checked]:bg-[#f9a826] data-[state=checked]:border-[#f9a826]"
                          />
                          <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-300">
                            I agree to the{" "}
                            <Link href="/terms" className="text-[#f9a826] hover:underline font-medium">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-[#f9a826] hover:underline font-medium">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex-1 border-white/30 text-white hover:bg-white/10 transition-colors bg-transparent h-12"
                          disabled={loading}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#f9a826] to-yellow-500 hover:from-[#f9a826]/90 hover:to-yellow-500/90 text-black font-semibold h-12 transition-all hover:scale-105"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-300">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#f9a826] hover:underline font-semibold transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
