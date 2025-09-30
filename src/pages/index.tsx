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
import { About, Event, Slide, Visi, Misi } from '@prisma/client';

interface HomeProps {
  slides: Slide[];
  latestBerita: BeritaType[];
  // Tipe VisiMisi disesuaikan dengan data yang kita olah
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
        <NewsSlider berita={latestBerita} />
        <EventsSection events={events} />
        <VisiMisiSection data={visiMisi} />
        <AboutUsSection data={about} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  // Ambil data dari model Visi dan Misi yang baru, BUKAN VisiMisi
  const [slides, latestBerita, visi, misi, about, events] = await Promise.all([
    prisma.slide.findMany({ orderBy: { order: 'asc' }, take: 2 }),
    prisma.berita.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.visi.findFirst(), // Mengambil dari model Visi
    prisma.misi.findMany({ orderBy: { id: 'asc' } }), // Mengambil dari model Misi
    prisma.about.findFirst(),
    prisma.event.findMany({ take: 3, orderBy: { tanggal: 'desc' } }),
  ]);

  // Gabungkan semua poin misi menjadi satu string dengan pemisah baris baru
  const misiString = misi.map(item => item.konten).join('\n');

  // Buat objek gabungan untuk dikirim sebagai satu prop 'visiMisi'
  const visiMisiData = {
    visi: visi?.konten || null,
    misi: misiString || null,
  };

  return {
    props: {
      slides: JSON.parse(JSON.stringify(slides)),
      latestBerita: JSON.parse(JSON.stringify(latestBerita)),
      visiMisi: JSON.parse(JSON.stringify(visiMisiData)), // Kirim data yang sudah digabung
      about: JSON.parse(JSON.stringify(about)),
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};