import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../_layout';
import toast, { Toaster } from 'react-hot-toast';

type Kategori = {
  id: number;
  nama: string;
  _count?: { berita: number };
};

export default function KategoriList() {
  const [items, setItems] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch('/api/admin/kategori');
      const data = await r.json();
      setItems(data);
    } catch {
      toast.error('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm('Hapus kategori ini?')) return;
    const p = toast.loading('Menghapus...');
    try {
      const r = await fetch(`/api/admin/kategori/${id}`, { method: 'DELETE' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || 'Gagal menghapus');
      toast.success('Kategori dihapus', { id: p });
      load();
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus', { id: p });
    }
  };

  return (
    <AdminLayout>
      <Toaster />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Kategori</h1>
        <Link
          href="/admin/kategori/tambah"
          className="px-4 py-2 bg-emerald-himp text-white rounded-md hover:bg-emerald-light"
        >
          + Tambah Kategori
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500">Memuat...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Dipakai</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Belum ada kategori
                  </td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-4 py-3">{it.id}</td>
                  <td className="px-4 py-3">{it.nama}</td>
                  <td className="px-4 py-3">{it._count?.berita ?? 0}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/kategori/${it.id}`}
                      className="px-3 py-1.5 rounded-md border hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(it.id)}
                      className="px-3 py-1.5 rounded-md border text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
