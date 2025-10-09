// src/pages/admin/berita/[id].tsx

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AdminLayout from "../_layout";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import "react-quill/dist/quill.snow.css";
import type ReactQuillType from "react-quill";

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
    loading: () => <div className="h-48 animate-pulse rounded-md bg-gray-200" />,
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

  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        if (input.files && quillRef.current) {
          const file = input.files[0];
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
          [{ font: [] }], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }], [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          ["link", "image", "video"], ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    };
  }, []);

  const handleGambarUnggulan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/berita/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, konten, gambarUrl, kategoriId: kategoriId ? Number(kategoriId) : null }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Berita berhasil diperbarui!");
      router.push("/admin/berita");
    } catch (err) {
      toast.error("Gagal memperbarui berita.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingData) {
    return (<AdminLayout><div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-emerald-dark" size={40} /></div></AdminLayout>);
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleUpdate}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/berita" className="flex items-center gap-2 text-gray-500 transition hover:text-gray-800 mb-2">
              <ArrowLeft size={18} /> Kembali ke Daftar Berita
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Edit Berita</h1>
          </div>
          <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b p-4">
                    <input value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full text-2xl font-bold placeholder-gray-400 focus:outline-none" placeholder="Ketik Judul Berita di Sini" required />
                </div>
                <ReactQuill forwardedRef={quillRef} theme="snow" value={konten} onChange={setKonten} modules={modules} placeholder="Tulis konten berita Anda di sini... Anda bisa copy-paste gambar ke editor ini." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Pengaturan</h3>
                <div className="mt-6 space-y-4">
                    <label htmlFor="kategori" className="block font-medium text-sm">Kategori</label>
                    <select id="kategori" value={kategoriId ?? ""} onChange={(e) => setKategoriId(e.target.value ? Number(e.target.value) : null)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-dark focus:ring-emerald-dark">
                        <option value="">Pilih kategori...</option>
                        {kategori.map((k) => (<option key={k.id} value={k.id}>{k.nama}</option>))}
                    </select>
                </div>
            </div>
             <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Gambar Unggulan</h3>
                <label htmlFor="file-upload" className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-emerald-dark hover:bg-emerald-50 ${gambarUrl ? 'border-emerald-dark bg-emerald-50' : 'border-gray-300'}`}>
                  {gambarUrl ? (
                    <img src={gambarUrl} alt="Preview" className="h-28 w-full object-contain" />
                  ) : (
                    <>
                      <ImageIcon size={40} className="text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Pilih gambar</p>
                    </>
                  )}
                  <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleGambarUnggulan} />
                </label>
                 {gambarUrl && <button type="button" onClick={() => setGambarUrl('')} className="mt-2 w-full text-sm text-red-600 hover:underline">Hapus gambar</button>}
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}