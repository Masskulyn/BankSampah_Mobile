import { Card } from "./ui/card";
import { Eye, EyeOff, TrendingUp, Leaf } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
  totalEarnings: number;
  wasteDeposited: number;
}

export function BalanceCard({ balance, totalEarnings, wasteDeposited }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden">
      <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white p-6 shadow-2xl border-0 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Leaf size={16} className="text-white" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm font-medium">Saldo EcoBank</p>
                <p className="text-white/80 text-xs">Bank Sampah Digital</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="mb-8">
            <div className="flex items-end gap-3 mb-2">
              <h2 className="text-4xl font-black tracking-tight">
                {showBalance ? formatCurrency(balance) : "Rp ••••••"}
              </h2>
            </div>
            <div className="flex items-center gap-1 text-emerald-100">
              <TrendingUp size={14} />
              <span className="text-sm">+12% dari bulan lalu</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <p className="text-emerald-100 text-xs font-medium">Total Pendapatan</p>
              </div>
              <p className="text-white font-bold text-lg">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <p className="text-emerald-100 text-xs font-medium">Sampah Disetor</p>
              </div>
              <p className="text-white font-bold text-lg">{wasteDeposited.toFixed(1)} kg</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}