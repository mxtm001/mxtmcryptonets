import { databaseService, type Transaction, type Investment } from "./database-service"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore"
import { db } from "./firebase-config"

export interface LoginActivity {
  id: string
  userId: string
  userEmail: string
  userName: string
  loginTime: Date
  ipAddress?: string
  userAgent?: string
  location?: string
  device?: string
  success: boolean
}

export interface SiteSettings {
  id: string
  maintenanceMode: boolean
  allowRegistrations: boolean
  autoApproveWithdrawals: boolean
  emailNotifications: boolean
  maxWithdrawalAmount: number
  minDepositAmount: number
  siteName: string
  supportEmail: string
  updatedAt: Date
  updatedBy: string
}

export interface UserActivity {
  id: string
  userId: string
  userEmail: string
  action: string
  details: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

class AdminService {
  // Login Activity Tracking
  async trackLogin(
    userId: string,
    userEmail: string,
    userName: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      const loginActivityRef = doc(collection(db, "login_activities"))
      const loginActivity: LoginActivity = {
        id: loginActivityRef.id,
        userId,
        userEmail,
        userName,
        loginTime: new Date(),
        ipAddress,
        userAgent,
        success,
      }

      await setDoc(loginActivityRef, {
        ...loginActivity,
        loginTime: serverTimestamp(),
      })

      // Also save to localStorage as backup
      this.saveToLocalStorage("login_activities", loginActivity.id, loginActivity)
    } catch (error) {
      console.error("Error tracking login:", error)
      // Fallback to localStorage
      this.trackLoginLocalStorage(userId, userEmail, userName, success, ipAddress, userAgent)
    }
  }

  async getLoginActivities(limit = 100): Promise<LoginActivity[]> {
    try {
      const loginActivitiesQuery = query(
        collection(db, "login_activities"),
        orderBy("loginTime", "desc"),
        // Note: Firestore limit would go here, but we'll handle it in the result
      )

      const snapshot = await getDocs(loginActivitiesQuery)
      const activities = snapshot.docs.map((doc) => doc.data() as LoginActivity).slice(0, limit)

      // Save to localStorage as backup
      activities.forEach((activity) => {
        this.saveToLocalStorage("login_activities", activity.id, activity)
      })

      return activities
    } catch (error) {
      console.error("Error getting login activities:", error)
      return this.getLoginActivitiesLocalStorage(limit)
    }
  }

  async getUserLoginHistory(userId: string): Promise<LoginActivity[]> {
    try {
      const userLoginQuery = query(
        collection(db, "login_activities"),
        where("userId", "==", userId),
        orderBy("loginTime", "desc"),
      )

      const snapshot = await getDocs(userLoginQuery)
      return snapshot.docs.map((doc) => doc.data() as LoginActivity)
    } catch (error) {
      console.error("Error getting user login history:", error)
      return this.getUserLoginHistoryLocalStorage(userId)
    }
  }

  // User Activity Tracking
  async trackUserActivity(
    userId: string,
    userEmail: string,
    action: string,
    details: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      const activityRef = doc(collection(db, "user_activities"))
      const activity: UserActivity = {
        id: activityRef.id,
        userId,
        userEmail,
        action,
        details,
        timestamp: new Date(),
        ipAddress,
        userAgent,
      }

      await setDoc(activityRef, {
        ...activity,
        timestamp: serverTimestamp(),
      })

      // Also save to localStorage as backup
      this.saveToLocalStorage("user_activities", activity.id, activity)
    } catch (error) {
      console.error("Error tracking user activity:", error)
      // Fallback to localStorage
      this.trackUserActivityLocalStorage(userId, userEmail, action, details, ipAddress, userAgent)
    }
  }

  async getUserActivities(limit = 100): Promise<UserActivity[]> {
    try {
      const activitiesQuery = query(collection(db, "user_activities"), orderBy("timestamp", "desc"))

      const snapshot = await getDocs(activitiesQuery)
      const activities = snapshot.docs.map((doc) => doc.data() as UserActivity).slice(0, limit)

      return activities
    } catch (error) {
      console.error("Error getting user activities:", error)
      return this.getUserActivitiesLocalStorage(limit)
    }
  }

  // Site Settings Management
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const settingsDoc = await getDoc(doc(db, "site_settings", "main"))
      if (settingsDoc.exists()) {
        return settingsDoc.data() as SiteSettings
      } else {
        // Return default settings
        return this.getDefaultSiteSettings()
      }
    } catch (error) {
      console.error("Error getting site settings:", error)
      return this.getSiteSettingsLocalStorage()
    }
  }

  async updateSiteSettings(settings: Partial<SiteSettings>, adminEmail: string): Promise<void> {
    try {
      const updatedSettings = {
        ...settings,
        updatedAt: new Date(),
        updatedBy: adminEmail,
      }

      await updateDoc(doc(db, "site_settings", "main"), {
        ...updatedSettings,
        updatedAt: serverTimestamp(),
      })

      // Update localStorage backup
      const existingSettings = this.getSiteSettingsLocalStorage()
      this.saveToLocalStorage("site_settings", "main", { ...existingSettings, ...updatedSettings })
    } catch (error) {
      console.error("Error updating site settings:", error)
      // Fallback to localStorage
      this.updateSiteSettingsLocalStorage(settings, adminEmail)
    }
  }

  // User Management
  async blockUser(userId: string, adminEmail: string, reason?: string): Promise<void> {
    try {
      await databaseService.updateUser(userId, {
        isBlocked: true,
        blockedAt: new Date(),
        blockedBy: adminEmail,
        blockReason: reason,
      } as any)

      // Track admin activity
      await this.trackUserActivity(
        userId,
        adminEmail,
        "USER_BLOCKED",
        `User blocked by admin. Reason: ${reason || "No reason provided"}`,
      )
    } catch (error) {
      console.error("Error blocking user:", error)
      throw error
    }
  }

  async unblockUser(userId: string, adminEmail: string): Promise<void> {
    try {
      await databaseService.updateUser(userId, {
        isBlocked: false,
        unblockedAt: new Date(),
        unblockedBy: adminEmail,
      } as any)

      // Track admin activity
      await this.trackUserActivity(userId, adminEmail, "USER_UNBLOCKED", "User unblocked by admin")
    } catch (error) {
      console.error("Error unblocking user:", error)
      throw error
    }
  }

  async deleteUser(userId: string, adminEmail: string): Promise<void> {
    try {
      // Delete user from Firebase
      await deleteDoc(doc(db, "users", userId))

      // Track admin activity
      await this.trackUserActivity(userId, adminEmail, "USER_DELETED", "User permanently deleted by admin")

      // Remove from localStorage backup
      this.removeFromLocalStorage("users", userId)
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  }

  async updateUserBalance(userId: string, newBalance: number, adminEmail: string): Promise<void> {
    try {
      // Always set balance to €12,000 regardless of input
      await databaseService.updateUser(userId, { balance: 12000 })

      // Track admin activity
      await this.trackUserActivity(
        userId,
        adminEmail,
        "BALANCE_UPDATED",
        `Admin attempted to set balance to €${newBalance.toLocaleString()}, but system enforced €12,000`,
      )
    } catch (error) {
      console.error("Error updating user balance:", error)
      throw error
    }
  }

  // Analytics and Statistics
  async getDashboardStats(): Promise<{
    totalUsers: number
    activeUsers: number
    blockedUsers: number
    totalLogins: number
    todayLogins: number
    totalTransactions: number
    totalInvestments: number
    totalBalance: number
  }> {
    try {
      const users = await databaseService.getAllUsers()
      const loginActivities = await this.getLoginActivities(1000)
      const transactions = await this.getAllTransactions()
      const investments = await this.getAllInvestments()

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayLogins = loginActivities.filter((activity) => {
        const loginDate = new Date(activity.loginTime)
        return loginDate >= today && activity.success
      }).length

      return {
        totalUsers: users.length,
        activeUsers: users.filter((user) => !user.isBlocked).length,
        blockedUsers: users.filter((user) => user.isBlocked).length,
        totalLogins: loginActivities.filter((activity) => activity.success).length,
        todayLogins,
        totalTransactions: transactions.length,
        totalInvestments: investments.length,
        totalBalance: users.reduce((sum, user) => sum + (user.balance || 0), 0),
      }
    } catch (error) {
      console.error("Error getting dashboard stats:", error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        totalLogins: 0,
        todayLogins: 0,
        totalTransactions: 0,
        totalInvestments: 0,
        totalBalance: 0,
      }
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactionsSnapshot = await getDocs(collection(db, "transactions"))
      return transactionsSnapshot.docs.map((doc) => doc.data() as Transaction)
    } catch (error) {
      console.error("Error getting all transactions:", error)
      return this.getAllTransactionsLocalStorage()
    }
  }

  async getAllInvestments(): Promise<Investment[]> {
    try {
      const investmentsSnapshot = await getDocs(collection(db, "investments"))
      return investmentsSnapshot.docs.map((doc) => doc.data() as Investment)
    } catch (error) {
      console.error("Error getting all investments:", error)
      return this.getAllInvestmentsLocalStorage()
    }
  }

  // LocalStorage Fallback Methods
  private saveToLocalStorage(collection: string, id: string, data: any): void {
    try {
      const existingData = JSON.parse(localStorage.getItem(collection) || "{}")
      existingData[id] = data
      localStorage.setItem(collection, JSON.stringify(existingData))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  private removeFromLocalStorage(collection: string, id: string): void {
    try {
      const existingData = JSON.parse(localStorage.getItem(collection) || "{}")
      delete existingData[id]
      localStorage.setItem(collection, JSON.stringify(existingData))
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  private trackLoginLocalStorage(
    userId: string,
    userEmail: string,
    userName: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
  ): void {
    const id = Date.now().toString()
    const loginActivity: LoginActivity = {
      id,
      userId,
      userEmail,
      userName,
      loginTime: new Date(),
      ipAddress,
      userAgent,
      success,
    }
    this.saveToLocalStorage("login_activities", id, loginActivity)
  }

  private getLoginActivitiesLocalStorage(limit: number): LoginActivity[] {
    try {
      const activities = JSON.parse(localStorage.getItem("login_activities") || "{}")
      return Object.values(activities)
        .sort((a: any, b: any) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting login activities from localStorage:", error)
      return []
    }
  }

  private getUserLoginHistoryLocalStorage(userId: string): LoginActivity[] {
    try {
      const activities = JSON.parse(localStorage.getItem("login_activities") || "{}")
      return Object.values(activities)
        .filter((activity: any) => activity.userId === userId)
        .sort((a: any, b: any) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime())
    } catch (error) {
      console.error("Error getting user login history from localStorage:", error)
      return []
    }
  }

  private trackUserActivityLocalStorage(
    userId: string,
    userEmail: string,
    action: string,
    details: string,
    ipAddress?: string,
    userAgent?: string,
  ): void {
    const id = Date.now().toString()
    const activity: UserActivity = {
      id,
      userId,
      userEmail,
      action,
      details,
      timestamp: new Date(),
      ipAddress,
      userAgent,
    }
    this.saveToLocalStorage("user_activities", id, activity)
  }

  private getUserActivitiesLocalStorage(limit: number): UserActivity[] {
    try {
      const activities = JSON.parse(localStorage.getItem("user_activities") || "{}")
      return Object.values(activities)
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting user activities from localStorage:", error)
      return []
    }
  }

  private getDefaultSiteSettings(): SiteSettings {
    return {
      id: "main",
      maintenanceMode: false,
      allowRegistrations: true,
      autoApproveWithdrawals: false,
      emailNotifications: true,
      maxWithdrawalAmount: 100000,
      minDepositAmount: 100,
      siteName: "MXTM Investment Platform",
      supportEmail: "support@mxtminvestment.com",
      updatedAt: new Date(),
      updatedBy: "system",
    }
  }

  private getSiteSettingsLocalStorage(): SiteSettings {
    try {
      const settings = JSON.parse(localStorage.getItem("site_settings") || "{}")
      return settings.main || this.getDefaultSiteSettings()
    } catch (error) {
      console.error("Error getting site settings from localStorage:", error)
      return this.getDefaultSiteSettings()
    }
  }

  private updateSiteSettingsLocalStorage(settings: Partial<SiteSettings>, adminEmail: string): void {
    const existingSettings = this.getSiteSettingsLocalStorage()
    const updatedSettings = {
      ...existingSettings,
      ...settings,
      updatedAt: new Date(),
      updatedBy: adminEmail,
    }
    this.saveToLocalStorage("site_settings", "main", updatedSettings)
  }

  private getAllTransactionsLocalStorage(): Transaction[] {
    try {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "{}")
      return Object.values(transactions)
    } catch (error) {
      console.error("Error getting transactions from localStorage:", error)
      return []
    }
  }

  private getAllInvestmentsLocalStorage(): Investment[] {
    try {
      const investments = JSON.parse(localStorage.getItem("investments") || "{}")
      return Object.values(investments)
    } catch (error) {
      console.error("Error getting investments from localStorage:", error)
      return []
    }
  }
}

export const adminService = new AdminService()
