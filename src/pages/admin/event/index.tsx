// src/pages/admin/event/index.tsx

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

interface EventType {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
}

const DeleteConfirmationModal = ({ onConfirm, onCancel, judul }: { onConfirm: () => void; onCancel: () => void; judul: string }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Hapus Event</h2>
        <p className="mt-2 text-gray-500">
          Anda yakin ingin menghapus event <strong className="text-gray-700">{`"${judul}"`}</strong>?
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={onCancel} className="rounded-lg border px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">Ya, Hapus</button>
        </div>
      </motion.div>
    </motion.div>
);

export default function EventList() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
        const res = await fetch("/api/admin/event");
        if (!res.ok) throw new Error("Gagal memuat data event");
        const data = await res.json();
        setEvents(data.sort((a: EventType, b: EventType) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
    } catch (error) {
        toast.error("Gagal memuat data event");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
        const res = await fetch(`/api/admin/event/${eventToDelete.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus event");
        setEvents(events.filter((e) => e.id !== eventToDelete.id));
        toast.success(`Event "${eventToDelete.judul}" berhasil dihapus`);
    } catch (error) {
        toast.error("Gagal menghapus event");
    } finally {
        setEventToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("id-ID", { day: '2-digit' }),
      month: date.toLocaleDateString("id-ID", { month: 'short' }),
      year: date.toLocaleDateString("id-ID", { year: 'numeric' }),
      full: date.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Event</h1>
          <p className="mt-1 text-gray-500">Kelola semua jadwal acara dan kegiatan.</p>
        </div>
        <Link href="/admin/event/tambah" className="flex items-center gap-2 rounded-lg bg-emerald-dark px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md">
          <Plus size={18} /> Tambah Event
        </Link>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            <Calendar size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-lg font-medium">Belum ada event</p>
            <p className="mt-1">Klik "Tambah Event" untuk membuat event baru.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
            {events.map((event) => {
              const formattedDate = formatDate(event.tanggal);
              return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col items-center justify-center rounded-lg bg-emerald-50 p-3 text-center text-emerald-700">
                  <span className="text-xs font-bold uppercase">{formattedDate.month}</span>
                  <span className="text-3xl font-bold tracking-tight">{formattedDate.day}</span>
                  <span className="text-xs text-emerald-600">{formattedDate.year}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800">{event.judul}</h2>
                  <div className="mt-1 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate.full}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.lokasi}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.deskripsi}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/event/${event.id}`} className="rounded-md p-2 text-sky-600 transition-colors hover:bg-sky-100 hover:text-sky-800">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => setEventToDelete(event)} className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            )})}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {eventToDelete && (
            <DeleteConfirmationModal 
                onConfirm={handleDelete}
                onCancel={() => setEventToDelete(null)}
                judul={eventToDelete.judul}
            />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}