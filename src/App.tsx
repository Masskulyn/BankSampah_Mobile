import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { AuthScreen } from "./components/AuthScreen";
import { SplashScreen } from "./components/SplashScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { BalanceCard } from "./components/BalanceCard";
import { QuickActions } from "./components/QuickActions";
import { TransactionHistory } from "./components/TransactionHistory";
import { AllTransactionsView } from "./components/AllTransactionsView";
import { AddressSearch } from "./components/AddressSearch";
import { NewsSection } from "./components/NewsSection";
import { AllNewsView } from "./components/AllNewsView";
import { ArticleView } from "./components/ArticleView";
import { StatisticsView } from "./components/StatisticsView";
import { ProfileView } from "./components/ProfileView";
import { ChatSupportView } from "./components/ChatSupportView";
import { CashOutModal } from "./components/CashOutModal";
import { QRScannerModal } from "./components/QRScannerModal";
import { ReminderModal } from "./components/ReminderModal";
import { BottomNavigation } from "./components/BottomNavigation";
import { HeroSection } from "./components/HeroSection";
import { StepsInfographic } from "./components/StepsInfographic";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { LeaderboardView } from "./components/LeaderboardView";
import { LeaderboardCard } from "./components/LeaderboardCard";
import { EducationView } from "./components/EducationView";
import { RewardsView } from "./components/RewardsView";
import { TopNavigation } from "./components/TopNavigation";
import { Footer } from "./components/Footer";
import { DepositView } from "./components/DepositView";
import { NotificationPanel } from "./components/NotificationPanel";
import { Bell, LogOut } from "lucide-react";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { mockTransactions } from "./data/mockTransactions";
import { mockNews } from "./data/mockNews";
import { loadAllArticles, incrementArticleViews } from "./utils/articleHelpers";
import "./data/demoUsers"; // Initialize demo users

function MainApp() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [showChatSupport, setShowChatSupport] = useState(false);
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allArticles, setAllArticles] = useState(() => loadAllArticles());
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [currentView, setCurrentView] = useState("home");
  const [topNavView, setTopNavView] = useState("home");

  // State untuk menyimpan stack navigasi
  const [navigationStack, setNavigationStack] = useState<
    Array<{ activeTab: string; currentView: string }>
  >([{ activeTab: "home", currentView: "home" }]);

  // Reload articles when component mounts or when returning from certain views
  // Removed duplicated useEffect related to splash screen and articles loading

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // If not authenticated, show auth screen
  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  // If user is admin, show admin dashboard
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // User data from auth context
  const userData = {
    name: user.name,
    balance: user.balance,
    totalEarnings: user.totalEarnings,
    wasteDeposited: user.wasteDeposited,
  };

  // Use first 4 transactions for preview in home
  const recentTransactions = mockTransactions.slice(0, 4);

  // Use first 3 news for preview in home
  const recentNews = allArticles.slice(0, 3);

  const handleCashOut = () => {
    setShowCashOutModal(true);
  };

  const handleCashOutSuccess = (amount: number) => {
    updateUser({ balance: user.balance - amount });
    toast.success(
      `Penarikan Rp ${amount.toLocaleString("id-ID")} berhasil diproses`
    );
  };

  const handleDeposit = () => {
    setShowQRScannerModal(true);
  };

  const handleHistory = () => {
    setCurrentView("allTransactions");
  };

  const handleSeeAllTransactions = () => {
    setCurrentView("allTransactions");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleReminder = () => {
    setShowReminderModal(true);
  };

  const handleQRScanSuccess = (data: any) => {
    // Process QR code data from admin
    // Support both old format (single waste) and new format (multi waste)
    const isMultiWaste = data.wasteItems && Array.isArray(data.wasteItems);

    if (data.type === "deposit") {
      let totalAmount = 0;
      let totalWeight = 0;
      let description = "";

      if (isMultiWaste) {
        // New format with multiple waste items
        totalAmount = data.totalAmount;
        totalWeight = data.wasteItems.reduce(
          (sum: number, item: any) => sum + item.wasteWeight,
          0
        );
        description = data.wasteItems
          .map((item: any) => `${item.wasteWeight} kg ${item.wasteType}`)
          .join(", ");
      } else {
        // Old format with single waste item (backward compatibility)
        totalAmount = data.amount;
        totalWeight = data.wasteWeight;
        description = `Setoran ${data.wasteType} - ${data.wasteWeight} kg`;
      }

      // Update user balance and waste deposited
      const newBalance = user.balance + totalAmount;
      const newTotalEarnings = user.totalEarnings + totalAmount;
      const newWasteDeposited = user.wasteDeposited + totalWeight;

      updateUser({
        balance: newBalance,
        totalEarnings: newTotalEarnings,
        wasteDeposited: newWasteDeposited,
      });

      // Save transaction to localStorage
      const transaction = {
        id: data.transactionId,
        userId: user.id,
        type: "deposit",
        amount: totalAmount,
        date: new Date().toISOString(),
        status: "completed",
        description: `Setoran sampah - ${description}`,
        wasteItems: isMultiWaste
          ? data.wasteItems
          : [
              {
                wasteType: data.wasteType,
                wasteWeight: data.wasteWeight,
                pricePerKg: totalAmount / totalWeight,
                amount: totalAmount,
              },
            ],
        totalWeight: totalWeight,
      };

      const transactionsData = localStorage.getItem("ecobank_transactions");
      const transactions = transactionsData ? JSON.parse(transactionsData) : [];
      transactions.push(transaction);
      localStorage.setItem(
        "ecobank_transactions",
        JSON.stringify(transactions)
      );

      toast.success(
        `Setoran berhasil! +Rp ${totalAmount.toLocaleString(
          "id-ID"
        )} (${totalWeight.toFixed(1)} kg)`,
        { duration: 5000 }
      );
    } else {
      toast.success("QR Code berhasil dipindai!");
    }
  };

  const handleReminderSuccess = (reminderData: any) => {
    const reminderTypes: { [key: string]: string } = {
      deposit: "Setor Sampah Rutin",
      cashout: "Penarikan Saldo",
      news: "Update Berita Lingkungan",
      tips: "Tips Ramah Lingkungan",
    };

    toast.success(
      `Pengingat "${reminderTypes[reminderData.type]}" berhasil diatur!`
    );
  };

  const handleSeeAllNews = () => {
    setCurrentView("allNews");
  };

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView("article");
    incrementArticleViews(articleId);
  };

  const handleBackFromArticle = () => {
    setSelectedArticleId(null);
    setCurrentView("allNews");
  };

  const handleBackFromAllNews = () => {
    setCurrentView("home");
  };

  const handleChatSupport = () => {
    setShowChatSupport(true);
  };

  const handleBackFromChat = () => {
    setShowChatSupport(false);
  };

  const handleAddressSelect = (address: any) => {
    if (address.id?.startsWith("unis-")) {
      toast.success(
        `📍 UNIS Tangerang - ${address.name} dipilih! Mengarahkan ke Google Maps...`
      );
    } else {
      toast.success(`📍 Lokasi "${address.name}" dipilih. Navigasi dimulai!`);
    }
    // Here you could integrate with maps API or navigation
  };

  const renderHomeContent = () => (
    <div className="space-y-6">
      <HeroSection isAuthenticated={isAuthenticated} />

      <StepsInfographic />

      <BalanceCard
        balance={userData.balance}
        totalEarnings={userData.totalEarnings}
        wasteDeposited={userData.wasteDeposited}
      />

      <QuickActions
        onCashOut={handleCashOut}
        onDeposit={handleDeposit}
        onHistory={handleHistory}
        onReminder={handleReminder}
      />

      <LeaderboardCard onViewAll={() => setTopNavView("leaderboard")} />

      <TransactionHistory
        transactions={recentTransactions}
        onSeeAll={handleSeeAllTransactions}
      />

      <AddressSearch onAddressSelect={handleAddressSelect} />

      <NewsSection
        news={recentNews}
        onSeeAll={handleSeeAllNews}
        onArticleClick={handleArticleClick}
      />
    </div>
  );

  const renderContent = () => {
    // Handle chat support first (full screen)
    if (showChatSupport) {
      return <ChatSupportView onBack={handleBackFromChat} />;
    }

    // Handle top navigation views first (but not home)
    if (topNavView === "deposit") {
      return (
        <DepositView
          onScanQR={() => setShowQRScannerModal(true)}
          onBack={() => setTopNavView("home")}
        />
      );
    }

    if (topNavView === "rewards") {
      return <RewardsView onBack={() => setTopNavView("home")} />;
    }

    if (topNavView === "education") {
      return <EducationView onBack={() => setTopNavView("home")} />;
    }

    if (topNavView === "leaderboard") {
      return <LeaderboardView onBack={() => setTopNavView("home")} />;
    }

    // Handle specific views
    if (currentView === "allTransactions") {
      return (
        <AllTransactionsView
          transactions={mockTransactions}
          onBack={handleBackToHome}
        />
      );
    }

    if (currentView === "allNews") {
      return (
        <AllNewsView
          news={allArticles}
          onBack={handleBackFromAllNews}
          onArticleClick={handleArticleClick}
        />
      );
    }

    if (currentView === "article" && selectedArticleId) {
      const selectedArticle = allArticles.find(
        (article) => article.id === selectedArticleId
      );
      if (selectedArticle) {
        return (
          <ArticleView
            article={selectedArticle}
            onBack={handleBackFromArticle}
            onArticleClick={handleArticleClick}
          />
        );
      }
    }

    // Handle tab-based content
    switch (activeTab) {
      case "home":
        return renderHomeContent();
      case "stats":
        return <StatisticsView />;
      case "news":
        return (
          <AllNewsView
            news={allArticles}
            onBack={() => setActiveTab("home")}
            onArticleClick={handleArticleClick}
          />
        );
      case "profile":
        return (
          <ProfileView userData={userData} onChatSupport={handleChatSupport} />
        );
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-green-50/30">
      {/* Connection Status Indicator */}
      <ConnectionStatus />

      {/* Conditionally render header and navigation based on chat support state */}
      {!showChatSupport && (
        <>
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-100/50">
            <div className="flex items-center justify-between p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-green-500/20 ring-offset-2">
                    <AvatarImage src={user.profileImage} alt={userData.name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm md:text-base">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-gray-900 text-base md:text-lg">
                    Selamat datang! 👋
                  </h1>
                  <p className="text-gray-600 font-medium text-sm md:text-base">
                    {userData.name}
                  </p>
                </div>
                <div className="sm:hidden">
                  <p className="text-gray-800 font-semibold text-sm">
                    {userData.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <TopNavigation
                  activeView={topNavView}
                  onViewChange={(view) => {
                    setTopNavView(view);
                    setActiveTab("home"); // Reset bottom nav when using top nav
                    setCurrentView("home");
                  }}
                  balance={userData.balance}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 md:p-3 hover:bg-gray-100 rounded-xl md:rounded-2xl transition-all duration-200 hover:scale-105"
                >
                  <Bell size={18} className="md:hidden text-gray-600" />
                  <Bell size={22} className="hidden md:block text-gray-600" />
                  <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></span>
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 md:p-3 hover:bg-red-50 hover:text-red-600 rounded-xl md:rounded-2xl transition-all duration-200"
                  title="Keluar"
                >
                  <LogOut size={16} className="md:hidden" />
                  <LogOut size={20} className="hidden md:block" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-6 pb-24">{renderContent()}</div>

          {/* Footer */}
          <Footer />

          {/* Bottom Navigation */}
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentView("home"); // Reset to home view when changing tabs
              setTopNavView("home"); // Reset top nav when using bottom nav
            }}
          />
        </>
      )}

      {/* Chat Support (Full Screen) */}
      {showChatSupport && renderContent()}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Keluar Aplikasi</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            Apakah Anda yakin ingin keluar dari aplikasi?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutConfirm(false);
                logout();
              }}
            >
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cash Out Modal */}
      <CashOutModal
        isOpen={showCashOutModal}
        onClose={() => setShowCashOutModal(false)}
        currentBalance={userData.balance}
        onSuccess={handleCashOutSuccess}
      />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScannerModal}
        onClose={() => setShowQRScannerModal(false)}
        onSuccess={handleQRScanSuccess}
      />

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSuccess={handleReminderSuccess}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
