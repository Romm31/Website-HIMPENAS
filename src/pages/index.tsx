import type { GetServerSideProps, NextPage } from 'next';
import { BeritaType } from '@/types';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import NewsSlider from '@/components/NewsSlider';
import VisiMisiSection from '@/components/VisiMisiSection';
import AboutUsSection from '@/components/AboutUsSection';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import EventsSection from '@/components/EventsSection';
import ShapeDivider from '@/components/ShapeDivider';
import WelcomeSection from '@/components/WelcomeSection';
import { About, Event, Slide, Visi, Misi } from '@prisma/client';

interface HomeProps {
  slides: Slide[];
  latestBerita: BeritaType[];
  visiMisi: {
    visi: string | null;
    misi: string | null;
  } | null;
  about: About | null;
  events: Event[];
}

const Home: NextPage<HomeProps> = ({ slides, latestBerita, visiMisi, about, events }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HeroSlider slides={slides} berita={latestBerita} />
        <ShapeDivider />

        {/* PERUBAHAN DI SINI: Tambahkan div pembungkus dengan margin negatif */}
        <div className="relative z-0 -mt-12 md:-mt-20 lg:-mt-24">
          <WelcomeSection />
          <NewsSlider berita={latestBerita} />
          <EventsSection events={events} />
          <VisiMisiSection data={visiMisi} />
          <AboutUsSection data={about} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

// getServerSideProps tidak perlu diubah
export const getServerSideProps: GetServerSideProps = async () => {
  const [slides, latestBerita, visi, misi, about, events] = await Promise.all([
    prisma.slide.findMany({ orderBy: { order: 'asc' }, take: 2 }),
    prisma.berita.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.visi.findFirst(),
    prisma.misi.findMany({ orderBy: { id: 'asc' } }),
    prisma.about.findFirst(),
    prisma.event.findMany({ take: 3, orderBy: { tanggal: 'desc' } }),
  ]);

  const misiString = misi.map((item) => item.konten).join('\n');

  const visiMisiData = {
    visi: visi?.konten || null,
    misi: misiString || null,
  };

  return {
    props: {
      slides: JSON.parse(JSON.stringify(slides)),
      latestBerita: JSON.parse(JSON.stringify(latestBerita)),
      visiMisi: JSON.parse(JSON.stringify(visiMisiData)),
      about: JSON.parse(JSON.stringify(about)),
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};