import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { useAuth } from "./AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Eye, 
  EyeOff, 
  Check,
  ChevronLeft,
  ChevronRight,
  Recycle,
  Shield,
  Gift,
  Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

export function RegisterView({ onSwitchToLogin }: RegisterViewProps) {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cities = [
    "Jakarta Selatan", "Jakarta Pusat", "Jakarta Utara", 
    "Jakarta Barat", "Jakarta Timur", "Tangerang", 
    "Bekasi", "Depok", "Bogor", "Bandung", "Surabaya", "Medan"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error("Nama lengkap harus diisi!");
      return false;
    }
    if (formData.name.trim().length < 3) {
      toast.error("Nama minimal 3 karakter!");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email harus diisi!");
      return false;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Format email tidak valid!");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Nomor telepon harus diisi!");
      return false;
    }
    if (formData.phone.length < 10) {
      toast.error("Nomor telepon minimal 10 digit!");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      toast.error("Password harus diisi!");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return false;
    }
    if (!formData.city) {
      toast.error("Kota harus dipilih!");
      return false;
    }
    if (!agreeToTerms) {
      toast.error("Anda harus menyetujui syarat dan ketentuan!");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsLoading(true);
    
    const success = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      city: formData.city
    });

    setIsLoading(false);

    if (!success) {
      // Error message is already shown in register function
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format Indonesian phone number
    if (digits.startsWith('0')) {
      return '+62 ' + digits.substring(1);
    } else if (digits.startsWith('62')) {
      return '+' + digits;
    } else {
      return digits;
    }
  };

  const benefits = [
    {
      icon: Recycle,
      title: "Daur Ulang Sampah",
      description: "Ubah sampah menjadi uang dengan mudah"
    },
    {
      icon: Gift,
      title: "Bonus & Reward",
      description: "Dapatkan bonus pendaftaran Rp 5.000"
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Data pribadi terlindungi dengan enkripsi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <Recycle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bergabung dengan EcoBank</h1>
          <p className="text-gray-600">Mulai perjalanan ramah lingkungan Anda</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
              currentStep >= 1 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              {currentStep > 1 ? <Check size={16} /> : '1'}
            </div>
            <div className={`w-12 h-1 rounded transition-colors ${
              currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
              currentStep >= 2 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-gray-900">
              {currentStep === 1 ? "Informasi Pribadi" : "Keamanan & Lokasi"}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {currentStep === 1 ? "Langkah 1 dari 2" : "Langkah 2 dari 2"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-4">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User size={14} className="text-green-600" />
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

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
                      onChange={(e) => handleInputChange('email', e.target.value.toLowerCase())}
                      placeholder="nama@email.com"
                      className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={14} className="text-green-600" />
                      Nomor Telepon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        handleInputChange('phone', formatted);
                      }}
                      placeholder="+62 812-3456-7890"
                      className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  {/* Benefits */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 mt-6">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Gift size={16} />
                      Keuntungan Bergabung
                    </h4>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div className="p-1 bg-green-200 rounded-lg">
                              <Icon size={14} className="text-green-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-900">{benefit.title}</p>
                              <p className="text-xs text-green-700">{benefit.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg gap-2 mt-6"
                  >
                    Lanjutkan
                    <ChevronRight size={16} />
                  </Button>
                </>
              )}

              {/* Step 2: Security & Location */}
              {currentStep === 2 && (
                <>
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
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock size={14} className="text-green-600" />
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Ketik ulang password"
                        className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin size={14} className="text-green-600" />
                      Kota
                    </Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger className="bg-gray-50/80 border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                        <SelectValue placeholder="Pilih kota Anda" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start space-x-3 pt-4">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={setAgreeToTerms}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Saya menyetujui{" "}
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-700 underline"
                          onClick={() => toast.info("Membuka syarat & ketentuan...")}
                        >
                          Syarat & Ketentuan
                        </button>
                        {" "}dan{" "}
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-700 underline"
                          onClick={() => toast.info("Membuka kebijakan privasi...")}
                        >
                          Kebijakan Privasi
                        </button>
                        {" "}EcoBank
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 h-12 gap-2"
                      disabled={isLoading}
                    >
                      <ChevronLeft size={16} />
                      Kembali
                    </Button>
                    
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Mendaftar...
                        </div>
                      ) : (
                        <>
                          Buat Akun
                          <Check size={16} />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* Login Link */}
            <Separator className="my-6" />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-green-600 hover:text-green-700 font-semibold p-0"
                  onClick={onSwitchToLogin}
                >
                  Masuk Sekarang
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2024 EcoBank Indonesia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}