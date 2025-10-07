import type { GetServerSideProps, NextPage } from "next";
import { Visi, Misi } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

interface VisiMisiPageProps {
  visi: Visi | null;
  misi: Misi | null;
}

const VisiMisiPage: NextPage<VisiMisiPageProps> = ({ visi, misi }) => {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Header Banner */}
      <header
        ref={headerRef}
        className={`bg-emerald-dark text-white pt-24 pb-40 relative fade-in-section ${
          headerInView ? "is-visible" : ""
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/header/berita-header.jpeg"
            fill
            alt="Latar Belakang Visi Misi"
            className="object-cover brightness-50"
            priority
          />
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
        <section
          ref={contentRef}
          className={`bg-white py-24 fade-in-section ${
            contentInView ? "is-visible" : ""
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* === VISI === */}
              <div
                className="group bg-white p-10 rounded-xl border-t-4 border-emerald-himp shadow-lg
                transform transition duration-500 ease-in-out
                hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
              >
                <h2
                  className="text-4xl font-bold font-heading text-emerald-dark mb-6 flex items-center
                  transition-colors duration-500 group-hover:text-emerald-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mr-4 text-emerald-himp transition-transform duration-500 group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Visi Kami
                </h2>
                <div
                  className="text-xl text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: visi?.konten || "<p>Visi belum diatur.</p>",
                  }}
                />
              </div>

              {/* === MISI === */}
              <div
                className="group bg-white p-10 rounded-xl border-t-4 border-emerald-himp shadow-lg
                transform transition duration-500 ease-in-out
                hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
              >
                <h2
                  className="text-4xl font-bold font-heading text-emerald-dark mb-6 flex items-center
                  transition-colors duration-500 group-hover:text-emerald-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mr-4 text-emerald-himp transition-transform duration-500 group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Misi Kami
                </h2>
                <div
                  className="text-xl text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: misi?.konten || "<p>Misi belum diatur.</p>",
                  }}
                />
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

export const getServerSideProps: GetServerSideProps = async () => {
  const [visi, misi] = await Promise.all([
    prisma.visi.findFirst(),
    prisma.misi.findFirst(),
  ]);

  return {
    props: {
      visi: JSON.parse(JSON.stringify(visi)),
      misi: JSON.parse(JSON.stringify(misi)),
    },
  };
};
