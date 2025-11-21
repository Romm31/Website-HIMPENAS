import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Crown, UserCheck, Briefcase } from 'lucide-react';

interface PersonMini {
  name: string;
  imageUrl: string;
}

interface DepartmentCardProps {
  title: string;
  staffCount: number;
  ketua: PersonMini;
  wakil: PersonMini;
  sekretaris: PersonMini;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  title,
  staffCount,
  ketua,
  wakil,
  sekretaris,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer h-full"
    >
      <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Gradient Background on Hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-himp/5 via-emerald-dark/5 to-transparent"
        ></motion.div>

        {/* Top Accent with Animation */}
        <motion.div 
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
          }}
          transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
          className="h-2 bg-gradient-to-r from-emerald-himp via-emerald-dark to-emerald-himp"
          style={{ backgroundSize: "200% 100%" }}
        ></motion.div>

        {/* Card Content */}
        <div className="p-6 md:p-8 flex flex-col flex-grow relative">
          {/* Department Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-4 group-hover:bg-emerald-100 transition-colors">
              <Briefcase className="w-4 h-4 text-emerald-himp" />
              <span className="text-xs font-bold text-emerald-dark uppercase tracking-wider">
                Departemen
              </span>
            </div>
            
            <motion.h3
              animate={{
                color: isHovered ? "rgb(4, 120, 87)" : "rgb(31, 41, 55)",
              }}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-xl font-extrabold break-words px-2 leading-tight"
            >
              {title}
            </motion.h3>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-himp to-transparent"></div>
              <div className="w-1.5 h-1.5 bg-emerald-himp rounded-full"></div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-himp to-transparent"></div>
            </div>
          </div>

          {/* Leadership Hierarchy */}
          <div className="flex flex-col items-center gap-6 mb-8 flex-grow">
            {/* Ketua (Top Position) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center relative"
            >
              <div className="relative">
                {/* Animated Ring for Ketua */}
                <motion.div
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1,
                    opacity: isHovered ? [0.3, 0.5, 0.3] : 0.2,
                  }}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 blur-md -z-10"
                ></motion.div>

                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 group-hover:border-yellow-400 transition-colors duration-500">
                  <Image
                    src={ketua.imageUrl}
                    alt={ketua.name}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Crown Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-1.5 shadow-lg"
                >
                  <Crown className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" />
                </motion.div>
              </div>

              <p className="text-xs md:text-sm font-bold text-gray-800 mt-3 text-center line-clamp-2 max-w-[120px]">
                {ketua.name}
              </p>
              <div className="flex items-center gap-1 mt-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                <Crown className="w-3 h-3 text-yellow-600" />
                <span className="text-[10px] md:text-xs font-bold text-yellow-700">KETUA</span>
              </div>
            </motion.div>

            {/* Wakil & Sekretaris (Side by Side) */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
              {[
                { person: wakil, role: 'Wakil', icon: UserCheck, color: 'emerald' },
                { person: sekretaris, role: 'Sekretaris', icon: Briefcase, color: 'emerald' }
              ].map(({ person, role, icon: Icon, color }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    {/* Subtle Ring */}
                    <motion.div
                      animate={{
                        scale: isHovered ? [1, 1.15, 1] : 1,
                        opacity: isHovered ? [0.2, 0.4, 0.2] : 0.15,
                      }}
                      transition={{ duration: 2, repeat: isHovered ? Infinity : 0, delay: i * 0.5 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-himp to-emerald-dark blur-sm -z-10"
                    ></motion.div>

                    <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 group-hover:border-${color}-400 transition-colors duration-500`}>
                      <Image
                        src={person.imageUrl}
                        alt={person.name}
                        fill
                        sizes="(max-width: 768px) 64px, 80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Role Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1), type: "spring" }}
                      className={`absolute -bottom-1 -right-1 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-full p-1 shadow-md`}
                    >
                      <Icon className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                    </motion.div>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-gray-800 mt-2 text-center line-clamp-2 max-w-[100px]">
                    {person.name}
                  </p>
                  <span className="text-[10px] md:text-xs text-gray-600 font-medium mt-0.5">{role}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-auto">
            {/* Staff Count */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 md:gap-3 p-2.5 md:p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-300"
            >
              <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-emerald-himp" />
              </div>
              <div className="text-left">
                <div className="text-[9px] md:text-[10px] text-gray-600 font-medium">Total Anggota</div>
                <div className="text-base md:text-lg font-bold text-emerald-dark">{staffCount} Staff</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Corner Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.2 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 right-0 w-32 h-32 bg-emerald-himp rounded-full blur-3xl -mr-16 -mt-16"
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default DepartmentCard;