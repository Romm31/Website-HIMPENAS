import { useState, useEffect, type FC } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import AdminLayout from "../_layout";

// ✅ Fix dynamic import ReactQuill (TypeScript safe)
const ReactQuill = dynamic(() => import("react-quill").then((mod) => mod.default), {
  ssr: false,
}) as unknown as FC<any>;
import "react-quill/dist/quill.snow.css";

interface Kategori {
  id: number;
  nama: string;
}

export default function TambahBerita() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [gambarUrl, setGambarUrl] = useState("");
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/kategori")
      .then((r) => r.json())
      .then(setKategori)
      .catch((e) => console.error("Gagal ambil kategori:", e));
  }, []);

  // Toolbar ReactQuill
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data?.url) {
      setGambarUrl(data.url);
      toast.success("📸 Gambar berhasil diupload!");
    } else {
      toast.error("❌ Upload gagal");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, konten, kategoriId, gambarUrl }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("✅ Berita berhasil ditambahkan!");
      router.push("/admin/berita");
    } catch (err) {
      console.error(err);
      toast.error("❌ Gagal menambahkan berita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-emerald-himp mb-6">Tambah Berita</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul */}
        <div>
          <label className="block font-medium mb-1">Judul Berita</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block font-medium mb-1">Kategori</label>
          <select
            value={kategoriId ?? ""}
            onChange={(e) => setKategoriId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Pilih kategori...</option>
            {kategori.map((k) => (
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
            <img src={gambarUrl} alt="Preview" className="mt-3 rounded-lg border w-48" />
          )}
        </div>

        {/* Konten */}
        <div>
          <label className="block font-medium mb-2">Konten Berita</label>
          <div className="react-quill-wrapper">
            <ReactQuill
              theme="snow"
              value={konten}
              onChange={setKonten}
              modules={quillModules}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-himp text-white px-5 py-2 rounded-lg hover:bg-emerald-light transition"
        >
          {loading ? "Menyimpan..." : "Simpan Berita"}
        </button>
      </form>
    </AdminLayout>
  );
}
