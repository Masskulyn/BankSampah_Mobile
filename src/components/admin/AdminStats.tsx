import { Card } from "../ui/card";
import { Users, TrendingUp, Trash2, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    totalWaste: 0,
    totalMoney: 0,
    todayTransactions: 0,
    todayWaste: 0,
    todayMoney: 0,
  });

  useEffect(() => {
    // Get all users
    const usersData = localStorage.getItem("ecobank_users");
    const users = usersData ? JSON.parse(usersData) : [];
    const regularUsers = users.filter((u: any) => u.role !== 'admin');

    // Calculate stats
    const totalUsers = regularUsers.length;
    const activeUsers = regularUsers.filter((u: any) => {
      const lastLogin = new Date(u.lastLogin);
      const daysDiff = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Active in last 7 days
    }).length;

    const totalWaste = regularUsers.reduce((sum: number, u: any) => sum + (u.wasteDeposited || 0), 0);
    const totalMoney = regularUsers.reduce((sum: number, u: any) => sum + (u.totalEarnings || 0), 0);

    // Get transactions
    const transactionsData = localStorage.getItem("ecobank_transactions");
    const transactions = transactionsData ? JSON.parse(transactionsData) : [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions.filter((t: any) => {
      const txDate = new Date(t.date);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    });

    const todayWaste = todayTransactions
      .filter((t: any) => t.type === 'deposit')
      .reduce((sum: number, t: any) => sum + (t.wasteWeight || 0), 0);

    const todayMoney = todayTransactions
      .reduce((sum: number, t: any) => {
        if (t.type === 'deposit') return sum + t.amount;
        if (t.type === 'cashout') return sum - t.amount;
        return sum;
      }, 0);

    setStats({
      totalUsers,
      activeUsers,
      totalTransactions: transactions.length,
      totalWaste,
      totalMoney,
      todayTransactions: todayTransactions.length,
      todayWaste,
      todayMoney,
    });
  }, []);

  const statCards = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      subValue: `${stats.activeUsers} aktif`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Transaksi",
      value: stats.totalTransactions,
      subValue: `${stats.todayTransactions} hari ini`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Total Sampah",
      value: `${stats.totalWaste.toFixed(1)} kg`,
      subValue: `${stats.todayWaste.toFixed(1)} kg hari ini`,
      icon: Trash2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Total Pencairan",
      value: `Rp ${stats.totalMoney.toLocaleString('id-ID')}`,
      subValue: `Rp ${Math.abs(stats.todayMoney).toLocaleString('id-ID')} hari ini`,
      icon: Wallet,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "+20%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-5 md:p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stat.bgColor}`}>
              {stat.trendUp ? (
                <ArrowUpRight className={`w-3 h-3 ${stat.textColor}`} />
              ) : (
                <ArrowDownRight className={`w-3 h-3 ${stat.textColor}`} />
              )}
              <span className={`text-xs font-medium ${stat.textColor}`}>
                {stat.trend}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500">{stat.subValue}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
