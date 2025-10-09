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
import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion'; // ✅ TAMBAHKAN IMPORT `Variants`
import { FolderSearch } from 'lucide-react';

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
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: contentRef, inView: contentInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // ✅ TAMBAHKAN TIPE `Variants`
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // ✅ TAMBAHKAN TIPE `Variants`
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <header
        ref={headerRef}
        className="relative bg-emerald-dark pt-48 pb-40 text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <Image src="/header/event-header.jpeg" layout="fill" objectFit="cover" alt="Galeri Kegiatan" className="brightness-50" priority />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: headerInView ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading tracking-tight mt-2 mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Dokumentasi visual dari setiap momen berharga dan kegiatan inspiratif HIMPENAS.
          </p>
        </motion.div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <GalleryFilterControls />
          
          <motion.div
            ref={contentRef}
            variants={containerVariants}
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {albums.length > 0 ? (
              albums.map((album) => (
                <motion.div key={album.id} variants={itemVariants}>
                  <AlbumCard album={album} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <FolderSearch size={64} className="text-gray-300" />
                <p className="mt-6 text-gray-600 text-2xl font-semibold">Album tidak ditemukan</p>
                <p className="mt-2 text-gray-500">Coba gunakan kata kunci atau filter yang berbeda.</p>
              </div>
            )}
          </motion.div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/galeri"
              query={{ search: currentSearch, filter: currentFilter }}
            />
          )}
        </div>
      </main>
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