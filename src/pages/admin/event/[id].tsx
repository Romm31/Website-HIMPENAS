// src/pages/admin/event/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import AdminLayout from "../_layout";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Calendar, MapPin, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/api/admin/event/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setJudul(data.judul);
          setDeskripsi(data.deskripsi);
          
          // Split tanggal dan waktu
          const dateTime = new Date(data.tanggal);
          const dateStr = dateTime.toISOString().split('T')[0];
          const timeStr = dateTime.toTimeString().slice(0, 5);
          
          setTanggal(dateStr);
          setWaktu(timeStr);
          setLokasi(data.lokasi);
        })
        .catch(() => toast.error("Gagal memuat data event"))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul.trim()) {
      toast.error("Judul event tidak boleh kosong");
      return;
    }

    if (!deskripsi.trim()) {
      toast.error("Deskripsi event tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gabungkan tanggal dan waktu
      const dateTimeString = `${tanggal}T${waktu}:00`;
      
      const res = await fetch(`/api/admin/event/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          judul, 
          deskripsi, 
          tanggal: dateTimeString, 
          lokasi 
        }),
      });
      
      if (!res.ok) throw new Error("Gagal memperbarui event");
      
      toast.success("Event berhasil diperbarui!");
      
      setTimeout(() => {
        router.push("/admin/event");
      }, 1000);
    } catch (error) {
      toast.error("Gagal memperbarui event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-emerald-600" size={48} />
          </motion.div>
          <p className="text-gray-500 font-medium">Memuat data event...</p>
        </div>
      </AdminLayout>
    );
  }

  const eventDate = tanggal ? new Date(tanggal) : null;
  const isPastEvent = eventDate && eventDate < new Date();

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/admin/event"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Kembali ke Daftar Event</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Event</h1>
            <p className="mt-2 text-gray-600">Perbarui detail acara atau kegiatan</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                <Calendar size={14} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">ID: {id}</span>
              </div>
              {isPastEvent && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5">
                  <span className="text-sm font-semibold text-gray-700">Event Selesai</span>
                </div>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Event</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Judul */}
            <div className="relative">
              <input
                id="judul"
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Judul Event"
              />
              <label
                htmlFor="judul"
                className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
              >
                Judul Event
              </label>
              <p className="mt-2 text-xs text-gray-500">Berikan judul yang jelas dan menarik</p>
            </div>

            {/* Deskripsi */}
            <div className="relative">
              <textarea
                id="deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                rows={4}
                className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Deskripsi Event"
              />
              <label
                htmlFor="deskripsi"
                className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
              >
                Deskripsi Event
              </label>
              <p className="mt-2 text-xs text-gray-500">
                {deskripsi.length}/500 karakter
              </p>
            </div>
          </div>
        </div>

        {/* DateTime & Location Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Jadwal & Lokasi</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tanggal */}
              <div className="relative">
                <input
                  id="tanggal"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Tanggal"
                />
                <label
                  htmlFor="tanggal"
                  className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                >
                  Tanggal
                </label>
              </div>

              {/* Waktu */}
              <div className="relative">
                <input
                  id="waktu"
                  type="time"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  required
                  className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="Waktu"
                />
                <label
                  htmlFor="waktu"
                  className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
                >
                  Waktu
                </label>
              </div>
            </div>

            {/* Lokasi */}
            <div className="relative">
              <input
                id="lokasi"
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
                className="peer block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-transparent transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Lokasi"
              />
              <label
                htmlFor="lokasi"
                className="absolute left-4 top-3.5 origin-[0] -translate-y-7 scale-75 transform bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-emerald-600"
              >
                Lokasi Event
              </label>
              <div className="mt-2 flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Cantumkan alamat lengkap atau nama tempat yang mudah dikenali
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Tips</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>• Pastikan tanggal dan waktu sudah benar</li>
                <li>• Gunakan deskripsi yang informatif dan menarik</li>
                <li>• Cantumkan lokasi dengan jelas untuk memudahkan peserta</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        {judul && tanggal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-green-100 bg-green-50 p-4"
          >
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">Preview Event</h4>
                <div className="mt-3 rounded-lg bg-white p-4 border border-green-200">
                  <h5 className="font-bold text-gray-900">{judul}</h5>
                  {deskripsi && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{deskripsi}</p>
                  )}
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    {tanggal && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>
                          {new Date(tanggal).toLocaleDateString("id-ID", { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                          {waktu && ` • ${waktu} WIB`}
                        </span>
                      </div>
                    )}
                    {lokasi && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{lokasi}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/event"
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Batal
          </Link>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </AdminLayout>
  );
}