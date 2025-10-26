import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Save, X, Camera, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
    birthDate?: string;
    gender?: string;
    occupation?: string;
    city?: string;
  };
  onSave: (data: any) => void;
}

export function EditProfileModal({ isOpen, onClose, userData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    birthDate: userData.birthDate || "",
    gender: userData.gender || "",
    occupation: userData.occupation || "",
    city: userData.city || "Jakarta Selatan"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onClose();
      toast.success("Profil berhasil diperbarui!");
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Edit Informasi Personal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl font-bold">
                {formData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Camera size={14} />
              Ubah Foto
            </Button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="bg-gray-50"
              required
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar size={14} className="text-green-600" />
              Tanggal Lahir
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="bg-gray-50"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Jenis Kelamin</Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label htmlFor="occupation">Pekerjaan</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              placeholder="Masukkan pekerjaan"
              className="bg-gray-50"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin size={14} className="text-purple-600" />
              Kota
            </Label>
            <Select value={formData.city} onValueChange={(value) => handleChange('city', value)}>
              <SelectTrigger className="bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                <SelectItem value="Jakarta Pusat">Jakarta Pusat</SelectItem>
                <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                <SelectItem value="Tangerang">Tangerang</SelectItem>
                <SelectItem value="Bekasi">Bekasi</SelectItem>
                <SelectItem value="Depok">Depok</SelectItem>
                <SelectItem value="Bogor">Bogor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 gap-2"
              disabled={isLoading}
            >
              <X size={16} />
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <Save size={16} />
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}