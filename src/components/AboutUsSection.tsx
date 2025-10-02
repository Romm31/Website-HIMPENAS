import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

interface AboutUsSectionProps {
  data: {
    profile?: string | null;
  } | null;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ data }) => {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      className={`py-20 bg-white transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Gambar */}
        <div
          className={`relative h-72 md:h-96 rounded-xl overflow-hidden shadow-lg transform transition duration-700 ${
            inView ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } hover:scale-105 hover:shadow-2xl`}
        >
          <Image
            src="/about/about.jpeg"
            alt="Tentang Himpunan"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>

        {/* Konten */}
        <div
          className={`transition-all duration-700 delay-150 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-dark mb-6">
            Tentang Kami
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
            {data?.profile ||
              "HIMPENAS adalah himpunan mahasiswa yang berkomitmen pada pengembangan diri, teknologi, dan solidaritas antar anggota."}
          </p>
          <Link
            href="/tentang"
            className="inline-block mt-6 bg-emerald-dark text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-emerald-dark hover:shadow-xl transition-all duration-300"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
