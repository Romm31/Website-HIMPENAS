import type { GetServerSideProps, NextPage } from "next";
import { Visi, Misi } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Sparkles, TrendingUp, Eye, ListChecks } from "lucide-react";

interface VisiMisiPageProps {
  visi: Visi | null;
  misi: Misi | null;
}

const VisiMisiPage: NextPage<VisiMisiPageProps> = ({ visi, misi }) => {
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

      {/* Premium Header */}
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
            alt="Visi Misi Background"
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
              <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-white">
                Arah & Tujuan HIMPENAS
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              Visi & Misi
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              Arah dan tujuan yang menjadi landasan gerak HIMPENAS menuju masa depan yang lebih baik
            </motion.p>

            {/* Stats/Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6"
            >
              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-white/80 font-medium">Visi Jelas</div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <ListChecks className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-white/80 font-medium">Misi Terukur</div>
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
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* VISI Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-emerald-himp to-emerald-dark p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                          Visi Kami
                        </h2>
                      </div>
                      <div className="h-1 w-24 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 md:p-10 flex-grow">
                    <div
                      className="prose prose-lg max-w-none
                                 prose-headings:text-gray-900 prose-headings:font-bold
                                 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700 prose-li:mb-2
                                 prose-strong:text-emerald-himp prose-strong:font-bold"
                      dangerouslySetInnerHTML={{
                        __html: visi?.konten || "<p class='text-gray-500 italic'>Visi belum diatur.</p>",
                      }}
                    />
                  </div>

                  {/* Decorative Footer */}
                  <div className="px-8 pb-8">
                    <div className="flex items-center gap-2 text-emerald-himp">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm font-semibold">Visi untuk Masa Depan</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* MISI Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-emerald-himp to-emerald-dark p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <ListChecks className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                          Misi Kami
                        </h2>
                      </div>
                      <div className="h-1 w-24 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 md:p-10 flex-grow">
                    <div
                      className="prose prose-lg max-w-none
                                 prose-headings:text-gray-900 prose-headings:font-bold
                                 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700 prose-li:mb-2 prose-li:marker:text-emerald-himp
                                 prose-strong:text-emerald-himp prose-strong:font-bold"
                      dangerouslySetInnerHTML={{
                        __html: misi?.konten || "<p class='text-gray-500 italic'>Misi belum diatur.</p>",
                      }}
                    />
                  </div>

                  {/* Decorative Footer */}
                  <div className="px-8 pb-8">
                    <div className="flex items-center gap-2 text-emerald-himp">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-semibold">Langkah Nyata untuk Tujuan</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-dark to-emerald-himp">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6 border border-white/30">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-sm font-bold uppercase tracking-wider text-white">Mari Bergabung</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
                Wujudkan Visi Bersama HIMPENAS
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan kami untuk mewujudkan visi dan misi HIMPENAS dalam memajukan organisasi dan mengembangkan potensi mahasiswa
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-white text-emerald-himp px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span>Hubungi Kami</span>
                <TrendingUp className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VisiMisiPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const [visi, misi] = await Promise.all([
    prisma.visi.findFirst(),
    prisma.misi.findFirst(),
  ]);

  return {
    props: {
      visi: JSON.parse(JSON.stringify(visi)),
      misi: JSON.parse(JSON.stringify(misi)),
    },
  };
};