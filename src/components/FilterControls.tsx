import React from "react";
import { Kategori } from "@prisma/client";
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface FilterControlsProps {
  kategoriList: Kategori[];
  currentSearch?: string;
  currentKategori?: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  kategoriList,
  currentSearch,
  currentKategori,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-12">
      <form
        method="GET"
        action="/berita"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
      >
        {/* Search */}
        <div className="md:col-span-2 flex flex-col">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cari Berita
          </label>
          <div className="relative flex items-center">
            <input
              type="search"
              name="search"
              id="search"
              defaultValue={currentSearch}
              placeholder="Ketik judul atau kata kunci..."
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-full
                         focus:ring-2 focus:ring-emerald-himp focus:border-emerald-himp
                         outline-none pr-20"
              autoComplete="off"
            />
            {currentSearch && (
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(
                    "search"
                  ) as HTMLInputElement;
                  if (input) input.value = "";
                }}
                className="absolute right-10 text-emerald-himp hover:text-emerald-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 text-emerald-himp hover:text-emerald-700"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Kategori */}
        <div className="flex flex-col relative">
          <label
            htmlFor="kategori"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter Kategori
          </label>
          <div className="relative">
            <select
              name="kategori"
              id="kategori"
              defaultValue={currentKategori}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300
                         rounded-full focus:ring-2 focus:ring-emerald-himp
                         focus:border-emerald-himp outline-none appearance-none
                         text-gray-700 pr-10"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map((kategori) => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.nama}
                </option>
              ))}
            </select>
            {/* Ikon panah custom */}
            <ChevronDownIcon className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tombol */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-transparent mb-2">
            .
          </label>
          <button
            type="submit"
            className="w-full bg-emerald-himp text-white font-bold py-3 px-5 
                       rounded-full hover:bg-emerald-light transition-colors"
          >
            Terapkan Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterControls;
