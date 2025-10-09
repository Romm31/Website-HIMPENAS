// src/components/NewsSlider.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BeritaType } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface NewsSliderProps {
  berita: BeritaType[];
}

const NewsSlider: React.FC<NewsSliderProps> = ({ berita }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="berita" ref={ref} className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Berita Terbaru
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Ikuti terus informasi dan kegiatan terkini dari HIMPENAS.
          </p>
        </motion.div>

        <div className="relative news-slider-container">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.custom-swiper-button-next',
              prevEl: '.custom-swiper-button-prev',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-16"
          >
            {berita.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:border-emerald-500 hover:border"
                >
                  <Link href={`/berita/${item.id}`} className="block">
                    <div className="relative aspect-video w-full overflow-hidden">
                      {item.gambarUrl ? (
                        <Image
                          src={item.gambarUrl}
                          alt={item.judul}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-400">
                          Gambar tidak tersedia
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-3 text-lg font-bold text-gray-800 line-clamp-3 min-h-[5.25rem]">
                      <Link
                        href={`/berita/${item.id}`}
                        className="transition-colors hover:text-emerald-dark"
                      >
                        {item.judul}
                      </Link>
                    </h3>

                    <div className="flex-grow" />

                    <Link
                      href={`/berita/${item.id}`}
                      className="inline-flex items-center gap-2 font-semibold text-emerald-dark transition-all duration-300 hover:translate-x-1 hover:text-emerald-800"
                    >
                      Baca Selengkapnya
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </Link>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-swiper-button-prev absolute top-1/2 -left-4 z-10 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-emerald-dark hover:text-white sm:flex">
            <ArrowLeft size={20} />
          </div>
          <div className="custom-swiper-button-next absolute top-1/2 -right-4 z-10 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-emerald-dark hover:text-white sm:flex">
            <ArrowRight size={20} />
          </div>

          <div className="swiper-pagination-custom text-center mt-8"></div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/berita"
            className="inline-block rounded-lg bg-emerald-dark px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-xl"
          >
            Lihat Semua Berita
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSlider;
