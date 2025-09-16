"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wallet,
  History,
  LifeBuoy,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  FileCheck,
  Bell,
  Eye,
  EyeOff,
  Crown,
  Star,
  Zap,
  Gift,
  Banknote,
} from "lucide-react"
import { userService } from "@/lib/user-service"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await userService.getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      // Set balance to 6 million EUR
      currentUser.balance = 6000000
      setUser(currentUser)
      setLoading(false)
    }

    loadUser()
  }, [router])

  const handleLogout = async () => {
    await userService.logout()
    router.push("/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9a826] mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050e24] via-[#0a1735] to-[#162040] flex">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#0a1735] to-[#162040] text-white hidden md:block border-r border-[#253256]/50 backdrop-blur-sm">
        <div className="p-4 border-b border-[#253256]/50">
          <Link href="/" className="flex items-center group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#f9a826]/20 group-hover:ring-[#f9a826]/40 transition-all">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-bold bg-gradient-to-r from-[#f9a826] to-yellow-400 bg-clip-text text-transparent">
              MXTM INVESTMENT
            </span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8 p-3 bg-gradient-to-r from-[#162040] to-[#253256] rounded-lg">
            <div className="bg-gradient-to-r from-[#f9a826] to-yellow-400 h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-black font-bold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstName || user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center p-3 rounded-lg bg-gradient-to-r from-[#f9a826] to-yellow-400 text-black font-medium"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/deposit"
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#162040] hover:to-[#253256] text-gray-300 hover:text-white transition-all group"
                >
                  <Wallet className="mr-3 h-5 w-5 group-hover:text-[#f9a826] transition-colors" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#162040] hover:to-[#253256] text-gray-300 hover:text-white transition-all group"
                >
                  <Banknote className="mr-3 h-5 w-5 group-hover:text-[#f9a826] transition-colors" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#162040] hover:to-[#253256] text-gray-300 hover:text-white transition-all group"
                >
                  <TrendingUp className="mr-3 h-5 w-5 group-hover:text-[#f9a826] transition-colors" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#162040] hover:to-[#253256] text-gray-300 hover:text-white transition-all group"
                >
                  <History className="mr-3 h-5 w-5 group-hover:text-[#f9a826] transition-colors" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#162040] hover:to-[#253256] text-gray-300 hover:text-white transition-all group"
                >
                  <FileCheck className="mr-3 h-5 w-5 group-hover:text-[#f9a826] transition-colors" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#162040] hover:to-[#253256] text-gray-300 hover:text-white transition-all group"
                >
                  <LifeBuoy className="mr-3 h-5 w-5 group-hover:text-[#f9a826] transition-colors" />
                  Support
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 text-gray-300 hover:text-red-400 w-full text-left transition-all group"
                >
                  <LogOut className="mr-3 h-5 w-5 group-hover:text-red-400 transition-colors" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-[#0a1735] to-[#162040] z-10 border-b border-[#253256]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-bold text-[#f9a826] text-sm">MXTM</span>
          </Link>
          <div className="flex items-center">
            <button className="mr-4">
              <Bell className="h-5 w-5 text-white" />
            </button>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome back, {user?.firstName || user?.name || "User"}!
              </h1>
              <p className="text-gray-400 mt-1">Here's what's happening with your investments today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-[#f9a826] to-yellow-400 hover:from-[#f9a826]/90 hover:to-yellow-400/90 text-black font-medium">
                <Plus className="h-4 w-4 mr-2" />
                New Investment
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Balance */}
            <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Balance</CardTitle>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <Wallet className="h-4 w-4 text-[#f9a826]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#f9a826] to-yellow-400 bg-clip-text text-transparent">
                  {showBalance ? formatCurrency(5500000) : "••••••"}
                </div>
                <p className="text-xs text-green-400 flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            {/* Total Invested */}
            <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Invested</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{showBalance ? formatCurrency(500000) : "••••••"}</div>
                <p className="text-xs text-blue-400 flex items-center mt-2">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.2% this week
                </p>
              </CardContent>
            </Card>

            {/* Total Profit */}
            <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{showBalance ? formatCurrency(250000) : "••••••"}</div>
                <p className="text-xs text-green-400 flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3% profit margin
                </p>
              </CardContent>
            </Card>

            {/* Active Investments */}
            <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Investments</CardTitle>
                <Activity className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-purple-400 flex items-center mt-2">
                  <Plus className="h-3 w-3 mr-1" />3 new this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                    <Link href="/dashboard/history">
                      <Button variant="ghost" size="sm" className="text-[#f9a826] hover:text-[#f9a826]/80">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "deposit",
                        amount: 50000,
                        description: "Bank Transfer Deposit",
                        date: "2024-01-15",
                        status: "completed",
                      },
                      {
                        type: "investment",
                        amount: -25000,
                        description: "Tech Stocks Portfolio",
                        date: "2024-01-14",
                        status: "completed",
                      },
                      {
                        type: "profit",
                        amount: 3750,
                        description: "Investment Returns",
                        date: "2024-01-13",
                        status: "completed",
                      },
                      {
                        type: "withdrawal",
                        amount: -10000,
                        description: "Bank Transfer Withdrawal",
                        date: "2024-01-12",
                        status: "pending",
                      },
                      {
                        type: "investment",
                        amount: -15000,
                        description: "Crypto Portfolio",
                        date: "2024-01-11",
                        status: "completed",
                      },
                    ].map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#162040]/50 rounded-lg border border-[#253256]/30 hover:bg-[#162040]/80 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "deposit"
                                ? "bg-green-500/20 text-green-400"
                                : transaction.type === "withdrawal"
                                  ? "bg-red-500/20 text-red-400"
                                  : transaction.type === "profit"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {transaction.type === "deposit" ? (
                              <ArrowDownRight className="h-4 w-4" />
                            ) : transaction.type === "withdrawal" ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : transaction.type === "profit" ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <p className="text-sm text-gray-400">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                            {transaction.amount > 0 ? "+" : ""}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <Badge
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className={
                              transaction.status === "completed"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/deposit">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Make Deposit
                    </Button>
                  </Link>
                  <Link href="/dashboard/withdraw">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                      <Minus className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </Link>
                  <Link href="/dashboard/investments">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      New Investment
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Portfolio Performance */}
              <Card className="bg-gradient-to-br from-[#0a1735] to-[#162040] border-[#253256]/50 text-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">This Month</span>
                      <span className="text-green-400 font-bold">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">This Year</span>
                      <span className="text-green-400 font-bold">+45.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">All Time</span>
                      <span className="text-green-400 font-bold">+127.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* VIP Status */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 text-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Crown className="h-5 w-5 text-yellow-400 mr-2" />
                    VIP Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                      <span>Priority Processing</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Gift className="h-4 w-4 text-pink-400 mr-2" />
                      <span>Reduced Fees</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-blue-400 mr-2" />
                      <span>24/7 Support</span>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to VIP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
