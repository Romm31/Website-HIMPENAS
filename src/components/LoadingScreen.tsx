import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress - 3 seconds total
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            onLoadingComplete?.();
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Left Corner */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
            {/* Bottom Right Corner */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-50"></div>
            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-30"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative mb-12"
            >
              {/* Subtle Glow Behind Logo */}
              <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-20 scale-110"></div>
              
              {/* Logo */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 shadow-xl">
                <Image
                  src="/logo/logo.png"
                  alt="HIMPENAS Logo"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Rotating Border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, #047857 50%, transparent 100%)',
                  padding: '3px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              ></motion.div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-dark mb-1">
                HIMPENAS
              </h1>
              <p className="text-sm text-gray-500">Himpunan Mahasiswa Pengolahan Sawit</p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-80 md:w-96"
            >
              {/* Progress Bar Container */}
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                {/* Progress Bar Fill */}
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-himp to-emerald-dark rounded-full shadow-lg"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </motion.div>
              </div>

              {/* Progress Info */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">Memuat...</span>
                <motion.span
                  key={progress}
                  initial={{ scale: 1.2, color: '#047857' }}
                  animate={{ scale: 1, color: '#047857' }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-lg"
                >
                  {progress}%
                </motion.span>
              </div>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-2 mt-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-emerald-himp rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Shimmer Animation */}
          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(200%);
              }
            }

            .animate-shimmer {
              animation: shimmer 2s infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;