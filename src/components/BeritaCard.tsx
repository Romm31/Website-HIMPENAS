// src/components/BeritaCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Berita, Kategori } from "@prisma/client";

type BeritaWithKategori = Berita & { kategori?: Kategori | null };

interface BeritaCardProps {
  berita: BeritaWithKategori;
}

export default function BeritaCard({ berita }: BeritaCardProps) {
  const publicationDate = new Date(berita.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col group">
      {/* Gambar */}
      <div className="relative h-52 w-full overflow-hidden">
        {berita.gambarUrl ? (
          <Image
            src={berita.gambarUrl}
            alt={berita.judul}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            Gambar tidak tersedia
          </div>
        )}
      </div>

      {/* Konten */}
      <div className="p-5 flex flex-col flex-grow">
        {berita.kategori && (
          <span className="text-xs font-semibold text-emerald-himp uppercase mb-1">
            {berita.kategori.nama}
          </span>
        )}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-himp">
          {berita.judul}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{publicationDate}</p>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {/* Strip HTML dari konten */}
          {berita.konten.replace(/<[^>]+>/g, "").slice(0, 150)}...
        </p>

        <Link
          href={`/berita/${berita.id}`}
          className="mt-auto font-semibold text-emerald-himp hover:underline"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </div>
  );
}
