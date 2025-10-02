import React from "react";
import { Berita, Kategori } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

type BeritaWithKategori = Berita & { kategori: Kategori | null };

interface BeritaCardProps {
  berita: BeritaWithKategori;
}

const BeritaCard: React.FC<BeritaCardProps> = ({ berita }) => {
  const date = new Date(berita.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] flex flex-col min-h-[380px]">
      {/* Gambar */}
      <div className="relative w-full h-48">
        {berita.gambarUrl ? (
          <Image
            src={berita.gambarUrl}
            alt={berita.judul}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded-t-xl">
            Gambar tidak tersedia
          </div>
        )}
      </div>

      {/* Konten */}
      <div className="flex flex-col flex-grow p-4">
        {berita.kategori && (
          <p className="text-xs font-semibold text-emerald-himp uppercase mb-1">
            {berita.kategori.nama}
          </p>
        )}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {berita.judul}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{date}</p>
        <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
          {berita.konten.replace(/<[^>]+>/g, "").slice(0, 120)}...
        </p>

        {/* Tombol */}
        <Link
          href={`/berita/${berita.id}`}
          className="text-emerald-himp font-semibold mt-4 hover:underline"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </div>
  );
};

export default BeritaCard;
