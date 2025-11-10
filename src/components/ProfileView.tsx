import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { EditContactModal } from "./EditContactModal";
import { EditProfileModal } from "./EditProfileModal";
import { SecurityModal } from "./SecurityModal";
import { BankAccountModal } from "./BankAccountModal";
import { HelpCenterModal } from "./HelpCenterModal";
import { TermsModal } from "./TermsModal";
import { LanguageModal } from "./LanguageModal";
import { useAuth } from "./AuthContext";
import {
  User,
  Edit,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Settings,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Leaf,
  Recycle,
  ChevronRight,
  Star,
  Gift,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Globe,
  FileText,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface ProfileViewProps {
  userData: {
    name: string;
    balance: number;
    totalEarnings: number;
    wasteDeposited: number;
  };
  onChatSupport?: () => void;
}

export function ProfileView({ userData, onChatSupport }: ProfileViewProps) {
  const { user, logout, updateUser } = useAuth();
  const [notifications, setNotifications] = useState({
    deposit: true,
    cashout: true,
    news: false,
    promo: true,
  });

  const [showBalance, setShowBalance] = useState(true);

  // Modal States
  const [showEditContact, setShowEditContact] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showBankAccount, setShowBankAccount] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  const [showTerms, setShowTerms] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  // Contact Data
  const [contactData, setContactData] = useState({
    phone: user?.phone || "+62 812-3456-7890",
    email: user?.email || "user@ecobank.id",
    address: `${user?.city || "Jakarta Selatan"}, DKI Jakarta`,
  });

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: user?.name || userData.name,
    birthDate: "1995-06-15",
    gender: "male",
    occupation: "Software Engineer",
    city: user?.city || "Jakarta Selatan",
    profileImage: user?.profileImage || "",
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [type]: value }));
    toast.success(
      `Notifikasi ${type} ${value ? "diaktifkan" : "dinonaktifkan"}`
    );
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleChangePhoto = () => {
    toast.info("Fitur ubah foto akan segera tersedia");
  };

  const handleLogout = () => {
    logout();
  };

  const handleContactSave = (data: any) => {
    setContactData(data);
    // Update user in auth context
    updateUser({
      phone: data.phone,
      email: data.email,
    });
  };

  const handleProfileSave = (data: any) => {
    setProfileData(data);
    // Update user in auth context
    updateUser({
      name: data.name,
      city: data.city,
      profileImage: data.profileImage,
    });
  };

  // User stats
  const userStats = {
    level: "Eco Warrior",
    points: 1250,
    rankPosition: 12,
    totalTransactions: 42,
    carbonSaved: 15.6, // kg CO2
    treesEquivalent: 3,
  };

  const menuItems = [
    {
      category: "Akun",
      items: [
        {
          icon: User,
          title: "Informasi Personal",
          subtitle: "Edit data pribadi Anda",
          action: () => setShowEditProfile(true),
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          icon: Shield,
          title: "Keamanan & Privasi",
          subtitle: "PIN, Password, dan keamanan akun",
          action: () => setShowSecurity(true),
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          icon: CreditCard,
          title: "Rekening Bank",
          subtitle: "Kelola rekening untuk pencairan",
          action: () => setShowBankAccount(true),
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ],
    },
    {
      category: "Preferensi",
      items: [
        {
          icon: Bell,
          title: "Notifikasi",
          subtitle: "Atur notifikasi aplikasi",
          action: null, // Will be handled differently
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
        {
          icon: Globe,
          title: "Bahasa & Region",
          subtitle: "Indonesia • Jakarta",
          action: () => setShowLanguage(true),
          color: "text-indigo-600",
          bgColor: "bg-indigo-100",
        },
      ],
    },
    {
      category: "Bantuan",
      items: [
        {
          icon: HelpCircle,
          title: "Pusat Bantuan",
          subtitle: "FAQ dan panduan penggunaan",
          action: () => setShowHelpCenter(true),
          color: "text-cyan-600",
          bgColor: "bg-cyan-100",
        },
        {
          icon: MessageCircle,
          title: "Chat Support",
          subtitle: "Live chat dengan customer service",
          action: () => onChatSupport?.(),
          color: "text-pink-600",
          bgColor: "bg-pink-100",
        },
        {
          icon: FileText,
          title: "Syarat & Ketentuan",
          subtitle: "Kebijakan dan aturan penggunaan",
          action: () => setShowTerms(true),
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-4 ring-white/30">
                  <AvatarImage
                    src={profileData.profileImage}
                    alt={userData.name}
                  />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-sm">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  onClick={handleChangePhoto}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/90 hover:bg-white text-green-600 rounded-full shadow-lg"
                >
                  <Camera size={14} />
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {user?.name || userData.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Award size={12} className="mr-1" />
                    {userStats.level}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    #{userStats.rankPosition}
                  </Badge>
                </div>
                <p className="text-white/80 text-sm">
                  Member sejak{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Januari 2024"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditProfile}
              className="text-white/80 hover:text-white hover:bg-white/20"
            >
              <Edit size={18} />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <p className="text-2xl font-bold">
                  {showBalance
                    ? `${Math.floor(userData.balance / 1000)}k`
                    : "•••"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="ml-1 w-6 h-6 text-white/70 hover:text-white hover:bg-white/20"
                >
                  {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
                </Button>
              </div>
              <p className="text-xs text-white/70">Saldo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userStats.points}</p>
              <p className="text-xs text-white/70">Poin Eco</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userData.wasteDeposited}</p>
              <p className="text-xs text-white/70">Kg Sampah</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Leaf className="text-green-600" size={16} />
              Dampak Lingkungan
            </h4>
            <Badge
              variant="outline"
              className="text-green-600 border-green-200"
            >
              <Star size={12} className="mr-1" />
              Hebat!
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Recycle className="text-green-600" size={14} />
                <p className="font-bold text-green-800">
                  {userStats.carbonSaved} kg
                </p>
              </div>
              <p className="text-xs text-green-600">CO₂ Tersimpan</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Leaf className="text-blue-600" size={14} />
                <p className="font-bold text-blue-800">
                  {userStats.treesEquivalent} pohon
                </p>
              </div>
              <p className="text-xs text-blue-600">Setara Menanam</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} className="text-gray-600" />
            Informasi Kontak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowEditContact(true)}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone size={14} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Nomor Telepon</p>
              <p className="font-medium">{contactData.phone}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
          <div
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowEditContact(true)}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail size={14} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{contactData.email}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
          <div
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowEditContact(true)}
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin size={14} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Alamat</p>
              <p className="font-medium">{contactData.address}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      {menuItems.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{section.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex}>
                {item.title === "Notifikasi" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className={`p-2 ${item.bgColor} rounded-lg`}>
                        <item.icon size={16} className={item.color} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.subtitle}</p>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="ml-14 space-y-3 pb-2">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Setor Sampah</p>
                          <p className="text-xs text-gray-500">
                            Pengingat jadwal setor
                          </p>
                        </div>
                        <Switch
                          checked={notifications.deposit}
                          onCheckedChange={(value) =>
                            handleNotificationChange("deposit", value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Penarikan Saldo</p>
                          <p className="text-xs text-gray-500">
                            Konfirmasi pencairan
                          </p>
                        </div>
                        <Switch
                          checked={notifications.cashout}
                          onCheckedChange={(value) =>
                            handleNotificationChange("cashout", value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Berita & Tips</p>
                          <p className="text-xs text-gray-500">
                            Update artikel terbaru
                          </p>
                        </div>
                        <Switch
                          checked={notifications.news}
                          onCheckedChange={(value) =>
                            handleNotificationChange("news", value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Promo & Reward</p>
                          <p className="text-xs text-gray-500">
                            Penawaran khusus
                          </p>
                        </div>
                        <Switch
                          checked={notifications.promo}
                          onCheckedChange={(value) =>
                            handleNotificationChange("promo", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className={`p-2 ${item.bgColor} rounded-lg`}>
                      <item.icon size={16} className={item.color} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                )}
                {itemIndex < section.items.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* All Modals */}
      <EditContactModal
        isOpen={showEditContact}
        onClose={() => setShowEditContact(false)}
        contactData={contactData}
        onSave={handleContactSave}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={profileData}
        onSave={handleProfileSave}
      />

      <SecurityModal
        isOpen={showSecurity}
        onClose={() => setShowSecurity(false)}
      />

      <BankAccountModal
        isOpen={showBankAccount}
        onClose={() => setShowBankAccount(false)}
      />

      <HelpCenterModal
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
      />

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

      <LanguageModal
        isOpen={showLanguage}
        onClose={() => setShowLanguage(false)}
      />

      {/* App Info */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Recycle size={16} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900">
                EcoBank v2.1.0
              </span>
            </div>
            <p className="text-xs text-gray-500">© 2024 EcoBank Indonesia</p>
            <p className="text-xs text-gray-400">
              Solusi digital untuk bank sampah berkelanjutan
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-center gap-2 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <LogOut size={16} />
            Keluar dari Aplikasi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
