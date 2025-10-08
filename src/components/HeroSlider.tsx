import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Slide } from '@prisma/client';
import { BeritaType } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  slides: Slide[];
  berita: BeritaType[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, berita }) => {
  const combinedSlides = [
    ...slides.map((slide) => ({
      id: `slide-${slide.id}`,
      title: slide.title,
      imageUrl: slide.imageUrl,
      href: '/',
    })),
    ...berita
      .filter((item) => item.gambarUrl)
      .map((item) => ({
        id: `berita-${item.id}`,
        title: item.judul,
        imageUrl: item.gambarUrl!,
        href: `/berita/${item.id}`,
      })),
  ];

  if (combinedSlides.length === 0) {
    return (
      <div className="w-full h-[85vh] bg-gray-300 flex items-center justify-center">
        <p className="text-gray-500">Tidak ada slide untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-gray-900">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        pagination={{
          el: '.swiper-pagination-hero',
          clickable: true,
        }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {combinedSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="w-full h-full">
            <Link href={slide.href} className="block w-full h-full relative group">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover brightness-75 group-hover:brightness-50 transition-all duration-300"
                priority={slide.id.startsWith('slide-')}
              />
              {/* Background overlay tanpa judul */}
              {slide.id.startsWith('slide-') && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              )}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="absolute bottom-6 md:bottom-10 lg:bottom-12 w-full z-10">
        <div className="swiper-pagination-hero"></div>
      </div>
    </section>
  );
};

export default HeroSlider;
