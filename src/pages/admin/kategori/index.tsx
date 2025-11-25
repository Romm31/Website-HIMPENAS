// src/pages/admin/kategori/index.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Shapes, Search, Filter, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

type Kategori = {
  id: number;
  nama: string;
  _count?: { berita: number };
};

const DeleteConfirmationModal = ({ 
  onConfirm, 
  onCancel, 
  nama,
  isDeleting 
}: { 
  onConfirm: () => void; 
  onCancel: () => void; 
  nama: string;
  isDeleting: boolean;
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
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200"
      >
        <Trash2 className="h-8 w-8 text-red-600" />
      </motion.div>
      
      <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
        Hapus Kategori
      </h2>
      
      <p className="mt-3 text-center text-gray-600">
        Anda yakin ingin menghapus kategori
      </p>
      <p className="mt-1 text-center">
        <strong className="text-gray-800">{`"${nama}"`}</strong>?
      </p>
      <p className="mt-2 text-center text-sm text-gray-500">
        Tindakan ini tidak dapat dibatalkan.
      </p>
      
      <div className="mt-8 flex flex-col-reverse sm:flex-row justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          disabled={isDeleting}
          className="rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 font-semibold text-white transition hover:from-red-700 hover:to-red-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isDeleting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
              Menghapus...
            </>
          ) : (
            'Ya, Hapus'
          )}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const KategoriCard = ({ 
  item, 
  onEdit, 
  onDelete 
}: { 
  item: Kategori; 
  onEdit: () => void; 
  onDelete: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
  >
    {/* Gradient Background on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
    
    <div className="relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-green-100"
            >
              <Shapes className="h-5 w-5 text-emerald-600" />
            </motion.div>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-mono font-medium text-gray-600">
              #{item.id}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
            {item.nama}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1.5">
          <FileText className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            {item._count?.berita ?? 0}
          </span>
          <span className="text-xs text-gray-500">berita</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-sky-600 hover:to-blue-600"
        >
          <Edit className="h-4 w-4" />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    </div>

    {/* Decorative Corner */}
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      whileHover={{ scale: 1, rotate: 0 }}
      className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 opacity-0 transition-opacity group-hover:opacity-30"
    />
  </motion.div>
);

export default function KategoriList() {
  const [items, setItems] = useState<Kategori[]>([]);
  const [filteredItems, setFilteredItems] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<Kategori | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const loadKategori = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/kategori');
      if (!res.ok) throw new Error("Gagal memuat kategori");
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
    } catch {
      toast.error('Gagal memuat kategori');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKategori();
  }, []);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/kategori/${itemToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Gagal menghapus');
      }
      toast.success(`Kategori "${itemToDelete.nama}" berhasil dihapus.`);
      loadKategori();
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500"
            >
              <Shapes className="h-6 w-6 text-white" />
            </motion.div>
            Kategori Berita
          </h1>
          <p className="mt-1 text-gray-500">Kelola semua kategori untuk artikel berita.</p>
        </div>
        <Link href="/admin/kategori/tambah">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Kategori</span>
            <span className="sm:hidden">Tambah</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              viewMode === 'grid'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shapes className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              viewMode === 'table'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-100">
          <p className="text-sm font-medium text-emerald-700">Total Kategori</p>
          <p className="mt-1 text-3xl font-bold text-emerald-900">{items.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 p-4 border border-blue-100">
          <p className="text-sm font-medium text-blue-700">Total Berita</p>
          <p className="mt-1 text-3xl font-bold text-blue-900">
            {items.reduce((sum, item) => sum + (item._count?.berita ?? 0), 0)}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 border border-purple-100 col-span-2 sm:col-span-1">
          <p className="text-sm font-medium text-purple-700">Hasil Pencarian</p>
          <p className="mt-1 text-3xl font-bold text-purple-900">{filteredItems.length}</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        {isLoading ? (
          // Loading State
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="animate-pulse">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                      <div className="h-5 w-12 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                    <div className="h-8 w-20 bg-gray-200 rounded-lg mb-4" />
                    <div className="flex gap-2">
                      <div className="h-9 flex-1 bg-gray-200 rounded-lg" />
                      <div className="h-9 w-12 bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></th>
                    <th className="px-6 py-3 text-left"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></th>
                    <th className="px-6 py-3 text-left"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></th>
                    <th className="px-6 py-3 text-left"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-6 py-5">
                        <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : filteredItems.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shapes size={64} className="mx-auto text-gray-300" />
            </motion.div>
            <p className="mt-4 text-xl font-semibold text-gray-700">
              {searchQuery ? 'Tidak ada hasil' : 'Belum ada kategori'}
            </p>
            <p className="mt-2 text-gray-500">
              {searchQuery
                ? `Tidak ditemukan kategori dengan kata kunci "${searchQuery}"`
                : 'Klik "Tambah Kategori" untuk memulai.'}
            </p>
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchQuery('')}
                className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700"
              >
                Reset Pencarian
              </motion.button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <KategoriCard
                  key={item.id}
                  item={item}
                  onEdit={() => window.location.href = `/admin/kategori/${item.id}`}
                  onDelete={() => setItemToDelete(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Table View
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th scope="col" className="w-24 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Nama Kategori
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                      Jumlah Berita
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="group transition-colors hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-mono text-sm font-medium text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                            #{item.id}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-green-100"
                            >
                              <Shapes className="h-4 w-4 text-emerald-600" />
                            </motion.div>
                            <span className="font-semibold text-gray-900 group-hover:text-emerald-700">
                              {item.nama}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1.5 group-hover:from-emerald-50 group-hover:to-green-50">
                            <FileText className="h-4 w-4 text-gray-600 group-hover:text-emerald-600" />
                            <span className="font-semibold text-gray-700 group-hover:text-emerald-700">
                              {item._count?.berita ?? 0}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => window.location.href = `/admin/kategori/${item.id}`}
                              className="rounded-lg bg-sky-100 p-2 text-sky-600 transition hover:bg-sky-200"
                            >
                              <Edit size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setItemToDelete(item)}
                              className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
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
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <DeleteConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => setItemToDelete(null)}
            nama={itemToDelete.nama}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}