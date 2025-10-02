import React from "react";
import { useInView } from "react-intersection-observer";

interface VisiMisiSectionProps {
  data: {
    visi: string | null;
    misi: string | null;
  } | null;
}

const VisiMisiSection: React.FC<VisiMisiSectionProps> = ({ data }) => {
  const { ref: visiRef, inView: visiInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: misiRef, inView: misiInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-dark mb-12">
          Visi & Misi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Visi Card */}
          <div
            ref={visiRef}
            className={`bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-600 transform transition-all duration-700 ${
              visiInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } hover:shadow-2xl hover:-translate-y-2 hover:scale-105`}
          >
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Visi</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {data?.visi || "Belum ada visi yang ditambahkan."}
            </p>
          </div>

          {/* Misi Card */}
          <div
            ref={misiRef}
            className={`bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-600 transform transition-all duration-700 delay-150 ${
              misiInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } hover:shadow-2xl hover:-translate-y-2 hover:scale-105`}
          >
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Misi</h3>
            <ul className="text-gray-600 text-left list-disc list-inside space-y-2 whitespace-pre-line">
              {data?.misi
                ? data.misi.split("\n").map((m, i) => (
                    <li key={i} className="hover:text-emerald-600 transition-colors">
                      {m}
                    </li>
                  ))
                : "Belum ada misi yang ditambahkan."}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisiSection;
