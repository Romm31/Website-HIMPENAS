// src/pages/admin/galeri/index.tsx

import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Plus, Trash2, X, Image as ImageIcon, Camera, Loader2, Folder } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

interface Album {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  mediaItems: any[];
}

const DeleteConfirmationModal = ({ onConfirm, onCancel, title }: { onConfirm: () => void; onCancel: () => void; title: string }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><Trash2 className="h-6 w-6 text-red-600" /></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus Album</h2>
        <p className="mt-2 text-gray-500">
          Anda yakin ingin menghapus album <strong className="text-gray-700">{`"${title}"`}</strong> beserta semua isinya?
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">Ya, Hapus</button>
        </div>
      </motion.div>
    </motion.div>
);


export default function GaleriAdmin() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
        const res = await fetch("/api/admin/galeri");
        if (!res.ok) throw new Error("Gagal memuat album");
        const data = await res.json();
        setAlbums(data);
    } catch (error) {
        toast.error("Gagal memuat daftar album.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCoverFile(null);
  };

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !coverFile) return toast.error("Judul dan gambar cover wajib diisi!");
    
    setIsSubmitting(true);
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("cover", coverFile);

    try {
        const res = await fetch("/api/admin/galeri", { method: "POST", body: form });
        if (!res.ok) throw new Error("Gagal membuat album");
        toast.success("Album baru berhasil dibuat!");
        setShowModal(false);
        resetForm();
        fetchAlbums();
    } catch (error) {
        toast.error("Gagal membuat album.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const deleteAlbum = async () => {
    if (!albumToDelete) return;
    try {
        await fetch(`/api/admin/galeri/${albumToDelete.id}`, { method: "DELETE" });
        fetchAlbums();
        toast.success(`Album "${albumToDelete.title}" berhasil dihapus.`);
    } catch (error) {
        toast.error("Gagal menghapus album.");
    } finally {
        setAlbumToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Galeri Foto & Video</h1>
          <p className="mt-1 text-gray-500">Kelola album dan media visual untuk ditampilkan.</p>
        </div>
        <motion.button onClick={() => setShowModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-lg bg-emerald-dark px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md">
          <Plus size={18} /> Tambah Album
        </motion.button>
      </div>
      
      <div className="mt-8">
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4 animate-pulse rounded-xl bg-gray-200 p-4">
                    <div className="aspect-video w-full rounded-md bg-gray-300"></div>
                    <div className="h-5 w-3/4 rounded-md bg-gray-300"></div>
                    <div className="h-4 w-full rounded-md bg-gray-300"></div>
                    <div className="h-4 w-1/2 rounded-md bg-gray-300"></div>
                  </div>
                ))}
            </div>
        ) : albums.length === 0 ? (
            <div className="py-24 text-center text-gray-500">
                <Folder size={48} className="mx-auto text-gray-300" />
                <p className="mt-4 text-lg font-medium">Belum ada album</p>
                <p className="mt-1">Klik "Tambah Album" untuk memulai.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {albums.map((album) => (
                        <motion.div 
                            key={album.id} 
                            layout 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full"
                        >
                            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
                                <Link href={`/admin/galeri/${album.id}`} className="block">
                                    {/* ✅ BAGIAN YANG DIPERBAIKI */}
                                    <div className="aspect-video w-full bg-gray-100">
                                      <img src={album.coverImageUrl} alt={album.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800 truncate">{album.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 h-10">{album.description}</p>
                                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                                            <span className="flex items-center gap-1.5"><Camera size={14}/> {album.mediaItems.length} media</span>
                                            <span className="font-medium text-emerald-dark">Lihat Detail &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                                <button onClick={() => setAlbumToDelete(album)} className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/80 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-red-600 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 transition hover:text-gray-600"><X /></button>
              <h2 className="text-2xl font-bold text-gray-800">Buat Album Baru</h2>
              <form onSubmit={createAlbum} className="mt-6 space-y-5">
                <div className="relative"><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Judul Album" /><label htmlFor="title" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Judul Album</label></div>
                <div className="relative"><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Deskripsi" /><label htmlFor="description" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Deskripsi (Opsional)</label></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Gambar Cover</label><input type="file" required accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100" /></div>
                <div className="flex justify-end pt-2"><motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Membuat...</> : "Buat Album"}</motion.button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {albumToDelete && <DeleteConfirmationModal onConfirm={deleteAlbum} onCancel={() => setAlbumToDelete(null)} title={albumToDelete.title} />}
      </AnimatePresence>
    </AdminLayout>
  );
}