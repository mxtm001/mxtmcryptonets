"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Database,
  Download,
  ExternalLink,
  RefreshCw,
  Shield,
  Users,
  Activity,
  Settings,
  DollarSign,
  BarChart2,
  LogOut,
  Menu,
  Copy,
  CheckCircle,
} from "lucide-react"
import { adminService, type LoginActivity, type UserActivity } from "@/lib/admin-service"
import { databaseService } from "@/lib/database-service"

export default function FirebaseDataPage() {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([])
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedText, setCopiedText] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem("admin_user")
    if (!storedAdmin) {
      router.push("/admin/login")
      return
    }

    try {
      const admin = JSON.parse(storedAdmin)
      if (admin.role !== "admin") {
        router.push("/admin/login")
        return
      }
      setAdminUser(admin)
      loadFirebaseData()
    } catch (error) {
      console.error("Error loading admin data:", error)
      localStorage.removeItem("admin_user")
      router.push("/admin/login")
    }
  }, [router])

  const loadFirebaseData = async () => {
    try {
      setLoading(true)
      const [loginActivitiesData, userActivitiesData, usersData, transactionsData, investmentsData, siteSettingsData] =
        await Promise.all([
          adminService.getLoginActivities(50),
          adminService.getUserActivities(50),
          databaseService.getAllUsers(),
          adminService.getAllTransactions(),
          adminService.getAllInvestments(),
          adminService.getSiteSettings(),
        ])

      setLoginActivities(loginActivitiesData)
      setUserActivities(userActivitiesData)
      setUsers(usersData)
      setTransactions(transactionsData)
      setInvestments(investmentsData)
      setSiteSettings(siteSettingsData)
    } catch (error) {
      console.error("Error loading Firebase data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const exportData = (data: any[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading Firebase data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#0a1735] text-white fixed h-full z-30 transition-transform duration-300 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-sm">ADMIN PANEL</span>
          </Link>
        </div>

        <div className="p-4 border-b border-[#253256]">
          <div className="flex items-center">
            <div className="bg-[#162040] h-8 w-8 rounded-full flex items-center justify-center mr-2">
              <Shield className="h-4 w-4 text-[#0066ff]" />
            </div>
            <div>
              <p className="text-sm font-medium">{adminUser?.email}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/firebase-data" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <Database className="mr-2 h-5 w-5" />
                Firebase Data
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <header className="bg-[#0a1735] p-4 flex justify-between items-center md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
          </Link>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Firebase Data Viewer</h1>
              <p className="text-gray-400">View and export all data stored in Firebase</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={loadFirebaseData} className="bg-[#0066ff] hover:bg-[#0066ff]/90">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => window.open("https://console.firebase.google.com", "_blank", "noopener,noreferrer")}
                className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Firebase Console
              </Button>
            </div>
          </div>

          {/* Firebase Console Links */}
          <Alert className="mb-6 bg-blue-500/10 border-blue-500 text-blue-500">
            <Database className="h-4 w-4" />
            <AlertTitle>Firebase Console Access</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p>Access your Firebase data directly in the console:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => window.open("https://console.firebase.google.com", "_blank", "noopener,noreferrer")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Main Console
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => copyToClipboard("https://console.firebase.google.com", "Firebase Console URL")}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Data Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Login Activities</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loginActivities.length}</div>
                <p className="text-xs text-gray-400">Total login records</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">User Activities</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userActivities.length}</div>
                <p className="text-xs text-gray-400">Total user actions</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-gray-400">Registered users</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
                <p className="text-xs text-gray-400">Total transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Firebase Collections Data */}
          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Firebase Collections Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login_activities">
                <TabsList className="bg-[#162040] border-[#253256]">
                  <TabsTrigger value="login_activities" className="data-[state=active]:bg-[#0a1735]">
                    Login Activities
                  </TabsTrigger>
                  <TabsTrigger value="user_activities" className="data-[state=active]:bg-[#0a1735]">
                    User Activities
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-[#0a1735]">
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-[#0a1735]">
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="site_settings" className="data-[state=active]:bg-[#0a1735]">
                    Site Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login_activities" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Login Activities Collection</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => exportData(loginActivities, "login_activities")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("/login_activities", "Collection Path")}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedText === "Collection Path" ? <CheckCircle className="h-4 w-4" /> : "Copy Path"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-[#162040] p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Firebase Path:</strong> /login_activities/{"{documentId}"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> Tracks every login attempt (successful and failed) with user
                      details, timestamps, and IP addresses.
                    </p>
                  </div>
                  <div className="rounded-md border border-[#253256] max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#162040] border-b border-[#253256]">
                        <tr>
                          <th className="py-3 px-4 text-left">User</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Login Time</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginActivities.map((activity) => (
                          <tr key={activity.id} className="border-b border-[#253256] hover:bg-[#162040]">
                            <td className="py-3 px-4">{activity.userName}</td>
                            <td className="py-3 px-4">{activity.userEmail}</td>
                            <td className="py-3 px-4">{formatDate(activity.loginTime)}</td>
                            <td className="py-3 px-4">
                              {activity.success ? (
                                <Badge className="bg-green-500/20 text-green-500">Success</Badge>
                              ) : (
                                <Badge className="bg-red-500/20 text-red-500">Failed</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">{activity.ipAddress || "Unknown"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="user_activities" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">User Activities Collection</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => exportData(userActivities, "user_activities")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("/user_activities", "Collection Path")}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedText === "Collection Path" ? <CheckCircle className="h-4 w-4" /> : "Copy Path"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-[#162040] p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Firebase Path:</strong> /user_activities/{"{documentId}"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> Tracks all user actions including registration, transactions,
                      profile updates, and admin actions.
                    </p>
                  </div>
                  <div className="rounded-md border border-[#253256] max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#162040] border-b border-[#253256]">
                        <tr>
                          <th className="py-3 px-4 text-left">User</th>
                          <th className="py-3 px-4 text-left">Action</th>
                          <th className="py-3 px-4 text-left">Details</th>
                          <th className="py-3 px-4 text-left">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userActivities.map((activity) => (
                          <tr key={activity.id} className="border-b border-[#253256] hover:bg-[#162040]">
                            <td className="py-3 px-4">{activity.userEmail}</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-blue-500/20 text-blue-500">{activity.action}</Badge>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate">{activity.details}</td>
                            <td className="py-3 px-4">{formatDate(activity.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="users" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Users Collection</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => exportData(users, "users")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("/users", "Collection Path")}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedText === "Collection Path" ? <CheckCircle className="h-4 w-4" /> : "Copy Path"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-[#162040] p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Firebase Path:</strong> /users/{"{userId}"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> Stores all user account information including personal details,
                      balance, verification status, and account status.
                    </p>
                  </div>
                  <div className="rounded-md border border-[#253256] max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#162040] border-b border-[#253256]">
                        <tr>
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Balance</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Last Login</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-[#253256] hover:bg-[#162040]">
                            <td className="py-3 px-4">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">€{user.balance?.toLocaleString() || "12,000"}</td>
                            <td className="py-3 px-4">
                              {user.isBlocked ? (
                                <Badge className="bg-red-500/20 text-red-500">Blocked</Badge>
                              ) : (
                                <Badge className="bg-green-500/20 text-green-500">Active</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="transactions" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Transactions Collection</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => exportData(transactions, "transactions")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("/transactions", "Collection Path")}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedText === "Collection Path" ? <CheckCircle className="h-4 w-4" /> : "Copy Path"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-[#162040] p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Firebase Path:</strong> /transactions/{"{transactionId}"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> Records all financial transactions including deposits and
                      withdrawals with amounts, methods, and status.
                    </p>
                  </div>
                  <div className="rounded-md border border-[#253256] max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-[#162040] border-b border-[#253256]">
                        <tr>
                          <th className="py-3 px-4 text-left">User</th>
                          <th className="py-3 px-4 text-left">Type</th>
                          <th className="py-3 px-4 text-left">Amount</th>
                          <th className="py-3 px-4 text-left">Method</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-[#253256] hover:bg-[#162040]">
                            <td className="py-3 px-4">{transaction.userEmail}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  transaction.type === "deposit"
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">€{transaction.amount?.toLocaleString()}</td>
                            <td className="py-3 px-4">{transaction.method}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  transaction.status === "completed"
                                    ? "bg-green-500/20 text-green-500"
                                    : transaction.status === "pending"
                                      ? "bg-yellow-500/20 text-yellow-500"
                                      : "bg-red-500/20 text-red-500"
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="site_settings" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Site Settings Collection</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => exportData([siteSettings], "site_settings")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("/site_settings/main", "Document Path")}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedText === "Document Path" ? <CheckCircle className="h-4 w-4" /> : "Copy Path"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-[#162040] p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Firebase Path:</strong> /site_settings/main
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> Contains all platform configuration settings including maintenance
                      mode, registration settings, and limits.
                    </p>
                  </div>
                  {siteSettings && (
                    <div className="bg-[#162040] p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Platform Settings</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Site Name:</span>
                              <span>{siteSettings.siteName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Support Email:</span>
                              <span>{siteSettings.supportEmail}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Maintenance Mode:</span>
                              <Badge
                                className={
                                  siteSettings.maintenanceMode
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-green-500/20 text-green-500"
                                }
                              >
                                {siteSettings.maintenanceMode ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Allow Registrations:</span>
                              <Badge
                                className={
                                  siteSettings.allowRegistrations
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }
                              >
                                {siteSettings.allowRegistrations ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Financial Settings</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Max Withdrawal:</span>
                              <span>€{siteSettings.maxWithdrawalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Min Deposit:</span>
                              <span>€{siteSettings.minDepositAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Auto Approve Withdrawals:</span>
                              <Badge
                                className={
                                  siteSettings.autoApproveWithdrawals
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }
                              >
                                {siteSettings.autoApproveWithdrawals ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Email Notifications:</span>
                              <Badge
                                className={
                                  siteSettings.emailNotifications
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }
                              >
                                {siteSettings.emailNotifications ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#253256]">
                        <p className="text-sm text-gray-400">
                          Last updated: {formatDate(siteSettings.updatedAt)} by {siteSettings.updatedBy}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
