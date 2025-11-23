import { Gift, ShoppingBag, Smartphone, Zap, Star, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import RedemptionsView from "./RedemptionsView";
import { postRedemption } from "../utils/api";

interface Reward {
  id: string;
  name: string;
  points: number;
  category: string;
  stock: number;
  image: string;
  description: string;
}

interface RewardsViewProps {
  onBack?: () => void;
}

export function RewardsView({ onBack }: RewardsViewProps = {}) {
  const { user, updateUser } = useAuth();

  // Load user points from localStorage per user (fallback to demo value)
  const getStoredPoints = () => {
    try {
      if (user && user.id) {
        const key = `ecobank_points_${user.id}`;
        const v = localStorage.getItem(key);
        if (v) return parseInt(v, 10);
      }
      const guest = localStorage.getItem("ecobank_guest_points");
      if (guest) return parseInt(guest, 10);
    } catch (e) {
      console.error(e);
    }
    return 7850;
  };

  const [userPoints, setUserPoints] = useState<number>(getStoredPoints());

  useEffect(() => {
    // persist points whenever they change
    try {
      if (user && user.id) {
        localStorage.setItem(`ecobank_points_${user.id}`, String(userPoints));
      } else {
        localStorage.setItem("ecobank_guest_points", String(userPoints));
      }
    } catch (e) {
      console.error(e);
    }
    // Optionally update user record if you want points stored there
    if (user && updateUser) {
      // store points in user object (will be saved to localStorage via updateUser)
      try {
        // @ts-ignore - add points field dynamically for demo
        updateUser({ points: userPoints } as any);
      } catch (e) {
        // ignore
      }
    }
  }, [userPoints]);

  const initialRewards: Reward[] = [
    {
      id: "1",
      name: "Pulsa Rp 10.000",
      points: 1000,
      category: "Pulsa",
      stock: 50,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
      description: "Pulsa untuk semua operator"
    },
    {
      id: "2",
      name: "Voucher E-commerce Rp 25.000",
      points: 2500,
      category: "Voucher",
      stock: 30,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
      description: "Berlaku untuk berbagai platform"
    },
    {
      id: "3",
      name: "Saldo GoPay Rp 20.000",
      points: 2000,
      category: "E-wallet",
      stock: 40,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      description: "Langsung masuk ke akun GoPay"
    },
    {
      id: "4",
      name: "Pulsa Rp 50.000",
      points: 5000,
      category: "Pulsa",
      stock: 20,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
      description: "Pulsa untuk semua operator"
    },
    {
      id: "5",
      name: "Voucher Grab Rp 30.000",
      points: 3000,
      category: "Voucher",
      stock: 25,
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
      description: "Untuk transportasi atau makanan"
    },
    {
      id: "6",
      name: "Saldo OVO Rp 50.000",
      points: 5000,
      category: "E-wallet",
      stock: 15,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
      description: "Langsung masuk ke akun OVO"
    }
  ];

  const categories = ["Semua", "Pulsa", "E-wallet", "Voucher"];
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [rewardsState, setRewardsState] = useState<Reward[]>(initialRewards);

  const filteredRewards = selectedCategory === "Semua"
    ? rewardsState
    : rewardsState.filter(r => r.category === selectedCategory);

  const [showRedeemDialog, setShowRedeemDialog] = useState<boolean>(false);
  const [redeemTarget, setRedeemTarget] = useState<Reward | null>(null);

  const openRedeemDialog = (reward: Reward) => {
    if (userPoints < reward.points) {
      toast.error(`Poin tidak cukup. Anda membutuhkan ${reward.points - userPoints} poin lagi.`);
      return;
    }
    setRedeemTarget(reward);
    setShowRedeemDialog(true);
  };

  const performRedeem = async () => {
    const reward = redeemTarget;
    if (!reward) return;

    // Deduct points locally first
    const newPoints = userPoints - reward.points;
    setUserPoints(newPoints);

    // Save redemption record (pending) locally
    const redemptionsKey = "ecobank_redemptions";
    try {
      const existing = localStorage.getItem(redemptionsKey);
      const arr = existing ? JSON.parse(existing) : [];
      const record = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        userId: user?.id || "guest",
        rewardId: reward.id,
        rewardName: reward.name,
        points: reward.points,
        date: new Date().toISOString(),
        status: "pending"
      };
      arr.push(record);
      localStorage.setItem(redemptionsKey, JSON.stringify(arr));
      toast.success(`Penukaran terdaftar! ${reward.points.toLocaleString()} poin terpakai. Menunggu proses.`);

      // Call backend API to process redemption
      try {
        const resp = await postRedemption({
          id: record.id,
          userId: record.userId,
          rewardId: record.rewardId,
          rewardName: record.rewardName,
          points: record.points,
          date: record.date,
        });

        // On success update local record to completed
        const raw2 = localStorage.getItem(redemptionsKey);
        const arr2 = raw2 ? JSON.parse(raw2) : [];
        const idx = arr2.findIndex((r: any) => r.id === record.id);
        if (idx !== -1) {
          arr2[idx].status = resp.success ? "completed" : "failed";
          arr2[idx].completedAt = resp.processedAt || new Date().toISOString();
          localStorage.setItem(redemptionsKey, JSON.stringify(arr2));
          if (resp.success) {
            toast.success(`Penukaran ${record.rewardName} berhasil diproses oleh server.`);
          } else {
            toast.error(`Penukaran gagal diproses oleh server.`);
          }
        }
      } catch (apiErr) {
        // Keep record pending and inform user
        console.error("API error", apiErr);
        toast.info("Penukaran disimpan sebagai pending. Akan dicoba sinkronisasi nanti.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan saat menyimpan penukaran.");
    }

    // Decrement stock in UI state
    setRewardsState((prev) => prev.map((r) => r.id === reward.id ? { ...r, stock: Math.max(0, r.stock - 1) } : r));

    setShowRedeemDialog(false);
    setRedeemTarget(null);
  };

  // Simulate backend sync: after delay, mark pending redemption as completed
  const simulateSync = (redemptionId: string) => {
    // Simulate network latency + processing
    setTimeout(() => {
      try {
        const key = "ecobank_redemptions";
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const arr = JSON.parse(raw);
        const idx = arr.findIndex((r: any) => r.id === redemptionId);
        if (idx === -1) return;
        arr[idx].status = "completed";
        arr[idx].completedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(arr));
        toast.success(`Penukaran ${arr[idx].rewardName} telah selesai diproses.`);
      } catch (e) {
        console.error(e);
      }
    }, 3000 + Math.floor(Math.random() * 4000));
  };

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
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <Gift className="w-8 h-8 md:w-10 md:h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tukar Poin</h1>
            <p className="text-sm md:text-base text-purple-100">Tukarkan poin Anda dengan hadiah menarik</p>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mt-4 md:mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-purple-100 text-xs md:text-sm">Poin Anda</div>
              <div className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                {userPoints.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-purple-100 text-xs md:text-sm">Level</div>
              <div className="text-xl md:text-2xl font-bold">5</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress ke Level 6</span>
              <span>78.5%</span>
            </div>
            <Progress value={78.5} className="h-3 bg-white/30" />
            <p className="text-xs text-purple-100">
              2,150 poin lagi untuk unlock hadiah eksklusif!
            </p>
          </div>
        </div>
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Penukaran</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            {redeemTarget ? (
              <>
                Tukar <strong>{redeemTarget.name}</strong> dengan <strong>{redeemTarget.points.toLocaleString()}</strong> poin?
                <div className="text-sm text-gray-500 mt-2">Stok tersisa: {redeemTarget.stock}</div>
              </>
            ) : (
              ""
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>Batal</Button>
            <Button variant="destructive" onClick={performRedeem}>Tukar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redemptions History (inline) */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Riwayat Penukaran</h3>
        <RedemptionsView />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full whitespace-nowrap ${
              selectedCategory === category 
                ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                : ""
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Rewards */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-900">🔥 Penawaran Terbatas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4">
            <div className="bg-orange-500 text-white w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg">
              50%
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Diskon 50% Voucher Tokopedia</p>
              <p className="text-sm text-gray-600">Hanya 1.250 poin (dari 2.500)</p>
              <Badge variant="destructive" className="mt-1">24 jam lagi</Badge>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-4">
            <div className="bg-purple-500 text-white w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg">
              2x
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Double Poin Weekend</p>
              <p className="text-sm text-gray-600">Setor sampah dapat poin 2x lipat</p>
              <Badge variant="secondary" className="mt-1">Sabtu & Minggu</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredRewards.map((reward) => {
          const canAfford = userPoints >= reward.points;
          
          return (
            <Card key={reward.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={reward.image} 
                  alt={reward.name}
                  className="w-full h-40 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-purple-600">
                  {reward.category}
                </Badge>
                {!canAfford && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-gray-900">
                      🔒 Butuh {reward.points - userPoints} poin lagi
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{reward.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-purple-600 font-bold">
                    <Star className="w-5 h-5 fill-current" />
                    {reward.points.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Stok: {reward.stock}
                  </div>
                </div>
                
                <Button 
                  className={`w-full ${
                    canAfford 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                      : "bg-gray-300 text-gray-500"
                  }`}
                  disabled={!canAfford}
                  onClick={() => openRedeemDialog(reward)}
                >
                  {canAfford ? (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Tukar Sekarang
                    </>
                  ) : (
                    "Poin Tidak Cukup"
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Earn More Points CTA */}
      <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Kumpulkan Lebih Banyak Poin!</h3>
            <p className="text-green-100 text-sm">
              Setor sampah, ajak teman, dan ikuti tantangan untuk mendapat poin bonus
            </p>
          </div>
          <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
            Lihat Cara
          </Button>
        </div>
      </Card>
    </div>
  );
}
