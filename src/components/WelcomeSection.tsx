import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Sparkles, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section 
      ref={ref} 
      className={`relative bg-gradient-to-b from-white via-gray-50 to-white pt-16 pb-24 overflow-hidden fade-in-section ${
        inView ? 'is-visible' : ''
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-himp rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-emerald-dark rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-emerald-himp rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-emerald-dark rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white shadow-lg rounded-full mb-8 border border-emerald-100"
        >
          <Sparkles className="w-4 h-4 text-emerald-himp animate-pulse" />
          <span className="text-sm font-bold text-emerald-dark uppercase tracking-wider">
            Portal Resmi HIMPENAS
          </span>
          <Sparkles className="w-4 h-4 text-emerald-himp animate-pulse" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight mb-6"
        >
          <span className="inline-block">
            Selamat{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-himp via-emerald-dark to-emerald-himp animate-gradient">
                Datang
              </span>
              {/* Underline Animation */}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-himp to-emerald-dark rounded-full"></span>
            </span>
          </span>
        </motion.h1>

        {/* Subtitle with Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed mb-4">
            di <span className="font-bold text-emerald-dark">Himpunan Pengolahan Sawit</span>
          </p>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Jelajahi inovasi, berita, dan kegiatan terbaru dari kami
          </p>
        </motion.div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: inView ? 1 : 0, scaleX: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-3 mt-8 mb-8"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-himp"></div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-himp animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-dark animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 rounded-full bg-emerald-himp animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-himp"></div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
        >
          {[
            { number: '500+', label: 'Anggota', icon: '👥' },
            { number: '10+', label: 'Prestasi', icon: '🏆' },
            { number: '50+', label: 'Event', icon: '📅' },
            { number: '100+', label: 'Proyek', icon: '🚀' },
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Border on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-himp to-emerald-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 blur-md"></div>
              
              <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-dark mb-1">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <div className="inline-flex flex-col items-center gap-2 text-gray-400 hover:text-emerald-dark transition-colors duration-300 cursor-pointer">
            <span className="text-sm font-medium">Scroll untuk lebih lanjut</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default WelcomeSection;