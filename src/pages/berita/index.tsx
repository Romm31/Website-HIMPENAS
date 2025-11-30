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
import { Newspaper, TrendingUp, Calendar, Sparkles } from "lucide-react";

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
        className="relative bg-gradient-to-br from-emerald-dark via-emerald-himp to-emerald-700 text-white pt-32 md:pt-40 pb-28 md:pb-36 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/header/berita-header.jpeg"
            fill
            className="object-cover"
            alt="Berita Background"
            priority
          />
        </div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/50 via-emerald-himp/50 to-emerald-700/50"></div>

        {/* Decorative Shapes */}
        <div 
          className="absolute top-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-64 h-64 md:w-80 md:h-80 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        ></div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white/20 backdrop-blur-xl rounded-full mb-6 border border-white/30 shadow-lg transition-all duration-700 ${
                headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <Newspaper className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-white">
                Pusat Informasi
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight transition-all duration-700 delay-200 ${
                headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Arsip Berita
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base md:text-lg lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto px-4 transition-all duration-700 delay-300 ${
                headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Temukan cerita, inovasi, dan aksi terbaru dari HIMPENAS
            </p>

            {/* Stats */}
            <div
              className={`flex flex-wrap justify-center gap-4 md:gap-6 transition-all duration-700 delay-500 ${
                headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 md:px-6 py-3 md:py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{totalBerita}</div>
                    <div className="text-xs md:text-sm text-white/80 font-medium">Total Berita</div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 md:px-6 py-3 md:py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{kategoriList.length}</div>
                    <div className="text-xs md:text-sm text-white/80 font-medium">Kategori</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none leading-none translate-y-4 md:translate-y-6">
          <svg
            className="w-full h-14 md:h-20"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            fill="none"
          >
            <path
              d="M0 22L60 26.7C120 31 240 41 360 39.2C480 37 600 23 720 17.8C840 13 960 17 1080 21.7C1200 26 1320 31 1380 33.3L1440 36V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"
              fill="rgb(249, 250, 251)"
            />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow -mt-20 relative z-10 bg-transparent">
        <div className="container mx-auto px-4 md:px-6 bg-transparent !shadow-none">
          {/* Filter Controls */}
          <FilterControls
            kategoriList={kategoriList}
            currentSearch={currentSearch}
            currentKategori={currentKategori}
          />

          {/* Results Info */}
          {(currentSearch || currentKategori) && (
            <div
              className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-4 bg-emerald-50 rounded-xl border border-emerald-200 gap-3 animate-in fade-in duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-himp rounded-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hasil Pencarian</p>
                  <p className="font-bold text-gray-900">
                    Ditemukan {berita.length} berita dari {totalBerita} total
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grid Berita */}
          {berita.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-500">
              {berita.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BeritaCard berita={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full animate-in zoom-in-95 duration-300">
              <div className="text-center py-16 md:py-20 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Newspaper className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Berita Tidak Ditemukan
                </h3>
                <p className="text-gray-600 text-base md:text-lg mb-6 max-w-md mx-auto px-4">
                  Coba gunakan kata kunci atau filter yang berbeda untuk
                  menemukan berita yang Anda cari.
                </p>
                <button
                  onClick={() => (window.location.href = "/berita")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-himp text-white rounded-full font-semibold hover:bg-emerald-dark transition-colors duration-300 hover:scale-105"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 md:mt-16 mb-12 md:mb-16">
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