// src/pages/galeri/[id].tsx

import { GetServerSideProps, NextPage } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import Lightbox, { MediaItem } from "@/components/Lightbox";
import { PlayCircle, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryAlbum {
  id: number;
  title: string;
  description?: string | null;
  coverImageUrl: string;
  mediaItems: MediaItem[];
}

interface GalleryPageProps {
  album: GalleryAlbum;
}

const GalleryPage: NextPage<GalleryPageProps> = ({ album }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const openLightbox = (media: MediaItem) => setSelectedMedia(media);
  const closeLightbox = () => setSelectedMedia(null);

  const showNext = () => {
    if (!selectedMedia) return;
    const currentIndex = album.mediaItems.findIndex(item => item.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % album.mediaItems.length;
    setSelectedMedia(album.mediaItems[nextIndex]);
  };

  const showPrev = () => {
    if (!selectedMedia) return;
    const currentIndex = album.mediaItems.findIndex(item => item.id === selectedMedia.id);
    const prevIndex = (currentIndex - 1 + album.mediaItems.length) % album.mediaItems.length;
    setSelectedMedia(album.mediaItems[prevIndex]);
  };

  const hasNext = selectedMedia ? album.mediaItems.findIndex(item => item.id === selectedMedia.id) < album.mediaItems.length - 1 : false;
  const hasPrev = selectedMedia ? album.mediaItems.findIndex(item => item.id === selectedMedia.id) > 0 : false;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <header className="relative h-[60vh] overflow-hidden text-center text-white">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            fill
            className="object-cover brightness-50"
            priority
          />
        </motion.div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/30 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-extrabold md:text-6xl"
          >
            {album.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 max-w-3xl text-lg text-gray-200 md:text-xl"
          >
            {album.description || "Dokumentasi kegiatan HIMPENAS"}
          </motion.p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {album.mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {album.mediaItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                // ✅ GANTI dari aspect-square menjadi aspect-video
                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md break-inside-avoid aspect-video bg-gray-200"
                onClick={() => openLightbox(item)}
              >
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.url}
                    alt={item.title || "Gambar"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <>
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title || "Video thumbnail"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <video
                        src={`${item.url}#t=0.1`}
                        className="h-full w-full object-cover bg-black"
                        muted
                        preload="metadata"
                        playsInline
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                      <PlayCircle className="text-6xl text-white opacity-90 drop-shadow-lg transition-transform group-hover:scale-110" />
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <ImageIcon size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-xl">Belum ada media di album ini.</p>
          </div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {selectedMedia && (
          <Lightbox
            media={selectedMedia}
            onClose={closeLightbox}
            onPrev={showPrev}
            onNext={showNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.params?.id as string);
  if (isNaN(id)) return { notFound: true };

  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { 
      mediaItems: {
        orderBy: {
          createdAt: 'asc'
        }
      } 
    },
  });

  if (!album) return { notFound: true };

  return {
    props: {
      album: JSON.parse(JSON.stringify(album)),
    },
  };
};