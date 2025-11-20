// src/pages/galeri/[id].tsx

import { GetServerSideProps, NextPage } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Lightbox, { MediaItem } from "@/components/Lightbox";
import { PlayCircle, Images, Video, ArrowLeft, Calendar, Grid3x3, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryAlbum {
  id: number;
  title: string;
  description?: string | null;
  coverImageUrl: string;
  createdAt: Date;
  mediaItems: MediaItem[];
}

interface GalleryPageProps {
  album: GalleryAlbum;
}

const GalleryPage: NextPage<GalleryPageProps> = ({ album }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

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

  // ✅ FIX — declare BEFORE used in showNext/showPrev
  const filteredMedia = album.mediaItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "image") return item.type === "IMAGE";
    if (filter === "video") return item.type === "VIDEO";
    return true;
  });

  const openLightbox = (media: MediaItem) => setSelectedMedia(media);
  const closeLightbox = () => setSelectedMedia(null);

  const showNext = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex((i) => i.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % filteredMedia.length;
    setSelectedMedia(filteredMedia[nextIndex]);
  };

  const showPrev = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredMedia.findIndex((i) => i.id === selectedMedia.id);
    const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setSelectedMedia(filteredMedia[prevIndex]);
  };

  const hasNext =
    selectedMedia &&
    filteredMedia.findIndex((i) => i.id === selectedMedia.id) < filteredMedia.length - 1;

  const hasPrev =
    selectedMedia &&
    filteredMedia.findIndex((i) => i.id === selectedMedia.id) > 0;

  const imageCount = album.mediaItems.filter((item) => item.type === "IMAGE").length;
  const videoCount = album.mediaItems.filter((item) => item.type === "VIDEO").length;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: album.description || "Lihat album galeri HIMPENAS",
        url: window.location.href,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <header ref={headerRef} className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute inset-0">
          <Image src={album.coverImageUrl} alt={album.title} fill className="object-cover" priority />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="max-w-4xl">

              <Link href="/galeri" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 group transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base font-medium">Kembali ke Galeri</span>
              </Link>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl">
                {album.title}
              </h1>

              {album.description && (
                <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 leading-relaxed max-w-3xl">
                  {album.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{formatDate(album.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <Grid3x3 className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{album.mediaItems.length} Media</span>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleShare} className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* WAVE */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-12 md:h-16" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none">
            <path d="M0 22L60 26.7C120 31 240 41 360 39.2C480 37 600 23 720 17.8C840 13 960 17 1080 21.7C1200 26 1320 31 1380 33.3L1440 36V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" fill="rgb(249, 250, 251)" />
          </svg>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow -mt-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          {/* FILTER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-himp to-emerald-dark rounded-xl">
                    <Images className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{imageCount}</div>
                    <div className="text-sm text-gray-600">Foto</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-himp to-emerald-dark rounded-xl">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{videoCount}</div>
                    <div className="text-sm text-gray-600">Video</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilter("all")} className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${filter === "all" ? "bg-emerald-himp text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Semua</button>
                <button onClick={() => setFilter("image")} className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${filter === "image" ? "bg-emerald-himp text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Foto</button>
                <button onClick={() => setFilter("video")} className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${filter === "video" ? "bg-emerald-himp text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Video</button>
              </div>
            </div>
          </motion.div>

          {/* GRID */}
          {filteredMedia.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

              {filteredMedia.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.05 }} whileHover={{ y: -8 }} className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-video bg-gray-200" onClick={() => openLightbox(item)}>

                  {/* IMAGE */}
                  {item.type === "IMAGE" ? (
                    <>
                      <Image src={item.url} alt={item.title || "Gambar"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width:640px)50vw, (max-width:768px)33vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {item.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                          {item.title}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* VIDEO */}
                      {item.thumbnailUrl ? (
                        <Image src={item.thumbnailUrl} alt={item.title || "Video"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width:640px)50vw, (max-width:768px)33vw, 25vw" />
                      ) : (
                        <video src={`${item.url}#t=0.1`} className="h-full w-full object-cover" muted preload="metadata" playsInline />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-300">
                        <motion.div whileHover={{ scale: 1.2 }} className="p-4 bg-white/20 backdrop-blur-md rounded-full">
                          <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-2xl" />
                        </motion.div>
                      </div>

                      {item.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-medium text-sm bg-gradient-to-t from-black/80 to-transparent">
                          {item.title}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
                <Images className="w-12 h-12 text-gray-400" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tidak Ada Media</h3>

              <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                {filter === "all"
                  ? "Belum ada media di album ini"
                  : `Tidak ada ${filter === "image" ? "foto" : "video"} di album ini`}
              </p>

              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-himp text-white rounded-full font-semibold hover:bg-emerald-dark transition-colors duration-300 shadow-lg hover:shadow-xl">
                  Lihat Semua Media
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedMedia && (
          <Lightbox
            media={selectedMedia}
            onClose={closeLightbox}
            onPrev={showPrev}
            onNext={showNext}
            hasPrev={!!hasPrev}
            hasNext={!!hasNext}
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
      mediaItems: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!album) return { notFound: true };

  return {
    props: {
      album: JSON.parse(JSON.stringify(album)),
    },
  };
};
