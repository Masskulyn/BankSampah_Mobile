import { useState, useEffect } from "react";
import { X, Bell, CheckCircle2, AlertCircle, Gift, Trash2, TrendingUp, Info } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "reward";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("ecobank_notifications");
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(
        parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
      );
    } else {
      // Initialize with demo notifications
      const demoNotifications: Notification[] = [
        {
          id: "1",
          type: "success",
          title: "Setoran Berhasil! 🎉",
          message: "Setoran sampah plastik 2.5 kg berhasil. +Rp 5.000 masuk ke saldo Anda.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
        },
        {
          id: "2",
          type: "reward",
          title: "Poin Reward Bertambah! 🎁",
          message: "Anda mendapat 50 poin dari setoran terakhir. Tukarkan dengan hadiah menarik!",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          read: false,
        },
        {
          id: "3",
          type: "info",
          title: "Tips Ramah Lingkungan 💡",
          message: "Tahukah Anda? Memilah sampah dari rumah dapat meningkatkan nilai jual hingga 30%.",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
        },
        {
          id: "4",
          type: "warning",
          title: "Pengingat Setor Sampah ⏰",
          message: "Sudah waktunya setor sampah mingguan Anda. Yuk, raih poin tambahan!",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          read: true,
        },
        {
          id: "5",
          type: "success",
          title: "Pencairan Berhasil ✅",
          message: "Pencairan saldo Rp 50.000 ke rekening BCA telah berhasil diproses.",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
        },
      ];
      setNotifications(demoNotifications);
      localStorage.setItem("ecobank_notifications", JSON.stringify(demoNotifications));
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("ecobank_notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("ecobank_notifications", JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("ecobank_notifications", JSON.stringify(updated));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "reward":
        return <Gift className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? "50" : "100";
    switch (type) {
      case "success":
        return `bg-green-${opacity}`;
      case "info":
        return `bg-blue-${opacity}`;
      case "warning":
        return `bg-orange-${opacity}`;
      case "reward":
        return `bg-purple-${opacity}`;
      default:
        return `bg-gray-${opacity}`;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
      return `${hours} jam yang lalu`;
    } else {
      return `${days} hari yang lalu`;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[101] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">Notifikasi</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-green-100">
                  {unreadCount} belum dibaca
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="w-full text-green-600 hover:bg-green-50 text-xs rounded-lg"
            >
              Tandai Semua Sudah Dibaca
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">
                Tidak Ada Notifikasi
              </h3>
              <p className="text-sm text-gray-500">
                Notifikasi Anda akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-green-50/50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0 h-auto">
                            Baru
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-[10px] text-red-500 hover:text-red-700 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
