// Mock database service for development
export interface User {
  id: string
  email: string
  password?: string
  firstName: string
  lastName: string
  phone: string
  country: string
  balance: number
  isVerified: boolean
  role: string
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "investment"
  amount: number
  status: "pending" | "completed" | "failed"
  method?: string
  description?: string
  createdAt: Date
  updatedAt?: Date
  accountDetails?: string
  failureReason?: string
}

export interface Investment {
  id: string
  userId: string
  amount: number
  plan: string
  status: "active" | "completed" | "cancelled"
  expectedReturn: number
  createdAt: Date
  updatedAt?: Date
}

class DatabaseService {
  private users: User[] = []
  private transactions: Transaction[] = []
  private investments: Investment[] = []

  // User operations
  async createUser(userData: Omit<User, "id">): Promise<string> {
    const userId = Date.now().toString()
    const user: User = {
      ...userData,
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return userId
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.find((user) => user.id === userId) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users]
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  async deleteUser(userId: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== userId)
  }

  // Transaction operations
  async createTransaction(transactionData: Omit<Transaction, "id" | "createdAt">): Promise<string> {
    const transactionId = Date.now().toString()
    const transaction: Transaction = {
      ...transactionData,
      id: transactionId,
      createdAt: new Date(),
    }
    this.transactions.push(transaction)
    return transactionId
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return this.transactions.find((transaction) => transaction.id === transactionId) || null
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactions.filter((transaction) => transaction.userId === userId)
  }

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
    const transactionIndex = this.transactions.findIndex((transaction) => transaction.id === transactionId)
    if (transactionIndex !== -1) {
      this.transactions[transactionIndex] = {
        ...this.transactions[transactionIndex],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  // Investment operations
  async createInvestment(investmentData: Omit<Investment, "id" | "createdAt">): Promise<string> {
    const investmentId = Date.now().toString()
    const investment: Investment = {
      ...investmentData,
      id: investmentId,
      createdAt: new Date(),
    }
    this.investments.push(investment)
    return investmentId
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    return this.investments.filter((investment) => investment.userId === userId)
  }

  async updateInvestment(investmentId: string, updates: Partial<Investment>): Promise<void> {
    const investmentIndex = this.investments.findIndex((investment) => investment.id === investmentId)
    if (investmentIndex !== -1) {
      this.investments[investmentIndex] = {
        ...this.investments[investmentIndex],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  // Sample data creation
  async createSampleData(userId: string): Promise<void> {
    // Create sample transactions
    await this.createTransaction({
      userId,
      type: "deposit",
      amount: 1000,
      status: "completed",
      method: "PIX",
      description: "Initial deposit via PIX",
    })

    await this.createTransaction({
      userId,
      type: "withdrawal",
      amount: 500,
      status: "failed",
      method: "Bank Transfer",
      description: "Withdrawal attempt",
      failureReason: "Insufficient balance for withdrawal fee",
    })

    // Create sample investment
    await this.createInvestment({
      userId,
      amount: 2000,
      plan: "Premium Plan",
      status: "active",
      expectedReturn: 2400,
    })
  }
}

export const databaseService = new DatabaseService()
