// src/pages/admin/about/index.tsx

import { useEffect, useState, useMemo, useRef } from "react";
import AdminLayout from "../_layout";
import { Toaster, toast } from "sonner";
import { Save, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import type ReactQuillType from "react-quill";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: { forwardedRef: React.Ref<ReactQuillType>, [key: string]: any }) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-md bg-gray-200" />,
  }
);

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
          [{ font: [] }], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }], [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          ["link", "image", "video"], ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    };
  }, []);
  
  const SkeletonLoader = () => (
    // ✅ TAMBAHKAN max-w-4xl mx-auto
    <div className="mt-8 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-1/4 rounded-md bg-gray-200 mb-4"></div>
        <div className="h-64 w-full rounded-md bg-gray-200"></div>
        <div className="flex justify-end mt-6">
            <div className="h-12 w-40 rounded-md bg-gray-300"></div>
        </div>
    </div>
  );

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Tentang Kami</h1>
            <p className="mt-1 text-gray-500">Ubah konten yang tampil di halaman "Tentang Kami".</p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <motion.form 
            onSubmit={handleSave} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            // ✅ TAMBAHKAN max-w-4xl mx-auto
            className="mt-8 max-w-4xl mx-auto"
        >
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 p-4 border-b">
                <Info className="text-emerald-dark"/> Profil Organisasi
            </h2>
            <ReactQuill 
                forwardedRef={quillRef} 
                theme="snow" 
                value={profile} 
                onChange={setProfile} 
                modules={modules} 
                placeholder="Tuliskan profil lengkap organisasi di sini..."
            />
          </div>
          <div className="flex justify-end mt-6">
            <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
            </motion.button>
          </div>
        </motion.form>
      )}
    </AdminLayout>
  );
}