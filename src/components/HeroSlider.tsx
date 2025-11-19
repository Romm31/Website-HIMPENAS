import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Slide } from '@prisma/client';
import { BeritaType } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Eye, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroSliderProps {
  slides: Slide[];
  berita: BeritaType[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, berita }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const combinedSlides = [
    ...slides.map((slide) => ({
      id: `slide-${slide.id}`,
      title: slide.title,
      imageUrl: slide.imageUrl,
      href: '/',
      type: 'slide' as const,
    })),
    ...berita
      .filter((item) => item.gambarUrl)
      .slice(0, 5)
      .map((item) => ({
        id: `berita-${item.id}`,
        title: item.judul,
        imageUrl: item.gambarUrl!,
        href: `/berita/${item.id}`,
        type: 'berita' as const,
        date: item.createdAt,
      })),
  ];

  if (combinedSlides.length === 0) {
    return (
      <div className="w-full h-[70vh] md:h-[85vh] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-base md:text-lg">Tidak ada slide untuk ditampilkan.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    return formatDate(date);
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-gray-900">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Navigation]}
        effect="fade"
        slidesPerView={1}
        navigation={{
          nextEl: '.hero-button-next',
          prevEl: '.hero-button-prev',
        }}
        pagination={{
          el: '.swiper-pagination-hero',
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active-hero',
        }}
        loop={true}
        autoplay={{ 
          delay: 6000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {combinedSlides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="w-full h-full">
            <div 
              className="block w-full h-full relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover transition-all duration-[8000ms] ease-out group-hover:scale-[1.06]"
                  priority={index < 2}
                />
              </div>

              {/* Gradient Overlays - Optimized for Mobile */}
              {slide.type === 'berita' ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 md:from-black/95 md:via-black/60 md:to-black/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent hidden md:block"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-emerald-800/10 to-transparent"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent md:from-black/40 md:via-black/10"></div>
                  <motion.div 
                    className="absolute inset-0 bg-black/20"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </>
              )}

              {/* Content Container - Responsive */}
              {slide.type === 'berita' && (
                <div className="absolute inset-0 flex items-end md:items-end">
                  <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-20 sm:pb-24 md:pb-20 lg:pb-24">
                    <AnimatePresence mode="wait">
                      {activeIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="max-w-full md:max-w-3xl lg:max-w-4xl"
                        >
                          {/* Top Meta Info - Responsive */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-5"
                          >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500/90 backdrop-blur-md rounded-lg border border-emerald-400/50 shadow-lg hover:bg-emerald-600/90 transition-all duration-300 cursor-pointer group/badge">
                              <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 text-white group-hover/badge:scale-110 transition-transform" />
                              <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wide">
                                Berita Terkini
                              </span>
                            </div>

                            {/* Time Badge */}
                            {slide.date && (
                              <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group/time">
                                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-300 group-hover/time:rotate-12 transition-transform" />
                                <span className="text-[10px] md:text-xs font-medium text-white/90">
                                  {getTimeAgo(slide.date)}
                                </span>
                              </div>
                            )}
                          </motion.div>

                          {/* Title - Mobile Optimized */}
                          <motion.h2
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4 leading-tight drop-shadow-2xl hover:text-emerald-300 transition-colors duration-300 cursor-pointer line-clamp-2 md:line-clamp-3"
                          >
                            {slide.title}
                          </motion.h2>

                          {/* Decorative Line */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="h-0.5 md:h-1 w-16 md:w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mb-4 md:mb-6 origin-left"
                          ></motion.div>

                          {/* Date - Desktop Only */}
                          {slide.date && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.6, delay: 0.45 }}
                              className="hidden md:flex items-center gap-3 text-white/80 mb-6 md:mb-8"
                            >
                              <div className="p-2 md:p-2.5 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer group/cal">
                                <Calendar className="w-4 h-4 group-hover/cal:scale-110 group-hover/cal:text-emerald-300 transition-all duration-300" />
                              </div>
                              <span className="text-sm font-semibold tracking-wide">{formatDate(slide.date)}</span>
                            </motion.div>
                          )}

                          {/* CTA Buttons - Responsive */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex gap-2 md:gap-4 flex-wrap items-center"
                          >
                            {/* Primary Button */}
                            <Link
                              href={slide.href}
                              className="group/btn relative inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 md:px-8 py-3 md:py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-105 overflow-hidden text-sm md:text-base"
                            >
                              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                              
                              <Eye className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover/btn:scale-110 transition-transform" />
                              <span className="relative z-10 hidden sm:inline">Baca Selengkapnya</span>
                              <span className="relative z-10 sm:hidden">Baca</span>
                              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-all duration-300 group-hover/btn:translate-x-2" />
                            </Link>

                            {/* Secondary Button - Hidden on small mobile */}
                            <Link
                              href="/berita"
                              className="hidden sm:inline-flex group/btn2 items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-5 md:px-7 py-3 md:py-4 rounded-xl font-semibold border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 text-sm md:text-base"
                            >
                              <span>Semua Berita</span>
                              <motion.div 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              ></motion.div>
                            </Link>
                          </motion.div>

                          {/* Stats Bar - Desktop Only */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="hidden md:flex items-center gap-6 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10"
                          >
                            <div className="flex items-center gap-2 text-white/70 hover:text-emerald-300 transition-colors cursor-pointer group/stat">
                              <Eye className="w-4 h-4 group-hover/stat:scale-110 transition-transform" />
                              <span className="text-sm font-medium">2.4k views</span>
                            </div>
                            <div className="w-1 h-4 bg-white/20 rounded-full"></div>
                            <div className="text-white/70 text-sm font-medium hover:text-emerald-300 transition-colors cursor-pointer">
                              5 min read
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Decorative Top Bar */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              ></motion.div>

              {/* Floating Particles - Reduced on Mobile */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 md:opacity-60">
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-1.5 md:w-2 h-1.5 md:h-2 bg-emerald-300 rounded-full blur-sm"
                  animate={{ 
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                <motion.div 
                  className="absolute top-1/3 right-1/3 w-1 md:w-1.5 h-1 md:h-1.5 bg-white rounded-full blur-sm"
                  animate={{ 
                    y: [0, -40, 0],
                    x: [0, -15, 0],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                ></motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Responsive */}
      <motion.button 
        className="hero-button-prev absolute left-3 md:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-xl hover:bg-emerald-500 text-white rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/20 hover:border-emerald-400 shadow-2xl group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-all duration-300 group-hover:-translate-x-1" />
      </motion.button>

      <motion.button 
        className="hero-button-next absolute right-3 md:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-xl hover:bg-emerald-500 text-white rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/20 hover:border-emerald-400 shadow-2xl group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-all duration-300 group-hover:translate-x-1" />
      </motion.button>

      {/* Pagination - Responsive */}
      <div className="absolute bottom-16 md:bottom-8 lg:bottom-12 w-full z-10">
        <div className="swiper-pagination-hero flex justify-center gap-2 md:gap-3"></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-white/10 z-10 overflow-hidden">
        <motion.div
          key={activeIndex}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 origin-left relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          ></motion.div>
        </motion.div>
      </div>

      {/* Responsive Styles */}
      <style jsx global>{`
        .swiper-pagination-hero .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .swiper-pagination-hero .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
          }
        }

        .swiper-pagination-hero .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.3);
          border-color: rgba(16, 185, 129, 0.8);
        }

        .swiper-pagination-hero .swiper-pagination-bullet-active-hero {
          width: 32px;
          border-radius: 5px;
          background: linear-gradient(90deg, #10b981, #059669);
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
        }

        @media (min-width: 768px) {
          .swiper-pagination-hero .swiper-pagination-bullet-active-hero {
            width: 40px;
            border-radius: 6px;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;