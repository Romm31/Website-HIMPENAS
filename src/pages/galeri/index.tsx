// src/pages/galeri/index.tsx

import { GetServerSideProps, NextPage } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { GalleryAlbum } from '@prisma/client';
import GalleryFilterControls from '@/components/GalleryFilterControls';
import Pagination from '@/components/Pagination';
import AlbumCard from '@/components/AlbumCard';
import { useRef, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Camera, FolderSearch, Images, Video, Sparkles, Grid3x3 } from 'lucide-react';

type AlbumWithCount = GalleryAlbum & {
  _count: {
    mediaItems: number;
  };
};

interface GaleriPageProps {
  albums: AlbumWithCount[];
  totalAlbums: number;
  currentPage: number;
  totalPages: number;
  currentSearch?: string;
  currentFilter?: string;
}

const GaleriPage: NextPage<GaleriPageProps> = ({
  albums,
  totalAlbums,
  currentPage,
  totalPages,
  currentSearch,
  currentFilter,
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Premium Header */}
      <header
        ref={headerRef}
        className="relative bg-gradient-to-br from-emerald-dark via-emerald-himp to-emerald-700 text-white pt-32 md:pt-40 pb-28 md:pb-36 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/header/event-header.jpeg"
            fill
            className="object-cover"
            alt="Gallery Background"
            priority
          />
        </div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/90 via-emerald-himp/80 to-emerald-700/90"></div>

        {/* Decorative Shapes */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
        ></motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full mb-6 border border-white/30 shadow-lg"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-white">
                Dokumentasi Visual HIMPENAS
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              Galeri Kegiatan
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              Dokumentasi visual dari setiap momen berharga dan kegiatan inspiratif HIMPENAS
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6"
            >
              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Grid3x3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white">{totalAlbums}</div>
                    <div className="text-sm text-white/80 font-medium">Total Album</div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Images className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {albums.reduce((acc, album) => acc + album._count.mediaItems, 0)}
                    </div>
                    <div className="text-sm text-white/80 font-medium">Media Items</div>
                  </div>
                </div>
              </div>
            </motion.div>
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
      <main className="flex-grow -mt-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-20">
          {/* Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <GalleryFilterControls />
          </motion.div>

          {/* Results Info */}
          {(currentSearch || currentFilter) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between px-6 py-4 bg-emerald-50 rounded-xl border border-emerald-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-himp rounded-lg">
                  <FolderSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hasil Pencarian</p>
                  <p className="font-bold text-gray-900">
                    Ditemukan {albums.length} album dari {totalAlbums} total
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Album Grid */}
          {albums.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {albums.map((album) => (
                <motion.div key={album.id} variants={itemVariants}>
                  <AlbumCard album={album} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center border border-gray-100"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center">
                <FolderSearch className="w-12 h-12 text-emerald-himp" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Album Tidak Ditemukan
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                Coba gunakan kata kunci atau filter yang berbeda untuk menemukan album yang Anda cari
              </p>
              <button
                onClick={() => (window.location.href = '/galeri')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-himp text-white rounded-full font-semibold hover:bg-emerald-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Reset Filter
              </button>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/galeri"
                query={{ search: currentSearch, filter: currentFilter }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Jelajahi Koleksi Kami
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Temukan berbagai momen berharga dari setiap kegiatan HIMPENAS
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-himp to-emerald-dark rounded-xl flex items-center justify-center">
                  <Images className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Foto Berkualitas</h3>
                <p className="text-gray-600">
                  Dokumentasi foto berkualitas tinggi dari setiap momen kegiatan
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-himp to-emerald-dark rounded-xl flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Video Dokumentasi</h3>
                <p className="text-gray-600">
                  Rekaman video lengkap untuk menghidupkan kembali setiap acara
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-himp to-emerald-dark rounded-xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Album Terorganisir</h3>
                <p className="text-gray-600">
                  Setiap album dikategorikan dengan rapi untuk kemudahan akses
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GaleriPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageSize = 9;
  const page = parseInt(context.query.page as string) || 1;
  const search = context.query.search as string | undefined;
  const filter = context.query.filter as string | undefined;

  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  const mediaFilter: any = {};
  if (filter === 'foto') {
    mediaFilter.some = { type: 'IMAGE' };
  }
  if (filter === 'video') {
    mediaFilter.some = { type: 'VIDEO' };
  }
  if (Object.keys(mediaFilter).length > 0) {
    whereClause.mediaItems = mediaFilter;
  }
  
  const [albums, totalAlbums] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where: whereClause,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { mediaItems: true },
        },
      },
    }),
    prisma.galleryAlbum.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalAlbums / pageSize);

  return {
    props: {
      albums: JSON.parse(JSON.stringify(albums)),
      totalAlbums,
      currentPage: page,
      totalPages,
      currentSearch: search || null,
      currentFilter: filter || null,
    },
  };
};