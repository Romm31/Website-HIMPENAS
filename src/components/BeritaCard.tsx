import React from "react";
import { Berita, Kategori } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Eye, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { stripHtml, getExcerpt } from "@/utils/stringUtils";

type BeritaWithKategori = Berita & { kategori: Kategori | null };

interface BeritaCardProps {
  berita: BeritaWithKategori;
}

const BeritaCard: React.FC<BeritaCardProps> = ({ berita }) => {
  const date = new Date(berita.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate reading time (avg 200 words per minute)
  const cleanContent = stripHtml(berita.konten);
  const wordCount = cleanContent.split(" ").length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Link href={`/berita/${berita.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden border border-gray-100 hover:border-emerald-200 relative"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-green-50/0 group-hover:from-emerald-50/50 group-hover:to-green-50/30 transition-all duration-500 pointer-events-none rounded-2xl"></div>

        {/* Image Container */}
        <div className="relative w-full h-56 overflow-hidden">
          {berita.gambarUrl ? (
            <>
              <Image
                src={berita.gambarUrl}
                alt={berita.judul}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Category Badge on Image */}
              {berita.kategori && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-himp/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg">
                    <Tag className="w-3 h-3" />
                    {berita.kategori.nama}
                  </div>
                </div>
              )}

              {/* Views Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  <Eye className="w-3 h-3" />
                  {berita.views || 0}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-sm font-medium">Gambar tidak tersedia</span>
            </div>
          )}

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-bl-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>

        {/* Content Container */}
        <div className="relative flex flex-col flex-grow p-6">
          {/* Date & Reading Time */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-himp" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-himp" />
              <span>{readingTime} min baca</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-emerald-dark transition-colors duration-300">
            {berita.judul}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 flex-grow leading-relaxed mb-4">
            {getExcerpt(berita.konten, 150)}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

          {/* CTA Button */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-emerald-dark font-bold text-sm transition-all duration-300 group-hover:gap-3">
              Baca Selengkapnya
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>

            {/* Hidden indicator - shows on hover */}
            <div className="w-2 h-2 bg-emerald-himp rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-1 bg-emerald-himp w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
      </motion.div>
    </Link>
  );
};

export default BeritaCard