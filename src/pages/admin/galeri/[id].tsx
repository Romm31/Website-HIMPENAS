import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { useRouter } from "next/router";
import { FiUpload, FiTrash2, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function AlbumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [album, setAlbum] = useState<any>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAlbum = async () => {
    if (!id) return;
    const res = await fetch(`/api/admin/galeri/${id}`);
    const data = await res.json();
    setAlbum(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const uploadMedia = async () => {
    if (!files) return alert("Pilih file dulu!");
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("media", f));
    await fetch(`/api/admin/galeri/media/${id}`, { method: "POST", body: form });
    setFiles(null);
    fetchAlbum();
  };

  const deleteMedia = async (mid: number) => {
    if (!confirm("Yakin mau hapus media ini?")) return;
    await fetch(`/api/admin/galeri/media/${id}?mid=${mid}`, { method: "DELETE" });
    fetchAlbum();
  };

  if (loading) return <AdminLayout><p className="p-6">Memuat...</p></AdminLayout>;
  if (!album) return <AdminLayout><p className="p-6">Album tidak ditemukan.</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/galeri" className="text-emerald-600 hover:underline flex items-center gap-1">
            <FiArrowLeft /> Kembali
          </Link>
          <h1 className="text-3xl font-bold text-emerald-700">{album.title}</h1>
        </div>

        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setFiles(e.target.files)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={uploadMedia}
            className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiUpload /> Upload Media
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {album.mediaItems.map((m: any) => (
            <div key={m.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
              {m.type === "VIDEO" ? (
                <video
                  className="w-full h-40 object-cover rounded-lg bg-black"
                  controls
                  preload="metadata"
                >
                  <source src={m.url} type="video/mp4" />
                  Browser kamu tidak mendukung tag video.
                </video>
              ) : (
                <img
                  src={m.url}
                  alt={m.title || "media"}
                  className="object-cover w-full h-40 rounded-lg bg-gray-200"
                />
              )}
              <button
                onClick={() => deleteMedia(m.id)}
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <FiTrash2 className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
