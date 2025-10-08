import { useEffect, useState, ReactNode } from "react";
import AdminLayout from "./_layout";
import Link from "next/link";
import {
  FiFileText,
  FiCalendar,
  FiImage,
  FiUsers,
  FiTag,
  FiBarChart2,
  FiPlusCircle,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Tipe data yang lebih kaya, sesuai dengan potensi data dari API
interface DashboardStats {
  totalBerita: number;
  totalEvent: number;
  totalAlbum: number;
  totalUser: number;
  totalKategori: number;
  beritaTerbaru: { id: number; judul: string; createdAt: string }[];
  beritaPerKategori: { nama: string; jumlah: number }[];
}

// Komponen untuk kartu statistik
const StatCard = ({
  icon,
  title,
  value,
  isLoading,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="h-[116px] animate-pulse rounded-xl bg-white p-6 shadow-md"></div>
    );
  }
  return (
    <div className="transform-gpu rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-white"
          style={{ lineHeight: 0 }} // ✅ Biar ikon di tengah sempurna
        >
          {icon}
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Gagal memuat statistik");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCardsData = [
    {
      title: "Total Berita",
      value: stats?.totalBerita,
      icon: <FiFileText size={24} />,
    },
    {
      title: "Jumlah Event",
      value: stats?.totalEvent,
      icon: <FiCalendar size={24} />,
    },
    {
      title: "Album Galeri",
      value: stats?.totalAlbum,
      icon: <FiImage size={24} />,
    },
    {
      title: "Pengguna Admin",
      value: stats?.totalUser,
      icon: <FiUsers size={24} />, // ✅ Sekarang posisinya sejajar
    },
    {
      title: "Kategori Berita",
      value: stats?.totalKategori,
      icon: <FiTag size={24} />,
    },
  ];

  return (
    <AdminLayout>
      {/* --- Header --- */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-gray-500">Selamat datang kembali, Admin!</p>
        </div>
        <Link href="/admin/berita/tambah" legacyBehavior>
          <a className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800">
            <FiPlusCircle />
            Tambah Berita Baru
          </a>
        </Link>
      </div>

      {/* --- Grid Statistik Utama --- */}
      <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {statCardsData.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value ?? 0}
            icon={card.icon}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* --- Konten Utama: Grafik & Aktivitas Terbaru --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Kolom Kiri: Grafik */}
        <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-700">
            <FiBarChart2 className="text-emerald-700" />
            Grafik Berita per Kategori
          </h3>
          <div className="h-80">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-200"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.beritaPerKategori}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="nama"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#065f4633" }}
                    contentStyle={{
                      borderRadius: "0.5rem",
                      borderColor: "#d1d5db",
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar
                    dataKey="jumlah"
                    fill="#047857"
                    name="Jumlah Berita"
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Aktivitas & Aksi Cepat */}
        <div className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Aktivitas Terbaru
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-md bg-gray-200"
                  ></div>
                ))
              ) : stats?.beritaTerbaru && stats.beritaTerbaru.length > 0 ? (
                stats.beritaTerbaru.map((berita) => (
                  <div
                    key={berita.id}
                    className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                  >
                    <div>
                      <p className="truncate font-medium text-gray-800">
                        {berita.judul}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(berita.createdAt).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <Link href={`/berita/${berita.id}`} legacyBehavior>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800"
                        title="Lihat Berita"
                      >
                        <FiExternalLink />
                      </a>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada berita baru.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <Link href="/admin/event/tambah" legacyBehavior>
                <a className="group flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-emerald-700">
                  <span className="font-medium text-gray-700 group-hover:text-white">
                    Buat Event Baru
                  </span>
                  <FiArrowRight className="text-gray-400 group-hover:text-white" />
                </a>
              </Link>
              <Link href="/admin/galeri/tambah" legacyBehavior>
                <a className="group flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-emerald-700">
                  <span className="font-medium text-gray-700 group-hover:text-white">
                    Upload ke Galeri
                  </span>
                  <FiArrowRight className="text-gray-400 group-hover:text-white" />
                </a>
              </Link>
              <Link href="/admin/kategori" legacyBehavior>
                <a className="group flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-emerald-700">
                  <span className="font-medium text-gray-700 group-hover:text-white">
                    Kelola Kategori
                  </span>
                  <FiArrowRight className="text-gray-400 group-hover:text-white" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
