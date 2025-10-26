import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Weight, Recycle, Calendar, Download, Eye } from "lucide-react";

interface MonthlyData {
  month: string;
  monthShort: string;
  earnings: number;
  weight: number;
  plastic: number;
  paper: number;
  metal: number;
  glass: number;
  organic: number;
  transactions: number;
}

export function StatisticsView() {
  // Mock data statistik bulanan yang realistis
  const monthlyData: MonthlyData[] = [
    { month: "Januari", monthShort: "Jan", earnings: 45000, weight: 12.5, plastic: 4.2, paper: 3.8, metal: 2.1, glass: 1.4, organic: 1.0, transactions: 8 },
    { month: "Februari", monthShort: "Feb", earnings: 52000, weight: 14.8, plastic: 5.1, paper: 4.2, metal: 2.5, glass: 1.8, organic: 1.2, transactions: 11 },
    { month: "Maret", monthShort: "Mar", earnings: 48000, weight: 13.2, plastic: 4.5, paper: 4.0, metal: 2.2, glass: 1.5, organic: 1.0, transactions: 9 },
    { month: "April", monthShort: "Apr", earnings: 61000, weight: 16.5, plastic: 5.8, paper: 4.7, metal: 2.8, glass: 2.0, organic: 1.2, transactions: 13 },
    { month: "Mei", monthShort: "Mei", earnings: 58000, weight: 15.8, plastic: 5.5, paper: 4.5, metal: 2.6, glass: 1.9, organic: 1.3, transactions: 12 },
    { month: "Juni", monthShort: "Jun", earnings: 67000, weight: 18.2, plastic: 6.4, paper: 5.1, metal: 3.2, glass: 2.2, organic: 1.3, transactions: 15 },
    { month: "Juli", monthShort: "Jul", earnings: 71000, weight: 19.5, plastic: 6.8, paper: 5.5, metal: 3.4, glass: 2.4, organic: 1.4, transactions: 16 },
    { month: "Agustus", monthShort: "Agu", earnings: 69000, weight: 18.8, plastic: 6.6, paper: 5.3, metal: 3.1, glass: 2.3, organic: 1.5, transactions: 14 },
    { month: "September", monthShort: "Sep", earnings: 73000, weight: 20.1, plastic: 7.0, paper: 5.8, metal: 3.5, glass: 2.4, organic: 1.4, transactions: 17 },
    { month: "Oktober", monthShort: "Okt", earnings: 76000, weight: 21.2, plastic: 7.5, paper: 6.0, metal: 3.7, glass: 2.5, organic: 1.5, transactions: 18 },
    { month: "November", monthShort: "Nov", earnings: 82000, weight: 22.8, plastic: 8.1, paper: 6.4, metal: 4.0, glass: 2.7, organic: 1.6, transactions: 19 },
    { month: "Desember", monthShort: "Des", earnings: 89000, weight: 24.5, plastic: 8.8, paper: 6.9, metal: 4.2, glass: 2.9, organic: 1.7, transactions: 21 }
  ];

  // Data untuk pie chart jenis sampah (total tahun)
  const wasteTypeData = [
    { name: "Plastik", value: 76.3, color: "#3B82F6", percentage: 35.2 },
    { name: "Kertas", value: 61.2, color: "#10B981", percentage: 28.3 },
    { name: "Logam", value: 37.3, color: "#F59E0B", percentage: 17.2 },
    { name: "Kaca", value: 26.0, color: "#8B5CF6", percentage: 12.0 },
    { name: "Organik", value: 15.8, color: "#EF4444", percentage: 7.3 }
  ];

  // Statistik ringkasan
  const totalEarnings = monthlyData.reduce((sum, data) => sum + data.earnings, 0);
  const totalWeight = monthlyData.reduce((sum, data) => sum + data.weight, 0);
  const totalTransactions = monthlyData.reduce((sum, data) => sum + data.transactions, 0);
  const avgMonthlyEarnings = totalEarnings / 12;

  // Trend calculation (comparing last 3 months vs previous 3 months)
  const lastQuarter = monthlyData.slice(-3).reduce((sum, data) => sum + data.earnings, 0) / 3;
  const prevQuarter = monthlyData.slice(-6, -3).reduce((sum, data) => sum + data.earnings, 0) / 3;
  const earningsTrend = ((lastQuarter - prevQuarter) / prevQuarter) * 100;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm text-gray-600">{entry.dataKey}: </span>
              <span className="font-semibold">
                {entry.dataKey === 'earnings' ? `Rp ${entry.value.toLocaleString('id-ID')}` : 
                 entry.dataKey === 'weight' ? `${entry.value} kg` : 
                 `${entry.value} kg`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistik Bank Sampah</h2>
          <p className="text-gray-600">Laporan aktivitas tahun 2024</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <Eye size={16} />
            Lihat Detail
          </Button>
          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Download size={16} />
            Unduh Laporan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-800">
                  Rp {totalEarnings.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {earningsTrend > 0 ? (
                    <TrendingUp size={14} className="text-green-600" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  <span className={`text-xs ${earningsTrend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {Math.abs(earningsTrend).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <DollarSign size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Sampah</p>
                <p className="text-2xl font-bold text-blue-800">
                  {totalWeight.toFixed(1)} kg
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  ~{(totalWeight/12).toFixed(1)}kg/bulan
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Weight size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Transaksi</p>
                <p className="text-2xl font-bold text-purple-800">
                  {totalTransactions}
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  {(totalTransactions/12).toFixed(1)} per bulan
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <Recycle size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">Rata-rata/Bulan</p>
                <p className="text-2xl font-bold text-orange-800">
                  Rp {avgMonthlyEarnings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Pendapatan bulanan
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl">
                <Calendar size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="earnings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Pendapatan
          </TabsTrigger>
          <TabsTrigger value="weight" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Berat Sampah
          </TabsTrigger>
          <TabsTrigger value="types" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Jenis Sampah
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />
                Pendapatan Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="monthShort" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                    <Tooltip content={customTooltip} />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      fill="url(#earningsGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight size={20} className="text-blue-600" />
                Berat Sampah Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="monthShort" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `${value}kg`} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="weight" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle size={20} className="text-purple-600" />
                  Distribusi Jenis Sampah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({name, percentage}) => `${name} ${percentage.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {wasteTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} kg`, 'Berat']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Detail per Jenis Sampah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wasteTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{item.value} kg</p>
                        <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Waste Types Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Jenis Sampah Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="monthShort" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `${value}kg`} />
                    <Tooltip content={customTooltip} />
                    <Line type="monotone" dataKey="plastic" stroke="#3B82F6" strokeWidth={2} name="Plastik" />
                    <Line type="monotone" dataKey="paper" stroke="#10B981" strokeWidth={2} name="Kertas" />
                    <Line type="monotone" dataKey="metal" stroke="#F59E0B" strokeWidth={2} name="Logam" />
                    <Line type="monotone" dataKey="glass" stroke="#8B5CF6" strokeWidth={2} name="Kaca" />
                    <Line type="monotone" dataKey="organic" stroke="#EF4444" strokeWidth={2} name="Organik" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Badges */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            🏆 Pencapaian Tahun Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 mb-2">
                Eco Warrior
              </Badge>
              <p className="text-sm text-gray-600">216+ kg sampah didaur ulang</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 mb-2">
                Konsisten
              </Badge>
              <p className="text-sm text-gray-600">12 bulan berturut-turut aktif</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300 mb-2">
                Top Earner
              </Badge>
              <p className="text-sm text-gray-600">Rp 691.000+ pendapatan</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300 mb-2">
                Trendsetter
              </Badge>
              <p className="text-sm text-gray-600">Trend positif +{earningsTrend.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}