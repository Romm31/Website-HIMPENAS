import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BeritaType } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';

interface NewsSliderProps {
  berita: BeritaType[];
}

const NewsSlider: React.FC<NewsSliderProps> = ({ berita }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="berita"
      ref={ref}
      className={`pt-5 pb-20 bg-gray-50 fade-in-section ${inView ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-5">
          <h2 className="text-4xl font-bold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-himp to-emerald-dark">
            Berita Terbaru
          </h2>
          <div className="mt-4 w-24 h-1 bg-emerald-himp mx-auto rounded-full"></div>
        </div>

        <div className="relative news-slider-container">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.custom-swiper-button-next',
              prevEl: '.custom-swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {berita.map((item) => (
              <SwiperSlide key={item.id} className="h-full">
                <Link href={`/berita/${item.id}`} className="block h-full">
                  <div className="bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col card-hover-effect group">
                    <div className="relative w-full h-56 bg-gray-200 overflow-hidden">
                      {item.gambarUrl ? (
                        <Image
                          src={item.gambarUrl}
                          alt={item.judul}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Gambar tidak tersedia
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-xl mb-3 text-gray-800 leading-tight group-hover:text-emerald-himp transition-colors flex-grow">
                        {item.judul}
                      </h3>
                      <span className="font-semibold text-emerald-himp mt-auto flex items-center">
                        Baca Selengkapnya
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Tombol navigasi custom */}
          <div className="custom-swiper-button-prev absolute top-1/2 left-0 -translate-y-1/2 z-10 cursor-pointer p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div className="custom-swiper-button-next absolute top-1/2 right-0 -translate-y-1/2 z-10 cursor-pointer p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/berita"
            className="inline-block bg-emerald-himp text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Lihat Semua Berita
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSlider;
