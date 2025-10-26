import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { QrCode, Download, RefreshCw, Copy, CheckCircle2, Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner@2.0.3";
import QRCode from "qrcode";

interface WasteItem {
  id: string;
  wasteType: string;
  wasteWeight: number;
  pricePerKg: number;
  amount: number;
}

interface QRData {
  type: 'deposit' | 'cashout';
  totalAmount: number;
  wasteItems: Array<{
    wasteType: string;
    wasteWeight: number;
    pricePerKg: number;
    amount: number;
  }>;
  adminId: string;
  timestamp: string;
  transactionId: string;
}

interface QRCodeGeneratorProps {
  adminId: string;
}

export function QRCodeGenerator({ adminId }: QRCodeGeneratorProps) {
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([
    {
      id: '1',
      wasteType: 'plastik',
      wasteWeight: 0,
      pricePerKg: 2000,
      amount: 0
    }
  ]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const wasteTypes = [
    { value: "plastik", label: "Plastik", price: 2000 },
    { value: "kertas", label: "Kertas", price: 1500 },
    { value: "botol", label: "Botol Kaca", price: 3000 },
    { value: "kaleng", label: "Kaleng", price: 2500 },
    { value: "elektronik", label: "Elektronik", price: 5000 },
    { value: "kain", label: "Kain/Tekstil", price: 1000 },
  ];

  const generateTransactionId = () => {
    return 'TRX-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  const addWasteItem = () => {
    const newItem: WasteItem = {
      id: Date.now().toString(),
      wasteType: 'plastik',
      wasteWeight: 0,
      pricePerKg: 2000,
      amount: 0
    };
    setWasteItems([...wasteItems, newItem]);
    toast.success("Item sampah baru ditambahkan");
  };

  const removeWasteItem = (id: string) => {
    if (wasteItems.length === 1) {
      toast.error("Minimal harus ada 1 jenis sampah");
      return;
    }
    setWasteItems(wasteItems.filter(item => item.id !== id));
    toast.success("Item sampah dihapus");
  };

  const updateWasteItem = (id: string, field: keyof WasteItem, value: any) => {
    setWasteItems(wasteItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Update price when waste type changes
        if (field === 'wasteType') {
          const type = wasteTypes.find(w => w.value === value);
          if (type) {
            updatedItem.pricePerKg = type.price;
            updatedItem.amount = updatedItem.wasteWeight * type.price;
          }
        }
        
        // Recalculate amount when weight changes
        if (field === 'wasteWeight') {
          updatedItem.amount = parseFloat(value || 0) * updatedItem.pricePerKg;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return wasteItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalWeight = () => {
    return wasteItems.reduce((sum, item) => sum + item.wasteWeight, 0);
  };

  const handleGenerateQR = async () => {
    // Validation
    const hasEmptyWeight = wasteItems.some(item => !item.wasteWeight || item.wasteWeight <= 0);
    if (hasEmptyWeight) {
      toast.error("Pastikan semua berat sampah sudah diisi dengan nilai yang valid!");
      return;
    }

    setIsGenerating(true);

    try {
      const txId = generateTransactionId();
      setTransactionId(txId);

      const qrData: QRData = {
        type: 'deposit',
        totalAmount: getTotalAmount(),
        wasteItems: wasteItems.map(item => ({
          wasteType: item.wasteType,
          wasteWeight: item.wasteWeight,
          pricePerKg: item.pricePerKg,
          amount: item.amount
        })),
        adminId,
        timestamp: new Date().toISOString(),
        transactionId: txId
      };

      // Generate QR code
      const qrString = JSON.stringify(qrData);
      const qrDataUrl = await QRCode.toDataURL(qrString, {
        width: 400,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrDataUrl);
      toast.success("QR Code berhasil dibuat! 🎉");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Gagal membuat QR code. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `deposit-qr-${transactionId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code berhasil diunduh!");
  };

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    toast.success("ID Transaksi disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setWasteItems([
      {
        id: '1',
        wasteType: 'plastik',
        wasteWeight: 0,
        pricePerKg: 2000,
        amount: 0
      }
    ]);
    setQrCodeUrl("");
    setTransactionId("");
    setCopied(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
      {/* QR Generator Form */}
      <Card className="p-3 md:p-6 bg-white shadow-lg">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg md:rounded-xl">
            <QrCode className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 text-sm md:text-base">Generator QR Code</h3>
            <p className="text-xs md:text-sm text-gray-500">Buat QR untuk setoran sampah</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-300px)] overflow-y-auto pr-1 md:pr-2">
          {/* Waste Items List */}
          {wasteItems.map((item, index) => (
            <Card key={item.id} className="p-3 md:p-4 bg-gray-50 border border-gray-200 md:border-2">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                  <span className="font-semibold text-gray-900 text-xs md:text-sm">Sampah #{index + 1}</span>
                </div>
                {wasteItems.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeWasteItem(item.id)}
                    className="h-7 w-7 p-0 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2 md:space-y-3">
                <div>
                  <Label htmlFor={`wasteType-${item.id}`} className="text-xs">Jenis Sampah</Label>
                  <Select 
                    value={item.wasteType} 
                    onValueChange={(value) => updateWasteItem(item.id, 'wasteType', value)}
                  >
                    <SelectTrigger className="mt-1 md:mt-1.5 h-8 md:h-9 text-xs md:text-sm">
                      <SelectValue placeholder="Pilih jenis sampah" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-xs md:text-sm">
                          {type.label} - Rp {type.price.toLocaleString('id-ID')}/kg
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`wasteWeight-${item.id}`} className="text-xs">Berat (kg)</Label>
                  <Input
                    id={`wasteWeight-${item.id}`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Contoh: 2.5"
                    value={item.wasteWeight || ''}
                    onChange={(e) => updateWasteItem(item.id, 'wasteWeight', parseFloat(e.target.value) || 0)}
                    className="mt-1 md:mt-1.5 h-8 md:h-9 text-xs md:text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Subtotal</Label>
                  <div className="mt-1 md:mt-1.5 h-8 md:h-9 px-2 md:px-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center">
                    <span className="font-semibold text-emerald-700 text-xs md:text-sm">
                      Rp {item.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Add Button */}
          <Button
            onClick={addWasteItem}
            variant="outline"
            className="w-full h-10 border-dashed border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 text-xs md:text-sm px-3 md:px-4"
          >
            <Plus className="w-4 h-4 mr-1.5 shrink-0" />
            <span className="truncate">Tambah Jenis Sampah</span>
          </Button>

          {/* Total Summary */}
          <Card className="p-3 md:p-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            <div className="space-y-1.5 md:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-white/90">Total Berat:</span>
                <span className="font-bold text-sm md:text-base">{getTotalWeight().toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t border-white/20">
                <span className="font-semibold text-sm md:text-base">Total Nilai:</span>
                <span className="text-lg md:text-xl font-bold">
                  Rp {getTotalAmount().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1 md:pt-2">
            <Button
              onClick={handleGenerateQR}
              disabled={isGenerating || wasteItems.some(item => !item.wasteWeight || item.wasteWeight <= 0)}
              className="flex-1 min-w-0 h-10 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs md:text-sm px-3 md:px-4"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
                  <span className="truncate">Membuat...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-1.5 shrink-0" />
                  <span className="truncate">Buat QR Code</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 h-10 w-10 p-0 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* QR Display */}
      <Card className="p-3 md:p-6 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <div>
            <h3 className="text-gray-900 text-sm md:text-base">QR Code Preview</h3>
            <p className="text-xs md:text-sm text-gray-500">Siap untuk di-scan pengguna</p>
          </div>
          {qrCodeUrl && (
            <Button
              size="sm"
              onClick={handleDownloadQR}
              className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs md:text-sm px-3"
            >
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 shrink-0" />
              <span className="truncate">Unduh</span>
            </Button>
          )}
        </div>

        {qrCodeUrl ? (
          <div className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-md flex items-center justify-center">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 md:w-64 md:h-64" />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 space-y-2 md:space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs md:text-sm text-gray-600">ID Transaksi:</span>
                <div className="flex items-center gap-1 md:gap-2">
                  <code className="text-[10px] md:text-xs font-mono bg-gray-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                    {transactionId}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyTransactionId}
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Waste Items Detail */}
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-[10px] md:text-xs font-semibold text-gray-700 mb-1 md:mb-2">Detail Sampah:</p>
                {wasteItems.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-md md:rounded-lg p-1.5 md:p-2 space-y-0.5 md:space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs text-gray-600">
                        {wasteTypes.find(w => w.value === item.wasteType)?.label}
                      </span>
                      <span className="text-[10px] md:text-xs font-medium text-gray-900">
                        {item.wasteWeight} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs text-gray-500">
                        @ Rp {item.pricePerKg.toLocaleString('id-ID')}/kg
                      </span>
                      <span className="text-[10px] md:text-xs font-semibold text-emerald-600">
                        Rp {item.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t border-gray-200">
                <span className="text-xs md:text-sm font-medium text-gray-700">Total Berat:</span>
                <span className="font-bold text-gray-900 text-xs md:text-sm">
                  {getTotalWeight().toFixed(1)} kg
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t-2 border-emerald-200">
                <span className="font-semibold text-gray-900 text-xs md:text-sm">Total Nilai:</span>
                <span className="text-base md:text-lg font-bold text-green-600">
                  Rp {getTotalAmount().toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-2 md:p-3 space-y-1.5 md:space-y-2">
              <p className="text-[10px] md:text-xs text-blue-800 font-semibold">
                💡 Cara Penggunaan:
              </p>
              <ol className="text-[10px] md:text-xs text-blue-700 space-y-0.5 md:space-y-1 pl-3 md:pl-4 list-decimal">
                <li>Tunjukkan QR code ini ke pengguna</li>
                <li>Pengguna membuka aplikasi dan klik "Scan QR"</li>
                <li>Arahkan kamera ke QR code ini</li>
                <li>Saldo pengguna otomatis bertambah</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="h-48 md:h-64 flex flex-col items-center justify-center text-gray-400">
            <QrCode className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-3 opacity-30" />
            <p className="text-xs md:text-sm">QR Code akan muncul di sini</p>
            <p className="text-[10px] md:text-xs mt-1">Isi form di sebelah kiri untuk membuat QR</p>
          </div>
        )}
      </Card>
    </div>
  );
}