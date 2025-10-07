import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../_layout";

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    lokasi: "",
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/event/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            judul: data.judul,
            deskripsi: data.deskripsi,
            tanggal: data.tanggal.split("T")[0],
            lokasi: data.lokasi,
          });
        })
        .catch(() => toast.error("Gagal memuat data event"));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/event/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Event berhasil diperbarui!");
      setTimeout(() => router.push("/admin/event"), 1200);
    } else toast.error("Gagal memperbarui event");
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow border border-gray-200">
        <div>
          <label className="block mb-1 font-semibold">Judul Event</label>
          <input
            type="text"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Deskripsi</label>
          <textarea
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full border rounded-md px-3 py-2 h-28"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Tanggal</label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Lokasi</label>
            <input
              type="text"
              value={form.lokasi}
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-himp text-white px-5 py-2 rounded-md hover:bg-emerald-light transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </AdminLayout>
  );
}
