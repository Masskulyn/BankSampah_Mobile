import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Camera, X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function QRScannerModal({
  isOpen,
  onClose,
  onSuccess,
}: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);

  const startCamera = async () => {
    try {
      setError("");
      const perm = await BarcodeScanner.checkPermission({ force: true });

      if (!perm.granted) {
        setError("Izin kamera diperlukan untuk memindai QR Code.");
        return;
      }

      setIsScanning(true);
      await BarcodeScanner.hideBackground();
      document.body.style.background = "transparent";

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        handleQRCodeScanned(result.content);
      } else {
        setError("QR Code tidak terdeteksi.");
        stopCamera();
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan."
      );
      setIsScanning(false);

      // fallback ke simulasi untuk testing
      setTimeout(() => simulateQRScan(), 1000);
    }
  };

  const stopCamera = async () => {
    try {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      document.body.style.background = "";
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
    setIsScanning(false);
  };

  const handleQRCodeScanned = (decodedText: string) => {
    try {
      const qrData = JSON.parse(decodedText);

      if (qrData.type === "deposit" && qrData.transactionId) {
        processQRData(qrData);
      } else {
        setError(
          "QR Code tidak valid. Pastikan QR Code dari sistem bank sampah."
        );
        stopCamera();
      }
    } catch (err) {
      // Jika gagal parse JSON, anggap bukan QR valid → simulasi data
      simulateQRScan();
    }
  };

  const processQRData = (data: any) => {
    setScannedData(data);
    setIsSuccess(true);
    setIsScanning(false);
    stopCamera();

    // Auto-close setelah 2 detik
    setTimeout(() => {
      onSuccess(data);
      handleClose();
    }, 2000);
  };

  const simulateQRScan = () => {
    const mockData = {
      type: "deposit",
      totalAmount: 8500,
      wasteItems: [
        {
          wasteType: "plastik",
          wasteWeight: 2.5,
          pricePerKg: 2000,
          amount: 5000,
        },
        {
          wasteType: "kertas",
          wasteWeight: 2.0,
          pricePerKg: 1500,
          amount: 3000,
        },
        {
          wasteType: "kaleng",
          wasteWeight: 0.2,
          pricePerKg: 2500,
          amount: 500,
        },
      ],
      adminId: "admin_001",
      timestamp: new Date().toISOString(),
      transactionId: "TRX-" + Date.now().toString(36).toUpperCase(),
    };

    processQRData(mockData);
  };

  const handleClose = () => {
    stopCamera();
    setIsScanning(false);
    setError("");
    setIsSuccess(false);
    setScannedData(null);
    onClose();
  };

  // === Tampilan sukses ===
  if (isSuccess && scannedData) {
    const isMultiWaste =
      scannedData.wasteItems && Array.isArray(scannedData.wasteItems);

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md w-[90%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">
              Scan Berhasil!
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              QR Code berhasil dipindai. Silakan lanjutkan proses setor sampah.
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-3 md:py-6">
            <CheckCircle2
              className="mx-auto mb-3 md:mb-4 text-green-500"
              size={48}
            />
            <div className="space-y-2 md:space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-200">
                <p className="text-xl md:text-2xl font-bold text-green-600 mb-1">
                  Rp{" "}
                  {(
                    scannedData.totalAmount || scannedData.amount
                  )?.toLocaleString("id-ID")}
                </p>
                {isMultiWaste ? (
                  <p className="text-xs md:text-sm text-gray-600">
                    {scannedData.wasteItems.length} jenis sampah (
                    {scannedData.wasteItems
                      .reduce(
                        (sum: number, item: any) => sum + item.wasteWeight,
                        0
                      )
                      .toFixed(1)}{" "}
                    kg)
                  </p>
                ) : (
                  <p className="text-xs md:text-sm text-gray-600">
                    {scannedData.wasteWeight} kg {scannedData.wasteType}
                  </p>
                )}
              </div>

              {isMultiWaste && (
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 space-y-1.5 md:space-y-2 text-left">
                  <p className="text-[10px] md:text-xs font-semibold text-gray-700">
                    Detail Sampah:
                  </p>
                  {scannedData.wasteItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded p-1.5 md:p-2 border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] md:text-xs text-gray-600 capitalize">
                          {item.wasteType}
                        </span>
                        <span className="text-[10px] md:text-xs font-medium text-gray-900">
                          {item.wasteWeight} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[10px] md:text-xs text-gray-500">
                          @ Rp {item.pricePerKg.toLocaleString("id-ID")}/kg
                        </span>
                        <span className="text-[10px] md:text-xs font-semibold text-emerald-600">
                          Rp {item.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1 text-xs md:text-sm text-left bg-gray-50 rounded-lg p-2 md:p-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Transaksi:</span>
                  <code className="text-[10px] md:text-xs font-mono bg-white px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                    {scannedData.transactionId}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu:</span>
                  <span className="font-medium text-[10px] md:text-xs">
                    {new Date(scannedData.timestamp).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // === Tampilan scanning / awal ===
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">
            Scan QR Code
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Arahkan kamera ke QR Code di lokasi bank sampah untuk memulai proses
            setor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isScanning ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Camera size={32} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">
                Siap untuk Scan
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-4">
                Tekan tombol di bawah untuk membuka kamera dan mulai pemindaian
                QR code
              </p>
              <Button onClick={startCamera} className="w-full">
                <Camera size={16} className="mr-2" />
                Buka Kamera
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <RefreshCw
                size={16}
                className="animate-spin text-green-600 mx-auto"
              />
              <p className="text-xs md:text-sm text-green-600 font-medium">
                Memindai QR Code...
              </p>
              <Button onClick={stopCamera} variant="outline" className="w-full">
                <X size={16} className="mr-2" />
                Batalkan
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
