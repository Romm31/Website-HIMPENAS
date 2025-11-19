import React from 'react';
import { Event } from '@prisma/client';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventsSectionProps {
  events: Event[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

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

  return (
    <section
      id="event"
      ref={ref}
      className={`relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden fade-in-section ${
        inView ? 'is-visible' : ''
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-himp" />
            <span className="text-sm font-semibold text-emerald-himp uppercase tracking-wide">
              Agenda Terkini
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-gray-900 mb-4">
            Kegiatan & <span className="text-emerald-himp">Acara</span>
          </h2>

          {/* Divider */}
          <div className="w-24 h-1 bg-emerald-himp mx-auto rounded-full mb-6"></div>

          {/* Description */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ikuti berbagai kegiatan dan acara menarik dari HIMPENAS
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event, index) => {
            const dateInfo = formatDate(event.tanggal);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex overflow-hidden transform hover:-translate-y-2 h-full">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-emerald-himp opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>

                  {/* Date Section - Vertical */}
                  <div className="relative flex flex-col justify-center items-center bg-emerald-himp text-white p-4 w-24 rounded-l-2xl overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Date Content */}
                    <div className="relative z-10 text-center">
                      <span className="text-4xl font-bold leading-none block">
                        {dateInfo.day}
                      </span>
                      <span className="font-bold text-sm tracking-wider mt-1 block">
                        {dateInfo.month}
                      </span>
                      <div className="w-8 h-px bg-white/40 mx-auto my-2"></div>
                      <span className="text-xs opacity-90 block">
                        {dateInfo.year}
                      </span>
                    </div>

                    {/* Calendar Icon at Bottom */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-20">
                      <Calendar className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight relative group/title line-clamp-2">
                      <span className="transition-colors duration-300 group-hover/title:text-emerald-dark">
                        {event.judul}
                      </span>
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-himp group-hover/title:w-full transition-all duration-300"></span>
                    </h3>

                    {/* Description (if available) */}
                    {event.deskripsi && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {event.deskripsi}
                      </p>
                    )}

                    <div className="flex-grow"></div>

                    {/* Event Details */}
                    <div className="space-y-2 mt-4">
                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600 group/location">
                        <div className="p-2 bg-emerald-50 rounded-lg mr-3 transition-colors duration-300 group-hover/location:bg-emerald-100">
                          <MapPin className="w-4 h-4 text-emerald-dark" />
                        </div>
                        <span className="font-medium">{event.lokasi}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center text-sm text-gray-600 group/time">
                        <div className="p-2 bg-emerald-50 rounded-lg mr-3 transition-colors duration-300 group-hover/time:bg-emerald-100">
                          <Clock className="w-4 h-4 text-emerald-dark" />
                        </div>
                        <span className="font-medium">{dateInfo.time} WIB</span>
                      </div>
                    </div>



                    {/* Hover Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                  </div>

                  {/* "NEW" Badge for Recent Events */}
                  {index < 3 && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-himp text-white text-xs font-bold rounded-full shadow-lg transform rotate-3">
                      BARU
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        {events.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="group inline-flex items-center gap-3 rounded-full bg-emerald-dark px-10 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-emerald-800 relative overflow-hidden">
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative">Lihat Semua Event</span>
              <ArrowRight className="w-5 h-5 relative transition-transform group-hover:translate-x-2" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;