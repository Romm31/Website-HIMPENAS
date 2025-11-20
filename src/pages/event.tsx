import type { GetServerSideProps, NextPage } from 'next';
import { Event } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles, Archive, ArrowRight } from 'lucide-react';

interface EventPageProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

const EventPage: NextPage<EventPageProps> = ({ upcomingEvents, pastEvents }) => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerInView, setHeaderInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Premium Header */}
      <header
        ref={headerRef}
        className="relative bg-gradient-to-br from-emerald-dark via-emerald-himp to-emerald-700 text-white pt-32 md:pt-40 pb-28 md:pb-36 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/header/event-header.jpeg"
            fill
            className="object-cover"
            alt="Event Background"
            priority
          />
        </div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/50 via-emerald-himp/50 to-emerald-700/50"></div>

        {/* Decorative Shapes */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
        ></motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full mb-6 border border-white/30 shadow-lg"
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-white">
                Agenda Kegiatan HIMPENAS
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              Kalender Kegiatan
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              Ikuti berbagai acara dan kegiatan menarik yang diselenggarakan oleh HIMPENAS
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: headerInView ? 1 : 0, y: headerInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6"
            >
              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white">{upcomingEvents.length}</div>
                    <div className="text-sm text-white/80 font-medium">Acara Mendatang</div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white">{pastEvents.length}</div>
                    <div className="text-sm text-white/80 font-medium">Arsip Acara</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Separator */}
 <div className="absolute bottom-0 left-0 w-full pointer-events-none leading-none translate-y-4 md:translate-y-6">
  <svg
    className="w-full h-14 md:h-20"
    preserveAspectRatio="none"
    viewBox="0 0 1440 54"
    fill="none"
  >
    <path
      d="M0 22L60 26.7C120 31 240 41 360 39.2C480 37 600 23 720 17.8C840 13 960 17 1080 21.7C1200 26 1320 31 1380 33.3L1440 36V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"
      fill="rgb(249, 250, 251)"
    />
  </svg>
</div>

       
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {/* Upcoming Events */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-himp to-emerald-dark rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
                  Acara Mendatang
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg text-center md:text-left max-w-2xl">
                Jangan lewatkan keseruan acara-acara yang akan datang
              </p>
            </motion.div>

            {/* Event Cards Grid */}
            {upcomingEvents.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center border border-gray-100"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-emerald-himp" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Belum Ada Acara Terjadwal
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                  Pantau terus halaman ini untuk informasi acara terbaru dari HIMPENAS
                </p>
                <div className="inline-flex items-center gap-2 text-emerald-himp font-semibold">
                  <Clock className="w-5 h-5" />
                  <span>Coming Soon</span>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Past Events */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
                  Arsip Acara
                </h2>
              </div>
              <p className="text-gray-600 text-base md:text-lg text-center md:text-left max-w-2xl">
                Dokumentasi acara-acara yang telah terlaksana dengan sukses
              </p>
            </motion.div>

            {/* Event Cards Grid */}
            {pastEvents.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {pastEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                  >
                    <EventCard event={event} isPast={true} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-xl p-12 md:p-16 text-center border border-gray-100"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
                  <Archive className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Belum Ada Arsip Acara
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Arsip dokumentasi acara yang telah terlaksana akan muncul di sini
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-dark to-emerald-himp text-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6 border border-white/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Ikuti Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
                Jangan Lewatkan Acara Menarik Lainnya!
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Ikuti media sosial kami untuk mendapatkan update terbaru seputar acara dan kegiatan HIMPENAS
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-white text-emerald-himp px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span>Hubungi Kami</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const now = new Date();
  const allEvents = await prisma.event.findMany({
    orderBy: { tanggal: 'desc' },
  });
  const upcomingEvents = allEvents
    .filter(event => new Date(event.tanggal) >= now)
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  const pastEvents = allEvents.filter(event => new Date(event.tanggal) < now);
  return {
    props: {
      upcomingEvents: JSON.parse(JSON.stringify(upcomingEvents)),
      pastEvents: JSON.parse(JSON.stringify(pastEvents)),
    },
  };
};