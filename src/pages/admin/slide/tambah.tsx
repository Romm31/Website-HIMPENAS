// src/pages/admin/slide/tambah.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../_layout";
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";

const TambahSlidePage = () => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, action: 'enter' | 'leave' | 'drop') => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'enter') setIsDragging(true);
    if (action === 'leave') setIsDragging(false);
    if (action === 'drop') {
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith('image/')) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
      } else {
        toast.error("Hanya file gambar yang diizinkan.");
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
        return toast.error("Gambar slide wajib diunggah.");
    }
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar");
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      const slideRes = await fetch("/api/admin/slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl, order }),
      });

      if (!slideRes.ok) {
        const err = await slideRes.json();
        throw new Error(err.message || "Gagal menyimpan slide");
      }
      
      toast.success("Slide berhasil ditambahkan!");
      router.push("/admin/slide");

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div>
        {/* === BAGIAN YANG DIPERBAIKI === */}
        <Link href="/admin/slide" className="flex items-center gap-2 text-gray-500 transition hover:text-gray-800 mb-6">
          <ArrowLeft size={18} /> Kembali ke Daftar Slide
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Tambah Slide Baru</h1>
        <p className="mt-1 text-gray-500">Buat slide baru untuk ditampilkan di halaman depan.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Detail Slide</h3>
                <div className="mt-6 space-y-5">
                    <div className="relative">
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Judul" />
                        <label htmlFor="title" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Judul Slide</label>
                    </div>
                     <div className="relative">
                        <input id="order" type="number" min="1" value={order} onChange={(e) => setOrder(Number(e.target.value))} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Urutan" />
                        <label htmlFor="order" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Urutan Tampil</label>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-6 py-3 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : "Simpan Slide"}
                </motion.button>
            </div>
        </div>

        <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Gambar Slide</h3>
                <div onDragEnter={(e) => handleDragEvents(e, 'enter')} onDragLeave={(e) => handleDragEvents(e, 'leave')} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEvents(e, 'drop')} className={`mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging ? 'border-emerald-dark bg-emerald-50' : 'border-gray-300'}`}>
                  <UploadCloud size={40} className={`transition-colors ${isDragging ? 'text-emerald-dark' : 'text-gray-400'}`} />
                  <p className="mt-4 text-gray-500">Seret & lepas gambar di sini, atau</p>
                  <label htmlFor="file-upload" className="mt-2 cursor-pointer font-semibold text-emerald-dark transition hover:text-emerald-600">
                    Pilih file
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                {preview && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
                        <img src={preview} alt="Preview" className="w-full rounded-lg shadow-md" />
                    </div>
                )}
            </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default TambahSlidePage;