import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../_layout";

interface EventType {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
}

export default function EventList() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetch("/api/admin/event")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => toast.error("Gagal memuat data event"));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;
    const res = await fetch(`/api/admin/event/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents(events.filter((e) => e.id !== id));
      toast.success("Event berhasil dihapus");
    } else toast.error("Gagal menghapus event");
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Event</h1>
        <Link
          href="/admin/event/tambah"
          className="bg-emerald-himp text-white px-4 py-2 rounded-lg hover:bg-emerald-light transition"
        >
          + Tambah Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">ID</th>
              <th className="p-3">Judul</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Lokasi</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{e.id}</td>
                <td className="p-3">{e.judul}</td>
                <td className="p-3">
                  {new Date(e.tanggal).toLocaleDateString("id-ID")}
                </td>
                <td className="p-3">{e.lokasi}</td>
                <td className="p-3 text-right space-x-2">
                  <Link
                    href={`/admin/event/${e.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  Belum ada event
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
