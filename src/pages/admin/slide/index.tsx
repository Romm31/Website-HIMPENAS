// src/pages/admin/slide/index.tsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

interface Slide {
  id: number;
  title: string;
  imageUrl: string;
  order: number;
}

const DeleteConfirmationModal = ({ onConfirm, onCancel, slideTitle }: { onConfirm: () => void; onCancel: () => void; slideTitle: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus Slide</h2>
      <p className="mt-2 text-gray-500">
        Anda yakin ingin menghapus slide berjudul <strong className="text-gray-700">{`"${slideTitle}"`}</strong>?
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">Batal</button>
        <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">Ya, Hapus</button>
      </div>
    </motion.div>
  </motion.div>
);

const SlidePage = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);

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

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Slide Show</h1>
          <p className="mt-1 text-gray-500">Kelola gambar yang tampil di halaman utama.</p>
        </div>
        
        {/* === BAGIAN YANG DIPERBAIKI (1) === */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="/admin/slide/tambah" 
            className="flex items-center gap-2 rounded-lg bg-emerald-dark px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md"
          >
            <Plus size={18} /> Tambah Slide
          </Link>
        </motion.div>

      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
        ) : slides.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            <ImageIcon size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-lg">Belum ada slide.</p>
            <p>Klik "Tambah Slide" untuk memulai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {slides.map((slide) => (
                <motion.div
                  key={slide.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md"
                >
                  <img src={slide.imageUrl} alt={slide.title} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <span className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-sm font-bold">
                      {slide.order}
                    </span>
                    <h3 className="text-lg font-bold">{slide.title}</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    
                    {/* === BAGIAN YANG DIPERBAIKI (2) === */}
                    <Link 
                      href={`/admin/slide/${slide.id}`}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-700"
                    >
                      <Edit size={20} />
                    </Link>

                    <button onClick={() => setSlideToDelete(slide)} className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {slideToDelete && (
          <DeleteConfirmationModal 
            onConfirm={handleDelete}
            onCancel={() => setSlideToDelete(null)}
            slideTitle={slideToDelete.title}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default SlidePage;