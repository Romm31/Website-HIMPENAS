import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import toast, { Toaster } from "react-hot-toast";

export default function AdminVisiMisiPage() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil data awal
  useEffect(() => {
    const fetchData = async () => {
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
        toast.error("Gagal memuat data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Simpan visi
  const simpanVisi = async () => {
    const res = await fetch("/api/admin/visi", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ konten: visi }),
    });
    if (res.ok) toast.success("Visi diperbarui!");
    else toast.error("Gagal menyimpan visi!");
  };

  // Simpan misi
  const simpanMisi = async () => {
    const res = await fetch("/api/admin/misi", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ konten: misi }),
    });
    if (res.ok) toast.success("Misi diperbarui!");
    else toast.error("Gagal menyimpan misi!");
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="space-y-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Kelola Visi & Misi</h1>

        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <>
            {/* === VISI === */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-emerald-himp mb-4">Visi</h2>
              <textarea
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Masukkan visi organisasi..."
              />
              <button
                onClick={simpanVisi}
                className="mt-3 bg-emerald-himp text-white px-5 py-2 rounded-md hover:bg-emerald-light transition"
              >
                Simpan Visi
              </button>
            </div>

            {/* === MISI === */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-xl font-semibold text-emerald-himp mb-4">Misi</h2>
              <textarea
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Masukkan misi organisasi..."
              />
              <button
                onClick={simpanMisi}
                className="mt-3 bg-emerald-himp text-white px-5 py-2 rounded-md hover:bg-emerald-light transition"
              >
                Simpan Misi
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
