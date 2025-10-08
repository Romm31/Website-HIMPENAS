import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../_layout";

interface Slide {
  id: number;
  title: string;
  imageUrl: string;
  order: number;
}

const SlidePage = () => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    fetch("/api/admin/slide")
      .then((res) => res.json())
      .then(setSlides);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus slide ini?")) return;
    await fetch(`/api/admin/slide/${id}`, { method: "DELETE" });
    setSlides(slides.filter((s) => s.id !== id));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-dark">Slide Show</h1>
        <Link
          href="/admin/slide/tambah"
          className="bg-emerald-dark text-white px-4 py-2 rounded hover:bg-emerald-light transition"
        >
          + Tambah Slide
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-emerald-dark text-white">
              <th className="p-2 text-left">Order</th>
              <th className="p-2 text-left">Judul</th>
              <th className="p-2 text-left">Gambar</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{s.order}</td>
                <td className="p-2 font-medium">{s.title}</td>
                <td className="p-2">
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="w-24 h-16 object-cover rounded-md shadow"
                  />
                </td>
                <td className="p-2 space-x-2">
                  <Link
                    href={`/admin/slide/${s.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default SlidePage;
