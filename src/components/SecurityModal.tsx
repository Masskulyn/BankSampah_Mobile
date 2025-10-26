import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Shield, Lock, Key, Fingerprint, Smartphone, Eye, EyeOff, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  const [securitySettings, setSecuritySettings] = useState({
    biometric: true,
    twoFactor: false,
    autoLock: true,
    loginAlerts: true
  });

  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [changePIN, setChangePIN] = useState({
    currentPIN: "",
    newPIN: "",
    confirmPIN: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(false);

  const handleSecurityChange = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    
    const messages = {
      biometric: `Autentikasi biometrik ${value ? 'diaktifkan' : 'dinonaktifkan'}`,
      twoFactor: `Two-factor authentication ${value ? 'diaktifkan' : 'dinonaktifkan'}`,
      autoLock: `Auto-lock ${value ? 'diaktifkan' : 'dinonaktifkan'}`,
      loginAlerts: `Notifikasi login ${value ? 'diaktifkan' : 'dinonaktifkan'}`
    };
    
    toast.success(messages[key as keyof typeof messages]);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.error("Password baru tidak cocok!");
      return;
    }

    if (changePassword.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setChangePassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password berhasil diubah!");
    }, 1000);
  };

  const handlePINChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (changePIN.newPIN !== changePIN.confirmPIN) {
      toast.error("PIN baru tidak cocok!");
      return;
    }

    if (changePIN.newPIN.length !== 6) {
      toast.error("PIN harus 6 digit!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setChangePIN({ currentPIN: "", newPIN: "", confirmPIN: "" });
      toast.success("PIN berhasil diubah!");
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="text-green-600" size={20} />
            Keamanan & Privasi
          </DialogTitle>
        </DialogHeader>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="flex-1 text-sm"
          >
            Pengaturan
          </Button>
          <Button
            variant={activeTab === "password" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("password")}
            className="flex-1 text-sm"
          >
            Password
          </Button>
          <Button
            variant={activeTab === "pin" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("pin")}
            className="flex-1 text-sm"
          >
            PIN
          </Button>
        </div>

        {/* Security Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Fingerprint size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Autentikasi Biometrik</p>
                    <p className="text-sm text-gray-500">Sidik jari / Face ID</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.biometric}
                  onCheckedChange={(value) => handleSecurityChange('biometric', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Verifikasi ganda via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.twoFactor}
                  onCheckedChange={(value) => handleSecurityChange('twoFactor', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lock size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Auto-Lock</p>
                    <p className="text-sm text-gray-500">Kunci otomatis setelah 5 menit</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.autoLock}
                  onCheckedChange={(value) => handleSecurityChange('autoLock', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Smartphone size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-gray-500">Notifikasi login baru</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={changePassword.currentPassword}
                  onChange={(e) => setChangePassword(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="bg-gray-50 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={changePassword.newPassword}
                  onChange={(e) => setChangePassword(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-gray-50 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={changePassword.confirmPassword}
                  onChange={(e) => setChangePassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-gray-50 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-green-600 hover:bg-green-700 mt-6"
              disabled={isLoading}
            >
              <Save size={16} />
              {isLoading ? "Mengubah..." : "Ubah Password"}
            </Button>
          </form>
        )}

        {/* Change PIN Tab */}
        {activeTab === "pin" && (
          <form onSubmit={handlePINChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPIN">PIN Saat Ini</Label>
              <Input
                id="currentPIN"
                type="password"
                maxLength={6}
                value={changePIN.currentPIN}
                onChange={(e) => setChangePIN(prev => ({ ...prev, currentPIN: e.target.value.replace(/\D/g, '') }))}
                className="bg-gray-50 text-center text-xl tracking-wider"
                placeholder="••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPIN">PIN Baru</Label>
              <Input
                id="newPIN"
                type="password"
                maxLength={6}
                value={changePIN.newPIN}
                onChange={(e) => setChangePIN(prev => ({ ...prev, newPIN: e.target.value.replace(/\D/g, '') }))}
                className="bg-gray-50 text-center text-xl tracking-wider"
                placeholder="••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPIN">Konfirmasi PIN Baru</Label>
              <Input
                id="confirmPIN"
                type="password"
                maxLength={6}
                value={changePIN.confirmPIN}
                onChange={(e) => setChangePIN(prev => ({ ...prev, confirmPIN: e.target.value.replace(/\D/g, '') }))}
                className="bg-gray-50 text-center text-xl tracking-wider"
                placeholder="••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2 bg-green-600 hover:bg-green-700 mt-6"
              disabled={isLoading}
            >
              <Key size={16} />
              {isLoading ? "Mengubah..." : "Ubah PIN"}
            </Button>
          </form>
        )}

        {/* Close Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full gap-2"
          >
            <X size={16} />
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}