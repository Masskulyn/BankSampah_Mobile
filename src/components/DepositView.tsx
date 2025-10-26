import { Trash2, QrCode, MapPin, Camera, TrendingUp, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface DepositViewProps {
  onScanQR: () => void;
  onBack?: () => void;
}

export function DepositView({ onScanQR, onBack }: DepositViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const wasteCategories = [
    {
      id: "plastic",
      name: "Plastik",
      icon: "🧴",
      price: "Rp 3.000/kg",
      examples: ["Botol plastik", "Kemasan makanan", "Kantong plastik"],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "paper",
      name: "Kertas",
      icon: "📄",
      price: "Rp 2.000/kg",
      examples: ["Koran", "Majalah", "Kardus"],
      color: "from-amber-500 to-amber-600"
    },
    {
      id: "metal",
      name: "Logam",
      icon: "🔧",
      price: "Rp 5.000/kg",
      examples: ["Kaleng", "Aluminium", "Besi tua"],
      color: "from-gray-500 to-gray-600"
    },
    {
      id: "glass",
      name: "Kaca",
      icon: "🍾",
      price: "Rp 1.500/kg",
      examples: ["Botol kaca", "Pecahan kaca", "Toples"],
      color: "from-green-500 to-green-600"
    },
    {
      id: "electronics",
      name: "Elektronik",
      icon: "📱",
      price: "Rp 10.000/kg",
      examples: ["HP bekas", "Charger", "Kabel"],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "organic",
      name: "Organik",
      icon: "🌿",
      price: "Rp 500/kg",
      examples: ["Sisa sayuran", "Daun kering", "Ranting"],
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const depositLocations = [
    {
      id: 1,
      name: "UNIS Tangerang - Cabang Utara",
      address: "Jl. Raya Serpong No. 45",
      distance: "1.2 km",
      hours: "08:00 - 17:00",
      status: "Buka"
    },
    {
      id: 2,
      name: "UNIS Tangerang - Cabang Selatan",
      address: "Jl. BSD Green Office No. 12",
      distance: "2.5 km",
      hours: "08:00 - 17:00",
      status: "Buka"
    },
    {
      id: 3,
      name: "UNIS Tangerang - Cabang Barat",
      address: "Jl. Gading Serpong Boulevard",
      distance: "3.8 km",
      hours: "08:00 - 17:00",
      status: "Tutup"
    }
  ];

  const recentDeposits = [
    {
      id: 1,
      date: "2025-01-12",
      category: "Plastik",
      weight: 5.5,
      points: 16500,
      status: "verified"
    },
    {
      id: 2,
      date: "2025-01-08",
      category: "Kertas",
      weight: 8.2,
      points: 16400,
      status: "verified"
    },
    {
      id: 3,
      date: "2025-01-05",
      category: "Logam",
      weight: 3.0,
      points: 15000,
      status: "verified"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </Button>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Setor Sampah</h1>
            <p className="text-sm md:text-base text-green-100">Tukar sampah Anda menjadi uang!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-green-100 text-xs md:text-sm">Total Setoran</div>
            <div className="text-lg md:text-2xl font-bold">78 kg</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-green-100 text-xs md:text-sm">Bulan Ini</div>
            <div className="text-lg md:text-2xl font-bold">12 kg</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-green-100 text-xs md:text-sm">Poin Didapat</div>
            <div className="text-lg md:text-2xl font-bold">7,850</div>
          </div>
        </div>
      </div>

      {/* Quick Action - Scan QR */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center">
            <QrCode className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Scan QR untuk Setor Sampah</h3>
            <p className="text-gray-600 text-sm">
              Scan QR code di lokasi setoran untuk memulai proses
            </p>
          </div>
          <Button
            onClick={onScanQR}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
          >
            <Camera className="w-5 h-5 mr-2" />
            Scan QR
          </Button>
        </div>
      </Card>

      {/* Waste Categories */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
        <h2 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Kategori Sampah & Harga</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {wasteCategories.map((category) => (
            <Card
              key={category.id}
              className={`p-3 md:p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                selectedCategory === category.id ? "ring-2 ring-green-500" : ""
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl mb-1.5 md:mb-2">{category.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{category.name}</h3>
                <Badge className={`bg-gradient-to-r ${category.color} text-white mb-2 text-xs`}>
                  {category.price}
                </Badge>
                {selectedCategory === category.id && (
                  <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Contoh:</p>
                    <ul className="text-xs text-gray-500 space-y-0.5 md:space-y-1">
                      {category.examples.map((example, idx) => (
                        <li key={idx}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Deposit Locations */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Lokasi Setoran Terdekat
        </h2>
        <div className="space-y-3">
          {depositLocations.map((location) => (
            <Card key={location.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{location.name}</h3>
                    <Badge variant={location.status === "Buka" ? "default" : "secondary"} 
                           className={location.status === "Buka" ? "bg-green-500" : ""}>
                      {location.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {location.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {location.hours}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Petunjuk Arah
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Deposits */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Setoran Terakhir
        </h2>
        <div className="space-y-3">
          {recentDeposits.map((deposit) => (
            <div key={deposit.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{deposit.category} - {deposit.weight} kg</div>
                  <div className="text-sm text-gray-600">
                    {new Date(deposit.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">+{deposit.points.toLocaleString()} poin</div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Terverifikasi
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <h3 className="font-bold text-gray-900 mb-3">💡 Tips Setor Sampah</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Pastikan sampah sudah dibersihkan dan dikeringkan</li>
          <li>• Pisahkan sampah berdasarkan kategori untuk harga terbaik</li>
          <li>• Bawa sampah di pagi hari untuk menghindari antrian</li>
          <li>• Simpan bukti setoran untuk klaim poin</li>
        </ul>
      </Card>
    </div>
  );
}
