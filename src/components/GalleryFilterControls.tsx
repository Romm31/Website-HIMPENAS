import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GalleryFilterControls: React.FC = () => {
  const router = useRouter();
  const { search, filter } = router.query;

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(router.asPath.split('?')[1]);
    params.set(name, value);
    return params.toString();
  };
  
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
      <form method="GET" action="/galeri" className="relative mb-6">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Cari album berdasarkan judul..."
          className="w-full pl-5 pr-12 py-3 bg-gray-100 border-transparent rounded-full focus:ring-2 focus:ring-emerald-himp focus:border-transparent"
          autoComplete="off"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-himp transition-colors" aria-label="Cari">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href={createFilterUrl('')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${!filter ? 'bg-emerald-himp text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Semua
        </Link>
        <Link href={createFilterUrl('foto')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'foto' ? 'bg-emerald-himp text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Foto
        </Link>
        <Link href={createFilterUrl('video')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'video' ? 'bg-emerald-himp text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Video
        </Link>
      </div>
    </div>
  );
};

export default GalleryFilterControls;