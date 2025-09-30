import { GetServerSideProps, NextPage } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { GalleryAlbum } from '@prisma/client';
import GalleryFilterControls from '@/components/GalleryFilterControls';
import Pagination from '@/components/Pagination';
import AlbumCard from '@/components/AlbumCard';

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
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <header className="bg-emerald-dark text-white pt-24 pb-40 relative">
        <div className="absolute inset-0 opacity-10">
          <Image src="/header/berita-header.jpeg" layout="fill" objectFit="cover" alt="Galeri Kegiatan" className="brightness-50" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading tracking-tight mt-2 mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Dokumentasi visual dari setiap momen berharga dan kegiatan inspiratif HIMPENAS.
          </p>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <GalleryFilterControls />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {albums.length > 0 ? (
              albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-2xl font-semibold">Album tidak ditemukan.</p>
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/galeri"
            query={{ search: currentSearch, filter: currentFilter }}
          />
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
  if (filter === 'foto') {
    whereClause.mediaItems = { some: { type: 'IMAGE' } };
  }
  if (filter === 'video') {
    whereClause.mediaItems = { some: { type: 'VIDEO' } };
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