// src/pages/admin/event/tambah.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import AdminLayout from "../_layout";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Calendar, MapPin, FileText, AlertCircle, CheckCircle2, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TambahEvent() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!tanggal) {
      toast.error("Tanggal event wajib diisi");
      return;
    }

    if (!waktu) {
      toast.error("Waktu event wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gabungkan tanggal dan waktu
      const dateTimeString = `${tanggal}T${waktu}:00`;

      const res = await fetch("/api/admin/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          judul, 
          deskripsi, 
          tanggal: dateTimeString, 
          lokasi 
        }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan event");

      toast.success("Event berhasil ditambahkan!");

      setTimeout(() => {
        router.push("/admin/event");
      }, 1000);
    } catch (error) {
      toast.error("Gagal menambahkan event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = judul && deskripsi && tanggal && waktu && lokasi;

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
            <h1 className="text-4xl font-bold text-gray-900">Buat Event Baru</h1>
            <p className="mt-2 text-gray-600">Isi detail lengkap untuk membuat jadwal acara baru</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                <Plus size={14} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Event Baru</span>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            whileHover={{ scale: isSubmitting || !isFormValid ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting || !isFormValid ? 1 : 0.95 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Simpan Event</span>
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
              <h4 className="font-semibold text-blue-900">Tips Membuat Event</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>• Gunakan judul yang singkat namun deskriptif</li>
                <li>• Tulis deskripsi yang informatif tentang event</li>
                <li>• Pastikan tanggal dan waktu sudah benar</li>
                <li>• Cantumkan lokasi dengan jelas dan lengkap</li>
                <li>• Periksa kembali semua informasi sebelum menyimpan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Required Fields Notice */}
        {!isFormValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
          >
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900">Field Wajib</h4>
                <ul className="mt-2 space-y-1 text-sm text-orange-700">
                  {!judul && <li>• Judul event belum diisi</li>}
                  {!deskripsi && <li>• Deskripsi event belum diisi</li>}
                  {!tanggal && <li>• Tanggal event belum dipilih</li>}
                  {!waktu && <li>• Waktu event belum dipilih</li>}
                  {!lokasi && <li>• Lokasi event belum diisi</li>}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview Card */}
        {isFormValid && (
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
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{deskripsi}</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {new Date(tanggal).toLocaleDateString("id-ID", { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {` • ${waktu} WIB`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{lokasi}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-green-700">
                  Event siap disimpan! Klik tombol "Simpan Event" untuk mempublikasikan.
                </p>
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
            disabled={isSubmitting || !isFormValid}
            whileHover={{ scale: isSubmitting || !isFormValid ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting || !isFormValid ? 1 : 0.98 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Simpan Event</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </AdminLayout>
  );
}