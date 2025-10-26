import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowUp, ArrowDown, Recycle, Clock, CheckCircle2, XCircle, ArrowLeft, Filter, Calendar, Search } from "lucide-react";
import { Input } from "./ui/input";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'cashout';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface AllTransactionsViewProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function AllTransactionsView({ transactions, onBack }: AllTransactionsViewProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const getTypeText = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'Setoran';
      case 'withdrawal':
        return 'Penarikan';
      case 'cashout':
        return 'Cairkan';
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutcome = transactions
    .filter(t => (t.type === 'cashout' || t.type === 'withdrawal') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="font-bold text-gray-900">Semua Transaksi</h1>
          <p className="text-sm text-gray-500">
            {filteredTransactions.length} dari {transactions.length} transaksi
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-green-600">Total Masuk</p>
            <p className="text-lg sm:text-xl text-green-700 mt-1">{formatCurrency(totalIncome)}</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-50 border-red-100 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-red-600">Total Keluar</p>
            <p className="text-lg sm:text-xl text-red-700 mt-1">{formatCurrency(totalOutcome)}</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-50 border-yellow-100 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-yellow-600">Pending</p>
            <p className="text-lg sm:text-xl text-yellow-700 mt-1">{pendingTransactions}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-5 bg-white shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-gray-700">Filter & Cari</span>
          </div>
          
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            
            {/* Mobile-optimized filter buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Semua Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="deposit">Setoran</SelectItem>
                  <SelectItem value="cashout">Penarikan</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-100">
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2">Tidak ada transaksi</h3>
              <p className="text-sm text-gray-500">
                Tidak ada transaksi yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div key={transaction.id} className="group">
                <div className="p-4 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md active:scale-98">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-2xl shadow-lg ${getTransactionColor(transaction.type)} flex-shrink-0`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-900 group-hover:text-gray-700 truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getTypeText(transaction.type)}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              <Badge className={`text-xs border ${getStatusColor(transaction.status)}`}>
                                {getStatusText(transaction.status)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{transaction.date}</p>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className={`text-base sm:text-lg ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">ID: {transaction.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connector line for next item */}
                {index < filteredTransactions.length - 1 && (
                  <div className="flex justify-start ml-6 my-2">
                    <div className="w-px h-3 bg-gradient-to-b from-gray-200 to-transparent"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}