import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Award, Crown } from 'lucide-react';

interface TeamCardProps {
  imageUrl: string;
  name: string;
  role: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ imageUrl, name, role }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if this is a leadership role (Ketua or Wakil)
  const isKetua = role.toLowerCase().includes('ketua') && !role.toLowerCase().includes('wakil');
  const isWakil = role.toLowerCase().includes('wakil');
  const isLeadership = isKetua || isWakil;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full max-w-[280px] md:max-w-[320px] text-center group cursor-pointer"
    >
      <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
        {/* Gradient Background on Hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-himp/10 via-emerald-dark/5 to-transparent"
        ></motion.div>

        {/* Card Content */}
        <div className="p-6 md:p-8 relative">
          {/* Image Container */}
          <div className="relative mb-6">
            <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto">
              {/* Animated Rings - Gold for Ketua, Emerald for others */}
              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.15, 1] : 1,
                  opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                className={`absolute inset-0 rounded-full blur-xl ${
                  isKetua 
                    ? 'bg-gradient-to-tr from-yellow-400 to-amber-500' 
                    : isWakil
                    ? 'bg-gradient-to-tr from-blue-400 to-indigo-500'
                    : 'bg-gradient-to-tr from-emerald-himp to-emerald-dark'
                }`}
              ></motion.div>

              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.1, 1] : 1,
                  opacity: isHovered ? [0.2, 0.4, 0.2] : 0.1,
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0, delay: 0.5 }}
                className={`absolute inset-0 rounded-full blur-lg ${
                  isKetua 
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-400' 
                    : isWakil
                    ? 'bg-gradient-to-br from-indigo-500 to-blue-400'
                    : 'bg-gradient-to-br from-emerald-dark to-emerald-himp'
                }`}
              ></motion.div>

              {/* Image */}
              <div className={`relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 bg-gray-100 ${
                isKetua 
                  ? 'group-hover:border-yellow-400' 
                  : isWakil
                  ? 'group-hover:border-blue-400'
                  : 'group-hover:border-emerald-himp'
              }`}>
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-t to-transparent ${
                    isKetua
                      ? 'from-yellow-900/70 via-yellow-900/20'
                      : isWakil
                      ? 'from-blue-900/70 via-blue-900/20'
                      : 'from-emerald-dark/70 via-emerald-dark/20'
                  }`}
                ></motion.div>
              </div>

              {/* Crown Badge for Ketua */}
              {isKetua && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-2 md:p-2.5 shadow-xl border-2 border-white"
                >
                  <Crown className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                </motion.div>
              )}

              {/* Star Badge for Wakil */}
              {isWakil && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-2 md:p-2.5 shadow-xl border-2 border-white"
                >
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                </motion.div>
              )}

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-lg whitespace-nowrap flex items-center gap-1 md:gap-1.5 ${
                  isKetua
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                    : isWakil
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-r from-emerald-himp to-emerald-dark'
                }`}
              >
                {isKetua ? (
                  <>
                    <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                    <span>KETUA</span>
                  </>
                ) : isWakil ? (
                  <>
                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                    <span>WAKIL</span>
                  </>
                ) : (
                  <>
                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                    <span>PENGURUS AKTIF</span>
                  </>
                )}
              </motion.div>
            </div>
          </div>

          {/* Name & Role */}
          <div className="space-y-3">
            <motion.h3
              animate={{
                color: isHovered ? "rgb(4, 120, 87)" : "rgb(31, 41, 55)",
              }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl font-extrabold break-words leading-tight px-2"
            >
              {name}
            </motion.h3>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2">
              <motion.div 
                animate={{ width: isHovered ? "40%" : "30%" }}
                transition={{ duration: 0.3 }}
                className="h-px bg-gradient-to-r from-transparent via-emerald-himp to-transparent"
              ></motion.div>
              <motion.div 
                animate={{ 
                  scale: isHovered ? [1, 1.5, 1] : 1,
                  rotate: isHovered ? 360 : 0
                }}
                transition={{ duration: 0.6 }}
                className="w-1.5 h-1.5 bg-emerald-himp rounded-full"
              ></motion.div>
              <motion.div 
                animate={{ width: isHovered ? "40%" : "30%" }}
                transition={{ duration: 0.3 }}
                className="h-px bg-gradient-to-r from-transparent via-emerald-himp to-transparent"
              ></motion.div>
            </div>

            <div className={`bg-emerald-50 rounded-lg px-4 py-2.5 transition-colors duration-300 ${
              isKetua 
                ? 'bg-yellow-50 group-hover:bg-yellow-100' 
                : isWakil
                ? 'bg-blue-50 group-hover:bg-blue-100'
                : 'group-hover:bg-emerald-100'
            }`}>
              <p className={`text-sm md:text-base font-bold ${
                isKetua 
                  ? 'text-yellow-700' 
                  : isWakil
                  ? 'text-blue-700'
                  : 'text-emerald-dark'
              }`}>
                {role}
              </p>
            </div>
          </div>

          {/* Period Badge (appears on hover) */}
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-4 border-t border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600">
              <Award className="w-4 h-4 text-emerald-himp" />
              <span>Periode 2024/2025</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Bottom Accent */}
        <motion.div 
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
          }}
          transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
          className={`h-1.5 ${
            isKetua
              ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400'
              : isWakil
              ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500'
              : 'bg-gradient-to-r from-emerald-himp via-emerald-dark to-emerald-himp'
          }`}
          style={{ backgroundSize: "200% 100%" }}
        ></motion.div>

        {/* Decorative Corner Elements */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-12 -mt-12 ${
            isKetua
              ? 'bg-yellow-400'
              : isWakil
              ? 'bg-blue-400'
              : 'bg-emerald-himp'
          }`}
        ></motion.div>
        <motion.div
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`absolute bottom-0 left-0 w-20 h-20 rounded-full blur-2xl -ml-10 -mb-10 ${
            isKetua
              ? 'bg-amber-500'
              : isWakil
              ? 'bg-indigo-600'
              : 'bg-emerald-dark'
          }`}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default TeamCard;