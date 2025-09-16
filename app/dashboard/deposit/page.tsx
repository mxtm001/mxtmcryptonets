"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  Home,
  History,
  LifeBuoy,
  LogOut,
  User,
  Copy,
  Check,
} from "lucide-react"

export default function DepositPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [copiedAddress, setCopiedAddress] = useState("")

  // Credit card fields
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

  // Bank transfer fields
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  // Crypto fields
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")

  // Crypto addresses
  const cryptoAddresses = {
    bitcoin: "1EwSeZbK8RW5EgRc96RnhjcLmGQA6zZ2RV",
    ethereum: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
    usdt_erc20: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
    usdt_bep20: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
    usdt_trc20: "TFBXLYCcuDLJqkN7ggxzfKMHmW64L7u9AA",
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch (error) {
      console.error("Error loading user data:", error)
      localStorage.removeItem("currentUser")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const copyToClipboard = useCallback((address: string, crypto: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(crypto)
      setTimeout(() => setCopiedAddress(""), 1500)
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError("Please enter a valid amount")
        return
      }

      if (Number(amount) < 50) {
        setError("Minimum deposit amount is €50")
        return
      }

      setProcessing(true)

      // Simple processing simulation
      setTimeout(() => {
        setProcessing(false)
        setSuccess(true)

        if (user) {
          const updatedUser = { ...user, balance: user.balance + Number(amount) }
          setUser(updatedUser)
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        }

        // Reset form
        setAmount("")
        setCardNumber("")
        setExpiryDate("")
        setCvv("")
        setCardName("")
      }, 1500)
    },
    [amount, user],
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium">MXTM INVESTMENT</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="bg-[#162040] h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0066ff] font-bold">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/deposit" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                  <Wallet className="mr-3 h-5 w-5" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <History className="mr-3 h-5 w-5" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <User className="mr-3 h-5 w-5" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <LifeBuoy className="mr-3 h-5 w-5" />
                  Support
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a1735] z-10 border-b border-[#253256]">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-white text-sm">MXTM</span>
          </Link>
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Home className="h-5 w-5 text-white" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/dashboard" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle>Add Funds to Your Account</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your preferred payment method and amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (EUR)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#162040] border-[#253256] text-white"
                    min="50"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400">Minimum deposit: €50</p>
                </div>

                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="bg-[#162040] border-[#253256] w-full">
                    <TabsTrigger value="credit_card" className="data-[state=active]:bg-[#0a1735]">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="bank_transfer" className="data-[state=active]:bg-[#0a1735]">
                      <Building2 className="h-4 w-4 mr-2" />
                      Bank Transfer
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-[#0a1735]">
                      <Wallet className="h-4 w-4 mr-2" />
                      Cryptocurrency
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit_card" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank_transfer" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        placeholder="Your bank name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="bg-[#162040] border-[#253256] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        placeholder="Your account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="bg-[#162040] border-[#253256] text-white"
                      />
                    </div>

                    <Alert className="bg-blue-500/10 border-blue-500">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-400">
                        Bank transfers may take 1-3 business days to process.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="crypto" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="crypto-type">Select Cryptocurrency</Label>
                      <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                        <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdt_erc20">USDT (ERC-20)</SelectItem>
                          <SelectItem value="usdt_bep20">USDT (BEP-20)</SelectItem>
                          <SelectItem value="usdt_trc20">USDT (TRC-20)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#162040] border border-[#253256] rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-white">
                            {selectedCrypto === "bitcoin"
                              ? "Bitcoin (BTC)"
                              : selectedCrypto === "ethereum"
                                ? "Ethereum (ETH)"
                                : selectedCrypto === "usdt_erc20"
                                  ? "USDT (ERC-20)"
                                  : selectedCrypto === "usdt_bep20"
                                    ? "USDT (BEP-20)"
                                    : "USDT (TRC-20)"}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {selectedCrypto === "bitcoin"
                              ? "Bitcoin Network"
                              : selectedCrypto === "ethereum"
                                ? "Ethereum Network"
                                : selectedCrypto === "usdt_erc20"
                                  ? "Ethereum Network"
                                  : selectedCrypto === "usdt_bep20"
                                    ? "BSC Network"
                                    : "Tron Network"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-gray-300">Wallet Address</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses]}
                              readOnly
                              className="bg-[#0a1735] border-[#253256] text-white font-mono text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  cryptoAddresses[selectedCrypto as keyof typeof cryptoAddresses],
                                  selectedCrypto,
                                )
                              }
                              className="bg-transparent border-[#253256] hover:bg-[#253256]"
                            >
                              {copiedAddress === selectedCrypto ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-400 space-y-1">
                          <p>
                            • Network:{" "}
                            {selectedCrypto === "bitcoin"
                              ? "Bitcoin"
                              : selectedCrypto === "ethereum"
                                ? "Ethereum"
                                : selectedCrypto === "usdt_erc20"
                                  ? "Ethereum (ERC-20)"
                                  : selectedCrypto === "usdt_bep20"
                                    ? "Binance Smart Chain (BEP-20)"
                                    : "Tron (TRC-20)"}
                          </p>
                          <p>
                            • Confirmations required:{" "}
                            {selectedCrypto === "bitcoin"
                              ? "3"
                              : selectedCrypto === "ethereum"
                                ? "12"
                                : selectedCrypto === "usdt_erc20"
                                  ? "12"
                                  : selectedCrypto === "usdt_bep20"
                                    ? "15"
                                    : "20"}
                          </p>
                          <p>• Only send {selectedCrypto.toUpperCase()} to this address</p>
                        </div>
                      </div>

                      <Alert className="bg-yellow-500/10 border-yellow-500">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-400">
                          <strong>Important:</strong> Only send{" "}
                          {selectedCrypto === "bitcoin"
                            ? "Bitcoin (BTC)"
                            : selectedCrypto === "ethereum"
                              ? "Ethereum (ETH)"
                              : "USDT"}{" "}
                          to this address. Sending other cryptocurrencies or using wrong networks will result in
                          permanent loss of funds.
                        </AlertDescription>
                      </Alert>

                      <div className="bg-[#162040] border border-[#253256] rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">How to deposit:</h4>
                        <ol className="text-sm text-gray-300 space-y-2">
                          <li>1. Copy the wallet address above</li>
                          <li>2. Open your crypto wallet or exchange</li>
                          <li>
                            3. Send{" "}
                            {selectedCrypto === "bitcoin"
                              ? "Bitcoin (BTC)"
                              : selectedCrypto === "ethereum"
                                ? "Ethereum (ETH)"
                                : "USDT"}{" "}
                            to the copied address
                          </li>
                          <li>4. Wait for network confirmations</li>
                          <li>5. Your balance will be updated automatically</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {paymentMethod !== "crypto" && (
                  <Button
                    type="submit"
                    className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium"
                    disabled={processing || !amount}
                  >
                    {processing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Processing Deposit...
                      </div>
                    ) : (
                      `Deposit ${amount ? formatCurrency(Number(amount)) : "€0"}`
                    )}
                  </Button>
                )}

                {paymentMethod === "crypto" && (
                  <Alert className="bg-green-500/10 border-green-500">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400">
                      Send your cryptocurrency to the address above. Your deposit will be processed automatically after
                      network confirmations.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Deposit Info */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Deposit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-[#f9a826] mt-0.5" />
                  <div>
                    <h4 className="font-medium">Credit Card</h4>
                    <p className="text-sm text-gray-400">Instant processing • 3% fee</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-[#f9a826] mt-0.5" />
                  <div>
                    <h4 className="font-medium">Bank Transfer</h4>
                    <p className="text-sm text-gray-400">1-3 business days • No fees</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Wallet className="h-5 w-5 text-[#f9a826] mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cryptocurrency</h4>
                    <p className="text-sm text-gray-400">10-60 minutes • Network fees apply</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0a1735] border border-[#253256] rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Deposit Successful!</h2>
              <p className="text-gray-300 mb-6">
                Your deposit of {formatCurrency(Number(amount))} has been processed successfully and added to your
                account.
              </p>
              <Button className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black" onClick={() => setSuccess(false)}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
