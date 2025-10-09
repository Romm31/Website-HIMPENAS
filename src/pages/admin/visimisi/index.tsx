// src/pages/admin/visimisi/index.tsx

import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Toaster, toast } from "sonner";
import { Save, Loader2, Goal, Flag } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminVisiMisiPage() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingVisi, setIsSavingVisi] = useState(false);
  const [isSavingMisi, setIsSavingMisi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [visiRes, misiRes] = await Promise.all([
          fetch("/api/admin/visi"),
          fetch("/api/admin/misi"),
        ]);
        const visiData = await visiRes.json();
        const misiData = await misiRes.json();
        setVisi(visiData.konten || "");
        setMisi(misiData.konten || "");
      } catch {
        toast.error("Gagal memuat data Visi & Misi!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (type: 'visi' | 'misi') => {
    if (type === 'visi') setIsSavingVisi(true);
    if (type === 'misi') setIsSavingMisi(true);

    const endpoint = `/api/admin/${type}`;
    const payload = type === 'visi' ? { konten: visi } : { konten: misi };
    const typeName = type.charAt(0).toUpperCase() + type.slice(1);

    try {
        const res = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Gagal menyimpan ${typeName}`);
        toast.success(`${typeName} berhasil diperbarui!`);
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        if (type === 'visi') setIsSavingVisi(false);
        if (type === 'misi') setIsSavingMisi(false);
    }
  };

  const CardSkeleton = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-7 w-24 rounded-md bg-gray-200 mb-6"></div>
        <div className="h-32 w-full rounded-md bg-gray-200"></div>
        <div className="h-10 w-32 rounded-md bg-gray-300 mt-4"></div>
    </div>
  );

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Visi & Misi</h1>
        <p className="mt-1 text-gray-500">Atur pernyataan visi dan misi utama organisasi.</p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* === KARTU VISI === */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                <Flag className="text-emerald-dark" /> Visi
              </h2>
              <textarea
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                rows={8}
                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-emerald-dark focus:ring-emerald-dark transition"
                placeholder="Tuliskan visi organisasi di sini..."
              />
              <div className="flex justify-end">
                <motion.button
                  onClick={() => handleSave('visi')}
                  disabled={isSavingVisi}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingVisi ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={18} /> Simpan Visi</>}
                </motion.button>
              </div>
            </div>

            {/* === KARTU MISI === */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                <Goal className="text-emerald-dark" /> Misi
              </h2>
              <textarea
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                rows={8}
                className="w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-emerald-dark focus:ring-emerald-dark transition"
                placeholder="Tuliskan poin-poin misi organisasi di sini..."
              />
              <div className="flex justify-end">
                <motion.button
                  onClick={() => handleSave('misi')}
                  disabled={isSavingMisi}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-dark px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingMisi ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={18} /> Simpan Misi</>}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}