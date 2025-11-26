// src/pages/admin/galeri/index.tsx

import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Plus, Trash2, X, Image as ImageIcon, Camera, Loader2, Folder, Upload, CheckCircle2, AlertCircle, Sparkles, Grid3x3, List } from "lucide-react";
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

const DeleteConfirmationModal = ({ 
  onConfirm, 
  onCancel, 
  album 
}: { 
  onConfirm: () => void; 
  onCancel: () => void; 
  album: Album 
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
          Anda akan menghapus album <span className="font-semibold text-gray-900">"{album.title}"</span> beserta {album.mediaItems.length} media di dalamnya.
        </p>

        {/* Preview */}
        <div className="mt-4 overflow-hidden rounded-lg">
          <img 
            src={album.coverImageUrl} 
            alt={album.title}
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

const AlbumCard = ({ 
  album, 
  onDelete 
}: { 
  album: Album; 
  onDelete: () => void 
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -8 }}
    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl"
  >
    {/* Cover Image */}
    <Link href={`/admin/galeri/${album.id}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={album.coverImageUrl}
          alt={album.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Media Count Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-white">
          <Camera size={14} />
          <span className="text-sm font-semibold">{album.mediaItems.length}</span>
        </div>
      </div>
    </Link>

    {/* Content */}
    <div className="p-5">
      <Link href={`/admin/galeri/${album.id}`}>
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {album.title}
        </h3>
        {album.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {album.description}
          </p>
        )}
      </Link>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
        <Link 
          href={`/admin/galeri/${album.id}`}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Kelola Album →
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

    {/* Decorative Element */}
    <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"></div>
  </motion.div>
);

export default function GaleriAdmin() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
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
    setCoverPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WebP");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Ukuran terlalu besar. Maksimal 5MB");
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Judul album tidak boleh kosong");
      return;
    }

    if (!coverFile) {
      toast.error("Gambar cover wajib diupload");
      return;
    }

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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Galeri</h1>
          <p className="mt-2 text-gray-600">Kelola album foto dan video organisasi</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-700">{albums.length} Total Album</span>
            </div>
            {albums.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5">
                <Camera size={14} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {albums.reduce((sum, album) => sum + album.mediaItems.length, 0)} Media
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            </button>
          </div>

          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Album</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        {isLoading ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={viewMode === 'grid' ? "h-80 animate-pulse rounded-2xl bg-gray-100" : "h-32 animate-pulse rounded-2xl bg-gray-100"}></div>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
              <Folder size={40} className="text-gray-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">Belum Ada Album</h3>
            <p className="mt-2 text-gray-500">Buat album pertama untuk mengelola galeri</p>
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
            >
              <Plus size={18} />
              <span>Buat Album Pertama</span>
            </motion.button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onDelete={() => setAlbumToDelete(album)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {albums.map((album) => (
                <motion.div
                  key={album.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                >
                  <Link href={`/admin/galeri/${album.id}`} className="flex-shrink-0">
                    <div className="h-24 w-32 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={album.coverImageUrl}
                        alt={album.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/galeri/${album.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 truncate hover:text-emerald-600 transition-colors">
                        {album.title}
                      </h3>
                    </Link>
                    {album.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{album.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Camera size={14} />
                      <span>{album.mediaItems.length} media</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/admin/galeri/${album.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        Kelola
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAlbumToDelete(album)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                      Hapus
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Create Album Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 mb-4">
                  <Folder className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Buat Album Baru</h2>
                <p className="mt-2 text-gray-600">Lengkapi informasi album untuk galeri</p>
              </div>

              <form onSubmit={createAlbum} className="space-y-6">
                {/* Title */}
                <div className="relative">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Judul Album"
                  />
                  <label
                    htmlFor="title"
                    className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                  >
                    Judul Album
                  </label>
                </div>

                {/* Description */}
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Deskripsi"
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                  >
                    Deskripsi (Opsional)
                  </label>
                </div>

                {/* Cover Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gambar Cover
                  </label>
                  {!coverPreview ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50">
                        <Upload size={32} className="text-emerald-600" />
                      </div>
                      <p className="mt-4 font-semibold text-gray-700">Upload Gambar Cover</p>
                      <p className="mt-2 text-sm text-gray-500">JPG, PNG, WebP (Max 5MB)</p>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={coverPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            <CheckCircle2 size={14} />
                            Siap
                          </span>
                        </div>
                      </div>
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-sm font-medium text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50">
                        <Upload size={16} />
                        <span>Ganti Gambar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Membuat...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Buat Album</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {albumToDelete && (
          <DeleteConfirmationModal
            onConfirm={deleteAlbum}
            onCancel={() => setAlbumToDelete(null)}
            album={albumToDelete}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}