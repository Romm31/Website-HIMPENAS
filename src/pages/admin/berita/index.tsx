import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";

interface Kategori {
  id: number;
  nama: string;
}
interface Berita {
  id: number;
  judul: string;
  konten: string;
  createdAt: string;
  kategori?: Kategori | null;
}

export default function ListBerita() {
  const [berita, setBerita] = useState<Berita[]>([]);

  const fetchBerita = async () => {
    const res = await fetch("/api/admin/berita");
    const data = await res.json();
    setBerita(data);
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    await fetch(`/api/admin/berita/${id}`, { method: "DELETE" });
    fetchBerita();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-himp">Manajemen Berita</h1>
        <Link
          href="/admin/berita/tambah"
          className="bg-emerald-himp text-white px-4 py-2 rounded-lg hover:bg-emerald-light transition"
        >
          + Tambah Berita
        </Link>
      </div>

      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr className="bg-emerald-himp text-white">
            <th className="px-4 py-2 text-left">Judul</th>
            <th className="px-4 py-2 text-left">Kategori</th>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {berita.map((b) => (
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{b.judul}</td>
              <td className="px-4 py-2">{b.kategori?.nama || "-"}</td>
              <td className="px-4 py-2 text-gray-600 text-sm">
                {new Date(b.createdAt).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <Link
                  href={`/admin/berita/${b.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
