import { Button } from "./ui/button";
import { Recycle, Sparkles, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroSectionProps {
  onRegisterClick?: () => void;
  isAuthenticated?: boolean;
}

export function HeroSection({ onRegisterClick, isAuthenticated = false }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-6 md:p-8 shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-24 md:w-32 h-24 md:h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 md:w-40 h-32 md:h-40 bg-yellow-200 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Left content */}
        <div className="flex-1 text-white space-y-3 md:space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>Platform Bank Sampah Digital</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Ubah Sampahmu Jadi Rupiah! 💰
          </h1>
          
          <p className="text-sm md:text-lg text-white/90 leading-relaxed">
            Bergabunglah dengan gerakan ramah lingkungan dan dapatkan penghasilan tambahan dari sampah daur ulang Anda.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
              <div>
                <div className="text-xs opacity-90">Total Pengguna</div>
                <div className="font-bold">50.000+</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm">
              <Recycle className="w-4 h-4 md:w-5 md:h-5" />
              <div>
                <div className="text-xs opacity-90">Sampah Terkumpul</div>
                <div className="font-bold">250 Ton</div>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <Button
              onClick={onRegisterClick}
              className="bg-white text-green-600 hover:bg-gray-100 hover:scale-105 transition-all shadow-lg px-6 md:px-8 py-5 md:py-6 text-base md:text-lg mt-4 w-full md:w-auto"
            >
              Daftar Sekarang - Gratis!
            </Button>
          )}
        </div>

        {/* Right content - Illustration (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-full shadow-2xl">
              <Recycle className="w-32 h-32 text-green-600 animate-spin-slow" style={{ animationDuration: '8s' }} />
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-lg animate-bounce">
              <span className="font-bold">+Rp 50K</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-400 text-blue-900 px-4 py-2 rounded-full shadow-lg animate-bounce delay-300">
              <span className="font-bold">Mudah!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
