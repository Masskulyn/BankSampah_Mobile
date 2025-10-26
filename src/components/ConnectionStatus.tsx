import { useEffect, useState } from "react";
import { Wifi, WifiOff, CloudUpload } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingUploads, setPendingUploads] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check localStorage for pending uploads (mock)
    const checkPendingUploads = () => {
      const pending = localStorage.getItem('pendingUploads');
      if (pending) {
        setPendingUploads(parseInt(pending));
      }
    };
    checkPendingUploads();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingUploads === 0) {
    return null; // Don't show anything if online and no pending uploads
  }

  return (
    <div className="fixed top-16 md:top-20 left-2 right-2 md:left-4 md:right-4 z-50 animate-in slide-in-from-top duration-300">
      {!isOnline ? (
        <Alert className="bg-red-50 border-red-200 shadow-lg">
          <WifiOff className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
          <AlertDescription className="ml-2 text-red-800 text-xs md:text-sm">
            <span className="font-bold">Mode Offline</span> - Tidak terhubung ke internet
          </AlertDescription>
        </Alert>
      ) : pendingUploads > 0 ? (
        <Alert className="bg-blue-50 border-blue-200 shadow-lg">
          <CloudUpload className="h-4 w-4 md:h-5 md:w-5 text-blue-600 animate-pulse" />
          <AlertDescription className="ml-2 text-blue-800 text-xs md:text-sm">
            <span className="font-bold">Mengunggah...</span> {pendingUploads} transaksi menunggu
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
