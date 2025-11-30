// src/pages/admin/galeri/[id].tsx

import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { useRouter } from "next/router";
import { 
  UploadCloud, 
  Trash2, 
  ArrowLeft, 
  Film, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ImagePlus,
  Sparkles,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110"
      >
        <X size={24} />
      </button>

      {!isFirst && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {!isLast && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110"
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
      >
        {media.type === 'VIDEO' ? (
          <video src={media.url} className="w-full h-full object-contain bg-black" controls autoPlay />
        ) : (
          <img src={media.url} alt="media" className="w-full h-full object-contain bg-black" />
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
        {allMedia.findIndex(item => item.id === media.id) + 1} / {allMedia.length}
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void; }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hapus Media</h2>
            <p className="text-sm text-gray-500">Tindakan tidak dapat dibatalkan</p>
          </div>
        </div>
        <p className="text-gray-600 mb-6">Anda yakin ingin menghapus media ini dari album?</p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel} 
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 font-medium text-white transition hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
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
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
            <p className="text-gray-500 text-lg">Memuat detail album...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!album) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <FolderOpen size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Album tidak ditemukan</h2>
            <p className="text-gray-500 mb-6">Album yang Anda cari tidak tersedia</p>
            <Link 
              href="/admin/galeri" 
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-green-700 transition-all"
            >
              Kembali ke Daftar Album
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 animate-in slide-in-from-top duration-500">
            <Link 
              href="/admin/galeri" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali ke Daftar Album</span>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg">
                <ImageIcon className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                  {album.title}
                  <Sparkles className="text-yellow-500" size={24} />
                </h1>
                <p className="text-gray-500 text-sm md:text-base mt-1">{album.description}</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Media</p>
                  <h3 className="text-3xl font-bold text-gray-900">{album.mediaItems.length}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <ImageIcon className="text-emerald-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Gambar</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {album.mediaItems.filter(m => m.type === 'IMAGE').length}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <ImageIcon className="text-green-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Video</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {album.mediaItems.filter(m => m.type === 'VIDEO').length}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center">
                  <Film className="text-teal-600" size={28} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Upload Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <ImagePlus className="text-emerald-600" size={24} />
              Upload Media Baru
            </h3>
            
            <label 
              htmlFor="file-upload" 
              onDragEnter={(e) => handleDragEvents(e, 'enter')} 
              onDragLeave={(e) => handleDragEvents(e, 'leave')} 
              onDragOver={(e) => e.preventDefault()} 
              onDrop={(e) => handleDragEvents(e, 'drop')} 
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-emerald-600 bg-emerald-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                isDragging ? 'bg-emerald-600' : 'bg-gray-100'
              }`}>
                <UploadCloud size={32} className={`transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`} />
              </div>
              
              <p className="font-bold text-lg text-gray-700 mb-2">
                {isDragging ? 'Lepaskan file di sini' : 'Seret & lepas file di sini'}
              </p>
              <p className="text-gray-500 mb-1">atau klik untuk memilih file</p>
              <p className="text-sm text-gray-400">Mendukung format gambar (JPG, PNG, GIF) dan video (MP4, MOV)</p>
              
              {isUploading && (
                <div className="mt-6 flex items-center gap-3 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-medium">
                  <Loader2 className="animate-spin" size={20}/>
                  <span>Mengunggah file...</span>
                </div>
              )}
              
              <input 
                id="file-upload" 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                onChange={(e) => handleFileUpload(e.target.files)} 
                className="sr-only" 
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Media Grid */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in slide-in-from-bottom delay-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FolderOpen className="text-emerald-600" size={24} />
              Isi Album ({album.mediaItems.length})
            </h3>
            
            {album.mediaItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <ImageIcon size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Album masih kosong</p>
                <p className="text-gray-400 text-sm">Upload media pertama Anda di atas</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {album.mediaItems.map((media, index) => (
                  <div 
                    key={media.id} 
                    onClick={() => setSelectedMedia(media)}
                    className="group relative aspect-video overflow-hidden rounded-xl shadow-md cursor-pointer bg-gray-200 hover:shadow-xl transition-all duration-300 animate-in zoom-in-95"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {media.type === "VIDEO" ? (
                      <>
                        <video className="h-full w-full object-cover bg-black" preload="metadata">
                          <source src={`${media.url}#t=0.1`} type="video/mp4" />
                        </video>
                        <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm text-white">
                          <Film size={16} />
                        </div>
                      </>
                    ) : (
                      <img src={media.url} alt="media" className="h-full w-full object-cover" />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setMediaToDelete(media); }} 
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110 shadow-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {selectedMedia && (
        <Lightbox 
          media={selectedMedia}
          allMedia={album.mediaItems}
          onClose={() => setSelectedMedia(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {mediaToDelete && (
        <DeleteConfirmationModal 
          onConfirm={deleteMedia} 
          onCancel={() => setMediaToDelete(null)} 
        />
      )}
    </AdminLayout>
  );
}