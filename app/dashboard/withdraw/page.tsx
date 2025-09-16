"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowUpRight,
  Wallet,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle,
  Crown,
  Bitcoin,
  CreditCard,
  Smartphone,
  Shield,
  Clock,
} from "lucide-react"
import { userService } from "@/lib/user-service"

// Cryptocurrency options with icons and network details
const cryptoOptions = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    network: "Bitcoin Network",
    minAmount: 0.001,
    fee: "0.0005 BTC",
    addressExample: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    network: "Ethereum Network",
    minAmount: 0.01,
    fee: "0.005 ETH",
    addressExample: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    icon: "₮",
    network: "ERC-20 / TRC-20",
    minAmount: 10,
    fee: "1 USDT",
    addressExample: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  },
  {
    id: "usd-coin",
    name: "USD Coin",
    symbol: "USDC",
    icon: "🪙",
    network: "ERC-20",
    minAmount: 10,
    fee: "1 USDC",
    addressExample: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  },
  {
    id: "binance-coin",
    name: "Binance Coin",
    symbol: "BNB",
    icon: "🟡",
    network: "BSC Network",
    minAmount: 0.1,
    fee: "0.005 BNB",
    addressExample: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    icon: "🔷",
    network: "Cardano Network",
    minAmount: 10,
    fee: "2 ADA",
    addressExample: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    network: "Solana Network",
    minAmount: 0.1,
    fee: "0.01 SOL",
    addressExample: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    icon: "🟣",
    network: "Polygon Network",
    minAmount: 1,
    fee: "0.1 MATIC",
    addressExample: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "LTC",
    icon: "Ł",
    network: "Litecoin Network",
    minAmount: 0.01,
    fee: "0.001 LTC",
    addressExample: "LdP8Qox1VAhCzLJNqrr74YovaWYyNBUWvL",
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    icon: "🔗",
    network: "ERC-20",
    minAmount: 1,
    fee: "0.1 LINK",
    addressExample: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    icon: "⚫",
    network: "Polkadot Network",
    minAmount: 1,
    fee: "0.1 DOT",
    addressExample: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    icon: "🔺",
    network: "Avalanche Network",
    minAmount: 0.1,
    fee: "0.01 AVAX",
    addressExample: "X-avax1x459sj0ssxzlw5n9d5qe6uscv5d5s5yqe6yx3v",
  },
]

export default function WithdrawPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("bank")
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0])
  const [walletAddress, setWalletAddress] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
  })
  const [paypalEmail, setPaypalEmail] = useState("")
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState("")
  const [error, setError] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await userService.getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      // Set balance to 5.5 million EUR
      currentUser.balance = 5500000
      setUser(currentUser)
      setLoading(false)
    }

    loadUser()
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const withdrawAmount = Number.parseFloat(amount)
    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Bitte geben Sie einen gültigen Betrag ein")
      return
    }

    if (withdrawAmount < 500) {
      setError("Der Mindestabhebungsbetrag beträgt 500 EUR")
      return
    }

    // Validate method-specific fields
    if (method === "bank") {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
        setError("Bitte füllen Sie alle erforderlichen Bankdaten aus")
        return
      }
    } else if (method === "crypto") {
      if (!walletAddress) {
        setError("Bitte geben Sie eine gültige Wallet-Adresse ein")
        return
      }
    } else if (method === "paypal") {
      if (!paypalEmail) {
        setError("Bitte geben Sie Ihre PayPal-E-Mail-Adresse ein")
        return
      }
    } else if (method === "mobile") {
      if (!mobileMoneyPhone) {
        setError("Bitte geben Sie Ihre Telefonnummer ein")
        return
      }
    }

    setProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Always show the fancy error modal
      setShowErrorModal(true)
    } catch (error) {
      console.error("Withdrawal error:", error)
      setError("Ein unerwarteter Fehler ist aufgetreten")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9a826] mx-auto mb-4"></div>
          <div className="text-gray-600">Dashboard wird geladen...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Weiterleitung zur Anmeldung...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geld abheben</h1>
          <p className="text-gray-600 mt-1">Heben Sie Geld von Ihrem Konto ab</p>
        </div>
        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          <CheckCircle className="h-4 w-4 mr-2" />
          Konto verifiziert
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Withdrawal Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2 text-[#f9a826]" />
                Abhebungsantrag
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Abhebungsbetrag (EUR)
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 h-12 text-lg"
                      min="500"
                      step="0.01"
                      disabled={processing}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  </div>
                  <p className="text-sm text-gray-500">Mindestbetrag: 500 EUR</p>
                </div>

                {/* Withdrawal Method */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Abhebungsmethode</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMethod("bank")}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        method === "bank" ? "border-[#f9a826] bg-[#f9a826]/5" : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={processing}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-3 text-[#f9a826]" />
                        <div>
                          <div className="font-medium">Banküberweisung</div>
                          <div className="text-sm text-gray-500">1-3 Werktage</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("crypto")}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        method === "crypto"
                          ? "border-[#f9a826] bg-[#f9a826]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={processing}
                    >
                      <div className="flex items-center">
                        <Bitcoin className="h-5 w-5 mr-3 text-[#f9a826]" />
                        <div>
                          <div className="font-medium">Kryptowährung</div>
                          <div className="text-sm text-gray-500">Sofort</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("paypal")}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        method === "paypal"
                          ? "border-[#f9a826] bg-[#f9a826]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={processing}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-3 text-[#f9a826]" />
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-500">Sofort</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("mobile")}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        method === "mobile"
                          ? "border-[#f9a826] bg-[#f9a826]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={processing}
                    >
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 mr-3 text-[#f9a826]" />
                        <div>
                          <div className="font-medium">Mobile Money</div>
                          <div className="text-sm text-gray-500">Sofort</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bank Transfer Details */}
                {method === "bank" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Bankdaten
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountName" className="text-sm">
                          Kontoinhaber
                        </Label>
                        <Input
                          id="accountName"
                          value={bankDetails.accountName}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                          placeholder="Vollständiger Name"
                          disabled={processing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber" className="text-sm">
                          Kontonummer/IBAN
                        </Label>
                        <Input
                          id="accountNumber"
                          value={bankDetails.accountNumber}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                          placeholder="DE89 3704 0044 0532 0130 00"
                          disabled={processing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bankName" className="text-sm">
                          Bankname
                        </Label>
                        <Input
                          id="bankName"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          placeholder="Deutsche Bank"
                          disabled={processing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingNumber" className="text-sm">
                          BIC/SWIFT (optional)
                        </Label>
                        <Input
                          id="routingNumber"
                          value={bankDetails.routingNumber}
                          onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                          placeholder="DEUTDEFF"
                          disabled={processing}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Crypto Selection */}
                {method === "crypto" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Bitcoin className="h-4 w-4 mr-2" />
                      Kryptowährung auswählen
                    </h3>

                    <div className="space-y-3">
                      <Label className="text-sm">Kryptowährung</Label>
                      <Select
                        value={selectedCrypto.id}
                        onValueChange={(value) => {
                          const crypto = cryptoOptions.find((c) => c.id === value)
                          if (crypto) setSelectedCrypto(crypto)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kryptowährung auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoOptions.map((crypto) => (
                            <SelectItem key={crypto.id} value={crypto.id}>
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{crypto.icon}</span>
                                <div>
                                  <div className="font-medium">{crypto.name}</div>
                                  <div className="text-xs text-gray-500">{crypto.network}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center text-sm text-blue-800 mb-2">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="font-medium">Ausgewählte Kryptowährung</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Netzwerk:</span>
                          <div className="font-medium">{selectedCrypto.network}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Gebühr:</span>
                          <div className="font-medium">{selectedCrypto.fee}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Mindestbetrag:</span>
                          <div className="font-medium">
                            {selectedCrypto.minAmount} {selectedCrypto.symbol}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Bearbeitungszeit:</span>
                          <div className="font-medium">5-30 Min</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="walletAddress" className="text-sm">
                        {selectedCrypto.name} Wallet-Adresse
                      </Label>
                      <Textarea
                        id="walletAddress"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder={`Geben Sie Ihre ${selectedCrypto.name} Wallet-Adresse ein\nBeispiel: ${selectedCrypto.addressExample}`}
                        className="min-h-[80px] font-mono text-sm"
                        disabled={processing}
                      />
                      <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          Stellen Sie sicher, dass die Wallet-Adresse korrekt ist. Falsche Adressen können zu
                          dauerhaftem Verlust führen.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Details */}
                {method === "paypal" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      PayPal-Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail" className="text-sm">
                        PayPal-E-Mail-Adresse
                      </Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="ihre.email@example.com"
                        disabled={processing}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Money Details */}
                {method === "mobile" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile Money Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="mobilePhone" className="text-sm">
                        Telefonnummer
                      </Label>
                      <Input
                        id="mobilePhone"
                        type="tel"
                        value={mobileMoneyPhone}
                        onChange={(e) => setMobileMoneyPhone(e.target.value)}
                        placeholder="+49 123 456 7890"
                        disabled={processing}
                      />
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Sicherheitshinweis:</strong> Alle Abhebungen erfordern eine Mindestguthaben von 500 EUR für
                    die Bearbeitung. Dies dient der Sicherheit und Verifizierung Ihres Kontos.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#f9a826] to-yellow-500 hover:from-[#f9a826]/90 hover:to-yellow-500/90 text-black font-semibold h-12"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Abhebung wird bearbeitet...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Abhebung beantragen
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Wallet className="h-5 w-5 mr-2 text-[#f9a826]" />
                Kontosaldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(5500000)}</div>
              <div className="text-sm text-gray-500">Verfügbar für Abhebung</div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Konto vollständig verifiziert</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Methods Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verfügbare Methoden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Banküberweisung</span>
                </div>
                <span className="text-sm font-medium text-green-600">Verfügbar</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bitcoin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Kryptowährung</span>
                </div>
                <span className="text-sm font-medium text-green-600">12 Optionen</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">PayPal</span>
                </div>
                <span className="text-sm font-medium text-green-600">Verfügbar</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Mobile Money</span>
                </div>
                <span className="text-sm font-medium text-green-600">Verfügbar</span>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Abhebungslimits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Täglich</span>
                <span className="text-sm font-medium">€50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Wöchentlich</span>
                <span className="text-sm font-medium">€200,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monatlich</span>
                <span className="text-sm font-medium">€500,000</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mindestbetrag</span>
                  <span className="text-sm font-medium">€500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Times */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bearbeitungszeiten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Banküberweisung</span>
                </div>
                <span className="text-sm font-medium">1-3 Werktage</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bitcoin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Kryptowährung</span>
                </div>
                <span className="text-sm font-medium">5-30 Min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">PayPal</span>
                </div>
                <span className="text-sm font-medium">Sofort</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Mobile Money</span>
                </div>
                <span className="text-sm font-medium">Sofort</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="max-w-md bg-white border border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Konto-Aktivierung erforderlich</h2>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center space-y-3">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Abhebung vorübergehend gesperrt</h3>
                <p className="text-red-700 text-sm">
                  Zur Freischaltung Ihrer Abhebung ist eine einmalige Aktivierungsgebühr erforderlich.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">Aktivierungsgebühr</span>
                </div>
                <div className="text-2xl font-bold text-yellow-800">500 EUR</div>
                <p className="text-yellow-700 text-sm mt-1">Einmalige Zahlung zur Freischaltung von 5.500.000 EUR</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-blue-800 font-medium text-xs">Sofortige Aktivierung</div>
                  <div className="text-blue-600 text-xs">Nach Zahlung verfügbar</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <Shield className="h-4 w-4 text-green-600 mx-auto mb-1" />
                  <div className="text-green-800 font-medium text-xs">100% Sicher</div>
                  <div className="text-green-600 text-xs">Verschlüsselte Übertragung</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 text-sm">
                  Nach der Aktivierung haben Sie unbegrenzten Zugang zu allen Abhebungsmethoden.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-3">
              <Button
                onClick={() => setShowErrorModal(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2"
              >
                Verstanden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
