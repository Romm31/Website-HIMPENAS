import type { GetServerSideProps, NextPage } from 'next';
import { About } from '@prisma/client'; // Hapus VisiMisi dari import
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import TeamCard from '@/components/TeamCard';
import Link from 'next/link';

// Hapus visiMisi dari props
interface TentangPageProps {
  about: About | null;
}

const TentangPage: NextPage<TentangPageProps> = ({ about }) => {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: profileRef, inView: profileInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Banner Header */}
      <header ref={headerRef} className={`relative h-72 bg-emerald-dark fade-in-section ${headerInView ? 'is-visible' : ''}`}>
        <Image src="/header/berita-header.jpeg" layout="fill" objectFit="cover" alt="Tentang Himpunan" className="opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white font-heading tracking-wider drop-shadow-lg">Tentang HIMPENAS</h1>
        </div>
      </header>

      <main className="flex-grow">
        {/* Section Profil */}
        <section ref={profileRef} className={`bg-white py-20 fade-in-section ${profileInView ? 'is-visible' : ''}`}>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
            <div>
              <h2 className="text-4xl font-bold font-heading text-emerald-dark mb-6">Profil & Sejarah</h2>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{about?.profile || 'Informasi profil belum tersedia.'}</p>
            </div>
            <div className="relative h-80">
              <Image src="/about/about.jpeg" layout="fill" objectFit="cover" alt="Kegiatan Himpunan" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </section>

        {/* SECTION VISI & MISI DIHAPUS DARI SINI */}

        {/* Section Struktur Organisasi */}
        <section ref={teamRef} className={`py-20 bg-gray-50 fade-in-section ${teamInView ? 'is-visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16"><h2 className="text-4xl font-bold font-heading text-emerald-dark">Struktur Organisasi</h2><div className="mt-4 w-24 h-1 bg-emerald-himp mx-auto rounded-full"></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <TeamCard imageUrl="/team/ketua.jpg" name="Nama Ketua" role="Ketua Himpunan" />
              <TeamCard imageUrl="/team/wakil.jpg" name="Nama Wakil" role="Wakil Ketua" />
              <TeamCard imageUrl="/team/sekretaris.jpg" name="Nama Sekretaris" role="Sekretaris" />
              <TeamCard imageUrl="/team/bendahara.jpg" name="Nama Bendahara" role="Bendahara" />
              <TeamCard imageUrl="/team/ketua.jpg" name="Nama Ketua" role="Ketua Himpunan" />
              <TeamCard imageUrl="/team/wakil.jpg" name="Nama Wakil" role="Wakil Ketua" />
              <TeamCard imageUrl="/team/sekretaris.jpg" name="Nama Sekretaris" role="Sekretaris" />
              <TeamCard imageUrl="/team/bendahara.jpg" name="udin" role="Bendahara" />
            </div>
          </div>
        </section>

        {/* Section Call to Action */}
        <section ref={ctaRef} className={`py-20 bg-emerald-himp fade-in-section ${ctaInView ? 'is-visible' : ''}`}>
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold font-heading mb-4">Tertarik untuk Bergabung?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Jadilah bagian dari komunitas kami dan kembangkan skill-mu di dunia teknologi open source!</p>
            <Link href="/kontak" className="bg-white text-emerald-himp font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg text-lg">
              Hubungi Kami
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TentangPage;

export const getServerSideProps: GetServerSideProps = async () => {
  // Hanya ambil data 'about'
  const about = await prisma.about.findFirst();

  return {
    props: {
      about: JSON.parse(JSON.stringify(about)),
    },
  };
};