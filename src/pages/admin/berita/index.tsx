// src/pages/admin/berita/index.tsx

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Newspaper, Search, X, Grid3x3, List, Calendar, Tag, Eye, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";

interface Kategori {
  id: number;
  nama: string;
}

interface Berita {
  id: number;
  judul: string;
  konten: string;
  createdAt: string;
  kategori?: Kategori | null;
}

const DeleteConfirmationModal = ({ 
  onConfirm, 
  onCancel, 
  berita 
}: { 
  onConfirm: () => void; 
  onCancel: () => void; 
  berita: Berita 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50"
      >
        <Trash2 className="h-8 w-8 text-red-600" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Konfirmasi Penghapusan</h2>
        <p className="mt-3 text-center text-gray-600">
          Anda akan menghapus berita <span className="font-semibold text-gray-900">"{berita.judul}"</span>. 
          Tindakan ini tidak dapat dibatalkan.
        </p>
        {berita.kategori && (
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <Tag size={12} />
              {berita.kategori.nama}
            </span>
          </div>
        )}
      </motion.div>

      <div className="mt-8 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          Batal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40"
        >
          Ya, Hapus
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const BeritaCard = ({ 
  berita, 
  onDelete 
}: { 
  berita: Berita; 
  onDelete: () => void 
}) => {
  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-100/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {berita.kategori && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 mb-3">
                <Tag size={12} />
                {berita.kategori.nama}
              </span>
            )}
            <h3 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {berita.judul}
            </h3>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {truncateText(berita.konten?.replace(/<[^>]*>/g, '') || '', 150)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{new Date(berita.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/admin/berita/${berita.id}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                <Edit size={18} />
              </motion.div>
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"></div>
    </motion.div>
  );
};

export default function ListBerita() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [beritaToDelete, setBeritaToDelete] = useState<Berita | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchBerita = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/berita");
      const data = await res.json();
      setBerita(data);
    } catch (error) {
      toast.error("Gagal memuat daftar berita.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleDelete = async () => {
    if (!beritaToDelete) return;
    try {
      await fetch(`/api/admin/berita/${beritaToDelete.id}`, { method: "DELETE" });
      fetchBerita();
      toast.success(`Berita "${beritaToDelete.judul}" berhasil dihapus.`);
    } catch (error) {
      toast.error("Gagal menghapus berita.");
    } finally {
      setBeritaToDelete(null);
    }
  };

  const uniqueKategori = useMemo(() => {
    const kategoris = berita
      .filter(b => b.kategori)
      .map(b => b.kategori!)
      .filter((k, i, arr) => arr.findIndex(t => t.id === k.id) === i);
    return kategoris;
  }, [berita]);

  const filteredBerita = useMemo(() => {
    let filtered = berita.filter(b =>
      (b.judul?.toLowerCase() || '').includes(debouncedSearchTerm.toLowerCase()) ||
      (b.kategori?.nama?.toLowerCase() || '').includes(debouncedSearchTerm.toLowerCase())
    );

    if (selectedKategori !== 'all') {
      if (selectedKategori === 'none') {
        filtered = filtered.filter(b => !b.kategori);
      } else {
        filtered = filtered.filter(b => b.kategori?.id === Number(selectedKategori));
      }
    }

    return filtered;
  }, [berita, debouncedSearchTerm, selectedKategori]);

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manajemen Berita</h1>
          <p className="mt-2 text-gray-600">Publikasikan, edit, dan kelola semua artikel berita</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-700">{berita.length} Total Berita</span>
            </div>
            {filteredBerita.length !== berita.length && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5">
                <span className="text-sm font-semibold text-blue-700">{filteredBerita.length} Hasil Filter</span>
              </div>
            )}
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/admin/berita/tambah"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <Plus size={20} />
            <span>Tambah Berita Baru</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex flex-col gap-4 sm:flex-row"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berita berdasarkan judul atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-medium shadow-sm transition-all ${
              selectedKategori !== 'all'
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <Filter size={18} />
            <span>Filter Kategori</span>
            <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(false)}
                ></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-14 z-20 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedKategori('all');
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedKategori === 'all'
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Semua Kategori
                    </button>
                    <button
                      onClick={() => {
                        setSelectedKategori('none');
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedKategori === 'none'
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Tanpa Kategori
                    </button>
                    {uniqueKategori.map(kategori => (
                      <button
                        key={kategori.id}
                        onClick={() => {
                          setSelectedKategori(String(kategori.id));
                          setShowFilterDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedKategori === String(kategori.id)
                            ? 'bg-emerald-100 text-emerald-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Tag size={14} />
                        {kategori.nama}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid3x3 size={16} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={16} />
            <span>List</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="h-96 animate-pulse bg-gray-100"></div>
            </div>
          )
        ) : filteredBerita.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
              <Newspaper size={40} className="text-gray-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              {debouncedSearchTerm || selectedKategori !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Berita'}
            </h3>
            <p className="mt-2 text-gray-500">
              {debouncedSearchTerm || selectedKategori !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Tambahkan berita pertama untuk memulai'}
            </p>
            {!debouncedSearchTerm && selectedKategori === 'all' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Link
                  href="/admin/berita/tambah"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
                >
                  <Plus size={18} />
                  <span>Tambah Berita Pertama</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredBerita.map(b => (
                <BeritaCard
                  key={b.id}
                  berita={b}
                  onDelete={() => setBeritaToDelete(b)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Judul</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Tanggal</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <AnimatePresence mode="popLayout">
                  {filteredBerita.map(b => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td title={b.judul} className="max-w-md truncate px-6 py-4 font-medium text-gray-900">
                        {b.judul}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            b.kategori ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {b.kategori && <Tag size={12} />}
                          {b.kategori?.nama || "Tanpa Kategori"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {new Date(b.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/berita/${b.id}`}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                            >
                              <Edit size={18} />
                            </motion.div>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setBeritaToDelete(b)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {beritaToDelete && (
          <DeleteConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => setBeritaToDelete(null)}
            berita={beritaToDelete}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}