import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Toaster, toast } from "sonner";
import {
  School,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlumniManagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [yearData, setYearData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add Member Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [adding, setAdding] = useState(false);

  // Edit Member
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  // Delete Modal
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Fetch Data
  const fetchYear = async () => {
    try {
      const res = await fetch(`/api/admin/alumni/${id}`);
      const data = await res.json();
      setYearData(data);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchYear();
  }, [id]);

  // Add Member
  const addMember = async () => {
    if (!name) return toast.warning("Nama alumni wajib diisi");
    setAdding(true);

    try {
      const res = await fetch("/api/admin/alumni/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yearId: Number(id),
          name,
          description,
          periodStart: periodStart ? Number(periodStart) : null,
          periodEnd: periodEnd ? Number(periodEnd) : null,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Alumni berhasil ditambahkan");

      setName("");
      setDescription("");
      setPeriodStart("");
      setPeriodEnd("");

      fetchYear();
    } catch {
      toast.error("Gagal menambahkan alumni");
    } finally {
      setAdding(false);
    }
  };

  // Delete Member (FIXED)
  const deleteMember = async (memberId: number) => {
    try {
      const res = await fetch(`/api/admin/alumni/member/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      toast.success("Alumni berhasil dihapus");

      fetchYear();
    } catch {
      toast.error("Gagal menghapus alumni");
    }
  };

  // Save Edit (FIXED)
  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/admin/alumni/member/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          periodStart: editStart ? Number(editStart) : null,
          periodEnd: editEnd ? Number(editEnd) : null,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Data alumni diperbarui");

      setEditId(null);
      fetchYear();
    } catch {
      toast.error("Gagal menyimpan perubahan");
    }
  };

  // Delete Modal
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
              Apakah Anda yakin ingin menghapus alumni ini?
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
                  deleteMember(confirmDeleteId!);
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

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 flex items-center gap-3 text-gray-600">
          <Loader2 size={24} className="animate-spin" />
          Loading...
        </div>
      </AdminLayout>
    );

  if (!yearData)
    return (
      <AdminLayout>
        <div className="p-6 text-gray-600">Data tidak ditemukan</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Toaster richColors position="top-right" />
      <ConfirmDeleteModal />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <School size={34} className="text-blue-600" />
          <h1 className="text-3xl font-bold">Kelola Alumni {yearData.year}</h1>
        </div>

        {/* Add Member */}
        <div className="bg-white p-5 rounded-xl shadow-md border mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Alumni</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <input
              type="text"
              placeholder="Nama Alumni"
              className="border rounded-lg px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Deskripsi (opsional)"
              className="border rounded-lg px-4 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              placeholder="Tahun Mulai (periodStart)"
              className="border rounded-lg px-4 py-2"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />

            <input
              type="number"
              placeholder="Tahun Lulus (periodEnd)"
              className="border rounded-lg px-4 py-2"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>

          <button
            onClick={addMember}
            disabled={adding}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
          >
            {adding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            Tambah Alumni
          </button>
        </div>

        {/* List Members */}
        <div className="bg-white p-5 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Daftar Alumni</h2>

          {yearData.members.length === 0 ? (
            <p className="text-gray-500">Belum ada alumni.</p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {yearData.members.map((m: any) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    {editId === m.id ? (
                      <div className="w-full space-y-2">
                        <input
                          className="border px-3 py-1 rounded w-full"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <input
                          className="border px-3 py-1 rounded w-full"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            className="border px-3 py-1 rounded"
                            value={editStart}
                            onChange={(e) => setEditStart(e.target.value)}
                            type="number"
                            placeholder="Mulai"
                          />
                          <input
                            className="border px-3 py-1 rounded"
                            value={editEnd}
                            onChange={(e) => setEditEnd(e.target.value)}
                            type="number"
                            placeholder="Selesai"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold">{m.name}</h3>
                        {m.description && (
                          <p className="text-gray-600 text-sm">{m.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {m.periodStart && m.periodEnd
                            ? `Periode ${m.periodStart} - ${m.periodEnd}`
                            : ""}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editId === m.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle2 size={22} />
                          </button>

                          <button
                            onClick={() => setEditId(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={22} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditId(m.id);
                              setEditName(m.name);
                              setEditDesc(m.description || "");
                              setEditStart(m.periodStart || "");
                              setEditEnd(m.periodEnd || "");
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={20} />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(m.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
