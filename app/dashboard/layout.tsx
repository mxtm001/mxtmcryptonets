"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Shield,
  HelpCircle,
  LogOut,
  TrendingUp,
  User,
} from "lucide-react"
import { userService, type UserProfile } from "@/lib/user-service"
import { ChatWidget } from "@/components/chat/chat-widget"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Deposit", href: "/dashboard/deposit", icon: ArrowDownLeft },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpRight },
  { name: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Verification", href: "/dashboard/verification", icon: Shield },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkAuth = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          router.push("/login")
          return
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
        return
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await userService.logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/login")
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f9a826]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center px-6 py-4 border-b">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
        </div>
        <span className="ml-2 font-semibold text-gray-900">MXTM Investment</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive ? "bg-[#f9a826] text-black" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
              {item.name === "Verification" && user.verificationStatus === "approved" && (
                <Badge className="ml-auto bg-green-100 text-green-800 text-xs">Verified</Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-[#f9a826] rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-black" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full justify-start text-gray-600 hover:text-gray-900 bg-transparent"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <div className="ml-2 flex items-center">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
              </div>
              <span className="ml-2 font-semibold text-gray-900">MXTM</span>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
