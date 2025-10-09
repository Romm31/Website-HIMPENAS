// src/pages/admin/berita/index.tsx

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Newspaper, Search, X } from "lucide-react";
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
  createdAt: string;
  kategori?: Kategori | null;
}

const DeleteConfirmationModal = ({ onConfirm, onCancel, judul }: { onConfirm: () => void; onCancel: () => void; judul: string }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus Berita</h2>
        <p className="mt-2 text-gray-500">
          Anda yakin ingin menghapus berita berjudul <strong className="text-gray-700">{`"${judul}"`}</strong>?
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">Ya, Hapus</button>
        </div>
      </motion.div>
    </motion.div>
  );

export default function ListBerita() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [beritaToDelete, setBeritaToDelete] = useState<Berita | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce untuk search

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
      fetchBerita(); // Muat ulang data
      toast.success(`Berita "${beritaToDelete.judul}" berhasil dihapus.`);
    } catch (error) {
        toast.error("Gagal menghapus berita.");
    } finally {
        setBeritaToDelete(null);
    }
  };
  
  const filteredBerita = useMemo(() => 
    berita.filter(b => 
        b.judul.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        b.kategori?.nama.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [berita, debouncedSearchTerm]
  );

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Berita</h1>
          <p className="mt-1 text-gray-500">Publikasikan, edit, dan kelola semua artikel berita.</p>
        </div>
        <Link href="/admin/berita/tambah" className="flex items-center gap-2 rounded-lg bg-emerald-dark px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md">
          <Plus size={18} /> Tambah Berita
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
            type="text"
            placeholder="Cari berita berdasarkan judul atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-10 shadow-sm focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark"
        />
        {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={18} />
            </button>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Judul</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kategori</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tanggal Publikasi</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <AnimatePresence>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="whitespace-nowrap px-6 py-5"><div className="h-6 w-full animate-pulse rounded-md bg-gray-200"></div></td></tr>
              ))
            ) : filteredBerita.length === 0 ? (
                <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-500">
                        <Newspaper size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-lg font-medium">{debouncedSearchTerm ? 'Berita tidak ditemukan' : 'Belum ada berita'}</p>
                        <p className="mt-1 text-sm">{debouncedSearchTerm ? `Tidak ada hasil untuk "${debouncedSearchTerm}"` : 'Klik "Tambah Berita" untuk memulai.'}</p>
                    </td>
                </tr>
            ) : (
              filteredBerita.map((b) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{b.judul}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${b.kategori ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {b.kategori?.nama || "Tanpa Kategori"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {new Date(b.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/berita/${b.id}`} className="text-sky-600 transition hover:text-sky-800"><Edit size={18} /></Link>
                      <button onClick={() => setBeritaToDelete(b)} className="text-red-600 transition hover:text-red-800"><Trash2 size={18} /></button>
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
        {beritaToDelete && (
            <DeleteConfirmationModal 
                onConfirm={handleDelete}
                onCancel={() => setBeritaToDelete(null)}
                judul={beritaToDelete.judul}
            />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}