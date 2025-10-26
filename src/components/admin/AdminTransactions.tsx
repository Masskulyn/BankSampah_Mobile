import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, TrendingUp, TrendingDown, Calendar, Filter, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  type: 'deposit' | 'cashout';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  wasteType?: string;
  wasteWeight?: number;
}

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    // Get transactions
    const transactionsData = localStorage.getItem("ecobank_transactions");
    let allTransactions = transactionsData ? JSON.parse(transactionsData) : [];

    // Get users to add names
    const usersData = localStorage.getItem("ecobank_users");
    const users = usersData ? JSON.parse(usersData) : [];

    // Add user names to transactions
    allTransactions = allTransactions.map((tx: Transaction) => {
      const user = users.find((u: any) => u.id === tx.userId);
      return {
        ...tx,
        userName: user ? user.name : 'Unknown User'
      };
    });

    // Sort by date (newest first)
    allTransactions.sort((a: Transaction, b: Transaction) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setTransactions(allTransactions);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type: string) => {
    if (type === 'deposit') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          Setoran
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          <TrendingDown className="w-3 h-3 mr-1" />
          Pencairan
        </Badge>
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Selesai</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Gagal</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      ['ID', 'Tanggal', 'Pengguna', 'Tipe', 'Jumlah', 'Status', 'Deskripsi'].join(','),
      ...filteredTransactions.map(tx => [
        tx.id,
        formatDate(tx.date),
        tx.userName,
        tx.type === 'deposit' ? 'Setoran' : 'Pencairan',
        tx.amount,
        tx.status,
        `"${tx.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaksi-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalAmount = filteredTransactions.reduce((sum, tx) => {
    if (tx.type === 'deposit') return sum + tx.amount;
    if (tx.type === 'cashout') return sum - tx.amount;
    return sum;
  }, 0);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Semua Transaksi</h3>
            <p className="text-sm text-gray-500">{filteredTransactions.length} transaksi</p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          size="sm"
          variant="outline"
          className="border-gray-300 h-9 px-3"
        >
          <Download className="w-4 h-4 mr-1.5 shrink-0" />
          <span className="hidden sm:inline truncate">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="deposit">Setoran</SelectItem>
            <SelectItem value="cashout">Pencairan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Gagal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-6 border border-green-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
            <p className="text-xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Setoran</p>
            <p className="text-xl font-bold text-green-600">
              {filteredTransactions.filter(t => t.type === 'deposit').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pencairan</p>
            <p className="text-xl font-bold text-orange-600">
              {filteredTransactions.filter(t => t.type === 'cashout').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Amount</p>
            <p className={`text-xl font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Rp {Math.abs(totalAmount).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaksi</TableHead>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tx.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(tx.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{tx.userName}</p>
                    <p className="text-xs text-gray-500">{tx.userId}</p>
                  </TableCell>
                  <TableCell>{getTypeBadge(tx.type)}</TableCell>
                  <TableCell>
                    <p className={`font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-orange-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </p>
                    {tx.wasteWeight && (
                      <p className="text-xs text-gray-500">{tx.wasteWeight} kg</p>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700 max-w-xs truncate">{tx.description}</p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Tidak ada transaksi yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <Card key={tx.id} className="p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{tx.userName}</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{tx.id}</code>
                </div>
                {getTypeBadge(tx.type)}
              </div>

              <div className="space-y-2 mb-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className={`font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-orange-600'}`}>
                    {tx.type === 'deposit' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(tx.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="text-gray-900 text-xs">{formatDate(tx.date)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 border-t pt-2">{tx.description}</p>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Tidak ada transaksi yang ditemukan
          </div>
        )}
      </div>
    </Card>
  );
}
