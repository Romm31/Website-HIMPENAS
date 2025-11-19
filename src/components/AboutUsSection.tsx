import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Users, Award, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
      className={`relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:hidden"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-himp" />
            <span className="text-sm font-semibold text-emerald-himp uppercase tracking-wide">
              Kenali Kami
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Gambar Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            {/* Main Image Container */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-3xl">
              <Image
                src="/about/about.jpeg"
                alt="Tentang Himpunan"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative Border */}
              <div className="absolute inset-0 border-4 border-emerald-himp/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Decorative Elements Around Image */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-himp/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-dark/20 rounded-full blur-2xl"></div>

            {/* Stats Floating Cards */}
            <div className="absolute -bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-emerald-dark" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-xs text-gray-600">Anggota Aktif</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-8 right-8 bg-white rounded-2xl shadow-xl p-4 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-emerald-dark" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">10+</div>
                  <div className="text-xs text-gray-600">Prestasi</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center md:text-left"
          >
            {/* Badge for Desktop */}
            <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-himp" />
              <span className="text-sm font-semibold text-emerald-himp uppercase tracking-wide">
                Kenali Kami
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tentang <span className="text-emerald-dark">Kami</span>
            </h2>

            {/* Divider */}
            <div className="w-24 h-1 bg-emerald-himp rounded-full mb-8 mx-auto md:mx-0"></div>

            {/* Content */}
            <div
              className="text-gray-600 text-base md:text-lg leading-relaxed prose prose-lg max-w-none mx-auto md:mx-0 mb-8"
              dangerouslySetInnerHTML={{
                __html:
                  data?.profile ||
                  "<p>HIMPENAS adalah himpunan mahasiswa yang berkomitmen pada pengembangan diri, teknologi, dan solidaritas antar anggota.</p>",
              }}
            />

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="group flex items-start gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors duration-300">
                <div className="bg-emerald-himp p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Inovatif</div>
                  <div className="text-xs text-gray-600">Solusi Kreatif</div>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors duration-300">
                <div className="bg-emerald-himp p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Kolaboratif</div>
                  <div className="text-xs text-gray-600">Kerja Tim Solid</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/tentang"
                className="group inline-flex items-center justify-center gap-3 bg-emerald-dark text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-emerald-800 transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative">Lihat Selengkapnya</span>
                <ArrowRight className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-2" />
              </Link>

              <button className="group inline-flex items-center justify-center gap-3 bg-white text-emerald-dark px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl border-2 border-emerald-dark transition-all duration-300 hover:scale-105">
                <span>Hubungi Kami</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Prose Styling */}
      <style jsx global>{`
        .prose p {
          margin-bottom: 1rem;
        }
        .prose strong {
          color: #047857;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
};

export default AboutUsSection;