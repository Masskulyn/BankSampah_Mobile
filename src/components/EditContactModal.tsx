import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Phone, Mail, MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactData: {
    phone: string;
    email: string;
    address: string;
  };
  onSave: (data: any) => void;
}

export function EditContactModal({ isOpen, onClose, contactData, onSave }: EditContactModalProps) {
  const [formData, setFormData] = useState(contactData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onClose();
      toast.success("Informasi kontak berhasil diperbarui!");
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="text-blue-600" size={20} />
            Edit Informasi Kontak
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone size={14} className="text-blue-600" />
              Nomor Telepon
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+62 812-3456-7890"
              className="bg-gray-50"
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
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="nama@email.com"
              className="bg-gray-50"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin size={14} className="text-purple-600" />
              Alamat
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Masukkan alamat lengkap..."
              className="bg-gray-50 min-h-20"
              rows={3}
            />
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