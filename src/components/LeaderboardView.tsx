import { Trophy, Medal, TrendingUp, Star, Award, Crown, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  wasteDeposited: number;
  rank: number;
  badges: string[];
  level: number;
}

interface LeaderboardViewProps {
  onBack?: () => void;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalEarnings?: number;
  wasteDeposited?: number;
}

export function LeaderboardView({ onBack }: LeaderboardViewProps = {}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserPoints, setCurrentUserPoints] = useState<number>(0);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    try {
      // Get all registered users from localStorage
      const usersJson = localStorage.getItem("ecobank_users");
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      // Get current user from AuthContext or localStorage
      const currentUserJson = localStorage.getItem("currentUser");
      const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

      // Build leaderboard with user points and stats (excluding admin)
      const leaderboardData = users
        .filter(user => user.role !== "admin") // Exclude admin from leaderboard
        .map((user) => {
          const userPoints = parseInt(localStorage.getItem(`ecobank_points_${user.id}`) || "0");
          const userTransactionsJson = localStorage.getItem(`ecobank_transactions_${user.id}`);
          const userTransactions = userTransactionsJson ? JSON.parse(userTransactionsJson) : [];
          
          // Calculate total waste deposited from transactions
          const totalWaste = userTransactions.reduce((sum: number, tx: any) => {
            return sum + (tx.amount || 0);
          }, 0);

          // Assign level based on points (every 1000 points = 1 level, max level 10)
          const level = Math.min(Math.floor(userPoints / 1000) + 1, 10);

          // Assign badges based on criteria
          const badges = [];
          if (totalWaste >= 100) badges.push("eco-warrior");
          if (userPoints >= 5000) badges.push("consistent");
          if (userPoints >= 10000) badges.push("top-contributor");
          if (userPoints >= 500) badges.push("beginner");
          if (totalWaste >= 500) badges.push("master");

          return {
            id: user.id,
            name: user.name,
            points: userPoints,
            wasteDeposited: totalWaste,
            rank: 0, // will be assigned after sorting
            badges: badges,
            level: level
          };
        });

      // Sort by points descending, then assign ranks
      leaderboardData.sort((a, b) => b.points - a.points);
      leaderboardData.forEach((user, index) => {
        user.rank = index + 1;
      });

      setLeaderboard(leaderboardData);

      // Find current user's rank and points
      if (currentUser) {
        const currentUserInLeaderboard = leaderboardData.find(u => u.id === currentUser.id);
        if (currentUserInLeaderboard) {
          setCurrentUserRank(currentUserInLeaderboard.rank);
          setCurrentUserPoints(currentUserInLeaderboard.points);
        }
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  const mockLeaderboard: LeaderboardUser[] = leaderboard.length > 0 ? leaderboard : [
    {
      id: "1",
      name: "Ahmad Santoso",
      points: 15240,
      wasteDeposited: 152,
      rank: 1,
      badges: ["eco-warrior", "consistent", "top-contributor"],
      level: 8
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      points: 14850,
      wasteDeposited: 148,
      rank: 2,
      badges: ["eco-warrior", "top-contributor"],
      level: 7
    },
    {
      id: "3",
      name: "Budi Pratama",
      points: 13920,
      wasteDeposited: 139,
      rank: 3,
      badges: ["consistent", "top-contributor"],
      level: 7
    },
    {
      id: "4",
      name: "Dewi Lestari",
      points: 12450,
      wasteDeposited: 124,
      rank: 4,
      badges: ["eco-warrior"],
      level: 6
    },
    {
      id: "5",
      name: "Andi Wijaya",
      points: 11230,
      wasteDeposited: 112,
      rank: 5,
      badges: ["consistent"],
      level: 6
    }
  ];

  const achievements = [
    { id: "eco-warrior", name: "Eco Warrior", icon: "🌿", description: "Setor 100+ kg sampah" },
    { id: "consistent", name: "Konsisten", icon: "🔥", description: "Setor 7 hari berturut-turut" },
    { id: "top-contributor", name: "Top Contributor", icon: "⭐", description: "Top 10 peringkat" },
    { id: "beginner", name: "Pemula", icon: "🌱", description: "Selesaikan setoran pertama" },
    { id: "master", name: "Master Recycler", icon: "👑", description: "Setor 500+ kg sampah" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200";
    }
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
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <Trophy className="w-8 h-8 md:w-10 md:h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Papan Peringkat</h1>
            <p className="text-sm md:text-base text-purple-100">Kompetisi pengguna teraktif</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-purple-100 text-xs md:text-sm">Total Peserta</div>
            <div className="text-lg md:text-2xl font-bold">50,234</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-purple-100 text-xs md:text-sm">Hadiah Bulan Ini</div>
            <div className="text-lg md:text-2xl font-bold">5 Juta</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-purple-100 text-xs md:text-sm">Update</div>
            <div className="text-lg md:text-2xl font-bold">Real-time</div>
          </div>
        </div>
      </div>

      {/* Achievements/Badges Section */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
        <h2 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-base md:text-lg">
          <Award className="w-5 h-5 text-purple-600" />
          Pencapaian & Badge
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg md:rounded-xl p-3 md:p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{achievement.icon}</div>
              <div className="font-bold text-xs md:text-sm text-gray-900 mb-0.5 md:mb-1">
                {achievement.name}
              </div>
              <div className="text-xs text-gray-600 hidden sm:block">
                {achievement.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Contributors
        </h2>
        
        <div className="space-y-3">
          {mockLeaderboard.map((user) => (
            <div
              key={user.id}
              className={`${getRankBg(user.rank)} ${user.rank <= 3 ? 'text-white' : 'text-gray-900'} rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 ring-2 ring-white/50">
                  <AvatarFallback className={`${user.rank <= 3 ? 'bg-white text-gray-900' : 'bg-green-500 text-white'} font-bold`}>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                {/* User info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{user.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Level {user.level}
                    </Badge>
                  </div>
                  <div className={`text-sm ${user.rank <= 3 ? 'text-white/80' : 'text-gray-600'}`}>
                    {user.wasteDeposited} kg sampah • {user.points.toLocaleString()} poin
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2">
                    <Progress 
                      value={(user.points / 20000) * 100} 
                      className="h-2 bg-white/30"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-1">
                  {user.badges.slice(0, 3).map((badge) => {
                    const achievement = achievements.find(a => a.id === badge);
                    return achievement ? (
                      <div
                        key={badge}
                        className="w-8 h-8 rounded-lg bg-white/30 backdrop-blur-sm flex items-center justify-center text-lg"
                        title={achievement.name}
                      >
                        {achievement.icon}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Progress Section */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Progress Anda</h3>
            <p className="text-green-100 text-sm">
              {currentUserRank ? `Peringkat #${currentUserRank} dari ${leaderboard.length} pengguna` : "Login untuk melihat peringkat"}
            </p>
          </div>
          <Star className="w-8 h-8" />
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{currentUserPoints.toLocaleString()} poin</span>
            <span>Level {Math.min(Math.floor(currentUserPoints / 1000) + 1, 10)} → Level {Math.min(Math.floor(currentUserPoints / 1000) + 2, 10)}</span>
          </div>
          <Progress 
            value={Math.min(((currentUserPoints % 1000) / 1000) * 100, 100)} 
            className="h-3 bg-white/30" 
          />
          <p className="text-xs text-green-100 mt-2">
            {1000 - (currentUserPoints % 1000)} poin lagi untuk naik level!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {leaderboard.find(u => u.id === (JSON.parse(localStorage.getItem("currentUser") || "{}").id))?.wasteDeposited || 0} kg
            </div>
            <div className="text-xs text-green-100">Sampah Disetor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {leaderboard.find(u => u.id === (JSON.parse(localStorage.getItem("currentUser") || "{}").id))?.badges.length || 0}
            </div>
            <div className="text-xs text-green-100">Badge Didapat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {(() => {
                const transactions = JSON.parse(localStorage.getItem(`ecobank_transactions_${JSON.parse(localStorage.getItem("currentUser") || "{}").id}`) || "[]");
                return transactions.length;
              })()}
            </div>
            <div className="text-xs text-green-100">Transaksi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
