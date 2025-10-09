// src/pages/admin/galeri/[id].tsx

import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { useRouter } from "next/router";
import { UploadCloud, Trash2, ArrowLeft, Film, Image as ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

interface MediaItem {
  id: number;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface Album {
  id: number;
  title: string;
  description: string;
  mediaItems: MediaItem[];
}

const Lightbox = ({ media, allMedia, onClose, onNext, onPrev }: {
  media: MediaItem;
  allMedia: MediaItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const isFirst = allMedia.findIndex(item => item.id === media.id) === 0;
  const isLast = allMedia.findIndex(item => item.id === media.id) === allMedia.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
        <X size={24} />
      </button>

      {!isFirst && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
          <ChevronLeft size={32} />
        </button>
      )}

      {!isLast && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
          <ChevronRight size={32} />
        </button>
      )}

      <motion.div
        layoutId={`media-${media.id}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh]"
      >
        {media.type === 'VIDEO' ? (
          <video src={media.url} className="w-full h-full object-contain" controls autoPlay />
        ) : (
          <img src={media.url} alt="media" className="w-full h-full object-contain" />
        )}
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmationModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void; }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><Trash2 className="h-6 w-6 text-red-600" /></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus Media</h2>
        <p className="mt-2 text-gray-500">Anda yakin ingin menghapus media ini dari album?</p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">Ya, Hapus</button>
        </div>
      </motion.div>
    </motion.div>
);

export default function AlbumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const fetchAlbum = async () => {
    if (!id) return;
    try {
        const res = await fetch(`/api/admin/galeri/${id}`);
        if (!res.ok) throw new Error("Album tidak ditemukan");
        const data = await res.json();
        setAlbum(data);
    } catch (error) {
        toast.error("Gagal memuat detail album.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
        fetchAlbum();
    }
  }, [id, router.isReady]);

  const handleNext = () => {
    if (!selectedMedia || !album) return;
    const currentIndex = album.mediaItems.findIndex(item => item.id === selectedMedia.id);
    const nextIndex = (currentIndex + 1) % album.mediaItems.length;
    setSelectedMedia(album.mediaItems[nextIndex]);
  };
  const handlePrev = () => {
    if (!selectedMedia || !album) return;
    const currentIndex = album.mediaItems.findIndex(item => item.id === selectedMedia.id);
    const prevIndex = (currentIndex - 1 + album.mediaItems.length) % album.mediaItems.length;
    setSelectedMedia(album.mediaItems[prevIndex]);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const toastId = toast.loading(`Mengunggah ${files.length} file...`);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("media", f));
    try {
        const res = await fetch(`/api/admin/galeri/media/${id}`, { method: "POST", body: form });
        if (!res.ok) throw new Error("Gagal mengunggah media.");
        toast.success(`${files.length} file berhasil diunggah!`, { id: toastId });
        fetchAlbum();
    } catch (error) {
        toast.error("Gagal mengunggah media.", { id: toastId });
    } finally {
        setIsUploading(false);
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, action: 'enter' | 'leave' | 'drop') => {
    e.preventDefault(); e.stopPropagation();
    if (action === 'enter') setIsDragging(true);
    if (action === 'leave') setIsDragging(false);
    if (action === 'drop') {
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    }
  };
  
  const deleteMedia = async () => {
    if (!mediaToDelete) return;
    try {
        await fetch(`/api/admin/galeri/media/${id}?mid=${mediaToDelete.id}`, { method: "DELETE" });
        toast.success("Media berhasil dihapus.");
        fetchAlbum();
    } catch (error) {
        toast.error("Gagal menghapus media.");
    } finally {
        setMediaToDelete(null);
    }
  };
  
  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-emerald-dark" size={40} /></div></AdminLayout>;
  if (!album) return <AdminLayout><div className="text-center p-10"><h2 className="text-xl text-red-600">Album tidak ditemukan.</h2><Link href="/admin/galeri" className="mt-4 inline-block text-emerald-dark hover:underline">Kembali ke daftar album</Link></div></AdminLayout>;

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div>
        <Link href="/admin/galeri" className="flex items-center gap-2 text-gray-500 transition hover:text-gray-800 mb-6">
          <ArrowLeft size={18} /> Kembali ke Daftar Album
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{album.title}</h1>
        <p className="mt-1 text-gray-500 max-w-2xl">{album.description}</p>
      </div>
      
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700">Upload Media</h3>
        <label htmlFor="file-upload" onDragEnter={(e) => handleDragEvents(e, 'enter')} onDragLeave={(e) => handleDragEvents(e, 'leave')} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEvents(e, 'drop')} className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${isDragging ? 'border-emerald-dark bg-emerald-50' : 'border-gray-300 hover:border-emerald-dark hover:bg-emerald-50'}`}>
            <UploadCloud size={40} className={`transition-colors ${isDragging ? 'text-emerald-dark' : 'text-gray-400'}`} />
            <p className="mt-4 font-semibold text-gray-600">Seret & lepas file di sini, atau klik untuk memilih</p>
            <p className="text-sm text-gray-500">Mendukung format gambar dan video</p>
            {isUploading && <div className="mt-4 flex items-center gap-2 text-emerald-dark"><Loader2 className="animate-spin" size={16}/><span>Mengunggah...</span></div>}
            <input id="file-upload" type="file" multiple accept="image/*,video/*" onChange={(e) => handleFileUpload(e.target.files)} className="sr-only" />
        </label>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Isi Album ({album.mediaItems.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {album.mediaItems.map((media) => (
            <motion.div 
                key={media.id} 
                layoutId={`media-${media.id}`}
                onClick={() => setSelectedMedia(media)}
                // ✅ GANTI DARI aspect-square MENJADI aspect-video
                className="group relative aspect-video overflow-hidden rounded-lg shadow-md cursor-pointer bg-gray-200"
            >
              {media.type === "VIDEO" ? (
                <>
                  <video className="h-full w-full object-cover bg-black" preload="metadata"><source src={`${media.url}#t=0.1`} type="video/mp4" /></video>
                  <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white"><Film size={14} /></div>
                </>
              ) : (
                <img src={media.url} alt="media" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                  <button onClick={(e) => { e.stopPropagation(); setMediaToDelete(media); }} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110">
                      <Trash2 size={18} />
                  </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMedia && (
            <Lightbox 
                media={selectedMedia}
                allMedia={album.mediaItems}
                onClose={() => setSelectedMedia(null)}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mediaToDelete && <DeleteConfirmationModal onConfirm={deleteMedia} onCancel={() => setMediaToDelete(null)} />}
      </AnimatePresence>
    </AdminLayout>
  );
}