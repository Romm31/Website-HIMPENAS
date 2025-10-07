import { useEffect, useState, type FC } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import AdminLayout from "../_layout";

// ✅ Dynamic import ReactQuill (fix SSR issues)
const ReactQuill = dynamic(() => import("react-quill").then(m => m.default), {
  ssr: false,
}) as unknown as FC<any>;
import "react-quill/dist/quill.snow.css";

interface Kategori {
  id: number;
  nama: string;
}

export default function EditBerita() {
  const router = useRouter();
  const { id } = router.query;

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Ambil berita berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchBerita = async () => {
      try {
        const res = await fetch(`/api/admin/berita/${id}`);

        // Pastikan status OK
        if (!res.ok) {
          toast.error("Gagal memuat berita");
          setLoading(false);
          return;
        }

        // Pastikan respons JSON
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.warn("⚠️ Response bukan JSON:", text.slice(0, 300));
          toast.error("Response bukan JSON dari server");
          setLoading(false);
          return;
        }

        // ✅ Langsung parse JSON
        const data = await res.json();

        setJudul(data?.judul ?? "");
        setKonten(data?.konten ?? "");
        setGambarUrl(data?.gambarUrl ?? "");
        setKategoriId(data?.kategoriId ?? null);
      } catch (err) {
        console.error("Fetch gagal:", err);
        toast.error("Terjadi kesalahan saat memuat berita");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [id]);

  // ✅ Ambil semua kategori
  useEffect(() => {
    fetch("/api/admin/kategori")
      .then(r => r.json())
      .then(setKategori)
      .catch(() => toast.error("Gagal memuat kategori"));
  }, []);

  // ✅ Konfigurasi toolbar ReactQuill
  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  // ✅ Upload gambar handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : null;

      if (res.ok && data?.url) {
        setGambarUrl(data.url);
        toast.success("Gambar berhasil diupload!");
      } else {
        toast.error("Upload gagal atau server tidak mengembalikan URL");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat upload");
    }
  };

  // ✅ Update berita
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/berita/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          konten,
          gambarUrl,
          kategoriId,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success("Berita berhasil diperbarui!");
      router.push("/admin/berita");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui berita");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-500 text-lg font-medium">
          Memuat data berita...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-emerald-himp mb-6">Edit Berita</h1>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Judul */}
        <div>
          <label className="block font-medium mb-1">Judul Berita</label>
          <input
            type="text"
            value={judul}
            onChange={e => setJudul(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-himp"
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block font-medium mb-1">Kategori</label>
          <select
            value={kategoriId ?? ""}
            onChange={e => setKategoriId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Pilih kategori...</option>
            {kategori.map(k => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Gambar */}
        <div>
          <label className="block font-medium mb-1">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:bg-emerald-himp file:text-white hover:file:bg-emerald-light"
          />
          {gambarUrl && (
            <img
              src={gambarUrl}
              alt="Preview"
              className="mt-3 rounded-lg border w-48 shadow-sm"
            />
          )}
        </div>

        {/* Konten */}
        <div>
          <label className="block font-medium mb-2">Konten Berita</label>
          <div className="react-quill-wrapper border rounded-lg bg-white">
            <ReactQuill
              theme="snow"
              value={konten}
              onChange={setKonten}
              modules={quillModules}
            />
          </div>
        </div>

        {/* Tombol Simpan */}
        <button
          type="submit"
          disabled={saving}
          className={`${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-himp hover:bg-emerald-light"
          } text-white px-5 py-2 rounded-lg transition`}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </AdminLayout>
  );
}
