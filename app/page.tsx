"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, TrendingUp, Users, CheckCircle } from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Optimized scroll handler
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9a826]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] text-white">
      {/* Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center sticky top-0 bg-[#050e24]/95 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 h-12">
            <Image src="/logo.png" alt="MXTM Investment" fill className="object-contain" />
          </div>
          <span className="ml-2 text-white font-medium">MXTM INVESTMENT PLATFORM</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/register">
            <Button className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium transition-colors">
              Register
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#1a2747] hover:bg-[#1a2747]/90 text-white font-medium transition-colors">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Professional Investment Platform
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join thousands of investors who trust MXTM for cryptocurrency and forex trading. Start your investment journey
          with our secure and profitable platform.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium transition-all hover:scale-105"
            >
              Start Investing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent transition-all hover:scale-105"
            >
              Login to Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[#0a1735] border-[#253256] hover:border-[#f9a826]/50 transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white">Starter Plan</CardTitle>
              <CardDescription className="text-gray-300">Perfect for beginners</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold mb-4 text-[#f9a826]">€100 - €999</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  5% Daily ROI
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  30 Days Duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  24/7 Support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1735] border-[#f9a826] hover:border-[#f9a826] transition-all hover:scale-105 relative">
            <CardHeader>
              <Badge className="w-fit bg-[#f9a826] text-black mb-2">Most Popular</Badge>
              <CardTitle className="text-white">Professional Plan</CardTitle>
              <CardDescription className="text-gray-300">For serious investors</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold mb-4 text-[#f9a826]">€1,000 - €4,999</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  8% Daily ROI
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  45 Days Duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Priority Support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1735] border-[#253256] hover:border-[#f9a826]/50 transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white">VIP Plan</CardTitle>
              <CardDescription className="text-gray-300">Maximum returns</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold mb-4 text-[#f9a826]">€5,000+</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  12% Daily ROI
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  60 Days Duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  VIP Support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MXTM?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group hover:scale-105 transition-transform">
            <div className="bg-[#0a1735] p-6 rounded-lg border border-[#253256] group-hover:border-[#f9a826]/50 transition-colors">
              <Shield className="h-12 w-12 text-[#f9a826] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-300">Bank-level security with SSL encryption and cold storage</p>
            </div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform">
            <div className="bg-[#0a1735] p-6 rounded-lg border border-[#253256] group-hover:border-[#f9a826]/50 transition-colors">
              <TrendingUp className="h-12 w-12 text-[#f9a826] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Returns</h3>
              <p className="text-gray-300">Consistent daily returns with professional trading strategies</p>
            </div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform">
            <div className="bg-[#0a1735] p-6 rounded-lg border border-[#253256] group-hover:border-[#f9a826]/50 transition-colors">
              <Users className="h-12 w-12 text-[#f9a826] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-300">Professional traders with years of market experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-16 px-4 text-center">
        <div className="bg-gradient-to-r from-[#0a1735] to-[#162040] p-8 rounded-lg border border-[#253256]">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our platform today and start earning consistent returns on your investments with our professional
            trading team.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium transition-all hover:scale-105"
            >
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030917] py-8 border-t border-[#253256]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2024 MXTM INVESTMENT PLATFORM. All rights reserved.</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
