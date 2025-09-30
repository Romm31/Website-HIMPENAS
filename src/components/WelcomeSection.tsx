import React from 'react';
import { useInView } from 'react-intersection-observer';

const WelcomeSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    // PERUBAHAN DI SINI: py-20 diubah menjadi pt-8 pb-20
    <section ref={ref} className={`bg-white pt-8 pb-20 fade-in-section ${inView ? 'is-visible' : ''}`}>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-himp to-emerald-dark">
          Selamat Datang
        </h2>
        <p className="mt-4 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          di Himpunan Pengolahan Sawit (HIMPENAS), Jelajahi inovasi, berita, dan kegiatan terbaru dari kami.
        </p>
      
      </div>
    </section>
  );
};

export default WelcomeSection;