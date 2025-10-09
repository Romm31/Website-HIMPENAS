// src/pages/admin/slide/[id].tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../_layout";
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";

const EditSlidePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      fetch(`/api/admin/slide/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setImageUrl(data.imageUrl);
          setOrder(data.order);
          setPreview(data.imageUrl);
        }).finally(() => setIsLoadingData(false));
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let uploadedUrl = imageUrl;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar baru");
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData.url;
      }

      const res = await fetch(`/api/admin/slide/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl: uploadedUrl, order }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui slide");
      
      toast.success("Slide berhasil diperbarui!");
      router.push("/admin/slide");

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-emerald-dark" size={40} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div>
        {/* === BAGIAN YANG DIPERBAIKI === */}
        <Link href="/admin/slide" className="flex items-center gap-2 text-gray-500 transition hover:text-gray-800 mb-6">
          <ArrowLeft size={18} /> Kembali ke Daftar Slide
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Slide</h1>
        <p className="mt-1 text-gray-500">Perbarui detail slide yang sudah ada.</p>
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
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : "Simpan Perubahan"}
                </motion.button>
            </div>
        </div>

        <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Ganti Gambar (Opsional)</h3>
                <label htmlFor="file-upload" className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-emerald-dark hover:bg-emerald-50">
                  <UploadCloud size={40} className="text-gray-400" />
                  <p className="mt-4 text-gray-500">Pilih file baru untuk mengganti</p>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
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

export default EditSlidePage;