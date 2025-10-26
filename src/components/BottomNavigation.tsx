import { Home, BarChart3, Newspaper, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home
    },
    {
      id: 'stats',
      label: 'Statistik',
      icon: BarChart3
    },
    {
      id: 'news',
      label: 'Berita',
      icon: Newspaper
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 px-6 py-3 safe-area-pb shadow-2xl">
      <div className="flex justify-around relative">
        {/* Active indicator background */}
        <div className="absolute inset-0 flex justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div key={`bg-${tab.id}`} className="flex-1 flex justify-center">
                {isActive && (
                  <div className="w-16 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-10 absolute top-1"></div>
                )}
              </div>
            );
          })}
        </div>
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-300 transform ${
                isActive
                  ? 'text-green-600 scale-110'
                  : 'text-gray-500 hover:text-gray-700 hover:scale-105'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-green-100 shadow-lg' : ''
              }`}>
                <Icon size={20} className={`transition-all duration-300 ${
                  isActive ? 'stroke-2' : 'stroke-1.5'
                }`} />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-green-500 rounded-full shadow-lg"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}