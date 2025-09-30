import type { GetServerSideProps, NextPage } from 'next';
import { Event } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface EventPageProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

const EventPage: NextPage<EventPageProps> = ({ upcomingEvents, pastEvents }) => {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      
      <header ref={headerRef} className={`relative h-64 bg-emerald-dark fade-in-section ${headerInView ? 'is-visible' : ''}`}>
        <Image src="/header/event-header.jpeg" layout="fill" objectFit="cover" alt="Kalender Kegiatan" className="opacity-20" priority />
        <div className="absolute inset-0 flex items-center justify-center p-4"> {/* Tambahkan padding untuk mobile */}
          {/* PERUBAHAN DI SINI: Ukuran teks & perataan */}
          <h1 className="text-4xl md:text-6xl font-bold text-white font-heading tracking-wider drop-shadow-lg text-center">
            Kalender Kegiatan
          </h1>
        </div>
      </header>

      <main className="flex-grow">
        <section id="upcoming-events" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-left mb-10">
              <h2 className="text-4xl font-bold text-gray-800 font-heading">Acara Mendatang</h2>
              <div className="mt-2 w-20 h-1 bg-emerald-himp rounded-full"></div>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg">
                <p className="text-gray-500">Tidak ada acara yang akan datang.</p>
              </div>
            )}
          </div>
        </section>

        <section id="past-events" className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-left mb-10">
              <h2 className="text-4xl font-bold text-gray-800 font-heading">Arsip Acara</h2>
              <div className="mt-2 w-20 h-1 bg-emerald-himp rounded-full"></div>
            </div>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 rounded-lg">
                <p className="text-gray-500">Belum ada arsip acara.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventPage;

// getServerSideProps tidak berubah
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