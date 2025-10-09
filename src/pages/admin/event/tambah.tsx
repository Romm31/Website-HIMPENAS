// src/pages/admin/event/tambah.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import AdminLayout from "../_layout";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TambahEvent() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch("/api/admin/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul, deskripsi, tanggal, lokasi }),
        });
        if (!res.ok) throw new Error("Gagal menambahkan event");
        toast.success("Event berhasil ditambahkan!");
        router.push("/admin/event");
    } catch (error) {
        toast.error("Gagal menambahkan event");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div>
        <Link href="/admin/event" className="flex items-center gap-2 text-gray-500 transition hover:text-gray-800 mb-6">
          <ArrowLeft size={18} /> Kembali ke Daftar Event
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Buat Event Baru</h1>
        <p className="mt-1 text-gray-500">Isi detail di bawah ini untuk membuat jadwal acara baru.</p>
      </div>

      {/* ✅ TAMBAHKAN mx-auto UNTUK MEMBUAT FORM KE TENGAH */}
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div className="relative">
                <input id="judul" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Judul Event" />
                <label htmlFor="judul" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Judul Event</label>
            </div>
             <div className="relative">
                <textarea id="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required rows={4} className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Deskripsi Event" />
                <label htmlFor="deskripsi" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Deskripsi</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                    <input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Tanggal" />
                    <label htmlFor="tanggal" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Tanggal</label>
                </div>
                <div className="relative">
                    <input id="lokasi" type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0" placeholder="Lokasi" />
                    <label htmlFor="lokasi" className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-white px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark">Lokasi</label>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={18} /> Simpan Event</>}
            </motion.button>
        </div>
      </form>
    </AdminLayout>
  );
}