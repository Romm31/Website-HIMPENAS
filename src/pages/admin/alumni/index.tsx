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
  Plus,
  Users,
  Calendar,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export default function AlumniAdminPage() {
  const [years, setYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FORM Create
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
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
      setShowAddForm(false);

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

  // Stats calculation
  const totalAlumni = years.reduce((acc, y) => acc + y.members.length, 0);
  const totalYears = years.length;

  // Modal Delete
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
              Apakah Anda yakin ingin menghapus tahun alumni ini? Semua data yang terkait akan ikut terhapus.
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
                  deleteYear(confirmDeleteId!);
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

  return (
    <AdminLayout>
      <Toaster richColors position="top-right" />
      <ConfirmDeleteModal />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
                  Data Alumni
                  <Sparkles className="text-yellow-500" size={24} />
                </h1>
                <p className="text-gray-500 text-sm md:text-base">Kelola informasi alumni dengan mudah</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Alumni</p>
                  <h3 className="text-3xl font-bold text-gray-900">{totalAlumni}</h3>
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
                  <h3 className="text-3xl font-bold text-gray-900">{totalYears}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="text-purple-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-right delay-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Rata-rata/Tahun</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {totalYears > 0 ? Math.round(totalAlumni / totalYears) : 0}
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={28} />
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
              Tambah Tahun Alumni
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 animate-in slide-in-from-top duration-300">
              <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <School className="text-blue-600" size={24} />
                  Formulir Tahun Alumni Baru
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun Alumni <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Misal: 2022"
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: TPS"
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Batch 1"
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun Batch
                    </label>
                    <input
                      type="number"
                      placeholder="Misal: 2000"
                      className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={batchYear}
                      onChange={(e) => setBatchYear(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={addYear}
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
                        <Save size={20} />
                        Simpan Data
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
            </div>
          )}

          {/* List Tahun Alumni */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 animate-in slide-in-from-bottom delay-500">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <School className="text-purple-600" size={24} />
              Daftar Tahun Alumni
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Memuat data alumni...</p>
              </div>
            ) : years.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <AlertCircle size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Belum ada data alumni</p>
                <p className="text-gray-400 text-sm">Tambahkan tahun alumni pertama Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {years.map((y) => (
                  <div
                    key={y.id}
                    className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50 animate-in slide-in-from-left duration-300"
                  >
                    {/* EDIT MODE */}
                    {editId === y.id ? (
                      <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <input
                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editYear}
                            onChange={(e) => setEditYear(e.target.value)}
                            placeholder="Tahun Alumni"
                            type="number"
                          />
                          <input
                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editProgram}
                            onChange={(e) => setEditProgram(e.target.value)}
                            placeholder="Program"
                          />
                          <input
                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editBatch}
                            onChange={(e) => setEditBatch(e.target.value)}
                            placeholder="Batch"
                          />
                          <input
                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editBatchYear}
                            onChange={(e) => setEditBatchYear(e.target.value)}
                            placeholder="Tahun Batch"
                            type="number"
                          />
                        </div>

                        <div className="flex gap-3">
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
                            <GraduationCap className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                              Alumni {y.year}
                            </h3>
                            {(y.program || y.batch || y.batchYear) && (
                              <p className="text-sm text-gray-600 mb-1 flex flex-wrap items-center gap-2">
                                {y.program && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                    {y.program}
                                  </span>
                                )}
                                {y.batch && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                                    {y.batch}
                                  </span>
                                )}
                                {y.batchYear && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                    Tahun {y.batchYear}
                                  </span>
                                )}
                              </p>
                            )}
                            <p className="text-gray-500 text-sm flex items-center gap-1.5">
                              <Users size={16} />
                              <span className="font-medium">{y.members.length}</span> anggota terdaftar
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => {
                              setEditId(y.id);
                              setEditYear(y.year);
                              setEditProgram(y.program || "");
                              setEditBatch(y.batch || "");
                              setEditBatchYear(y.batchYear || "");
                            }}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(y.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>

                          <button
                            onClick={() =>
                              (window.location.href = `/admin/alumni/${y.id}`)
                            }
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            Kelola →
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