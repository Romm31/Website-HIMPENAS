// src/pages/admin/slide/tambah.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../_layout";
import { ArrowLeft, UploadCloud, Loader2, Image as ImageIcon, X, Eye, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";

const TambahSlidePage = () => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const router = useRouter();

  const handleFile = (selectedFile: File | null | undefined) => {
    if (selectedFile) {
      // Validasi file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP");
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB");
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      toast.success("Gambar berhasil dipilih");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFile(selectedFile);
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

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    toast.info("Gambar dihapus");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Judul slide tidak boleh kosong");
      return;
    }

    if (!file) {
      toast.error("Gambar slide wajib diunggah");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload image
      const formData = new FormData();
      formData.append("file", file);
      
      toast.loading("Mengunggah gambar...");
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      
      if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar");
      
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;
      toast.dismiss();

      // Create slide
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
      
      setTimeout(() => {
        router.push("/admin/slide");
      }, 1000);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-4xl font-bold text-gray-900">Tambah Slide Baru</h1>
            <p className="mt-2 text-gray-600">Buat slide baru untuk ditampilkan di halaman depan</p>
          </div>
          
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2">
            <Plus size={18} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Slide Baru</span>
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
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• Gunakan gambar dengan rasio 16:9 untuk hasil terbaik</li>
                  <li>• Format yang didukung: JPG, PNG, WebP</li>
                  <li>• Ukuran maksimal: 5MB</li>
                  <li>• Resolusi minimum: 1920x1080px</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Required Fields Notice */}
          {!file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
            >
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900">Gambar Diperlukan</h4>
                  <p className="mt-1 text-sm text-orange-700">
                    Upload gambar slide sebelum menyimpan
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
              disabled={isSubmitting || !file}
              whileHover={{ scale: isSubmitting || !file ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || !file ? 1 : 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Simpan Slide</span>
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
                Upload Gambar
              </h3>
              <p className="mt-1 text-sm text-gray-500">Gambar slide wajib diupload</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Drag & Drop Area */}
              {!preview ? (
                <label
                  htmlFor="file-upload"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50 scale-105'
                      : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50"
                  >
                    <UploadCloud size={40} className="text-emerald-600" />
                  </motion.div>
                  <p className="mt-6 font-semibold text-gray-700">
                    {isDragging ? 'Lepaskan file di sini' : 'Drag & drop atau klik untuk upload'}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG, PNG, WebP (Max 5MB)
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Minimal 1920x1080px
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
              ) : (
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
                      <motion.button
                        type="button"
                        onClick={removeImage}
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
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        <CheckCircle2 size={14} />
                        Siap Upload
                      </span>
                    </div>
                  </div>

                  {file && (
                    <div className="rounded-lg bg-gray-50 p-3 space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">File:</span> {file.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Ukuran:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Tipe:</span> {file.type}
                      </p>
                    </div>
                  )}

                  {/* Change Image Button */}
                  <label
                    htmlFor="file-upload-change"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-sm font-medium text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <UploadCloud size={16} />
                    <span>Ganti Gambar</span>
                    <input
                      id="file-upload-change"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
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
                  <h4 className="font-semibold text-green-900">Gambar Siap</h4>
                  <p className="mt-1 text-sm text-green-700">
                    Gambar akan diupload saat Anda menyimpan slide
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

export default TambahSlidePage;