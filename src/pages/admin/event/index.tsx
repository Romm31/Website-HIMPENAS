// src/pages/admin/event/index.tsx

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminLayout from "../_layout";
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, Search, X, Grid3x3, List, Filter, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

interface EventType {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
}

const DeleteConfirmationModal = ({ 
  onConfirm, 
  onCancel, 
  event 
}: { 
  onConfirm: () => void; 
  onCancel: () => void; 
  event: EventType 
}) => {
  const formattedDate = new Date(event.tanggal).toLocaleDateString("id-ID", { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50"
        >
          <Trash2 className="h-8 w-8 text-red-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Konfirmasi Penghapusan</h2>
          <p className="mt-3 text-center text-gray-600">
            Anda akan menghapus event <span className="font-semibold text-gray-900">"{event.judul}"</span>
          </p>

          {/* Event Details */}
          <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span>{event.lokasi}</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Batal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40"
          >
            Ya, Hapus
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EventCard = ({ 
  event, 
  onDelete 
}: { 
  event: EventType; 
  onDelete: () => void 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("id-ID", { day: '2-digit' }),
      month: date.toLocaleDateString("id-ID", { month: 'short' }),
      year: date.toLocaleDateString("id-ID", { year: 'numeric' }),
      full: date.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const formattedDate = formatDate(event.tanggal);
  const isPast = new Date(event.tanggal) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl ${
        isPast ? 'opacity-75' : ''
      }`}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-100/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative p-6">
        {/* Date Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 text-center text-white shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider">{formattedDate.month}</span>
          <span className="text-3xl font-bold leading-none">{formattedDate.day}</span>
          <span className="text-xs opacity-90">{formattedDate.year}</span>
        </div>

        {/* Status Badge */}
        {isPast && (
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white">
              Selesai
            </span>
          </div>
        )}

        {/* Content */}
        <div className="pr-24">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {event.judul}
          </h3>

          <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {event.deskripsi}
          </p>

          {/* Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Calendar size={14} className="text-emerald-600" />
              </div>
              <span className="font-medium">{formattedDate.full}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Clock size={14} className="text-emerald-600" />
              </div>
              <span className="font-medium">{formattedDate.time} WIB</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="rounded-lg bg-emerald-50 p-2">
                <MapPin size={14} className="text-emerald-600" />
              </div>
              <span className="font-medium">{event.lokasi}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-2 pt-4 border-t border-gray-100">
          <Link href={`/admin/event/${event.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Edit size={16} />
              <span>Edit</span>
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDelete}
            className="rounded-lg bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"></div>
    </motion.div>
  );
};

export default function EventList() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterMode === 'all') return matchesSearch;
    
    const isPast = new Date(event.tanggal) < new Date();
    if (filterMode === 'upcoming') return matchesSearch && !isPast;
    if (filterMode === 'past') return matchesSearch && isPast;
    
    return matchesSearch;
  });

  const upcomingCount = events.filter(e => new Date(e.tanggal) >= new Date()).length;
  const pastCount = events.filter(e => new Date(e.tanggal) < new Date()).length;

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manajemen Event</h1>
          <p className="mt-2 text-gray-600">Kelola semua jadwal acara dan kegiatan</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-emerald-700">{events.length} Total Event</span>
            </div>
            {upcomingCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5">
                <span className="text-sm font-semibold text-blue-700">{upcomingCount} Mendatang</span>
              </div>
            )}
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/admin/event/tambah"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <Plus size={20} />
            <span>Tambah Event Baru</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex flex-col gap-4 sm:flex-row"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari event berdasarkan judul, lokasi, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-medium shadow-sm transition-all ${
              filterMode !== 'all'
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <Filter size={18} />
            <span>
              {filterMode === 'all' && 'Semua Event'}
              {filterMode === 'upcoming' && 'Mendatang'}
              {filterMode === 'past' && 'Selesai'}
            </span>
            <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(false)}
                ></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-14 z-20 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setFilterMode('all');
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        filterMode === 'all'
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Semua Event</span>
                      <span className="text-xs">{events.length}</span>
                    </button>
                    <button
                      onClick={() => {
                        setFilterMode('upcoming');
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        filterMode === 'upcoming'
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Mendatang</span>
                      <span className="text-xs">{upcomingCount}</span>
                    </button>
                    <button
                      onClick={() => {
                        setFilterMode('past');
                        setShowFilterDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        filterMode === 'past'
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Selesai</span>
                      <span className="text-xs">{pastCount}</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid3x3 size={16} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={16} />
            <span>List</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100"></div>
              ))}
            </div>
          )
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
              <Calendar size={40} className="text-gray-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              {searchTerm || filterMode !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Event'}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || filterMode !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Tambahkan event pertama untuk memulai'}
            </p>
            {!searchTerm && filterMode === 'all' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Link
                  href="/admin/event/tambah"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700"
                >
                  <Plus size={18} />
                  <span>Tambah Event Pertama</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDelete={() => setEventToDelete(event)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => {
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString);
                  return {
                    day: date.toLocaleDateString("id-ID", { day: '2-digit' }),
                    month: date.toLocaleDateString("id-ID", { month: 'short' }),
                    year: date.toLocaleDateString("id-ID", { year: 'numeric' }),
                    full: date.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                  };
                };

                const formattedDate = formatDate(event.tanggal);
                const isPast = new Date(event.tanggal) < new Date();

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg ${
                      isPast ? 'opacity-75' : ''
                    }`}
                  >
                    {/* Date Badge */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 text-center text-white shadow-lg">
                      <span className="text-xs font-bold uppercase tracking-wider">{formattedDate.month}</span>
                      <span className="text-3xl font-bold leading-none tracking-tight">{formattedDate.day}</span>
                      <span className="text-xs opacity-90">{formattedDate.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="text-lg font-bold text-gray-900">{event.judul}</h2>
                          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} /> {formattedDate.full}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={14} /> {event.lokasi}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.deskripsi}</p>
                        </div>

                        {isPast && (
                          <span className="rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                            Selesai
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/admin/event/${event.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-lg p-2.5 text-emerald-600 transition-colors hover:bg-emerald-50"
                        >
                          <Edit size={18} />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEventToDelete(event)}
                        className="rounded-lg p-2.5 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {eventToDelete && (
          <DeleteConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => setEventToDelete(null)}
            event={eventToDelete}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}