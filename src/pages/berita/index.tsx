import { GetServerSideProps, NextPage } from "next";
import { Berita, Kategori } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import FilterControls from "@/components/FilterControls";
import Pagination from "@/components/Pagination";
import React, { useRef, useEffect, useState } from "react";
import BeritaCard from "@/components/BeritaCard";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Calendar } from "lucide-react";

type BeritaWithKategori = Berita & { kategori: Kategori | null };

interface BeritaPageProps {
  berita: BeritaWithKategori[];
  kategoriList: Kategori[];
  totalBerita: number;
  currentPage: number;
  totalPages: number;
  currentSearch?: string;
  currentKategori?: string;
}

const BeritaPage: NextPage<BeritaPageProps> = ({
  berita,
  kategoriList,
  totalBerita,
  currentPage,
  totalPages,
  currentSearch,
  currentKategori,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerInView, setHeaderInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Enhanced Header */}
      <header
        ref={headerRef}
        className={`relative bg-gradient-to-br from-emerald-dark via-emerald-himp to-emerald-800 text-white pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden fade-in-section ${
          headerInView ? "is-visible" : ""
        }`}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/header/berita-header.jpeg"
            fill
            className="object-cover opacity-10"
            alt="Latar Belakang Berita"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/20 to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-emerald-900/30 backdrop-blur-md rounded-full mb-6 border border-emerald-400/30"
          >
            <Newspaper className="w-4 md:w-5 h-4 md:h-5 text-emerald-200" />
            <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-emerald-100">
              Pusat Informasi
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-heading tracking-tight mb-4 md:mb-6"
          >
            <span className="block md:inline">Arsip </span>
            <span className="text-emerald-200 relative inline-block">
              Berita
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: headerInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-emerald-300 rounded-full origin-left"
              ></motion.div>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg lg:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Temukan cerita, inovasi, dan aksi terbaru dari HIMPENAS
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 px-4"
          >
            <div className="group flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 bg-emerald-900/40 backdrop-blur-md rounded-xl border border-emerald-400/30 hover:bg-emerald-800/50 transition-all duration-300 hover:scale-105 hover:border-emerald-300/50">
              <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                <TrendingUp className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">{totalBerita}</div>
                <div className="text-xs text-emerald-200 uppercase tracking-wide">
                  Total Berita
                </div>
              </div>
            </div>
            <div className="group flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 bg-emerald-900/40 backdrop-blur-md rounded-xl border border-emerald-400/30 hover:bg-emerald-800/50 transition-all duration-300 hover:scale-105 hover:border-emerald-300/50">
              <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                <Calendar className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {kategoriList.length}
                </div>
                <div className="text-xs text-emerald-200 uppercase tracking-wide">
                  Kategori
                </div>
              </div>
            </div>
          </motion.div>
        </div>   
           
      </header>

      {/* Main Content */}
      <main className="flex-grow -mt-20 relative z-10 bg-transparent">
        <div className="container mx-auto px-6 bg-transparent !shadow-none">
          {/* Filter Controls */}
          <FilterControls
            kategoriList={kategoriList}
            currentSearch={currentSearch}
            currentKategori={currentKategori}
          />

          {/* Results Info */}
          {(currentSearch || currentKategori) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between px-6 py-4 bg-emerald-50 rounded-xl border border-emerald-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-himp rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hasil Pencarian</p>
                  <p className="font-bold text-gray-900">
                    Ditemukan {berita.length} berita dari {totalBerita} total
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid Berita */}
          {berita.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {berita.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BeritaCard berita={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Berita Tidak Ditemukan
                </h3>
                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  Coba gunakan kata kunci atau filter yang berbeda untuk
                  menemukan berita yang Anda cari.
                </p>
                <button
                  onClick={() => (window.location.href = "/berita")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-himp text-white rounded-full font-semibold hover:bg-emerald-dark transition-colors duration-300"
                >
                  Reset Filter
                </button>
              </div>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 mb-16">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/berita"
                query={{ search: currentSearch, kategori: currentKategori }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BeritaPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageSize = 6;
  const page = parseInt(context.query.page as string) || 1;

  let search: string | undefined;
  if (context.query.search) {
    search = Array.isArray(context.query.search)
      ? context.query.search[0]
      : context.query.search;
  }

  let kategori: string | undefined;
  if (context.query.kategori) {
    kategori = Array.isArray(context.query.kategori)
      ? context.query.kategori[0]
      : context.query.kategori;
  }

  const whereClause: any = {};

  if (search && typeof search === "string" && search.trim() !== "") {
    whereClause.OR = [
      { judul: { contains: search.trim(), mode: "insensitive" } },
      { konten: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  if (
    kategori &&
    typeof kategori === "string" &&
    kategori.trim() !== "" &&
    !isNaN(parseInt(kategori))
  ) {
    whereClause.kategoriId = parseInt(kategori);
  }

  const [berita, totalBerita, kategoriList] = await Promise.all([
    prisma.berita.findMany({
      where: whereClause,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
      include: { kategori: true },
    }),
    prisma.berita.count({ where: whereClause }),
    prisma.kategori.findMany({
      orderBy: { nama: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalBerita / pageSize);

  return {
    props: {
      berita: JSON.parse(JSON.stringify(berita)),
      kategoriList: JSON.parse(JSON.stringify(kategoriList)),
      totalBerita,
      currentPage: page,
      totalPages,
      currentSearch:
        search && typeof search === "string" && search.trim() !== ""
          ? search
          : null,
      currentKategori:
        kategori && typeof kategori === "string" && kategori.trim() !== ""
          ? kategori
          : null,
    },
  };
};
