import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GalleryFilterControls: React.FC = () => {
  const router = useRouter();
  const { search, filter } = router.query;
  const [searchValue, setSearchValue] = useState(search || '');

  const createFilterUrl = (newFilter: string) => {
    const params = new URLSearchParams(router.asPath.split('?')[1]);
    if (newFilter) {
      params.set('filter', newFilter);
    } else {
      params.delete('filter');
    }
    return `/galeri?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 -mt-20 relative z-20 mx-auto max-w-4xl">
      {/* Form Search */}
      <form method="GET" action="/galeri" className="relative mb-6 flex items-center">
        <input
          type="search"
          name="search"
          value={searchValue as string}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Cari album berdasarkan judul..."
          className="w-full pl-5 pr-20 py-3 bg-gray-100 border-transparent rounded-full 
                     focus:outline-none focus:ring-2 focus:ring-emerald-himp focus:border-transparent"
          autoComplete="off"
        />
        {/* Tombol Clear */}
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-himp hover:bg-gray-200 
                       rounded-full p-1 transition-colors"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 8.586L4.707 3.293a1 1 0 00-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 001.414 1.414L10 11.414l5.293 5.293a1 1 0 001.414-1.414L11.414 10l5.293-5.293a1 1 0 00-1.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        {/* Tombol Submit */}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-himp hover:bg-gray-200 
                     rounded-full p-1 transition-colors"
          aria-label="Cari"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={createFilterUrl('')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            !filter
              ? 'bg-emerald-himp text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Semua
        </Link>
        <Link
          href={createFilterUrl('foto')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'foto'
              ? 'bg-emerald-himp text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Foto
        </Link>
        <Link
          href={createFilterUrl('video')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'video'
              ? 'bg-emerald-himp text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Video
        </Link>
      </div>
    </div>
  );
};

export default GalleryFilterControls;
