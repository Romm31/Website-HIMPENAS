'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  judul: string;
  deskripsi?: string;
  tanggal: Date;
  lokasi: string;
}

interface EventsSectionProps {
  events: Event[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [inView, setInView] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useTransform(mouseX, [0, 1000], [-20, 20]);
  const parallaxY = useTransform(mouseY, [0, 1000], [-20, 20]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.getElementById('event');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (!events || events.length === 0) return null;

  const formatDate = (date: Date) => {
    const eventDate = new Date(date);
    return {
      day: eventDate.getDate(),
      month: eventDate.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
      year: eventDate.getFullYear(),
      time: eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    const newScrollLeft =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(checkScrollability, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    checkScrollability();
  };

  const handleMouseMoveParallax = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [events]);

  return (
    <section
      id="event"
      onMouseMove={handleMouseMoveParallax}
      className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      {/* BG decorative elements */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-300/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        style={{ x: useTransform(parallaxX, v => -v), y: useTransform(parallaxY, v => -v) }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-emerald-300/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: inView ? 1 : 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full mb-6 shadow-md"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </motion.div>
            <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
              Agenda Terkini
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Kegiatan &{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Acara
            </span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: inView ? 96 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Ikuti berbagai kegiatan dan acara menarik dari HIMPENAS
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div className="relative mt-4">
          {/* Arrows */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 text-gray-700 -ml-7 border border-gray-100 items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}

            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => scroll('right')}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 text-gray-700 -mr-7 border border-gray-100 items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* SCROLL AREA — ALREADY PROPERLY CENTERED */}
         <div
  ref={scrollContainerRef}
  onScroll={checkScrollability}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleDragEnd}
  onMouseLeave={handleDragEnd}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleDragEnd}
  className={`flex gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory 
              justify-start md:justify-center ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>

            {events.map((event, index) => {
              const dateInfo = formatDate(event.tanggal);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group flex-shrink-0 w-80 sm:w-96 snap-center"
                >
                  {/* Event card (tidak diubah) */}
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex overflow-hidden h-full border border-gray-100">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative flex flex-col justify-center items-center bg-gradient-to-br from-emerald-600 to-green-600 text-white p-4 w-24 rounded-l-2xl overflow-hidden"
                    >
                      <span className="text-4xl font-bold">{dateInfo.day}</span>
                      <span className="font-bold text-sm mt-1">{dateInfo.month}</span>
                      <div className="h-px bg-white/40 w-8 my-2" />
                      <span className="text-xs opacity-90">{dateInfo.year}</span>
                    </motion.div>

                    <div className="flex-1 p-6 flex flex-col">
                      <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                        {event.judul}
                      </h3>

                      {event.deskripsi && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {event.deskripsi}
                        </p>
                      )}

                      <div className="mt-auto space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-emerald-600 mr-3" />
                          {event.lokasi}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-emerald-600 mr-3" />
                          {dateInfo.time} WIB
                        </div>
                      </div>

                      {index < 3 && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                          BARU
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Hint */}
          <div className="md:hidden text-center mt-6 text-gray-500 text-sm">
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span className="font-medium">Geser untuk melihat lebih banyak</span>
              <span>→</span>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default EventsSection;
