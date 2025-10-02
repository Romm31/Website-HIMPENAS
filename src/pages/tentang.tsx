import type { GetServerSideProps, NextPage } from "next";
import { About } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import TeamCard from "@/components/TeamCard";
import DepartmentCard from "@/components/DepartmentCard";
import Link from "next/link";

interface TentangPageProps {
  about: About | null;
}

const TentangPage: NextPage<TentangPageProps> = ({ about }) => {
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: profileRef, inView: profileInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Header */}
      <header
        ref={headerRef}
        className={`relative bg-emerald-dark text-white pt-24 pb-40 transition-all duration-700 ${
          headerInView ? "opacity-100 translate-y-0" : "md:opacity-0 md:translate-y-10"
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/header/event-header.jpeg"
            alt="Latar Belakang Tentang Kami"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mt-2 mb-4">
            Tentang HIMPENAS
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Mengenal lebih dekat struktur organisasi & departemen HIMPENAS.
          </p>
        </div>
      </header>

      <main className="flex-grow">
        {/* Profil & Sejarah */}
        <section
          ref={profileRef}
          className={`bg-white py-16 md:py-24 transition-all duration-700 ${
            profileInView ? "opacity-100 translate-y-0" : "md:opacity-0 md:translate-y-10"
          }`}
        >
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
            {/* Gambar Profil */}
            <div className="relative h-64 md:h-80 order-first md:order-last rounded-xl shadow-xl overflow-hidden">
              <Image
                src="/about/about.jpeg"
                alt="Kegiatan Himpunan"
                fill
                className="object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>

            {/* Deskripsi Profil */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-emerald-dark mb-6">
                Profil & Sejarah
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {about?.profile || "Informasi profil belum tersedia."}
              </p>
            </div>
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section
          ref={teamRef}
          className={`py-20 bg-gray-50 transition-all duration-700 ${
            teamInView ? "opacity-100 translate-y-0" : "md:opacity-0 md:translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-emerald-dark">
                Struktur Organisasi
              </h2>
              <div className="mt-4 w-24 h-1 bg-emerald-himp mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-col items-center gap-12">
              {/* Ketua & Wakil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                <TeamCard imageUrl="/struktur/ketua.jpg" name="Nama Ketua" role="Ketua Himpunan" />
                <TeamCard imageUrl="/struktur/wakil.jpg" name="Nama Wakil" role="Wakil Ketua Himpunan" />
              </div>

              {/* Sekum + Bendahara */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                <TeamCard imageUrl="/struktur/sekre.jpg" name="Nama Sekum" role="Sekretaris Umum" />
                <TeamCard imageUrl="/struktur/bendum1.jpg" name="Nama Bendum 1" role="Bendahara Umum 1" />
                <TeamCard imageUrl="/struktur/bendum2.jpg" name="Nama Bendum 2" role="Bendahara Umum 2" />
              </div>

              {/* Departemen */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                <DepartmentCard
                  title="Departemen Internal"
                  staffCount={18}
                  ketua={{ name: "Nama Ketua Internal", imageUrl: "/struktur/departemen/internal/foto1.jpg" }}
                  wakil={{ name: "Nama Wakil Internal", imageUrl: "/struktur/departemen/internal/foto2.jpg" }}
                  sekretaris={{ name: "Nama Sekretaris Internal", imageUrl: "/struktur/departemen/internal/foto3.jpg" }}
                />
                <DepartmentCard
                  title="Departemen Eksternal"
                  staffCount={20}
                  ketua={{ name: "Nama Ketua Eksternal", imageUrl: "/struktur/departemen/eksternal/foto1.jpg" }}
                  wakil={{ name: "Nama Wakil Eksternal", imageUrl: "/struktur/departemen/eksternal/foto2.jpg" }}
                  sekretaris={{ name: "Nama Sekretaris Eksternal", imageUrl: "/struktur/departemen/eksternal/foto3.jpg" }}
                />
                <DepartmentCard
                  title="Departemen Akademik"
                  staffCount={14}
                  ketua={{ name: "Nama Ketua Akademik", imageUrl: "/struktur/departemen/akademik/foto1.jpg" }}
                  wakil={{ name: "Nama Wakil Akademik", imageUrl: "/struktur/departemen/akademik/foto2.jpg" }}
                  sekretaris={{ name: "Nama Sekretaris Akademik", imageUrl: "/struktur/departemen/akademik/foto3.jpg" }}
                />
                <DepartmentCard
                  title="Departemen PSDM"
                  staffCount={19}
                  ketua={{ name: "Nama Ketua PSDM", imageUrl: "/struktur/departemen/psdm/foto1.jpg" }}
                  wakil={{ name: "Nama Wakil PSDM", imageUrl: "/struktur/departemen/psdm/foto2.jpg" }}
                  sekretaris={{ name: "Nama Sekretaris PSDM", imageUrl: "/struktur/departemen/psdm/foto3.jpg" }}
                />
                <DepartmentCard
                  title="Departemen INFOKOM"
                  staffCount={9}
                  ketua={{ name: "Nama Ketua INFOKOM", imageUrl: "/struktur/departemen/infokom/foto1.jpg" }}
                  wakil={{ name: "Nama Wakil INFOKOM", imageUrl: "/struktur/departemen/infokom/foto2.jpg" }}
                  sekretaris={{ name: "Nama Sekretaris INFOKOM", imageUrl: "/struktur/departemen/infokom/foto3.jpg" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          ref={ctaRef}
          className={`py-20 bg-emerald-himp transition-all duration-700 ${
            ctaInView ? "opacity-100 translate-y-0" : "md:opacity-0 md:translate-y-10"
          }`}
        >
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Tertarik untuk Bergabung?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Jadilah bagian dari komunitas kami dan kembangkan skill-mu di dunia teknologi open source!
            </p>
            <Link
              href="/kontak"
              className="bg-white text-emerald-himp font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg text-lg"
            >
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
  const about = await prisma.about.findFirst();
  return {
    props: { about: JSON.parse(JSON.stringify(about)) },
  };
};
