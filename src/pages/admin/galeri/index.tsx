import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Link from "next/link";

export default function GaleriAdmin() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);

  const fetchAlbums = async () => {
    const res = await fetch("/api/admin/galeri");
    const data = await res.json();
    setAlbums(data);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const createAlbum = async () => {
    if (!title || !cover) return alert("Judul dan cover wajib diisi!");
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("cover", cover);

    await fetch("/api/admin/galeri", { method: "POST", body: form });
    setShowModal(false);
    setTitle("");
    setDescription("");
    setCover(null);
    fetchAlbums();
  };

  const deleteAlbum = async (id: number) => {
    if (!confirm("Yakin mau hapus album ini?")) return;
    await fetch(`/api/admin/galeri/${id}`, { method: "DELETE" });
    fetchAlbums();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-700">Kelola Galeri</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus /> Tambah Album
          </button>
        </div>

        {albums.length === 0 ? (
          <p className="text-gray-600">Belum ada album.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {albums.map((a) => (
              <div
                key={a.id}
                className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <Link href={`/admin/galeri/${a.id}`}>
                  <img
                    src={a.coverImageUrl}
                    alt={a.title}
                    className="object-cover w-full h-48 bg-gray-100"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{a.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{a.mediaItems.length} media</p>
                </div>
                <button
                  onClick={() => deleteAlbum(a.id)}
                  className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600"
                >
                  <FiTrash2 className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-emerald-700">Tambah Album</h2>

              <input
                type="text"
                placeholder="Judul Album"
                className="border p-2 w-full mb-3 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Deskripsi (opsional)"
                className="border p-2 w-full mb-3 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="border p-2 w-full mb-4 rounded"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
              />

              <button
                onClick={createAlbum}
                className="bg-emerald-600 text-white px-4 py-2 rounded w-full hover:bg-emerald-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
