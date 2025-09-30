import type { GetServerSideProps, NextPage } from 'next';
import { Visi, Misi } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface VisiMisiPageProps {
  visi: Visi | null;
  misiItems: Misi[];
}

const VisiMisiPage: NextPage<VisiMisiPageProps> = ({ visi, misiItems }) => {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: contentRef, inView: contentInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Banner Header */}
      <header ref={headerRef} className={`bg-emerald-dark text-white pt-24 pb-40 relative fade-in-section ${headerInView ? 'is-visible' : ''}`}>
        <div className="absolute inset-0 opacity-10">
          <Image src="/header/berita-header.jpeg" layout="fill" objectFit="cover" alt="Latar Belakang Visi Misi" className="brightness-50" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading tracking-tight mt-2 mb-4">
            Visi & Misi
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Arah dan tujuan yang menjadi landasan gerak HIMPENAS.
          </p>
        </div>
      </header>

      <main className="flex-grow">
        {/* Section Visi & Misi Terpadu */}
        <section ref={contentRef} className={`bg-white py-24 fade-in-section ${contentInView ? 'is-visible' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* Kolom Visi */}
              <div className="bg-white p-10 rounded-xl shadow-2xl border-t-4 border-emerald-himp">
                <h2 className="text-4xl font-bold font-heading text-emerald-dark mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-emerald-himp" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Visi Kami
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed italic">
                  {visi?.konten || 'Visi belum diatur.'}
                </p>
              </div>

              {/* Kolom Misi */}
              <div className="bg-white p-10 rounded-xl shadow-2xl border-t-4 border-emerald-himp">
                <h2 className="text-4xl font-bold font-heading text-emerald-dark mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-emerald-himp" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Misi Kami
                </h2>
                {misiItems.length > 0 ? (
                  <ul className="space-y-4">
                    {misiItems.map((item) => (
                      <li key={item.id} className="flex items-start text-lg text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-himp flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        <span>{item.konten.trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Misi belum diatur.</p>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VisiMisiPage;

// getServerSideProps tidak berubah
export const getServerSideProps: GetServerSideProps = async () => {
  const [visi, misiItems] = await Promise.all([
    prisma.visi.findFirst(),
    prisma.misi.findMany({
      orderBy: { id: 'asc' }
    }),
  ]);

  return {
    props: {
      visi: JSON.parse(JSON.stringify(visi)),
      misiItems: JSON.parse(JSON.stringify(misiItems)),
    },
  };
};