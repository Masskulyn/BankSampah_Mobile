import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Banknote, Plus, History, Bell, ArrowUpRight } from "lucide-react";

interface QuickActionsProps {
  onCashOut: () => void;
  onDeposit: () => void;
  onHistory: () => void;
  onReminder: () => void;
}

export function QuickActions({ onCashOut, onDeposit, onHistory, onReminder }: QuickActionsProps) {
  const actions = [
    {
      icon: <Banknote size={24} />,
      label: "Tarik Saldo",
      onClick: onCashOut,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/25"
    },
    {
      icon: <Plus size={24} />,
      label: "Setor Sampah",
      onClick: onDeposit,
      gradient: "from-green-500 to-emerald-600",
      shadow: "shadow-green-500/25"
    },
    {
      icon: <History size={24} />,
      label: "Riwayat",
      onClick: onHistory,
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/25"
    },
    {
      icon: <Bell size={24} />,
      label: "Ingatkan Saya",
      onClick: onReminder,
      gradient: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/25"
    }
  ];

  return (
    <Card className="p-6 bg-white shadow-xl border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900">Aksi Cepat</h3>
        <ArrowUpRight size={20} className="text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`
              relative overflow-hidden group
              flex flex-col items-center justify-center gap-3 h-24 p-4
              bg-gradient-to-br ${action.gradient} text-white
              border-0 rounded-2xl shadow-lg ${action.shadow}
              hover:shadow-xl hover:scale-105 
              transition-all duration-300 ease-out
              before:absolute before:inset-0 before:bg-white/10 before:opacity-0 
              hover:before:opacity-100 before:transition-opacity before:duration-300
            `}
            onClick={action.onClick}
          >
            <div className="relative z-10 p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
              {action.icon}
            </div>
            <span className="relative z-10 text-sm font-semibold tracking-wide">{action.label}</span>
            
            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full blur-md opacity-50"></div>
          </Button>
        ))}
      </div>
    </Card>
  );
}