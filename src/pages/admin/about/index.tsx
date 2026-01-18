// src/pages/admin/about/index.tsx

import { useEffect, useState, useMemo, useRef } from "react";
import AdminLayout from "../_layout";
import { Toaster, toast } from "sonner";
import { Save, Loader2, Info, AlertCircle, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import "react-quill-new/dist/quill.snow.css";
import type ReactQuillType from "react-quill-new";
import dynamic from "next/dynamic";

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

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const quillRef = useRef<ReactQuillType>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile || "");
      })
      .catch(() => {
        toast.error("Gagal memuat data profil");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Count characters excluding HTML tags
    const text = profile.replace(/<[^>]*>/g, '');
    setCharCount(text.length);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.trim() || profile === '<p><br></p>') {
      toast.error("Profil organisasi tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      
      if (!res.ok) throw new Error("Gagal memperbarui profil");
      
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          const toastId = toast.loading("Mengunggah gambar...");
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-emerald-600" size={48} />
          </motion.div>
          <p className="text-gray-500 font-medium">Memuat data profil...</p>
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Tentang Kami</h1>
            <p className="mt-2 text-gray-600">Kelola profil dan informasi organisasi</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                <Info size={14} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Profil Organisasi</span>
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
            onClick={handleSave}
            disabled={isSubmitting || !profile.trim() || profile === '<p><br></p>'}
            whileHover={{ scale: isSubmitting || !profile.trim() ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting || !profile.trim() ? 1 : 0.95 }}
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

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-4"
      >
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Tips Menulis Profil</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• Jelaskan sejarah singkat dan latar belakang organisasi</li>
              <li>• Sertakan informasi tentang struktur dan kegiatan organisasi</li>
              <li>• Gunakan toolbar untuk format teks (heading, bold, list, dll)</li>
              <li>• Klik icon gambar untuk menambahkan foto atau ilustrasi</li>
              <li>• Pastikan informasi yang disampaikan akurat dan up-to-date</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Editor Form */}
      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Editor Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Konten Profil</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Tulis atau edit informasi lengkap tentang organisasi</p>
          </div>

          <div className="quill-wrapper">
            <ReactQuill
              forwardedRef={quillRef}
              theme="snow"
              value={profile}
              onChange={setProfile}
              modules={modules}
              placeholder="Tuliskan profil lengkap organisasi di sini... 

Anda dapat menambahkan:
• Sejarah dan latar belakang organisasi
• Visi, misi, dan tujuan
• Struktur organisasi
• Program dan kegiatan
• Prestasi dan pencapaian
• Kontak dan informasi lainnya

Gunakan toolbar di atas untuk format teks dan sisipkan gambar."
              className="min-h-[500px]"
            />
          </div>
        </div>

        {/* Required Notice */}
        {(!profile.trim() || profile === '<p><br></p>') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
          >
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900">Profil Belum Diisi</h4>
                <p className="mt-1 text-sm text-orange-700">
                  Silakan tulis profil organisasi untuk ditampilkan di halaman "Tentang Kami".
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Notice */}
        {profile.trim() && profile !== '<p><br></p>' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-green-100 bg-green-50 p-4"
          >
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Profil Siap Disimpan</h4>
                <p className="mt-1 text-sm text-green-700">
                  Konten profil sudah lengkap dengan {charCount.toLocaleString()} karakter. Klik "Simpan Perubahan" untuk mempublikasikan.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting || !profile.trim() || profile === '<p><br></p>'}
            whileHover={{ scale: isSubmitting || !profile.trim() ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting || !profile.trim() ? 1 : 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
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
      </motion.form>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-gray-600 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">Catatan:</p>
            <ul className="mt-2 space-y-1">
              <li>• Perubahan akan langsung terlihat di halaman publik setelah disimpan</li>
              <li>• Gambar yang diupload akan disimpan secara permanen</li>
              <li>• Pastikan format dan tata letak sudah sesuai sebelum menyimpan</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .quill-wrapper .ql-container {
          min-height: 500px;
          font-size: 16px;
        }
        .quill-wrapper .ql-editor {
          min-height: 500px;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>
    </AdminLayout>
  );
}