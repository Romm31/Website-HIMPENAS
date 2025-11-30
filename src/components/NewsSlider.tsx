// src/components/NewsSlider.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BeritaType } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, ArrowRight, Calendar, Clock, TrendingUp } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    <section id="berita" ref={ref} className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 md:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-green-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 rounded-full mb-4 md:mb-6">
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-himp" />
            <span className="text-xs md:text-sm font-semibold text-emerald-himp uppercase tracking-wide">
              Update Terkini
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Berita <span className="text-emerald-himp">Terbaru</span>
          </h2>
          <div className="w-20 md:w-24 h-1 bg-emerald-himp mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Ikuti terus informasi dan kegiatan terkini dari HIMPENAS
          </p>
        </div>

        {/* Slider Section */}
        <div
          className={`relative news-slider-container transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
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
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="!pb-14 md:!pb-16"
          >
            {berita.map((item, index) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Card Border Gradient on Hover */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-emerald-himp opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
                  
                  <Link href={`/berita/${item.id}`} className="block relative">
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      {item.gambarUrl ? (
                        <>
                          <Image
                            src={item.gambarUrl}
                            alt={item.judul}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* "NEW" Badge */}
                          <div className="absolute top-3 left-3 px-2.5 py-0.5 md:px-3 md:py-1 bg-emerald-himp text-white text-[10px] md:text-xs font-bold rounded-full shadow-lg transform -rotate-3">
                            NEW
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                            </div>
                            <span className="text-xs md:text-sm text-gray-400">Gambar tidak tersedia</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-4 md:p-6 relative">
                    {/* Date/Time Badge */}
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                      <span className="truncate">{formatDate(item.createdAt)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 md:mb-4 text-sm md:text-base lg:text-lg font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] leading-snug break-words">
                      <Link
                        href={`/berita/${item.id}`}
                        className="transition-colors duration-300 hover:text-emerald-himp relative group/title"
                      >
                        {item.judul}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-himp group-hover/title:w-full transition-all duration-300"></span>
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3 md:mb-4 break-words">
                      {getExcerpt(item.konten, 100)}
                    </p>

                    <div className="flex-grow" />

                    {/* CTA Button */}
                    <Link
                      href={`/berita/${item.id}`}
                      className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold text-emerald-dark transition-all duration-300 group/link"
                    >
                      <span className="relative">
                        Baca Selengkapnya
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-dark scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="custom-swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-3 md:-left-5 z-20 hidden lg:flex h-10 w-10 md:h-12 md:w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:bg-emerald-dark hover:text-white hover:scale-110 hover:shadow-2xl group">
            <ArrowLeft size={18} className="md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <button className="custom-swiper-button-next absolute top-1/2 -translate-y-1/2 -right-3 md:-right-5 z-20 hidden lg:flex h-10 w-10 md:h-12 md:w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:bg-emerald-dark hover:text-white hover:scale-110 hover:shadow-2xl group">
            <ArrowRight size={18} className="md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom flex justify-center gap-2 mt-8 md:mt-10"></div>
        </div>

        {/* CTA Button */}
        <div
          className={`text-center mt-12 md:mt-16 transition-all duration-700 delay-400 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Link
            href="/berita"
            className="group inline-flex items-center gap-2 md:gap-3 rounded-full bg-emerald-dark px-6 py-3 md:px-10 md:py-4 text-sm md:text-base font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-emerald-800 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative">Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        @media (min-width: 768px) {
          .swiper-pagination-custom .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
          }
        }
        
        .swiper-pagination-custom .swiper-pagination-bullet-active-custom {
          width: 28px;
          border-radius: 6px;
          background: #047857;
        }
        
        @media (min-width: 768px) {
          .swiper-pagination-custom .swiper-pagination-bullet-active-custom {
            width: 36px;
          }
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