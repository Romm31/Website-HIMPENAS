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
        className="text-center mb-16 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
          <GraduationCap className="w-4 h-4 text-emerald-himp" />
          <span className="text-sm font-semibold text-emerald-dark uppercase tracking-wide">
            Alumni
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          Daftar Alumni
        </h2>

        <div className="w-24 h-1 bg-gradient-to-r from-emerald-himp to-emerald-dark mx-auto rounded-full mb-6"></div>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Informasi alumni berdasarkan tahun dan batch
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari alumni berdasarkan tahun, program..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ==========================
           STATS FIXED VERSION
      ============================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
      >
        {/* Total Angkatan */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 
                        p-4 border border-emerald-100 mx-auto w-full max-w-[200px]">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <School className="h-4 w-4" />
            <p className="text-sm font-medium">Total Angkatan</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{years.length}</p>
        </div>

        {/* Total Alumni */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 
                        p-4 border border-emerald-100 mx-auto w-full max-w-[200px]">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Users className="h-4 w-4" />
            <p className="text-sm font-medium">Total Alumni</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{totalAlumni}</p>
        </div>

        {/* Angkatan Lulus */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 
                        p-4 border border-emerald-100 mx-auto w-full max-w-[200px]
                        col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Award className="h-4 w-4" />
            <p className="text-sm font-medium">Angkatan Lulus</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{years.length}</p>
        </div>
      </motion.div>

      {/* LIST SECTION */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredYears.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* MOBILE HORIZONTAL SCROLL */}
          <div className="block md:hidden overflow-x-auto pb-4">
            <div className="flex gap-5 min-w-max">
              {filteredYears.map((y, index) => (
                <motion.div
                  key={y.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => (window.location.href = `/alumni/${y.id}`)}
                  className="w-72 flex-shrink-0 group cursor-pointer relative overflow-hidden 
                             rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl"
                >
                  <CardContent y={y} index={index} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* DESKTOP GRID */}
          <motion.div
            layout
            className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredYears.map((y, index) => (
                <motion.div
                  key={y.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => (window.location.href = `/alumni/${y.id}`)}
                  className="group cursor-pointer relative overflow-hidden 
                             rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
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
      className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center"
    >
      <School size={64} className="mx-auto text-gray-300" />
      <p className="mt-4 text-xl font-semibold text-gray-700">Tidak ditemukan hasil</p>
      <p className="mt-2 text-gray-500">Coba kata kunci lain seperti “2020”, “TI”, atau “Batch 2”</p>
    </motion.div>
  );
}

function CardContent({ y, index }: { y: AlumniYear; index: number }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

      <div className="relative p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl 
                          bg-gradient-to-br from-emerald-100 to-green-100 
                          group-hover:from-emerald-500 group-hover:to-green-600 transition-all">
            <Award className="h-6 w-6 text-emerald-600 group-hover:text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 mb-2">
              <Calendar className="h-3 w-3 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">
                Alumni {y.year}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600">
              {y.program ?? "Program Tidak Ada"}
              {y.batch && ` Batch ${y.batch}`}
              {y.batchYear && ` (${y.batchYear})`}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg 
                        bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg 
                          bg-gradient-to-br from-emerald-500 to-green-600">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Total Anggota</p>
            <p className="font-bold text-emerald-600 text-2xl">
              {y.members.length}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-600">
            Lihat Detail
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 
                       group-hover:bg-emerald-600"
          >
            <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:text-white" />
          </motion.div>
        </div>
      </div>

      {parseInt(String(y.year)) >= new Date().getFullYear() - 2 && (
        <div className="absolute top-4 right-4 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-500 
                        text-white text-xs font-bold rounded-full shadow-lg">
          BARU
        </div>
      )}
    </>
  );
}
