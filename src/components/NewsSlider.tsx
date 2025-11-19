// src/components/NewsSlider.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BeritaType } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, ArrowRight, Calendar, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface NewsSliderProps {
  berita: BeritaType[];
}

const NewsSlider: React.FC<NewsSliderProps> = ({ berita }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Function to format date from createdAt
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Function to get excerpt from konten
  const getExcerpt = (konten: string, maxLength: number = 100) => {
    const text = konten.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <section id="berita" ref={ref} className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-himp" />
            <span className="text-sm font-semibold text-emerald-himp uppercase tracking-wide">
              Update Terkini
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Berita <span className="text-emerald-himp">Terbaru</span>
          </h2>
          <div className="w-24 h-1 bg-emerald-himp mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ikuti terus informasi dan kegiatan terkini dari HIMPENAS
          </p>
        </motion.div>

        {/* Slider Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative news-slider-container"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: '.custom-swiper-button-next',
              prevEl: '.custom-swiper-button-prev',
            }}
            pagination={{ 
              clickable: true, 
              el: '.swiper-pagination-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="!pb-16"
          >
            {berita.map((item, index) => (
              <SwiperSlide key={item.id} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Card Border Gradient on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-emerald-himp opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
                  
                  <Link href={`/berita/${item.id}`} className="block relative">
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      {item.gambarUrl ? (
                        <>
                          <Image
                            src={item.gambarUrl}
                            alt={item.judul}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* "NEW" Badge */}
                          <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-himp text-white text-xs font-bold rounded-full shadow-lg transform -rotate-3">
                            NEW
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-400">Gambar tidak tersedia</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-6 relative">
                    {/* Date/Time Badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-4 text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] leading-snug">
                      <Link
                        href={`/berita/${item.id}`}
                        className="transition-colors duration-300 hover:text-emerald-himp relative group/title"
                      >
                        {item.judul}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-himp group-hover/title:w-full transition-all duration-300"></span>
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {getExcerpt(item.konten, 120)}
                    </p>

                    <div className="flex-grow" />

                    {/* CTA Button */}
                    <Link
                      href={`/berita/${item.id}`}
                      className="inline-flex items-center gap-2 font-semibold text-emerald-dark transition-all duration-300 group/link"
                    >
                      <span className="relative">
                        Baca Selengkapnya
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-dark scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                    </Link>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="custom-swiper-button-prev absolute top-1/2 -left-5 z-20 hidden lg:flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:bg-emerald-dark hover:text-white hover:scale-110 hover:shadow-2xl group">
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          </div>
          <div className="custom-swiper-button-next absolute top-1/2 -right-5 z-20 hidden lg:flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:bg-emerald-dark hover:text-white hover:scale-110 hover:shadow-2xl group">
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </div>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom flex justify-center gap-2 mt-10"></div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/berita"
            className="group inline-flex items-center gap-3 rounded-full bg-emerald-dark px-10 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-emerald-800 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative">Lihat Semua Berita</span>
            <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-custom .swiper-pagination-bullet-active-custom {
          width: 36px;
          border-radius: 6px;
          background: #047857;
        }
        
        .swiper-pagination-custom .swiper-pagination-bullet:hover {
          background: #9ca3af;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
};

export default NewsSlider;