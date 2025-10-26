import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowUp, ArrowDown, Recycle, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'cashout';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSeeAll?: () => void;
}

export function TransactionHistory({ transactions, onSeeAll }: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <Recycle className="text-white" size={18} />;
      case 'withdrawal':
        return <ArrowUp className="text-white" size={18} />;
      case 'cashout':
        return <ArrowDown className="text-white" size={18} />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'withdrawal':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'cashout':
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={14} className="text-green-600" />;
      case 'pending':
        return <Clock size={14} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={14} className="text-red-600" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Gagal';
    }
  };

  return (
    <Card className="p-5 sm:p-6 bg-white shadow-xl border-0">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg text-gray-900">Riwayat Transaksi</h3>
          <p className="text-sm text-gray-500 mt-1">Aktivitas terbaru Anda</p>
        </div>
        <button 
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
        >
          Lihat Semua
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div key={transaction.id} className="group">
            <div className="p-4 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-98">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-2xl shadow-lg ${getTransactionColor(transaction.type)} flex-shrink-0`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 group-hover:text-gray-700 truncate">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          <Badge className={`text-xs border ${getStatusColor(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className={`text-base sm:text-lg ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connector line for next item */}
            {index < transactions.length - 1 && (
              <div className="flex justify-start ml-6 my-2">
                <div className="w-px h-3 bg-gradient-to-b from-gray-200 to-transparent"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}