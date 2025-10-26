import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Recycle, Leaf, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-60 h-60 bg-yellow-200 rounded-full blur-3xl"
          />
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-100, 100],
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Leaf className="w-6 h-6 text-white/40" />
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-8">
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="relative mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-32 h-32 md:w-40 md:h-40 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl"
              >
                <Recycle className="w-16 h-16 md:w-20 md:h-20 text-green-600" />
              </motion.div>
              
              {/* Sparkles animation */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-3 mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Bank Sampah Digital
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Ubah Sampahmu Jadi Rupiah! 💰
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-64 md:w-80 mx-auto"
          >
            <div className="bg-white/30 backdrop-blur-sm rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full shadow-lg"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/80 text-sm mt-4"
            >
              Memuat aplikasi...
            </motion.p>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 space-y-2"
          >
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Platform Ramah Lingkungan</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
