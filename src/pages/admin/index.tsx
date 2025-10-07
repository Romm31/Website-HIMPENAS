import { useEffect, useState } from "react";
import AdminLayout from "./_layout";

interface Stats {
  berita: number;
  event: number;
  galeri: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-emerald-himp mb-6">
        Selamat Datang di Dashboard Admin
      </h1>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Berita</h3>
            <p className="text-3xl font-bold text-emerald-himp">{stats.berita}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Event</h3>
            <p className="text-3xl font-bold text-emerald-himp">{stats.event}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Galeri</h3>
            <p className="text-3xl font-bold text-emerald-himp">{stats.galeri}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading data...</p>
      )}
    </AdminLayout>
  );
}
