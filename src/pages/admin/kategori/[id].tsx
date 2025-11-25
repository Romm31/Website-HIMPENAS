// src/pages/admin/kategori/[id].tsx

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../_layout';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Shapes, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Kategori = { id: number; nama: string };

const FormContent = ({ 
  handleSubmit, 
  nama, 
  setNama, 
  isSubmitting 
}: {
  handleSubmit: (e: FormEvent) => void;
  nama: string;
  setNama: (nama: string) => void;
  isSubmitting: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isValid = nama.trim().length >= 3;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        handleSubmit(e);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }}
      className="mt-8 max-w-2xl"
    >
      {/* Main Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all"
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
            >
              <Shapes className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">Detail Kategori</h3>
              <p className="text-sm text-emerald-50">Perbarui informasi kategori berita</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Input Field with Enhanced Design */}
          <div className="relative">
            <label
              htmlFor="nama"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Nama Kategori
            </label>
            
            <div className="relative">
              <motion.input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                animate={{
                  scale: isFocused ? 1.01 : 1,
                }}
                className={`block w-full rounded-xl border-2 px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:outline-none ${
                  isFocused
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-lg shadow-emerald-100'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } ${
                  nama && !isValid
                    ? 'border-red-300 bg-red-50/30'
                    : ''
                }`}
                placeholder="Masukkan nama kategori..."
              />
              
              {/* Status Icon */}
              <AnimatePresence>
                {nama && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {isValid ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Character Counter & Validation */}
            <div className="mt-2 flex items-center justify-between">
              <AnimatePresence mode="wait">
                {nama && !isValid && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-1.5 text-sm text-red-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Minimal 3 karakter
                  </motion.p>
                )}
                {nama && isValid && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-1.5 text-sm text-emerald-600"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Nama kategori valid
                  </motion.p>
                )}
              </AnimatePresence>
              
              <span className={`text-sm font-medium ${
                nama.length > 50 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {nama.length}/50
              </span>
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 p-4"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500"
                >
                  <AlertCircle className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Tips Penamaan</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Gunakan nama yang singkat dan jelas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Hindari karakter spesial yang tidak perlu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Pastikan mudah dipahami oleh pembaca</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Terakhir diubah: <span className="font-medium text-gray-900">Hari ini</span>
            </p>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/admin/kategori" className="flex-1 sm:flex-none">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto rounded-xl border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
                >
                  Batal
                </motion.button>
              </Link>
              
              <motion.button
                type="submit"
                disabled={isSubmitting || !isValid}
                whileHover={{ scale: isSubmitting || !isValid ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || !isValid ? 1 : 0.98 }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-white shadow-lg transition-all ${
                  isSubmitting || !isValid
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={20} />
                    </motion.div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Simpan Perubahan
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Indicator */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Berhasil!</p>
                  <p className="text-sm text-emerald-50">Kategori berhasil diperbarui</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default function EditKategori() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [nama, setNama] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/kategori/${id}`);
        if (!res.ok) throw new Error("Kategori tidak ditemukan");
        const data = await res.json();
        setNama(data?.nama || '');
      } catch {
        toast.error('Gagal memuat data kategori.');
        router.push('/admin/kategori');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router.isReady, id, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/kategori/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Gagal menyimpan');
      }
      toast.success('Kategori berhasil diperbarui!');
      setTimeout(() => {
        router.push('/admin/kategori');
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/admin/kategori">
          <motion.div
            whileHover={{ x: -5 }}
            className="inline-flex items-center gap-2 text-gray-600 transition hover:text-emerald-600 mb-6 group"
          >
            <motion.div
              whileHover={{ x: -3 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-emerald-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </motion.div>
            <span className="font-medium">Kembali ke Daftar Kategori</span>
          </motion.div>
        </Link>
        
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg"
          >
            <Shapes className="h-7 w-7 text-white" />
          </motion.div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Kategori</h1>
            <p className="mt-1 text-gray-500">Perbarui nama kategori yang sudah ada.</p>
          </div>
        </div>
      </motion.div>
      
      {/* Loading State */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 max-w-2xl"
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/30 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-white/40 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-white/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Body Skeleton */}
            <div className="p-6 space-y-6">
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-14 w-full bg-gray-100 rounded-xl animate-pulse" />
                <div className="flex justify-between mt-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Skeleton */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-10 w-20 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <FormContent 
          handleSubmit={handleSubmit}
          nama={nama}
          setNama={setNama}
          isSubmitting={isSubmitting}
        />
      )}
    </AdminLayout>
  );
}