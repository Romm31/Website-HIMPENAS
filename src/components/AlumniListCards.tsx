import { useEffect, useState } from "react";
import { School, Users } from "lucide-react";

export default function AlumniListCards() {
  const [years, setYears] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/alumni")
      .then((res) => res.json())
      .then((data) => setYears(data));
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <School size={30} className="text-blue-600" />
        Alumni
      </h2>

      {years.length === 0 ? (
        <p className="text-gray-600">Belum ada data alumni.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {years.map((y) => (
            <div
              key={y.id}
              onClick={() => (window.location.href = `/alumni/${y.id}`)}
              className="cursor-pointer border rounded-xl p-5 bg-white shadow hover:shadow-lg transition group"
            >
              {/* TITLE BESAR: TPS + Batch + Tahun */}
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight">
                {y.program ?? "Program Tidak Ada"}{" "}
                {y.batch ? `Batch ${y.batch}` : ""}{" "}
                {y.batchYear ? `Tahun ${y.batchYear}` : ""}
              </h3>

              {/* Subtle small subtitle */}
              <p className="text-sm text-gray-500 mt-1">
                Alumni {y.year}
              </p>

              {/* Members count */}
              <div className="flex items-center text-gray-500 text-sm gap-1 mt-3">
                <Users size={16} /> {y.members.length} anggota
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
