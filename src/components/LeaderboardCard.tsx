import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState, useEffect } from "react";

interface LeaderboardCardProps {
  onViewAll: () => void;
}

interface TopUser {
  name: string;
  points: number;
  rank: number;
}

export function LeaderboardCard({ onViewAll }: LeaderboardCardProps) {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<string>("#42");
  const [currentUserLevel, setCurrentUserLevel] = useState<number>(5);

  useEffect(() => {
    loadTopUsers();
  }, []);

  const loadTopUsers = () => {
    try {
      // Get all registered users from localStorage
      const usersJson = localStorage.getItem("ecobank_users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Get current user from AuthContext or localStorage
      const currentUserJson = localStorage.getItem("currentUser");
      const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

      // Build user list with points (excluding admin)
      const usersWithPoints = users
        .filter((user: any) => user.role !== "admin") // Exclude admin from leaderboard
        .map((user: any) => {
          const points = parseInt(localStorage.getItem(`ecobank_points_${user.id}`) || "0");
          return {
            id: user.id,
            name: user.name,
            points: points
          };
        });

      // Sort by points descending
      usersWithPoints.sort((a: any, b: any) => b.points - a.points);

      // Get top 3 users
      const top3 = usersWithPoints.slice(0, 3).map((user: any, index: number) => ({
        name: user.name,
        points: user.points,
        rank: index + 1
      }));

      setTopUsers(top3);

      // Find current user's rank and level
      if (currentUser) {
        const currentUserIndex = usersWithPoints.findIndex((u: any) => u.id === currentUser.id);
        if (currentUserIndex >= 0) {
          setCurrentUserRank(`#${currentUserIndex + 1} dari ${usersWithPoints.length}`);
          const points = usersWithPoints[currentUserIndex].points;
          const level = Math.min(Math.floor(points / 1000) + 1, 10);
          setCurrentUserLevel(level);
        }
      }
    } catch (error) {
      console.error("Error loading top users:", error);
    }
  };

  const defaultTopUsers = [
    { name: "Ahmad Santoso", points: 15240, rank: 1 },
    { name: "Siti Nurhaliza", points: 14850, rank: 2 },
    { name: "Budi Pratama", points: 13920, rank: 3 },
  ];

  const displayTopUsers = topUsers.length > 0 ? topUsers : defaultTopUsers;

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm md:text-base">Papan Peringkat</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 text-xs md:text-sm"
        >
          Lihat Semua
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-2 md:space-y-3">
        {displayTopUsers.map((user) => (
          <div
            key={user.rank}
            className="bg-white rounded-lg md:rounded-xl p-2.5 md:p-3 flex items-center gap-2 md:gap-3 hover:shadow-md transition-shadow"
          >
            <div className="text-xl md:text-2xl w-6 md:w-8 text-center">
              {getRankEmoji(user.rank)}
            </div>
            <Avatar className="w-8 h-8 md:w-10 md:h-10">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs md:text-sm">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-sm md:text-base truncate">{user.name}</div>
              <div className="text-xs md:text-sm text-gray-600">{user.points.toLocaleString()} poin</div>
            </div>
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
          </div>
        ))}
      </div>

      <div className="mt-3 md:mt-4 p-2.5 md:p-3 bg-white rounded-lg md:rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-600">Peringkat Anda</p>
            <p className="font-bold text-gray-900 text-sm md:text-base">{currentUserRank}</p>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs md:text-sm">
            Level {currentUserLevel}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
