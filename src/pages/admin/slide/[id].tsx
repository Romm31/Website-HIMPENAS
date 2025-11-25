// src/pages/admin/slide/[id].tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../_layout";
import { ArrowLeft, UploadCloud, Loader2, Image as ImageIcon, Eye, Save, AlertCircle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
        })
        .catch(() => toast.error("Gagal memuat data slide"))
        .finally(() => setIsLoadingData(false));
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    handleFile(selected);
  };

  const handleFile = (selected: File | null | undefined) => {
    if (selected) {
      // Validasi file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(selected.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP");
        return;
      }

      if (selected.size > maxSize) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB");
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      toast.success("Gambar berhasil dipilih");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Judul slide tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let uploadedUrl = imageUrl;
      
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        toast.loading("Mengunggah gambar...");
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        
        if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar baru");
        
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData.url;
        toast.dismiss();
      }

      const res = await fetch(`/api/admin/slide/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl: uploadedUrl, order }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui slide");
      
      toast.success("Slide berhasil diperbarui!");
      
      setTimeout(() => {
        router.push("/admin/slide");
      }, 1000);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(imageUrl); // Kembali ke gambar original
    toast.info("Perubahan gambar dibatalkan");
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
          <p className="text-gray-500 font-medium">Memuat data slide...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          href="/admin/slide" 
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Kembali ke Daftar Slide</span>
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Slide</h1>
            <p className="mt-2 text-gray-600">Perbarui informasi dan gambar slide</p>
          </div>
          
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-emerald-700">Slide ID: {id}</span>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column - Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Detail Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <ImageIcon size={20} className="text-emerald-600" />
                Detail Slide
              </h3>
              <p className="mt-1 text-sm text-gray-500">Informasi dasar tentang slide</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Title Input */}
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Judul"
                />
                <label
                  htmlFor="title"
                  className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                >
                  Judul Slide
                </label>
                <p className="mt-2 text-xs text-gray-500">Berikan judul yang deskriptif dan menarik</p>
              </div>

              {/* Order Input */}
              <div className="relative">
                <input
                  id="order"
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  required
                  className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Urutan"
                />
                <label
                  htmlFor="order"
                  className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                >
                  Urutan Tampil
                </label>
                <p className="mt-2 text-xs text-gray-500">Angka lebih kecil akan ditampilkan lebih dulu</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Tips</h4>
                <p className="mt-1 text-sm text-blue-700">
                  Gunakan gambar dengan rasio 16:9 untuk hasil terbaik. Format yang didukung: JPG, PNG, WebP (maksimal 5MB).
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Link
              href="/admin/slide"
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </Link>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
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
        </motion.div>

        {/* Right Column - Image Upload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Upload Card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <UploadCloud size={20} className="text-emerald-600" />
                Ganti Gambar
              </h3>
              <p className="mt-1 text-sm text-gray-500">Upload gambar baru (opsional)</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Drag & Drop Area */}
              <label
                htmlFor="file-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50"
                >
                  <UploadCloud size={32} className="text-emerald-600" />
                </motion.div>
                <p className="mt-4 font-semibold text-gray-700">
                  {isDragging ? 'Lepaskan file di sini' : 'Klik atau drag & drop'}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG, WebP (Max 5MB)
                </p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {/* Preview Section */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
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
                      {file && (
                        <motion.button
                          type="button"
                          onClick={removeImage}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                        >
                          <X size={14} />
                          Reset
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden rounded-xl shadow-md">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    {file && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          <CheckCircle2 size={14} />
                          Gambar Baru
                        </span>
                      </div>
                    )}
                  </div>

                  {file && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">File:</span> {file.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold">Ukuran:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Success Indicator */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-green-100 bg-green-50 p-4"
            >
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Siap Diupload</h4>
                  <p className="mt-1 text-sm text-green-700">
                    Gambar baru akan menggantikan gambar lama saat Anda menyimpan perubahan.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </form>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && preview && (
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
                src={preview}
                alt="Preview Fullscreen"
                className="w-full rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default EditSlidePage;