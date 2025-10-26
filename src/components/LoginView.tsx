import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAuth } from "./AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  Recycle,
  ChevronRight,
  Smartphone,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export function LoginView({ onSwitchToRegister }: LoginViewProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Format email tidak valid!");
      return;
    }

    setIsLoading(true);

    const success = await login(formData.email, formData.password);
    setIsLoading(false);

    if (!success) {
      // Error message is already shown in login function
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setFormData({ email: "demo@ecobank.id", password: "demo123" });

    // Small delay to show loading state
    setTimeout(async () => {
      const success = await login("demo@ecobank.id", "demo123");
      setIsLoading(false);

      if (!success) {
        // Create demo user if not exists
        const usersData = localStorage.getItem("ecobank_users");
        const users = usersData ? JSON.parse(usersData) : [];

        // Hash demo password
        const encoder = new TextEncoder();
        const data = encoder.encode("demo123" + "ecobank_salt");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        const demoUser = {
          id: "demo_user_123",
          name: "Anggit Ganteng",
          email: "demo@ecobank.id",
          phone: "+62 812-3456-7890",
          city: "Jakarta Selatan",
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          balance: 125000,
          totalEarnings: 12000,
          wasteDeposited: 15,
        };

        users.push(demoUser);
        localStorage.setItem("ecobank_users", JSON.stringify(users));

        // Try login again
        await login("demo@ecobank.id", "demo123");
      }
    }, 800);
  };

  const features = [
    {
      icon: Recycle,
      title: "Bank Sampah Digital",
      description: "Kelola sampah, raih keuntungan",
    },
    {
      icon: Smartphone,
      title: "Mudah & Praktis",
      description: "Akses kapan saja, dimana saja",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Data dan transaksi terlindungi",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center p-6">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <Recycle size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EcoBank</h1>
          <p className="text-gray-600">Solusi Digital Bank Sampah Indonesia</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-green-100"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">
              Masuk ke Akun Anda
            </CardTitle>
            <p className="text-sm text-gray-600">
              Selamat datang kembali di EcoBank!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={14} className="text-green-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="nama@email.com"
                  className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock size={14} className="text-green-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Masukkan password"
                    className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="text-green-600 hover:text-green-700 text-sm p-0"
                  onClick={() =>
                    toast.info("Fitur lupa password akan segera tersedia")
                  }
                >
                  Lupa password?
                </Button>
              </div>

              {/* Login Button */}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Masuk...
                  </div>
                ) : (
                  <>
                    Masuk
                    <ChevronRight size={16} />
                  </>
                )}
              </Button>
            </form>
            {/* <Separator className="my-6" />
            Demo Login */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 gap-2"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Users size={16} />
              Coba Demo Account
            </Button> */}
            {/* Admin Info */}
            {/* <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg flex-shrink-0">
                  <Shield size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-1">Admin Access</h4>
                  <div className="text-xs text-emerald-700 space-y-0.5">
                    <p><strong>Email:</strong> admin@ecobank.id</p>
                    <p><strong>Password:</strong> admin123</p>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-green-600 hover:text-green-700 font-semibold p-0"
                  onClick={onSwitchToRegister}
                >
                  Daftar Sekarang
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-gray-500">
            © 2024 EcoBank Indonesia. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <button onClick={() => toast.info("Membuka syarat & ketentuan...")}>
              Syarat & Ketentuan
            </button>
            <span>•</span>
            <button onClick={() => toast.info("Membuka kebijakan privasi...")}>
              Kebijakan Privasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
