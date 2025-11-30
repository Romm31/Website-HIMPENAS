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
  ArrowLeft,
  Users,
  Calendar,
  AlertCircle,
  User,
  Award,
  Sparkles,
} from "lucide-react";

export default function AlumniManagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [yearData, setYearData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add Member Form
  const [showAddForm, setShowAddForm] = useState(false);
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
      setShowAddForm(false);

      fetchYear();
    } catch {
      toast.error("Gagal menambahkan alumni");
    } finally {
      setAdding(false);
    }
  };

  // Delete Member
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

  // Save Edit
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
    <>
      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h3>
                <p className="text-sm text-gray-500">Tindakan tidak dapat dibatalkan</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus alumni ini dari daftar?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  deleteMember(confirmDeleteId!);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (loading)
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 text-lg">Memuat data alumni...</p>
          </div>
        </div>
      </AdminLayout>
    );

  if (!yearData)
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <AlertCircle size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Data tidak ditemukan</p>
          </div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Toaster richColors position="top-right" />
      <ConfirmDeleteModal />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button & Header */}
          <div className="mb-8 animate-in slide-in-from-top duration-500">
            <button
              onClick={() => router.push("/admin/alumni")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Kembali ke Daftar Alumni</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <School className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                  Alumni {yearData.year}
                  <Sparkles className="text-yellow-500" size={24} />
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                  {yearData.program && `${yearData.program} • `}
                  {yearData.batch && `${yearData.batch} • `}
                  Kelola daftar anggota alumni
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Alumni</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {yearData.members.length}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Users className="text-blue-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom delay-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Tahun Alumni</p>
                  <h3 className="text-3xl font-bold text-gray-900">{yearData.year}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="text-purple-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-right delay-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Program</p>
                  <h3 className="text-xl font-bold text-gray-900">
                    {yearData.program || "Tidak ada"}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <Award className="text-green-600" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="mb-6 animate-in slide-in-from-bottom delay-300">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} />
              Tambah Alumni
            </button>
          </div>

          {/* Add Member Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 animate-in slide-in-from-top duration-300">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <User className="text-blue-600" size={24} />
                Formulir Alumni Baru
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Alumni <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    placeholder="Deskripsi atau catatan tambahan (opsional)"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Mulai
                  </label>
                  <input
                    type="number"
                    placeholder="Misal: 2018"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Lulus
                  </label>
                  <input
                    type="number"
                    placeholder="Misal: 2022"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addMember}
                  disabled={adding}
                  className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg transition-all"
                >
                  {adding ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Tambah Alumni
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* List Members */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-in slide-in-from-bottom delay-500">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-purple-600" size={24} />
              Daftar Alumni ({yearData.members.length})
            </h2>

            {yearData.members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <User size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Belum ada alumni</p>
                <p className="text-gray-400 text-sm">Tambahkan alumni pertama Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {yearData.members.map((m: any, index: number) => (
                  <div
                    key={m.id}
                    className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50 animate-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {editId === m.id ? (
                      <div className="w-full space-y-3">
                        <input
                          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nama Alumni"
                        />
                        <textarea
                          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Deskripsi"
                          rows={2}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            className="border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editStart}
                            onChange={(e) => setEditStart(e.target.value)}
                            type="number"
                            placeholder="Tahun Mulai"
                          />
                          <input
                            className="border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editEnd}
                            onChange={(e) => setEditEnd(e.target.value)}
                            type="number"
                            placeholder="Tahun Lulus"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={saveEdit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors"
                          >
                            <CheckCircle2 size={18} /> Simpan
                          </button>

                          <button
                            onClick={() => setEditId(null)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                          >
                            <X size={18} /> Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                            <User className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                              {m.name}
                            </h3>
                            {m.description && (
                              <p className="text-gray-600 text-sm mb-2">{m.description}</p>
                            )}
                            {m.periodStart && m.periodEnd && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={16} />
                                <span className="font-medium">
                                  Periode {m.periodStart} - {m.periodEnd}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => {
                              setEditId(m.id);
                              setEditName(m.name);
                              setEditDesc(m.description || "");
                              setEditStart(m.periodStart || "");
                              setEditEnd(m.periodEnd || "");
                            }}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(m.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}