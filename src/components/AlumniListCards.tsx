import { useEffect, useState } from "react";
import {
  School,
  Users,
  GraduationCap,
  Calendar,
  Award,
  ChevronRight
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
      .then((data) => {
        setYears(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const totalAlumni = years.reduce((sum, y) => sum + y.members.length, 0);

  return (
    <div id="alumni-section" className="mt-20">
      {/* ===========================
          NEW HEADER STYLE (LIKE STRUCTURE ORGANIZATION)
      ============================ */}
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12"
      >
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <School className="h-4 w-4" />
            <p className="text-sm font-medium">Total Angkatan</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{years.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Users className="h-4 w-4" />
            <p className="text-sm font-medium">Total Alumni</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{totalAlumni}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-100 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Award className="h-4 w-4" />
            <p className="text-sm font-medium">Angkatan Aktif</p>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{years.length}</p>
        </div>
      </motion.div>

      {/* =======================
          CONTENT LIST
      ======================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
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
      ) : years.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center"
        >
          <School size={64} className="mx-auto text-gray-300" />
          <p className="mt-4 text-xl font-semibold text-gray-700">
            Belum ada data alumni
          </p>
          <p className="mt-2 text-gray-500">Data alumni akan muncul di sini</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {years.map((y, index) => (
              <motion.div
                key={y.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => (window.location.href = `/alumni/${y.id}`)}
                className="group cursor-pointer relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                <div className="relative p-5">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Static Icon (No Rotation) */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 group-hover:from-emerald-500 group-hover:to-green-600 transition-all flex-shrink-0">
                      <Award className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 mb-2">
                        <Calendar className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">
                          Alumni {y.year}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                        {y.program ?? "Program Tidak Ada"}
                        {y.batch && ` Batch ${y.batch}`}
                        {y.batchYear && ` (${y.batchYear})`}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex-shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Total Anggota
                      </p>
                      <p className="font-bold text-emerald-600 text-2xl">
                        {y.members.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors">
                      Lihat Detail
                    </span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-600 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                    </motion.div>
                  </div>
                </div>

                {parseInt(String(y.year)) >= new Date().getFullYear() - 2 && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    BARU
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
