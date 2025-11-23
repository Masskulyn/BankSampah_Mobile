import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AdminStats } from "./AdminStats";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { UserManagement } from "./UserManagement";
import { AdminTransactions } from "./AdminTransactions";
import { ArticleManagement } from "./ArticleManagement";
import { AdminChatView } from "../AdminChatView";
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  Receipt,
  LogOut,
  Shield,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";
import { useRef } from "react";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar dari admin panel");
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      if (direction === 'left') {
        tabsContainerRef.current.scrollLeft -= scrollAmount;
      } else {
        tabsContainerRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman admin.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-emerald-50/30">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-white/90">Bank Sampah Digital</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm text-white/90">{user.name}</p>
                <p className="text-xs text-white/70">{user.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 md:space-y-6">
          {/* Tabs Navigation - dengan slider untuk mobile */}
          <div className="relative group">
            {/* Left Arrow - Mobile only */}
            <button
              onClick={() => scrollTabs('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Tabs Container - scrollable on mobile */}
            <div
              ref={tabsContainerRef}
              className="overflow-x-auto scrollbar-hide"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <TabsList className="flex bg-white shadow-md p-1 md:p-1.5 h-auto gap-0.5 min-w-max md:min-w-0">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-1 py-2 px-3 md:px-4 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex-shrink-0"
                >
                  <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="qrcode"
                  className="flex items-center gap-1 py-2 px-3 md:px-4 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex-shrink-0"
                >
                  <QrCode className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">QR Code</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="users"
                  className="flex items-center gap-1 py-2 px-3 md:px-4 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex-shrink-0"
                >
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">Pengguna</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions"
                  className="flex items-center gap-1 py-2 px-3 md:px-4 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex-shrink-0"
                >
                  <Receipt className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">Transaksi</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="chat"
                  className="flex items-center gap-1 py-2 px-3 md:px-4 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex-shrink-0"
                >
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="articles"
                  className="flex items-center gap-1 py-2 px-3 md:px-4 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg flex-shrink-0"
                >
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">Artikel</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Right Arrow - Mobile only */}
            <button
              onClick={() => scrollTabs('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add this CSS for scrollbar hiding */}
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-3 md:space-y-6">
            <AdminStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
              <Card className="p-3 md:p-6 bg-white shadow-lg">
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-3 md:mb-4">Quick Actions</h3>
                <div className="space-y-2 md:space-y-3">
                  <Button
                    onClick={() => setActiveTab("qrcode")}
                    className="w-full h-10 justify-start bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs md:text-sm px-3 md:px-4"
                  >
                    <QrCode className="w-4 h-4 lg:w-5 lg:h-5 mr-2 md:mr-3 shrink-0" />
                    <span className="truncate">Generate QR Code untuk Setoran</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("articles")}
                    variant="outline"
                    className="w-full h-10 justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs md:text-sm px-3 md:px-4"
                  >
                    <FileText className="w-4 h-4 lg:w-5 lg:h-5 mr-2 md:mr-3 shrink-0" />
                    <span className="truncate">Kelola Artikel & Tips</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("users")}
                    variant="outline"
                    className="w-full h-10 justify-start border-gray-300 text-xs md:text-sm px-3 md:px-4"
                  >
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2 md:mr-3 shrink-0" />
                    <span className="truncate">Kelola Pengguna</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("transactions")}
                    variant="outline"
                    className="w-full h-10 justify-start border-gray-300 text-xs md:text-sm px-3 md:px-4"
                  >
                    <Receipt className="w-4 h-4 lg:w-5 lg:h-5 mr-2 md:mr-3 shrink-0" />
                    <span className="truncate">Lihat Semua Transaksi</span>
                  </Button>
                </div>
              </Card>

              <Card className="p-3 md:p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                <h3 className="text-sm md:text-base lg:text-lg font-bold mb-2">Selamat Datang, Admin!</h3>
                <p className="text-white/90 text-xs md:text-sm mb-3 md:mb-6">
                  Kelola sistem Bank Sampah Digital dengan mudah. Gunakan menu di atas untuk mengakses berbagai fitur.
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 space-y-1.5 md:space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-white/80">Level Akses:</span>
                    <span className="font-bold">Administrator</span>
                  </div>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-white/80">ID Admin:</span>
                    <span className="font-mono text-[10px] md:text-xs">{user.id}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qrcode" className="space-y-6">
            <QRCodeGenerator adminId={user.id} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <AdminTransactions />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <AdminChatView onBack={() => setActiveTab("dashboard")} />
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <ArticleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}