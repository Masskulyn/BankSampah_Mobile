import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Bell, Clock, CheckCircle2, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reminderData: any) => void;
}

export function ReminderModal({ isOpen, onClose, onSuccess }: ReminderModalProps) {
  const [reminderType, setReminderType] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reminderTypes = [
    { value: "deposit", label: "Setor Sampah Rutin", icon: "♻️" },
    { value: "cashout", label: "Penarikan Saldo", icon: "💰" },
    { value: "news", label: "Update Berita Lingkungan", icon: "📰" },
    { value: "tips", label: "Tips Ramah Lingkungan", icon: "💡" }
  ];

  const timeOptions = [
    { value: "daily", label: "Setiap Hari (08:00)" },
    { value: "weekly", label: "Setiap Minggu (Senin 08:00)" },
    { value: "monthly", label: "Setiap Bulan (Tanggal 1)" },
    { value: "custom", label: "Waktu Kustom" }
  ];

  const handleSetReminder = () => {
    if (!reminderType || !reminderTime) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const reminderData = {
        type: reminderType,
        time: reminderTime,
        createdAt: new Date().toISOString()
      };
      
      setIsSuccess(true);
      setIsProcessing(false);
      onSuccess(reminderData);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1000);
  };

  const handleClose = () => {
    setReminderType("");
    setReminderTime("");
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  const selectedReminderType = reminderTypes.find(type => type.value === reminderType);
  const selectedTimeOption = timeOptions.find(option => option.value === reminderTime);

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pengingat Berhasil Diatur!</DialogTitle>
            <DialogDescription>
              Pengingat Anda telah berhasil disimpan dan akan aktif sesuai jadwal yang dipilih.
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto mb-4 text-green-500" size={64} />
            <div className="space-y-2">
              <p className="font-medium">
                {selectedReminderType?.icon} {selectedReminderType?.label}
              </p>
              <p className="text-sm text-gray-600">
                {selectedTimeOption?.label}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell size={20} className="text-orange-500" />
            Atur Pengingat
          </DialogTitle>
          <DialogDescription>
            Tetap terhubung dengan aktivitas ramah lingkungan melalui pengingat yang dapat disesuaikan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Jenis Pengingat</Label>
            <div className="grid grid-cols-1 gap-2">
              {reminderTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setReminderType(type.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    reminderType === type.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Waktu Pengingat</Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Pilih waktu pengingat" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Pengingat akan dikirim melalui notifikasi browser. Pastikan notifikasi diizinkan untuk pengalaman terbaik.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSetReminder}
              disabled={!reminderType || !reminderTime || isProcessing}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </div>
              ) : (
                <>
                  <Bell size={16} className="mr-2" />
                  Atur Pengingat
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}