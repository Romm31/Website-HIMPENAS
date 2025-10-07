import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../_layout';
import toast, { Toaster } from 'react-hot-toast';

export default function TambahKategori() {
  const [nama, setNama] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const p = toast.loading('Menyimpan...');
    try {
      setSaving(true);
      const r = await fetch('/api/admin/kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || 'Gagal menyimpan');
      toast.success('Kategori berhasil dibuat', { id: p });
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
      <h1 className="text-2xl font-semibold mb-6">Tambah Kategori</h1>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Kategori</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="cth: Pengumuman"
            required
          />
        </div>

        <div className="pt-2">
          <button
            disabled={saving}
            className="px-4 py-2 bg-emerald-himp text-white rounded-md hover:bg-emerald-light disabled:opacity-60"
          >
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
