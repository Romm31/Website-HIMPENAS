import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../_layout";

const TambahSlidePage = () => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async (): Promise<string> => {
    if (!file) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await handleUpload();

      const res = await fetch("/api/admin/slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl, order }),
      });

      if (res.ok) {
        alert("Slide berhasil ditambahkan!");
        router.push("/admin/slide");
      } else {
        const err = await res.json();
        alert(`Gagal menambahkan slide: ${err.message}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-emerald-dark mb-6">Tambah Slide</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4 max-w-2xl"
      >
        <div>
          <label className="block font-medium mb-2">Judul</label>
          <input
            type="text"
            className="w-full border rounded-md p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-md p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 rounded-md shadow max-w-md"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Urutan</label>
          <input
            type="number"
            className="w-full border rounded-md p-2"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-dark text-white px-4 py-2 rounded hover:bg-emerald-light transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Slide"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default TambahSlidePage;
