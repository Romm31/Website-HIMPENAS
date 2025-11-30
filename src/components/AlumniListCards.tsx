import { useEffect, useState } from "react";
import {
  School,
  Users,
  GraduationCap,
  Calendar,
  Award,
  ChevronRight,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AlumniYear {
  id: number;
  program?: string;
  batch?: string;
  batchYear?: string;
  year: string | number;
  members: any[];
}

export default function AlumniListCards() {
  const [years, setYears] = useState<AlumniYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.getElementById("alumni-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/admin/alumni")
      .then((res) => res.json())
      .then((data) => setYears(data))
      .finally(() => setIsLoading(false));
  }, []);

  const totalAlumni = years.reduce((sum, y) => sum + y.members.length, 0);

  const filteredYears = years.filter((y) => {
    const term = searchTerm.toLowerCase();
    return (
      y.program?.toLowerCase().includes(term) ||
      y.year?.toString().includes(term) ||
      y.batch?.toLowerCase().includes(term) ||
      y.batchYear?.toString().includes(term)
    );
  });

  return (
    <div id="alumni-section" className="mt-20">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-4">
          <GraduationCap className="w-4 h-4 text-emerald-himp" />
          <span className="text-sm font-semibold text-emerald-dark uppercase tracking-wide">
            Alumni
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
          Daftar Alumni
        </h2>

        <div className="w-24 h-1 bg-gradient-to-r from-emerald-himp to-emerald-dark mx-auto rounded-full mb-4"></div>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Informasi alumni berdasarkan tahun dan batch
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="max-w-md mx-auto mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileFocus={{ scale: 1.02 }}
          className="relative"
        >
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors peer-focus:text-emerald-600" />
          <input
            type="text"
            placeholder="Cari alumni berdasarkan tahun, program..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 
                       focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                       transition-all duration-300 outline-none shadow-sm hover:shadow-md
                       bg-white peer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
      </div>

      {/* STATS - COMPACT VERSION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto"
      >
        {/* Total Angkatan */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100
                     p-4 border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-all 
                     duration-300 cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-emerald-700 mb-2 group-hover:text-emerald-800">
            <School className="h-5 w-5 transition-transform group-hover:scale-110" />
            <p className="text-xs font-semibold uppercase tracking-wide">Total Angkatan</p>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 group-hover:text-emerald-700 transition-colors">
            {years.length}
          </p>
        </motion.div>

        {/* Total Alumni */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100
                     p-4 border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-all 
                     duration-300 cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-emerald-700 mb-2 group-hover:text-emerald-800">
            <Users className="h-5 w-5 transition-transform group-hover:scale-110" />
            <p className="text-xs font-semibold uppercase tracking-wide">Total Alumni</p>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 group-hover:text-emerald-700 transition-colors">
            {totalAlumni}
          </p>
        </motion.div>

        {/* Angkatan Lulus */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100
                     p-4 border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-all 
                     duration-300 cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-2 text-emerald-700 mb-2 group-hover:text-emerald-800">
            <Award className="h-5 w-5 transition-transform group-hover:scale-110" />
            <p className="text-xs font-semibold uppercase tracking-wide">Angkatan Lulus</p>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 group-hover:text-emerald-700 transition-colors">
            {years.length}
          </p>
        </motion.div>
      </motion.div>

      {/* LIST SECTION */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredYears.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* MOBILE HORIZONTAL SCROLL */}
          <div className="block md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              {filteredYears.map((y, index) => (
                <motion.div
                  key={y.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  onClick={() => (window.location.href = `/alumni/${y.id}`)}
                  className="w-72 flex-shrink-0 group cursor-pointer relative overflow-hidden 
                             rounded-2xl border-2 border-emerald-100 bg-white shadow-md 
                             hover:shadow-2xl hover:border-emerald-300 transition-all duration-300"
                >
                  <CardContent y={y} index={index} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* DESKTOP GRID - COMPACT */}
          <motion.div
            layout
            className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredYears.map((y, index) => (
                <motion.div
                  key={y.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = `/alumni/${y.id}`)}
                  className="group cursor-pointer relative overflow-hidden 
                             rounded-2xl border-2 border-emerald-100 bg-white 
                             shadow-md hover:shadow-2xl hover:border-emerald-300 
                             transition-all duration-300"
                >
                  <CardContent y={y} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ============================
   SUB COMPONENTS
============================ */

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-lg" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-lg" />
            <div className="h-4 w-2/3 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 py-16 text-center"
    >
      <School size={64} className="mx-auto text-emerald-200" />
      <p className="mt-4 text-xl font-semibold text-gray-700">Tidak ditemukan hasil</p>
      <p className="mt-2 text-gray-500">Coba kata kunci lain seperti "2020", "TI", atau "Batch 2"</p>
    </motion.div>
  );
}

function CardContent({ y, index }: { y: AlumniYear; index: number }) {
  return (
    <>
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 
                      opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

      <div className="relative p-5">
        {/* Header Section */}
        <div className="flex items-start gap-3 mb-4">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex h-12 w-12 items-center justify-center rounded-xl 
                       bg-gradient-to-br from-emerald-100 to-green-200 
                       group-hover:from-emerald-500 group-hover:to-green-600 
                       transition-all duration-300 shadow-sm group-hover:shadow-md"
          >
            <Award className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 
                           px-3 py-1 mb-2 group-hover:bg-emerald-200 transition-colors">
              <Calendar className="h-3 w-3 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">
                Alumni {y.year}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 
                          transition-colors duration-300 leading-tight">
              {y.program ?? "Program Tidak Ada"}
              {y.batch && ` Batch ${y.batch}`}
              {y.batchYear && ` (${y.batchYear})`}
            </h3>
          </div>
        </div>

        {/* Members Count */}
        <div className="flex items-center gap-3 p-3 rounded-xl 
                       bg-gradient-to-br from-emerald-50 to-green-50 
                       border-2 border-emerald-100 group-hover:border-emerald-200
                       group-hover:shadow-md transition-all duration-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg 
                         bg-gradient-to-br from-emerald-500 to-green-600 
                         shadow-sm group-hover:shadow-md transition-shadow">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Total Anggota</p>
            <p className="font-extrabold text-emerald-600 text-2xl leading-none">
              {y.members.length}
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 group-hover:text-emerald-600 
                         transition-colors">
            Lihat Detail
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-full 
                       bg-emerald-100 group-hover:bg-emerald-600 
                       shadow-sm group-hover:shadow-md transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>

      {/* Badge BARU */}
      {parseInt(String(y.year)) >= new Date().getFullYear() - 2 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute top-4 right-4 px-2.5 py-1 
                     bg-gradient-to-r from-emerald-500 to-green-500 
                     text-white text-xs font-bold rounded-full shadow-lg
                     hover:shadow-xl hover:scale-110 transition-all duration-300"
        >
          BARU
        </motion.div>
      )}
    </>
  );
}
