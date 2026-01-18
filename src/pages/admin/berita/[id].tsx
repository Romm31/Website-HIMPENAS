// src/pages/admin/berita/[id].tsx

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AdminLayout from "../_layout";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, X, Eye, CheckCircle2, AlertCircle, FileText, Settings, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";
import type ReactQuillType from "react-quill-new";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: { forwardedRef: React.Ref<ReactQuillType>, [key: string]: any }) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse rounded-xl bg-gray-100" />,
  }
);

interface Kategori {
  id: number;
  nama: string;
}

export default function EditBerita() {
  const router = useRouter();
  const { id } = router.query;

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const quillRef = useRef<ReactQuillType>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBerita = async () => {
      setIsLoadingData(true);
      try {
        const res = await fetch(`/api/admin/berita/${id}`);
        if (!res.ok) throw new Error("Gagal memuat berita");
        const data = await res.json();
        setJudul(data?.judul ?? "");
        setKonten(data?.konten ?? "");
        setGambarUrl(data?.gambarUrl ?? "");
        setKategoriId(data?.kategoriId ?? null);
      } catch (err) {
        toast.error("Terjadi kesalahan saat memuat berita.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchBerita();
  }, [id]);

  useEffect(() => {
    fetch("/api/admin/kategori")
      .then(r => r.json())
      .then(setKategori)
      .catch(() => toast.error("Gagal memuat kategori"));
  }, []);

  useEffect(() => {
    // Count characters excluding HTML tags
    const text = konten.replace(/<[^>]*>/g, '');
    setCharCount(text.length);
  }, [konten]);

  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        if (input.files && quillRef.current) {
          const file = input.files[0];
          
          // Validate file
          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
          const maxSize = 5 * 1024 * 1024; // 5MB

          if (!validTypes.includes(file.type)) {
            toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP");
            return;
          }

          if (file.size > maxSize) {
            toast.error("Ukuran file terlalu besar. Maksimal 5MB");
            return;
          }

          const toastId = toast.loading("Mengunggah gambar ke konten...");
          const formData = new FormData();
          formData.append("file", file);

          try {
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok || !data?.url) throw new Error("Upload gagal");

            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, "image", data.url);
            editor.setSelection(range.index + 1, 0);

            toast.success("Gambar berhasil disisipkan!", { id: toastId });
          } catch (error) {
            toast.error("Gagal menyisipkan gambar.", { id: toastId });
          }
        }
      };
    };

    return {
      toolbar: {
        container: [
          [{ font: [] }], 
          [{ header: [1, 2, 3, 4, 5, 6, false] }], 
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"], 
          [{ color: [] }, { background: [] }], 
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"], 
          [{ list: "ordered" }, { list: "bullet" }], 
          [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          ["link", "image", "video"], 
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    };
  }, []);

  const handleGambarUnggulan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Ukuran file terlalu besar. Maksimal 5MB");
      return;
    }

    const toastId = toast.loading("Mengunggah gambar unggulan...");
    const fd = new FormData();
    fd.append("file", file);
    
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error("Upload gagal");
      setGambarUrl(data.url);
      toast.success("Gambar unggulan berhasil diganti!", { id: toastId });
    } catch (error) {
      toast.error("Upload gagal.", { id: toastId });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!judul.trim()) {
      toast.error("Judul berita tidak boleh kosong");
      return;
    }

    if (!konten.trim() || konten === '<p><br></p>') {
      toast.error("Konten berita tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/berita/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          judul, 
          konten, 
          gambarUrl, 
          kategoriId: kategoriId ? Number(kategoriId) : null 
        }),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      toast.success("Berita berhasil diperbarui!");
      
      setTimeout(() => {
        router.push("/admin/berita");
      }, 1000);
    } catch (err) {
      toast.error("Gagal memperbarui berita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-emerald-600" size={48} />
          </motion.div>
          <p className="text-gray-500 font-medium">Memuat data berita...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Kembali ke Daftar Berita</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Berita</h1>
            <p className="mt-2 text-gray-600">Perbarui konten dan pengaturan berita</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                <FileText size={14} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">ID: {id}</span>
              </div>
              {charCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5">
                  <span className="text-sm font-semibold text-blue-700">{charCount.toLocaleString()} Karakter</span>
                </div>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            onClick={handleUpdate}
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Title & Editor Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Konten Berita</h3>
              </div>
            </div>

            {/* Title Input */}
            <div className="border-b border-gray-100 p-6">
              <input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                placeholder="Ketik Judul Berita di Sini..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                {judul.length}/200 karakter
              </p>
            </div>

            {/* Rich Text Editor */}
            <div className="quill-wrapper">
              <ReactQuill
                forwardedRef={quillRef}
                theme="snow"
                value={konten}
                onChange={setKonten}
                modules={modules}
                placeholder="Tulis konten berita Anda di sini... Anda bisa copy-paste gambar ke editor ini atau gunakan tombol gambar di toolbar."
                className="min-h-[400px] prose prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 prose-img:rounded-xl"
              />
            </div>
          </div>

          {/* Tips Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Tips Editor</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• Gunakan toolbar untuk format teks (bold, italic, heading, dll)</li>
                  <li>• Klik icon gambar untuk upload gambar ke konten</li>
                  <li>• Bisa copy-paste gambar langsung dari clipboard</li>
                  <li>• Gunakan blockquote untuk kutipan penting</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Settings Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Pengaturan</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Category Select */}
              <div>
                <label htmlFor="kategori" className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Berita
                </label>
                <select
                  id="kategori"
                  value={kategoriId ?? ""}
                  onChange={(e) => setKategoriId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">Pilih kategori...</option>
                  {kategori.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Kategori membantu mengorganisir berita
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} className="text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Gambar Unggulan</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">Gambar utama berita (opsional)</p>
            </div>

            <div className="p-6 space-y-4">
              {!gambarUrl ? (
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50">
                    <Upload size={32} className="text-emerald-600" />
                  </div>
                  <p className="mt-4 font-semibold text-gray-700">Upload Gambar</p>
                  <p className="mt-2 text-sm text-gray-500">JPG, PNG, WebP (Max 5MB)</p>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleGambarUnggulan}
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Preview</p>
                    <div className="flex gap-2">
                      <motion.button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <Eye size={14} />
                        Lihat
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setGambarUrl('')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                      >
                        <X size={14} />
                        Hapus
                      </motion.button>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl shadow-md">
                    <img
                      src={gambarUrl}
                      alt="Featured"
                      className="w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        <CheckCircle2 size={14} />
                        Aktif
                      </span>
                    </div>
                  </div>

                  {/* Change Image Button */}
                  <label
                    htmlFor="file-upload-change"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-sm font-medium text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Upload size={16} />
                    <span>Ganti Gambar</span>
                    <input
                      id="file-upload-change"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleGambarUnggulan}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Save Reminder */}
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Ingat!</h4>
                <p className="mt-1 text-sm text-green-700">
                  Jangan lupa klik "Simpan Perubahan" setelah mengedit
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </form>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && gambarUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowPreviewModal(false)}
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
                onClick={() => setShowPreviewModal(false)}
                className="absolute -top-12 right-0 rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <X size={24} />
              </button>
              <img
                src={gambarUrl}
                alt="Preview Fullscreen"
                className="w-full rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .quill-wrapper .ql-container {
          min-height: 400px;
          font-size: 16px;
        }
        .quill-wrapper .ql-editor {
          min-height: 400px;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </AdminLayout>
  );
}