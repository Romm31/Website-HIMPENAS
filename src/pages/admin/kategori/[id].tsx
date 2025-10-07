import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../_layout';
import toast, { Toaster } from 'react-hot-toast';

type Kategori = { id: number; nama: string };

export default function EditKategori() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [item, setItem] = useState<Kategori | null>(null);
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const load = async () => {
      try {
        setLoading(true);
        const r = await fetch(`/api/admin/kategori/${id}`);
        const data = await r.json();
        setItem(data);
        setNama(data?.nama || '');
      } catch {
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router.isReady, id]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const p = toast.loading('Menyimpan...');
    try {
      setSaving(true);
      const r = await fetch(`/api/admin/kategori/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || 'Gagal menyimpan');
      toast.success('Kategori diperbarui', { id: p });
      router.push('/admin/kategori');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan', { id: p });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Toaster />
      <h1 className="text-2xl font-semibold mb-6">Edit Kategori</h1>

      {loading ? (
        <div className="text-gray-500">Memuat…</div>
      ) : !item ? (
        <div className="text-red-600">Kategori tidak ditemukan.</div>
      ) : (
        <form onSubmit={onSubmit} className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Kategori</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div className="pt-2">
            <button
              disabled={saving}
              className="px-4 py-2 bg-emerald-himp text-white rounded-md hover:bg-emerald-light disabled:opacity-60"
            >
              {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
