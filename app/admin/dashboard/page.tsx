"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart2,
  Users,
  DollarSign,
  LogOut,
  Search,
  AlertCircle,
  Settings,
  Shield,
  Wallet,
  Menu,
  Activity,
  Eye,
  UserX,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { adminService, type LoginActivity, type UserActivity, type SiteSettings } from "@/lib/admin-service"
import { databaseService, type User } from "@/lib/database-service"

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([])
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [dashboardStats, setDashboardStats] = useState<any>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  // Load data
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

      // Load all data
      loadDashboardData()
    } catch (error) {
      console.error("Error loading admin data:", error)
      localStorage.removeItem("admin_user")
      router.push("/admin/login")
    }
  }, [router])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm && users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load all data in parallel
      const [usersData, loginActivitiesData, userActivitiesData, siteSettingsData, statsData] = await Promise.all([
        databaseService.getAllUsers(),
        adminService.getLoginActivities(50),
        adminService.getUserActivities(50),
        adminService.getSiteSettings(),
        adminService.getDashboardStats(),
      ])

      setUsers(usersData)
      setFilteredUsers(usersData)
      setLoginActivities(loginActivitiesData)
      setUserActivities(userActivitiesData)
      setSiteSettings(siteSettingsData)
      setDashboardStats(statsData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  const handleBlockUser = async (user: User) => {
    try {
      await adminService.blockUser(user.id, adminUser?.email || "admin", "Blocked by admin")
      await loadDashboardData()
    } catch (error) {
      console.error("Error blocking user:", error)
    }
  }

  const handleUnblockUser = async (user: User) => {
    try {
      await adminService.unblockUser(user.id, adminUser?.email || "admin")
      await loadDashboardData()
    } catch (error) {
      console.error("Error unblocking user:", error)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to permanently delete user ${user.email}?`)) {
      try {
        await adminService.deleteUser(user.id, adminUser?.email || "admin")
        await loadDashboardData()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleUpdateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      await adminService.updateSiteSettings(updates, adminUser?.email || "admin")
      setSiteSettings((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (error) {
      console.error("Error updating site settings:", error)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500">Active</Badge>
      case "blocked":
        return <Badge className="bg-red-500/20 text-red-500">Blocked</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
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
              <Link href="/admin/dashboard" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
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
                href="/admin/login-activities"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Activity className="mr-2 h-5 w-5" />
                Login Activities
              </Link>
            </li>
            <li>
              <Link
                href="/admin/transactions"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Transactions
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Settings className="mr-2 h-5 w-5" />
                Site Settings
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
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-2 bg-transparent"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
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
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Monitor and control your platform</p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} className="bg-[#0066ff] hover:bg-[#0066ff]/90">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Site Status Alert */}
          {siteSettings?.maintenanceMode && (
            <Alert className="mb-6 bg-yellow-500/10 border-yellow-500 text-yellow-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Maintenance Mode Active</AlertTitle>
              <AlertDescription>
                The site is currently in maintenance mode. Users cannot access the platform.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalUsers || 0}</div>
                <p className="text-xs text-gray-400">{dashboardStats.activeUsers || 0} active users</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalLogins || 0}</div>
                <p className="text-xs text-gray-400">{dashboardStats.todayLogins || 0} today</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{dashboardStats.totalBalance?.toLocaleString() || 0}</div>
                <p className="text-xs text-gray-400">All user balances combined</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                <UserX className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.blockedUsers || 0}</div>
                <p className="text-xs text-gray-400">Users with restricted access</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle>Platform Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users">
                <TabsList className="bg-[#162040] border-[#253256]">
                  <TabsTrigger value="users" className="data-[state=active]:bg-[#0a1735]">
                    Users ({users.length})
                  </TabsTrigger>
                  <TabsTrigger value="logins" className="data-[state=active]:bg-[#0a1735]">
                    Login Activities ({loginActivities.length})
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="data-[state=active]:bg-[#0a1735]">
                    User Activities ({userActivities.length})
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-[#0a1735]">
                    Site Settings
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users, activities, or logins..."
                      className="pl-9 bg-[#162040] border-[#253256] text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value="users" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Balance</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Last Login</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <tr key={user.id} className="border-b border-[#253256] hover:bg-[#162040]">
                                <td className="py-3 px-4">
                                  {user.firstName} {user.lastName}
                                </td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">€{user.balance?.toLocaleString() || "12,000"}</td>
                                <td className="py-3 px-4">{getStatusBadge(user.isBlocked ? "blocked" : "active")}</td>
                                <td className="py-3 px-4">{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 py-0 bg-transparent"
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    {user.isBlocked ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                        onClick={() => handleUnblockUser(user)}
                                      >
                                        Unblock
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                        onClick={() => handleBlockUser(user)}
                                      >
                                        Block
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                      onClick={() => handleDeleteUser(user)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400">
                                No users found matching your search criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logins" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Login Time</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">IP Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loginActivities.length > 0 ? (
                            loginActivities.map((activity) => (
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
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-400">
                                No login activities found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Action</th>
                            <th className="py-3 px-4 text-left">Details</th>
                            <th className="py-3 px-4 text-left">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userActivities.length > 0 ? (
                            userActivities.map((activity) => (
                              <tr key={activity.id} className="border-b border-[#253256] hover:bg-[#162040]">
                                <td className="py-3 px-4">{activity.userEmail}</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-blue-500/20 text-blue-500">{activity.action}</Badge>
                                </td>
                                <td className="py-3 px-4">{activity.details}</td>
                                <td className="py-3 px-4">{formatDate(activity.timestamp)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-gray-400">
                                No user activities found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  {siteSettings && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="maintenance-mode" className="text-base">
                                Maintenance Mode
                              </Label>
                              <p className="text-sm text-gray-400">
                                Enable maintenance mode to temporarily disable user access
                              </p>
                            </div>
                            <Switch
                              id="maintenance-mode"
                              checked={siteSettings.maintenanceMode}
                              onCheckedChange={(checked) => handleUpdateSiteSettings({ maintenanceMode: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="allow-registrations" className="text-base">
                                Allow New Registrations
                              </Label>
                              <p className="text-sm text-gray-400">Enable or disable new user registrations</p>
                            </div>
                            <Switch
                              id="allow-registrations"
                              checked={siteSettings.allowRegistrations}
                              onCheckedChange={(checked) => handleUpdateSiteSettings({ allowRegistrations: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="auto-approve" className="text-base">
                                Auto-Approve Withdrawals
                              </Label>
                              <p className="text-sm text-gray-400">
                                Automatically approve withdrawal requests without manual review
                              </p>
                            </div>
                            <Switch
                              id="auto-approve"
                              checked={siteSettings.autoApproveWithdrawals}
                              onCheckedChange={(checked) =>
                                handleUpdateSiteSettings({ autoApproveWithdrawals: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-notifications" className="text-base">
                                Email Notifications
                              </Label>
                              <p className="text-sm text-gray-400">
                                Send email notifications for important platform activities
                              </p>
                            </div>
                            <Switch
                              id="email-notifications"
                              checked={siteSettings.emailNotifications}
                              onCheckedChange={(checked) => handleUpdateSiteSettings({ emailNotifications: checked })}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="site-name" className="text-base">
                              Site Name
                            </Label>
                            <Input
                              id="site-name"
                              value={siteSettings.siteName}
                              onChange={(e) => handleUpdateSiteSettings({ siteName: e.target.value })}
                              className="bg-[#162040] border-[#253256] text-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="support-email" className="text-base">
                              Support Email
                            </Label>
                            <Input
                              id="support-email"
                              type="email"
                              value={siteSettings.supportEmail}
                              onChange={(e) => handleUpdateSiteSettings({ supportEmail: e.target.value })}
                              className="bg-[#162040] border-[#253256] text-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="max-withdrawal" className="text-base">
                              Max Withdrawal Amount (€)
                            </Label>
                            <Input
                              id="max-withdrawal"
                              type="number"
                              value={siteSettings.maxWithdrawalAmount}
                              onChange={(e) =>
                                handleUpdateSiteSettings({ maxWithdrawalAmount: Number(e.target.value) })
                              }
                              className="bg-[#162040] border-[#253256] text-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="min-deposit" className="text-base">
                              Min Deposit Amount (€)
                            </Label>
                            <Input
                              id="min-deposit"
                              type="number"
                              value={siteSettings.minDepositAmount}
                              onChange={(e) => handleUpdateSiteSettings({ minDepositAmount: Number(e.target.value) })}
                              className="bg-[#162040] border-[#253256] text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#253256]">
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
