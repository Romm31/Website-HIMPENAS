import React from 'react';
import { Event } from '@prisma/client';
import { useInView } from 'react-intersection-observer';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 150,
  });

  const eventDate = new Date(event.tanggal);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
  const year = eventDate.getFullYear();
  const time = eventDate.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div 
      ref={ref} 
      className={`fade-in-section ${inView ? 'is-visible' : ''} h-full`}
    >
      <div
        className={`
          relative bg-white rounded-2xl shadow-lg hover:shadow-2xl 
          transition-all duration-500 group h-full flex flex-col 
          transform hover:-translate-y-3 overflow-hidden
          ${isPast ? 'opacity-70' : ''}
        `}
      >
        {/* Gradient Border Effect on Hover */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
          transition-opacity duration-500 -z-10 blur-md
          ${isPast ? 'bg-gray-400' : 'bg-emerald-himp'}
        `}></div>

        {/* Status Badge */}
        {!isPast && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-himp text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              UPCOMING
            </div>
          </div>
        )}

        {isPast && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1.5 bg-gray-500 text-white text-xs font-semibold rounded-full shadow-lg">
              SELESAI
            </div>
          </div>
        )}

        {/* Header dengan Tanggal - Design Modern */}
        <div className={`
          relative p-6 text-white overflow-hidden
          ${isPast ? 'bg-gray-400' : 'bg-emerald-himp'}
        `}>
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative flex items-center justify-between">
            {/* Date Display */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-5xl font-heading leading-none">{day}</span>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wider">{month}</span>
                <span className="text-xs opacity-90">{year}</span>
              </div>
            </div>

            {/* Calendar Icon */}
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Time Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{time} WIB</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow relative">
          {/* Decorative Corner */}
          <div className={`
            absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 
            group-hover:opacity-100 transition-opacity duration-500
            ${isPast ? 'bg-gray-100' : 'bg-emerald-50'}
          `}></div>

          {/* Title */}
          <h3 className="font-bold text-xl mb-3 text-gray-900 leading-tight flex-grow relative group/title">
            <span className={`
              transition-colors duration-300
              ${isPast ? '' : 'group-hover/title:text-emerald-dark'}
            `}>
              {event.judul}
            </span>
            <span className={`
              absolute bottom-0 left-0 h-0.5 w-0 
              group-hover/title:w-full transition-all duration-300
              ${isPast ? 'bg-gray-400' : 'bg-emerald-himp'}
            `}></span>
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {event.deskripsi}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

          {/* Footer Info */}
          <div className="space-y-2 mt-auto">
            {/* Location */}
            <div className="flex items-center text-sm text-gray-600 group/location">
              <div className={`
                p-2 rounded-lg mr-3 transition-colors duration-300
                ${isPast 
                  ? 'bg-gray-100 group-hover/location:bg-gray-200' 
                  : 'bg-emerald-50 group-hover/location:bg-emerald-100'
                }
              `}>
                <MapPin className={`
                  w-4 h-4 transition-colors duration-300
                  ${isPast ? 'text-gray-500' : 'text-emerald-dark'}
                `} />
              </div>
              <span className="font-medium">{event.lokasi}</span>
            </div>

            {/* Category/Type Info */}
            <div className="flex items-center text-sm text-gray-600 group/category">
              <div className={`
                p-2 rounded-lg mr-3 transition-colors duration-300
                ${isPast 
                  ? 'bg-gray-100 group-hover/category:bg-gray-200' 
                  : 'bg-emerald-50 group-hover/category:bg-emerald-100'
                }
              `}>
                <Users className={`
                  w-4 h-4 transition-colors duration-300
                  ${isPast ? 'text-gray-500' : 'text-emerald-dark'}
                `} />
              </div>
              <span className="font-medium">Event HIMPENAS</span>
            </div>
          </div>

          {/* Action Button */}
          {!isPast && (
            <button className={`
              mt-4 w-full py-3 px-4 rounded-xl font-semibold
              bg-emerald-himp text-white
              transition-all duration-300
              hover:bg-emerald-dark hover:shadow-lg hover:scale-[1.02]
              active:scale-[0.98]
              flex items-center justify-center gap-2
              group/button
            `}>
              <span>Lihat Detail</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};
  

export default EventCard;