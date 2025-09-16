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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { userService } from "@/lib/user-service"
import { getSavedLogins, updateLastUsed, type SavedLogin } from "@/lib/saved-logins"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [savedLogins, setSavedLogins] = useState<SavedLogin[]>([])
  const [showSavedLogins, setShowSavedLogins] = useState(false)

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

    // Load saved logins
    const saved = getSavedLogins()
    setSavedLogins(saved)
    setShowSavedLogins(saved.length > 0)
  }, [router])

  const handleSavedLoginClick = (savedLogin: SavedLogin) => {
    setEmail(savedLogin.email)
    setShowSavedLogins(false)
    updateLastUsed(savedLogin.email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800))

      const result = await userService.login({ email: email.trim(), password: password.trim() })

      if (result.success && result.user) {
        // Successful login - redirect to dashboard
        router.push("/dashboard")
      } else {
        setError(result.message || "Invalid email or password. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f9a826]"></div>
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
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-4 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href="/" className="flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
              </div>
              <span className="ml-2 font-medium text-white">MXTM INVESTMENT</span>
            </Link>
          </div>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-300">Sign in to your investment account</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Saved Logins */}
              {showSavedLogins && savedLogins.length > 0 && (
                <div className="mb-6">
                  <Label className="text-gray-200 font-medium mb-3 block">Recent Logins</Label>
                  <div className="space-y-2">
                    {savedLogins.slice(0, 3).map((savedLogin) => (
                      <button
                        key={savedLogin.id}
                        onClick={() => handleSavedLoginClick(savedLogin)}
                        className="w-full flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all text-left"
                        disabled={loading}
                      >
                        <div className="w-8 h-8 bg-[#f9a826] rounded-full flex items-center justify-center mr-3">
                          <span className="text-black font-bold text-sm">
                            {savedLogin.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{savedLogin.name}</p>
                          <p className="text-gray-400 text-xs">{savedLogin.email}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(savedLogin.lastUsed).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm text-center mb-4">Or sign in with your credentials</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#f9a826] transition-colors h-12 pr-12"
                      disabled={loading}
                      autoComplete="current-password"
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
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-[#f9a826] hover:underline font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#f9a826] to-yellow-500 hover:from-[#f9a826]/90 hover:to-yellow-500/90 text-black font-semibold h-12 transition-all hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-[#f9a826] hover:underline font-semibold transition-colors">
                    Create one here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
