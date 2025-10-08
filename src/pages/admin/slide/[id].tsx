import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../_layout";

const EditSlidePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/slide/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setImageUrl(data.imageUrl);
          setOrder(data.order);
          setPreview(data.imageUrl);
        });
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (): Promise<string> => {
    if (!file) return imageUrl;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.filePath || data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const uploadedUrl = file ? await handleUpload() : imageUrl;

    const res = await fetch(`/api/admin/slide/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, imageUrl: uploadedUrl, order }),
    });

    setLoading(false);
    if (res.ok) {
      alert("Slide berhasil diperbarui!");
      router.push("/admin/slide");
    } else {
      alert("Gagal memperbarui slide!");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-emerald-dark mb-6">Edit Slide</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
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
          <label className="block font-medium mb-2">Ganti Gambar</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-md p-2"
            onChange={handleFileChange}
          />
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img src={preview} alt="Preview" className="w-full max-w-md rounded-md shadow" />
            </div>
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
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditSlidePage;
