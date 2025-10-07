import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";
import AdminLayout from "../_layout";

// React Quill (harus dynamic import biar SSR-nya aman)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState("");
  const [saving, setSaving] = useState(false);

  // ambil data dari API
  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal memuat data profil");
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Profil berhasil diperbarui!");
    } else toast.error("Gagal memperbarui profil");
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tentang Kami</h1>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4">
          <label className="block font-semibold text-gray-700 mb-2">Profil Organisasi</label>
          <ReactQuill
            theme="snow"
            value={profile}
            onChange={setProfile}
            modules={modules}
            className="min-h-[300px] bg-white rounded-md"
          />

          <button
            type="submit"
            disabled={saving}
            className={`mt-4 px-6 py-2 rounded-md text-white font-medium transition ${
              saving ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-himp hover:bg-emerald-light"
            }`}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
