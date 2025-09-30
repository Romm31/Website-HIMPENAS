import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GalleryAlbum } from '@prisma/client';

// Tipe kustom untuk menyertakan _count
type AlbumWithCount = GalleryAlbum & {
  _count: {
    mediaItems: number;
  };
};

interface AlbumCardProps {
  album: AlbumWithCount;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const albumDate = new Date(album.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <Link href={`/galeri/${album.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col card-hover-effect">
        <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 font-bold text-2xl text-white font-heading drop-shadow-md">
            {album.title}
          </h3>
        </div>
        <div className="p-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>{album._count.mediaItems} item</span>
          </div>
          <span>{albumDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;