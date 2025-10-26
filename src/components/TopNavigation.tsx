import { Home, Trash2, Gift, BookOpen, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface TopNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function TopNavigation({ activeView, onViewChange }: TopNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    { id: "deposit", label: "Setor", icon: <Trash2 className="w-5 h-5" /> },
    { id: "rewards", label: "Tukar Poin", icon: <Gift className="w-5 h-5" /> },
    { id: "education", label: "Edukasi", icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-lg">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            onClick={() => onViewChange(item.id)}
            className={`rounded-xl flex items-center gap-2 transition-all text-sm ${
              activeView === item.id
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Mobile/Tablet Navigation */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-2xl"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-top duration-200">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start rounded-xl flex items-center gap-3 ${
                    activeView === item.id
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
