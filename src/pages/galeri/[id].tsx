import { GetServerSideProps, NextPage } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import Lightbox, { MediaItem } from "@/components/Lightbox";

interface GalleryAlbum {
  id: number;
  title: string;
  description?: string | null;
  coverImageUrl: string;
  createdAt: string;
  updatedAt: string;
  mediaItems: MediaItem[];
}

interface GalleryPageProps {
  album: GalleryAlbum;
}

const GalleryPage: NextPage<GalleryPageProps> = ({ album }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const showNext = () =>
    setLightboxIndex((i) =>
      i !== null && i < album.mediaItems.length - 1 ? i + 1 : i
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Header */}
      <header className="bg-emerald-dark text-white py-24 text-center relative">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            {album.title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            {album.description || "Dokumentasi kegiatan HIMPENAS"}
          </p>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="flex-grow container mx-auto px-4 py-16">
        {album.mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {album.mediaItems.map((item, index) => (
              <div
                key={item.id}
                className="relative w-full h-48 md:h-64 cursor-pointer group overflow-hidden rounded-xl shadow-md"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={item.title ?? "Media"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20 text-xl">
            Belum ada media di album ini.
          </div>
        )}
      </main>

      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          media={album.mediaItems[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < album.mediaItems.length - 1}
        />
      )}
    </div>
  );
};

export default GalleryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.params?.id as string);
  if (isNaN(id)) return { notFound: true };

  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { mediaItems: true },
  });

  if (!album) return { notFound: true };

  return {
    props: {
      album: JSON.parse(JSON.stringify(album)),
    },
  };
};
