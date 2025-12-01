// src/pages/admin/index.tsx

import { useEffect, useState, ReactNode } from "react";
import AdminLayout from "./_layout";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiFileText, FiCalendar, FiImage, FiUsers, FiTag,
  FiBarChart2, FiPlusCircle, FiArrowRight, FiExternalLink,
  FiTrendingUp, FiActivity
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface DashboardStats {
  totalBerita: number;
  totalEvent: number;
  totalAlbum: number;
  totalUser: number;
  totalKategori: number;
  beritaTerbaru: { id: number; judul: string; createdAt: string }[];
  beritaPerKategori: { nama: string; jumlah: number }[];
  eventTerbaru: { id: number; judul: string; tanggal: string }[];
}

const StatCard = ({ 
  icon, 
  title, 
  value, 
  isLoading,
  gradient
}: { 
  icon: ReactNode; 
  title: string; 
  value: number; 
  isLoading: boolean;
  gradient: string;
}) => {
  if (isLoading) {
    return (
      <div className="h-[140px] md:h-[160px] animate-pulse rounded-2xl bg-gray-200"></div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl ${gradient} p-6 md:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/60"
          >
            <FiTrendingUp size={20} />
          </motion.div>
        </div>
        
        <div>
          <p className="text-sm md:text-base font-medium text-white/80 mb-1">{title}</p>
          <p className="text-3xl md:text-4xl font-extrabold text-white">{value}</p>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/stats", {
          method: "GET",
          credentials: "include",      // ⬅️ FIX PENTING AGAR COOKIE TERKIRIM
        });

        if (!res.ok) throw new Error("Gagal memuat statistik");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error load stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCardsData = [
    { 
      title: "Total Berita", 
      value: stats?.totalBerita, 
      icon: <FiFileText size={24} />,
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700"
    },
    { 
      title: "Jumlah Event", 
      value: stats?.totalEvent, 
      icon: <FiCalendar size={24} />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    { 
      title: "Album Galeri", 
      value: stats?.totalAlbum, 
      icon: <FiImage size={24} />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    { 
      title: "Pengguna Admin", 
      value: stats?.totalUser, 
      icon: <FiUsers size={24} />,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-700"
    },
    { 
      title: "Kategori Berita", 
      value: stats?.totalKategori, 
      icon: <FiTag size={24} />,
      gradient: "bg-gradient-to-br from-pink-500 to-pink-700"
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FiActivity className="text-emerald-600" />
              Selamat datang kembali! Kelola website HIMPENAS
            </p>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/admin/berita/tambah" legacyBehavior>
              <a className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <FiPlusCircle size={20} />
                <span className="hidden sm:inline">Tambah Berita Baru</span>
                <span className="sm:hidden">Buat Berita</span>
              </a>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="mb-8 md:mb-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {statCardsData.map((card, index) => (
          <StatCard 
            key={index} 
            title={card.title} 
            value={card.value ?? 0} 
            icon={card.icon} 
            isLoading={isLoading}
            gradient={card.gradient}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="mb-6 flex items-center gap-2 text-lg md:text-xl font-bold text-gray-800">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FiBarChart2 className="text-emerald-700" size={20} />
              </div>
              Grafik Berita per Kategori
            </h3>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-gray-100"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.beritaPerKategori} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="nama" 
                      stroke="#6b7280" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      allowDecimals={false} 
                      stroke="#6b7280" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: "#065f4620" }} 
                      contentStyle={{ 
                        borderRadius: "0.75rem", 
                        borderColor: "#d1d5db",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }} 
                    />
                    <Legend iconType="circle" iconSize={10} />
                    <Bar 
                      dataKey="jumlah" 
                      fill="#047857" 
                      name="Jumlah Berita" 
                      barSize={40} 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Recent Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="mb-6 flex items-center gap-2 text-lg md:text-xl font-bold text-gray-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="text-blue-700" size={20} />
              </div>
              Event Terbaru
            </h3>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100"></div>
                ))
              ) : stats?.eventTerbaru && stats.eventTerbaru.length > 0 ? (
                stats.eventTerbaru.map((event) => (
                  <Link key={event.id} href={`/admin/event/${event.id}`} legacyBehavior>
                    <motion.a
                      whileHover={{ x: 4 }}
                      className="group flex items-center justify-between rounded-xl p-4 hover:bg-gray-50 transition-colors border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                          <FiCalendar size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {event.judul}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {new Date(event.tanggal).toLocaleDateString("id-ID", { 
                              day: "numeric", 
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1 flex-shrink-0" />
                    </motion.a>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiCalendar size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Belum ada event yang dibuat</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Recent News */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="mb-6 flex items-center gap-2 text-lg md:text-xl font-bold text-gray-800">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiActivity className="text-purple-700" size={20} />
              </div>
              Aktivitas Terbaru
            </h3>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100"></div>
                ))
              ) : stats?.beritaTerbaru && stats.beritaTerbaru.length > 0 ? (
                stats.beritaTerbaru.map((berita) => (
                  <motion.div
                    key={berita.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-gray-50 transition-colors border border-gray-100 hover:border-purple-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold text-gray-800 text-sm md:text-base">
                        {berita.judul}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(berita.createdAt).toLocaleDateString("id-ID", { 
                          day: "numeric", 
                          month: "long" 
                        })}
                      </p>
                    </div>
                    <Link 
                      href={`/berita/${berita.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-shrink-0 text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors" 
                      title="Lihat Berita"
                    >
                      <FiExternalLink size={18} />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiFileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Belum ada berita baru</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow text-white"
          >
            <h3 className="mb-6 flex items-center gap-2 text-lg md:text-xl font-bold">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <FiPlusCircle size={20} />
              </div>
              Aksi Cepat
            </h3>

            <div className="space-y-3">
              <Link href="/admin/event/tambah" legacyBehavior>
                <motion.a
                  whileHover={{ x: 4 }}
                  className="group flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 border border-white/20 hover:border-white/40"
                >
                  <span className="font-semibold">Buat Event Baru</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </motion.a>
              </Link>

              <Link href="/admin/galeri/tambah" legacyBehavior>
                <motion.a
                  whileHover={{ x: 4 }}
                  className="group flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 border border-white/20 hover:border-white/40"
                >
                  <span className="font-semibold">Upload ke Galeri</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </motion.a>
              </Link>

              <Link href="/admin/kategori" legacyBehavior>
                <motion.a
                  whileHover={{ x: 4 }}
                  className="group flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 border border-white/20 hover:border-white/40"
                >
                  <span className="font-semibold">Kelola Kategori</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </motion.a>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
