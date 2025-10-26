import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface LeaderboardCardProps {
  onViewAll: () => void;
}

export function LeaderboardCard({ onViewAll }: LeaderboardCardProps) {
  const topUsers = [
    { name: "Ahmad Santoso", points: 15240, rank: 1 },
    { name: "Siti Nurhaliza", points: 14850, rank: 2 },
    { name: "Budi Pratama", points: 13920, rank: 3 },
  ];

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
        {topUsers.map((user) => (
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
            <p className="font-bold text-gray-900 text-sm md:text-base">#42 dari 50,234</p>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs md:text-sm">
            Level 5
          </Badge>
        </div>
      </div>
    </Card>
  );
}
