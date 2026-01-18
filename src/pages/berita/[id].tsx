// src/pages/berita/[id].tsx

import type { GetServerSideProps, NextPage } from "next";
import { Berita, Kategori } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Eye, Clock, Share2, Bookmark, ChevronRight, TrendingUp, Tag, ArrowLeft } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

type BeritaWithKategori = Berita & { kategori: Kategori | null };

interface BeritaDetailPageProps {
  berita: BeritaWithKategori;
  otherBerita: BeritaWithKategori[];
  kategoriList: Kategori[];
}

const BeritaDetailPage: NextPage<BeritaDetailPageProps> = ({
  berita,
  otherBerita,
  kategoriList,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const publicationDate = new Date(berita.createdAt).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Kemarin';
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return publicationDate;
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cleanHtmlForMeta = (html: string) => {
    if (typeof document !== 'undefined') {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    }
    return html.replace(/<[^>]+>/g, '');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: berita.judul,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <>
      <Head>
        <title>{`${berita.judul} - HIMPENAS`}</title>
        <meta name="description" content={cleanHtmlForMeta(berita.konten).substring(0, 155)} />
      </Head>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section - Enhanced */}
        <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          {/* Background Image with Parallax */}
          {berita.gambarUrl && (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <Image
                src={berita.gambarUrl}
                alt={berita.judul}
                layout="fill"
                objectFit="cover"
                priority
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-8 md:pb-12 lg:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl"
              >
                {/* Back Button */}
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 md:mb-6 group transition-all"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm md:text-base font-medium">Kembali ke Berita</span>
                </Link>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  {berita.kategori && (
                    <Link
                      href={`/berita?kategori=${berita.kategori.nama.toLowerCase()}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-md px-4 py-2 rounded-lg text-white text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-300 border border-emerald-400/50 shadow-lg"
                    >
                      <Tag className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {berita.kategori.nama}
                    </Link>
                  )}

                  <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="font-medium">{getTimeAgo(berita.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                      <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="font-medium">{berita.views?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-2xl mb-4 md:mb-6"
                >
                  {berita.judul}
                </motion.h1>

                {/* Date & Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base font-medium">{publicationDate}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 md:p-2.5 rounded-lg backdrop-blur-md border transition-all duration-300 ${
                        isBookmarked
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="p-2 md:p-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Bottom Wave */}
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

        </section>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8 min-w-0"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 md:p-10 lg:p-12 overflow-hidden">
                  <div className="ql-snow">
                    <div
                      className="ql-editor !h-auto !min-h-0 !overflow-visible !p-0 !text-base
                                 prose prose-base md:prose-lg max-w-none w-full break-words
                                 prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4
                                 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                 prose-strong:text-gray-900 prose-strong:font-bold
                                 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6
                                 prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700 prose-blockquote:italic
                                 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700 prose-li:mb-2
                                 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-emerald-600
                                 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4
                                 prose-hr:border-gray-300 prose-hr:my-8
                                 prose-table:border-collapse prose-th:bg-emerald-50 prose-th:border prose-th:p-3 prose-td:border prose-td:p-3
                                 [&>*:first-child]:mt-0"
                      dangerouslySetInnerHTML={{ __html: berita.konten }}
                    />
                  </div>
              </div>

              {/* Tags */}
              {berita.kategori && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 p-6 bg-white rounded-2xl shadow-lg"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-emerald-600" />
                    Kategori Artikel
                  </h3>
                  <Link
                    href={`/berita?kategori=${berita.kategori.nama.toLowerCase()}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300 border border-emerald-200 hover:border-emerald-300"
                  >
                    {berita.kategori.nama}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6 md:space-y-8">
              {/* Trending News */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white shadow-lg rounded-2xl p-6 sticky top-4"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Trending</h3>
                </div>

                <div className="space-y-4">
                  {otherBerita.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        href={`/berita/${item.id}`}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-emerald-100 hover:shadow-md"
                      >
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-100">
                          {item.gambarUrl ? (
                            <Image
                              src={item.gambarUrl}
                              alt={item.judul}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                              <TrendingUp className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm md:text-base text-gray-800 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors mb-2">
                            {item.judul}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{item.views?.toLocaleString() || 0} views</span>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white shadow-lg rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  Kategori Lainnya
                </h3>
                <div className="flex flex-wrap gap-2">
                  {kategoriList.map((kat) => (
                    <Link
                      key={kat.id}
                      href={`/berita?kategori=${kat.nama.toLowerCase()}`}
                      className="bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      {kat.nama}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </aside>
          </div>
        </main>

        {/* Related Articles */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                Baca Juga
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Artikel lainnya yang mungkin menarik untuk Anda
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {otherBerita.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link
                    href={`/berita/${item.id}`}
                    className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100">
                      {item.gambarUrl ? (
                        <Image
                          src={item.gambarUrl}
                          alt={item.judul}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TrendingUp className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-5 md:p-6">
                      {item.kategori && (
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          {item.kategori.nama}
                        </span>
                      )}
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 group-hover:text-emerald-600 line-clamp-2 mb-3 transition-colors">
                        {item.judul}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default BeritaDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.params?.id as string);
  if (isNaN(id)) return { notFound: true };

  const berita = await prisma.berita.findUnique({
    where: { id },
    include: { kategori: true },
  });

  if (!berita) return { notFound: true };

  await prisma.berita.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  const otherBerita = await prisma.berita.findMany({
    where: { NOT: { id } },
    take: 5,
    orderBy: { views: 'desc' },
    include: { kategori: true },
  });

  const kategoriList = await prisma.kategori.findMany({
    orderBy: { nama: "asc" },
  });

  return {
    props: {
      berita: JSON.parse(JSON.stringify(berita)),
      otherBerita: JSON.parse(JSON.stringify(otherBerita)),
      kategoriList: JSON.parse(JSON.stringify(kategoriList)),
    },
  };
};