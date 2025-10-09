// src/pages/berita/[id].tsx

import type { GetServerSideProps, NextPage } from "next";
import { Berita, Kategori } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

type BeritaWithKategori = Berita & { kategori: Kategori | null };

interface BeritaDetailPageProps {
  berita: BeritaWithKategori;
  otherBerita: BeritaWithKategori[];
  kategoriList: Kategori[];
}

const BeritaDetailPage: NextPage<BeritaDetailPageProps> = ({
  berita,
  otherBerita,
  kategoriList,
}) => {
  const publicationDate = new Date(berita.createdAt).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "long", year: "numeric" }
  );

  // Fungsi untuk membersihkan HTML dari konten untuk deskripsi meta
  const cleanHtmlForMeta = (html: string) => {
    if (typeof document !== 'undefined') {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    return html.replace(/<[^>]+>/g, '');
  }

  return (
    <>
      <Head>
        <title>{`${berita.judul} - HIMPENAS`}</title>
        <meta name="description" content={cleanHtmlForMeta(berita.konten).substring(0, 155)} />
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero */}
        <section className="relative w-full h-[400px] md:h-[500px]">
          {berita.gambarUrl && (
            <Image
              src={berita.gambarUrl}
              alt={berita.judul}
              layout="fill"
              objectFit="cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black/90"></div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white max-w-4xl px-4">
            {berita.kategori && (
              <Link
                href={`/berita?kategori=${berita.kategori.nama.toLowerCase()}`}
                className="inline-block bg-emerald-600 px-4 py-1 rounded-full text-xs md:text-sm uppercase font-semibold mb-3"
              >
                {berita.kategori.nama}
              </Link>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              {berita.judul}
            </h1>
            <p className="mt-3 text-gray-200 text-sm md:text-base">
              Dipublikasikan {publicationDate}
            </p>
          </div>
        </section>

        {/* Body */}
        <main className="flex-grow container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Konten Utama */}
          <article className="lg:col-span-8 bg-white rounded-xl shadow p-6 md:p-10">
            <div
              className="prose prose-lg max-w-none 
                         prose-headings:font-bold prose-headings:text-gray-900
                         prose-p:text-gray-700 prose-p:leading-relaxed 
                         prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-gray-900
                         prose-img:rounded-xl prose-img:shadow-md
                         prose-blockquote:border-emerald-500 prose-blockquote:text-gray-600
                         prose-p:text-justify" // ✅ PERBAIKAN UTAMA DI SINI
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Berita Populer */}
            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Berita Populer</h3>
              <div className="space-y-4">
                {otherBerita.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {item.gambarUrl ? (
                        <Image
                          src={item.gambarUrl}
                          alt={item.judul}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Kategori */}
            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">Kategori Lain</h3>
              <div className="flex flex-wrap gap-2">
                {kategoriList.map((kat) => (
                  <Link
                    key={kat.id}
                    href={`/berita?kategori=${kat.nama.toLowerCase()}`}
                    className="bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 px-3 py-1 rounded-full text-sm transition"
                  >
                    {kat.nama}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </main>

        {/* Baca Juga */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
              Baca Juga
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBerita.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.id}`}
                  className="group block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                >
                  <div className="relative w-full h-44">
                    {item.gambarUrl && (
                      <Image
                        src={item.gambarUrl}
                        alt={item.judul}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default BeritaDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.params?.id as string);
  if (isNaN(id)) return { notFound: true };

  const berita = await prisma.berita.findUnique({
    where: { id },
    include: { kategori: true },
  });

  if (!berita) return { notFound: true };

  // Update view count
  await prisma.berita.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  const otherBerita = await prisma.berita.findMany({
    where: { NOT: { id } },
    take: 5,
    orderBy: { views: 'desc' }, // Order by views
    include: { kategori: true },
  });

  const kategoriList = await prisma.kategori.findMany({
    orderBy: { nama: "asc" },
  });

  return {
    props: {
      berita: JSON.parse(JSON.stringify(berita)),
      otherBerita: JSON.parse(JSON.stringify(otherBerita)),
      kategoriList: JSON.parse(JSON.stringify(kategoriList)),
    },
  };
};