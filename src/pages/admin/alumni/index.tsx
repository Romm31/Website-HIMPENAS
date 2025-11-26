import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Toaster, toast } from "sonner";
import {
  Save,
  Loader2,
  School,
  AlertCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlumniAdminPage() {
  const [years, setYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FORM Create
  const [adding, setAdding] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [program, setProgram] = useState("");
  const [batch, setBatch] = useState("");
  const [batchYear, setBatchYear] = useState("");

  // FORM Edit
  const [editId, setEditId] = useState<number | null>(null);
  const [editYear, setEditYear] = useState("");
  const [editProgram, setEditProgram] = useState("");
  const [editBatch, setEditBatch] = useState("");
  const [editBatchYear, setEditBatchYear] = useState("");

  // DELETE modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Fetch data
  const fetchYears = async () => {
    try {
      const res = await fetch("/api/admin/alumni");
      const data = await res.json();
      setYears(data);
    } catch {
      toast.error("Gagal memuat data alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  // Create
  const addYear = async () => {
    if (!yearInput) return toast.warning("Tahun alumni wajib diisi");
    setAdding(true);

    try {
      const res = await fetch("/api/admin/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(yearInput),
          program,
          batch,
          batchYear: batchYear ? Number(batchYear) : null,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Tahun alumni berhasil ditambahkan");

      setYearInput("");
      setProgram("");
      setBatch("");
      setBatchYear("");

      fetchYears();
    } catch {
      toast.error("Gagal menambahkan data");
    } finally {
      setAdding(false);
    }
  };

  // Delete
  const deleteYear = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/alumni/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Data alumni berhasil dihapus");

      fetchYears();
    } catch {
      toast.error("Gagal menghapus data");
    }
  };

  // Save Edit
  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/admin/alumni/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(editYear),
          program: editProgram,
          batch: editBatch,
          batchYear: editBatchYear ? Number(editBatchYear) : null,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Data alumni berhasil diupdate");

      setEditId(null);
      fetchYears();
    } catch {
      toast.error("Gagal menyimpan perubahan");
    }
  };

  // Modal Delete
  const ConfirmDeleteModal = () => (
    <AnimatePresence>
      {confirmDeleteId !== null && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-xl font-semibold mb-2">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-5">
              Apakah Anda yakin ingin menghapus tahun alumni ini?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  deleteYear(confirmDeleteId!);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <AdminLayout>
      <Toaster richColors position="top-right" />

      <ConfirmDeleteModal />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <School size={34} className="text-blue-600" />
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Data Alumni
            <Sparkles className="text-yellow-400" size={22} />
          </h1>
        </div>

        {/* Tambah Tahun */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Tambah Tahun Alumni</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              placeholder="Tahun Alumni (misal: 2022)"
              className="border p-2 rounded-lg"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
            />

            <input
              type="text"
              placeholder="Program (misal: TPS)"
              className="border p-2 rounded-lg"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            />

            <input
              type="text"
              placeholder="Batch (misal: Batch 1)"
              className="border p-2 rounded-lg"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />

            <input
              type="number"
              placeholder="Tahun Batch (misal: 2000)"
              className="border p-2 rounded-lg"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
            />
          </div>

          <button
            onClick={addYear}
            disabled={adding}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {adding ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Tambah
          </button>
        </div>

        {/* List Tahun Alumni */}
        <div className="bg-white shadow-md rounded-xl p-5 border">
          <h2 className="text-xl font-semibold mb-4">Daftar Tahun Alumni</h2>

          {loading ? (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 size={22} className="animate-spin" />
              Memuat data...
            </div>
          ) : years.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle size={22} />
              Belum ada data alumni.
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {years.map((y) => (
                  <motion.div
                    key={y.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    {/* EDIT MODE */}
                    {editId === y.id ? (
                      <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <input
                            className="border p-2 rounded"
                            value={editYear}
                            onChange={(e) => setEditYear(e.target.value)}
                            placeholder="Tahun Alumni"
                            type="number"
                          />
                          <input
                            className="border p-2 rounded"
                            value={editProgram}
                            onChange={(e) => setEditProgram(e.target.value)}
                            placeholder="Program"
                          />
                          <input
                            className="border p-2 rounded"
                            value={editBatch}
                            onChange={(e) => setEditBatch(e.target.value)}
                            placeholder="Batch"
                          />
                          <input
                            className="border p-2 rounded"
                            value={editBatchYear}
                            onChange={(e) => setEditBatchYear(e.target.value)}
                            placeholder="Tahun Batch"
                            type="number"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <CheckCircle2 size={20} /> Simpan
                          </button>

                          <button
                            onClick={() => setEditId(null)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            <X size={20} /> Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold">Alumni {y.year}</h3>
                        <p className="text-sm text-gray-600">
                          {y.program ? `${y.program} • ` : ""}
                          {y.batch ? `${y.batch} • ` : ""}
                          {y.batchYear ? `Tahun ${y.batchYear}` : ""}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Total anggota: {y.members.length}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {editId === y.id ? null : (
                        <>
                          <button
                            onClick={() => {
                              setEditId(y.id);
                              setEditYear(y.year);
                              setEditProgram(y.program || "");
                              setEditBatch(y.batch || "");
                              setEditBatchYear(y.batchYear || "");
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil size={20} />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(y.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>

                          <button
                            onClick={() =>
                              (window.location.href = `/admin/alumni/${y.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Kelola →
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
