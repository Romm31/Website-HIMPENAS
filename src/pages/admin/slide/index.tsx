// src/pages/admin/slide/index.tsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, Eye, ArrowUpDown, Sparkles, Grid3x3, List, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

interface Slide {
  id: number;
  title: string;
  imageUrl: string;
  order: number;
}

const DeleteConfirmationModal = ({ 
  onConfirm, 
  onCancel, 
  slide 
}: { 
  onConfirm: () => void; 
  onCancel: () => void; 
  slide: Slide 
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
          Anda akan menghapus slide <span className="font-semibold text-gray-900">"{slide.title}"</span>. 
          Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Preview Image */}
        <div className="mt-4 overflow-hidden rounded-lg">
          <img 
            src={slide.imageUrl} 
            alt={slide.title}
            className="w-full h-32 object-cover"
          />
        </div>
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

const PreviewModal = ({ 
  slide, 
  onClose 
}: { 
  slide: Slide; 
  onClose: () => void 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
      className="relative max-w-5xl w-full"
    >
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X size={24} />
      </button>
      <div className="rounded-2xl bg-white p-4 shadow-2xl">
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full rounded-lg"
        />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
            <p className="text-sm text-gray-500">Urutan: {slide.order}</p>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const SlidePage = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/slide");
      if (!res.ok) throw new Error("Gagal memuat slides");
      const data = await res.json();
      setSlides(data.sort((a: Slide, b: Slide) => a.order - b.order));
    } catch (error) {
      toast.error("Gagal memuat data slide.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async () => {
    if (!slideToDelete) return;
    try {
      await fetch(`/api/admin/slide/${slideToDelete.id}`, { method: "DELETE" });
      setSlides(slides.filter((s) => s.id !== slideToDelete.id));
      toast.success(`Slide "${slideToDelete.title}" berhasil dihapus.`);
    } catch (error) {
      toast.error("Gagal menghapus slide.");
    } finally {
      setSlideToDelete(null);
    }
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setSlides([...slides].sort((a, b) => 
      newOrder === 'asc' ? a.order - b.order : b.order - a.order
    ));
  };

  const sortedSlides = [...slides].sort((a, b) => 
    sortOrder === 'asc' ? a.order - b.order : b.order - a.order
  );

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
          <h1 className="text-4xl font-bold text-gray-900">Slide Show</h1>
          <p className="mt-2 text-gray-600">Kelola gambar yang tampil di halaman utama</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-700">{slides.length} Total Slide</span>
            </div>
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="/admin/slide/tambah" 
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <Plus size={20} />
            <span>Tambah Slide Baru</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSort}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowUpDown size={18} />
            <span>Urutan: {sortOrder === 'asc' ? 'Naik' : 'Turun'}</span>
          </motion.button>
        </div>

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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100"></div>
              ))}
            </div>
          )
        ) : slides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
              <ImageIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">Belum Ada Slide</h3>
            <p className="mt-2 text-gray-500">Tambahkan slide pertama untuk memulai</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6"
            >
              <Link 
                href="/admin/slide/tambah"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
              >
                <Plus size={18} />
                <span>Tambah Slide Pertama</span>
              </Link>
            </motion.div>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {sortedSlides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Order Badge */}
                    <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                      <span className="text-sm font-bold text-emerald-600">{slide.order}</span>
                    </div>

                    {/* Featured Badge */}
                    {slide.order === 1 && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 shadow-lg">
                        <Sparkles size={14} className="text-white" />
                        <span className="text-xs font-bold text-white">Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{slide.title}</h3>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPreviewSlide(slide)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-all hover:bg-gray-100"
                    >
                      <Eye size={20} />
                    </motion.button>

                    <Link href={`/admin/slide/${slide.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all hover:bg-emerald-700"
                      >
                        <Edit size={20} />
                      </motion.div>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSlideToDelete(slide)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all hover:bg-red-700"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sortedSlides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Order */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-bold text-white shadow-lg">
                    {slide.order}
                  </div>

                  {/* Thumbnail */}
                  <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{slide.title}</h3>
                    <p className="text-sm text-gray-500">ID: {slide.id}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPreviewSlide(slide)}
                      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      <Eye size={20} />
                    </motion.button>

                    <Link href={`/admin/slide/${slide.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                      >
                        <Edit size={20} />
                      </motion.div>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSlideToDelete(slide)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {slideToDelete && (
          <DeleteConfirmationModal 
            onConfirm={handleDelete}
            onCancel={() => setSlideToDelete(null)}
            slide={slideToDelete}
          />
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewSlide && (
          <PreviewModal
            slide={previewSlide}
            onClose={() => setPreviewSlide(null)}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default SlidePage;