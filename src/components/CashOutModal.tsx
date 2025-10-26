import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, CheckCircle, Wallet, CreditCard, History, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface CashOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: (amount: number) => void;
}

interface WithdrawalHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  destination: string;
  status: "success" | "pending" | "failed";
}

export function CashOutModal({ isOpen, onClose, currentBalance, onSuccess }: CashOutModalProps) {
  const [amount, setAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState<"bank" | "ewallet">("bank");
  const [destination, setDestination] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Mock withdrawal history
  const withdrawalHistory: WithdrawalHistory[] = [
    {
      id: "1",
      date: "2025-01-10",
      amount: 50000,
      method: "GoPay",
      destination: "0812****5678",
      status: "success"
    },
    {
      id: "2",
      date: "2025-01-05",
      amount: 100000,
      method: "BCA",
      destination: "1234****90",
      status: "success"
    },
    {
      id: "3",
      date: "2024-12-28",
      amount: 75000,
      method: "OVO",
      destination: "0856****1234",
      status: "success"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const withdrawAmount = parseInt(amount);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Jumlah penarikan tidak valid");
      return;
    }
    
    if (withdrawAmount > currentBalance) {
      setError("Saldo tidak mencukupi");
      return;
    }
    
    if (withdrawAmount < 10000) {
      setError("Minimum penarikan Rp 10.000");
      return;
    }
    
    if (!destination) {
      setError(withdrawalMethod === "bank" ? "Pilih rekening tujuan" : "Pilih e-wallet tujuan");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onSuccess(withdrawAmount);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        setAmount("");
        setDestination("");
        onClose();
      }, 2000);
    }, 2000);
  };

  const quickAmounts = [10000, 25000, 50000, 100000];

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Penarikan Berhasil!</DialogTitle>
            <DialogDescription>
              Penarikan sebesar {formatCurrency(parseInt(amount))} sedang diproses.
              Dana akan masuk ke {withdrawalMethod === "bank" ? "rekening" : "e-wallet"} dalam 1-3 hari kerja.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tarik Saldo</DialogTitle>
          <DialogDescription>
            Pilih metode penarikan dan masukkan jumlah yang ingin ditarik.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="withdraw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="withdraw">Tarik Saldo</TabsTrigger>
            <TabsTrigger value="history">Riwayat Penarikan</TabsTrigger>
          </TabsList>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-4 mt-4">
            <div>
              <Label>Saldo Tersedia</Label>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(currentBalance)}</p>
            </div>

            {/* Withdrawal Method Selection */}
            <div>
              <Label>Metode Penarikan</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                  type="button"
                  variant={withdrawalMethod === "bank" ? "default" : "outline"}
                  onClick={() => {
                    setWithdrawalMethod("bank");
                    setDestination("");
                  }}
                  className={`h-auto py-4 ${withdrawalMethod === "bank" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span>Transfer Bank</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={withdrawalMethod === "ewallet" ? "default" : "outline"}
                  onClick={() => {
                    setWithdrawalMethod("ewallet");
                    setDestination("");
                  }}
                  className={`h-auto py-4 ${withdrawalMethod === "ewallet" ? "bg-gradient-to-r from-purple-500 to-pink-600" : ""}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    <span>E-Wallet</span>
                  </div>
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Jumlah Penarikan</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isProcessing}
                />
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      disabled={quickAmount > currentBalance || isProcessing}
                      className="text-xs"
                    >
                      {formatCurrency(quickAmount)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>{withdrawalMethod === "bank" ? "Rekening Tujuan" : "E-Wallet Tujuan"}</Label>
                <Select value={destination} onValueChange={setDestination} disabled={isProcessing}>
                  <SelectTrigger>
                    <SelectValue placeholder={withdrawalMethod === "bank" ? "Pilih rekening" : "Pilih e-wallet"} />
                  </SelectTrigger>
                  <SelectContent>
                    {withdrawalMethod === "bank" ? (
                      <>
                        <SelectItem value="bca-1234">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            BCA - 1234567890 (John Doe)
                          </div>
                        </SelectItem>
                        <SelectItem value="mandiri-5678">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Mandiri - 5678901234 (John Doe)
                          </div>
                        </SelectItem>
                        <SelectItem value="bni-9012">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            BNI - 9012345678 (John Doe)
                          </div>
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="gopay-0812">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            GoPay - 0812****5678
                          </div>
                        </SelectItem>
                        <SelectItem value="ovo-0856">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            OVO - 0856****1234
                          </div>
                        </SelectItem>
                        <SelectItem value="dana-0821">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            DANA - 0821****9876
                          </div>
                        </SelectItem>
                        <SelectItem value="shopeepay-0878">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            ShopeePay - 0878****4321
                          </div>
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                <p>• Minimum penarikan Rp 10.000</p>
                <p>• Transfer bank: 1-3 hari kerja</p>
                <p>• E-wallet: Instan - 24 jam</p>
                <p>• Tidak ada biaya administrasi</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isProcessing ? "Memproses..." : "Tarik Saldo"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">Riwayat Penarikan</h3>
            </div>

            {withdrawalHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Belum ada riwayat penarikan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawalHistory.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.method.includes("Pay") || item.method.includes("OVO") || item.method.includes("DANA")
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {item.method.includes("Pay") || item.method.includes("OVO") || item.method.includes("DANA") ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{formatCurrency(item.amount)}</div>
                          <div className="text-sm text-gray-600">{item.method} - {item.destination}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(item.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={item.status === "success" ? "default" : item.status === "pending" ? "secondary" : "destructive"}
                        className={item.status === "success" ? "bg-green-500" : ""}
                      >
                        {item.status === "success" ? "Berhasil" : item.status === "pending" ? "Diproses" : "Gagal"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
