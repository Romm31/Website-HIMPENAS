// src/pages/admin/kategori/tambah.tsx

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../_layout';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TambahKategori() {
  const [nama, setNama] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Gagal menyimpan');
      }
      toast.success('Kategori baru berhasil dibuat!');
      router.push('/admin/kategori');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div>
        <Link href="/admin/kategori" className="flex items-center gap-2 text-gray-500 transition hover:text-gray-800 mb-6">
          <ArrowLeft size={18} /> Kembali ke Daftar Kategori
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Tambah Kategori Baru</h1>
        <p className="mt-1 text-gray-500">Buat kategori baru untuk mengelompokkan berita.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Detail Kategori</h3>
            <div className="mt-6">
                <div className="relative">
                    <input id="nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Nama Kategori" />
                    <label htmlFor="nama" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Nama Kategori</label>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={18} /> Simpan</>}
            </motion.button>
        </div>
      </form>
    </AdminLayout>
  );
}