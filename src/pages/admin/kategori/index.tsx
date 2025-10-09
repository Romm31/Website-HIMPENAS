// src/pages/admin/kategori/index.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Shapes, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

type Kategori = {
  id: number;
  nama: string;
  _count?: { berita: number };
};

const DeleteConfirmationModal = ({ onConfirm, onCancel, nama }: { onConfirm: () => void; onCancel: () => void; nama: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus Kategori</h2>
      <p className="mt-2 text-gray-500">
        Anda yakin ingin menghapus kategori <strong className="text-gray-700">{`"${nama}"`}</strong>?
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">Batal</button>
        <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">Ya, Hapus</button>
      </div>
    </motion.div>
  </motion.div>
);

export default function KategoriList() {
  const [items, setItems] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<Kategori | null>(null);

  const loadKategori = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/kategori');
      if (!res.ok) throw new Error("Gagal memuat kategori");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error('Gagal memuat kategori');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKategori();
  }, []);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/kategori/${itemToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Gagal menghapus');
      }
      toast.success(`Kategori "${itemToDelete.nama}" berhasil dihapus.`);
      loadKategori(); // Muat ulang data
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus');
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kategori Berita</h1>
          <p className="mt-1 text-gray-500">Kelola semua kategori untuk artikel berita.</p>
        </div>
        <Link href="/admin/kategori/tambah" className="flex items-center gap-2 rounded-lg bg-emerald-dark px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md">
          <Plus size={18} /> Tambah Kategori
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-24 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Kategori</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jumlah Berita</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <AnimatePresence>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="whitespace-nowrap px-6 py-5"><div className="h-6 w-full animate-pulse rounded-md bg-gray-200"></div></td></tr>
              ))
            ) : items.length === 0 ? (
                <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-500">
                        <Shapes size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-lg font-medium">Belum ada kategori</p>
                        <p className="mt-1 text-sm">Klik "Tambah Kategori" untuk memulai.</p>
                    </td>
                </tr>
            ) : (
              items.map((item) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-gray-500">{item.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {item._count?.berita ?? 0}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/kategori/${item.id}`} className="text-sky-600 transition hover:text-sky-800"><Edit size={18} /></Link>
                      <button onClick={() => setItemToDelete(item)} className="text-red-600 transition hover:text-red-800"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {itemToDelete && (
            <DeleteConfirmationModal 
                onConfirm={handleDelete}
                onCancel={() => setItemToDelete(null)}
                nama={itemToDelete.nama}
            />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}