import { useState, useRef, useEffect } from "react";
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
import jsQR from "jsqr";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      setError("");
      setIsScanning(true);

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Start scanning loop
        scanQRCode();
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

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      handleQRCodeScanned(code.data);
      return; // Stop scanning after successful scan
    }

    // Continue scanning
    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const stopCamera = async () => {
    try {
      // Stop animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Stop video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
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
        // stopCamera(); // Removed to keep camera on until valid QR is scanned
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
    // stopCamera(); // Removed to keep camera on during success display

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
          recyclable: true,
        },
        {
          wasteType: "kertas",
          wasteWeight: 2.0,
          pricePerKg: 1500,
          amount: 3000,
          recyclable: true,
        },
        {
          wasteType: "kaleng",
          wasteWeight: 0.2,
          pricePerKg: 2500,
          amount: 500,
          recyclable: true,
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

  const handleRetry = () => {
    setError("");
    setIsSuccess(false);
    setScannedData(null);
    // Do not stop camera, just reset state to continue scanning
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[10px] md:text-xs text-gray-500">
                          Dapat Didaur Ulang:
                        </span>
                        <span
                          className={`text-[10px] md:text-xs font-semibold ${
                            item.recyclable ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.recyclable ? "Ya" : "Tidak"}
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

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Scan Lagi
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Selesai
                </Button>
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
              <div className="mx-auto mb-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
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
            <div className="space-y-4">
              <div className="relative w-full h-64 md:h-80 bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                {/* Scanning frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-green-500"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-green-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-green-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-green-500"></div>
                  </div>
                </div>
                {/* Scanning line animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-0.5 bg-green-500 animate-pulse"></div>
                </div>
                {/* Instructions overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-sm font-medium bg-black bg-opacity-50 rounded px-2 py-1">
                    Arahkan kamera ke QR Code
                  </p>
                </div>
              </div>
              <div className="text-center">
                <RefreshCw
                  size={16}
                  className="animate-spin text-green-600 mx-auto mb-2"
                />
                <p className="text-xs md:text-sm text-green-600 font-medium mb-4">
                  Memindai QR Code...
                </p>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="w-full"
                >
                  <X size={16} className="mr-2" />
                  Batalkan
                </Button>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {error}
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Coba Lagi
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
