import React, { useState } from "react";
import { Kategori } from "@prisma/client";
import { Search, X, ChevronDown, Filter, Sparkles, RotateCcw, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [searchValue, setSearchValue] = useState(currentSearch || "");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleReset = () => {
    setSearchValue("");
    const form = document.getElementById("filter-form") as HTMLFormElement;
    if (form) form.reset();
    window.location.href = "/berita";
  };

  const hasActiveFilters = currentSearch || currentKategori;

  return (
    <div className="relative mb-12">
      {/* Background Decorations */}
      <div className="absolute -top-10 right-0 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute -bottom-10 left-0 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Desktop Header */}
        <div className="hidden md:block bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-himp rounded-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Filter & Pencarian</h3>
                <p className="text-sm text-gray-600">Temukan berita yang Anda cari</p>
              </div>
            </div>

            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-himp/10 rounded-full border border-emerald-himp/30"
              >
                <Sparkles className="w-4 h-4 text-emerald-himp" />
                <span className="text-sm font-semibold text-emerald-dark">
                  Filter Aktif
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Header with Toggle */}
        <div className="md:hidden bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-4 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-himp rounded-lg">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Filter Berita</h3>
                {hasActiveFilters && (
                  <span className="text-xs text-emerald-dark">
                    {hasActiveFilters ? "Ada filter aktif" : ""}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-himp text-white rounded-lg font-semibold transition-all duration-300 hover:bg-emerald-dark"
            >
              <Sliders className="w-4 h-4" />
              {isMobileFilterOpen ? "Tutup" : "Buka"}
            </button>
          </div>
        </div>

        {/* Form Content - Desktop Always Visible, Mobile Collapsible */}
        <AnimatePresence>
          {(isMobileFilterOpen || window.innerWidth >= 768) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:block overflow-hidden"
            >
              <form
                id="filter-form"
                method="GET"
                action="/berita"
                className="p-4 md:p-6"
              >
                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 items-end">
                  {/* Search Input */}
                  <div className="md:col-span-7 flex flex-col">
                    <label
                      htmlFor="search-desktop"
                      className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-emerald-himp" />
                      Cari Berita
                    </label>
                    <div className="relative group">
                      <input
                        type="search"
                        name="search"
                        id="search-desktop"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Ketik judul atau kata kunci..."
                        className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                   focus:ring-2 focus:ring-emerald-himp/20 focus:border-emerald-himp
                                   outline-none transition-all duration-300
                                   hover:border-emerald-himp/50"
                        style={{ paddingRight: searchValue ? '80px' : '48px' }}
                        autoComplete="off"
                      />
                      
                      {/* Clear Button */}
                      <AnimatePresence>
                        {searchValue && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-md transition-all duration-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Search Icon */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-himp pointer-events-none">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="md:col-span-3 flex flex-col">
                    <label
                      htmlFor="kategori-desktop"
                      className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4 text-emerald-himp" />
                      Kategori
                    </label>
                    <div className="relative group">
                      <select
                        name="kategori"
                        id="kategori-desktop"
                        defaultValue={currentKategori}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200
                                   rounded-xl focus:ring-2 focus:ring-emerald-himp/20
                                   focus:border-emerald-himp outline-none appearance-none
                                   text-gray-700 pr-10 font-medium transition-all duration-300
                                   hover:border-emerald-himp/50 cursor-pointer"
                      >
                        <option value="">Semua Kategori</option>
                        {kategoriList.map((kategori) => (
                          <option key={kategori.id} value={kategori.id}>
                            {kategori.nama}
                          </option>
                        ))}
                      </select>

                      {/* Custom Dropdown Icon */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-himp">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="md:col-span-2 flex gap-2">
                    {/* Apply Filter Button */}
                    <button
                      type="submit"
                      className="flex-1 group relative bg-gradient-to-r from-emerald-himp to-emerald-dark text-white font-bold py-3 px-6 
                                 rounded-xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 
                                 hover:scale-105 overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        <Search className="w-5 h-5" />
                        Cari
                      </span>
                    </button>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        type="button"
                        onClick={handleReset}
                        className="group p-3 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 
                                   rounded-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-red-200"
                        title="Reset Filter"
                      >
                        <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  {/* Search Input Mobile */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="search-mobile"
                      className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-emerald-himp" />
                      Cari Berita
                    </label>
                    <div className="relative">
                      <input
                        type="search"
                        name="search"
                        id="search-mobile"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Ketik judul atau kata kunci..."
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                   focus:ring-2 focus:ring-emerald-himp/20 focus:border-emerald-himp
                                   outline-none transition-all duration-300"
                        style={{ paddingRight: searchValue ? '80px' : '48px' }}
                        autoComplete="off"
                      />
                      
                      <AnimatePresence>
                        {searchValue && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-himp pointer-events-none">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Category Dropdown Mobile */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="kategori-mobile"
                      className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4 text-emerald-himp" />
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        name="kategori"
                        id="kategori-mobile"
                        defaultValue={currentKategori}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200
                                   rounded-xl focus:ring-2 focus:ring-emerald-himp/20
                                   focus:border-emerald-himp outline-none appearance-none
                                   text-gray-700 pr-10 font-medium"
                      >
                        <option value="">Semua Kategori</option>
                        {kategoriList.map((kategori) => (
                          <option key={kategori.id} value={kategori.id}>
                            {kategori.nama}
                          </option>
                        ))}
                      </select>

                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-himp">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Mobile */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-himp to-emerald-dark text-white font-bold py-3 px-6 
                                 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Cari Berita
                    </button>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="p-3 bg-red-50 text-red-600 rounded-xl border-2 border-red-200 hover:bg-red-100 transition-all duration-300"
                        title="Reset"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Filter Tags */}
                {(currentSearch || currentKategori) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-gray-100"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-gray-600">Filter Aktif:</span>
                      
                      {currentSearch && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-dark rounded-lg border border-emerald-200">
                          <Search className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">"{currentSearch}"</span>
                        </div>
                      )}

                      {currentKategori && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                          <Filter className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium">
                            {kategoriList.find(k => k.id === parseInt(currentKategori))?.nama || "Kategori"}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-himp via-emerald-400 to-emerald-himp opacity-50"></div>
      </motion.div>
    </div>
  );
};

export default FilterControls;