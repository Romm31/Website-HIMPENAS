import React from "react";
import { useInView } from "react-intersection-observer";

interface VisiMisiSectionProps {
  data: {
    visi?: string | null; // pakai optional biar gak error kalau undefined
    misi?: string | null;
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

  // Fungsi untuk hapus <p> luar supaya gak double
  const sanitizeHTML = (html: string | null | undefined, fallback: string) => {
    if (!html) return fallback;
    return html.replace(/^<p>/gi, "").replace(/<\/p>$/gi, "").trim();
  };

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-dark mb-12">
          Visi & Misi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* === VISI CARD === */}
          <div
            ref={visiRef}
            className={`bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-dark transform transition-all duration-700 ${
              visiInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } hover:shadow-2xl hover:-translate-y-2 hover:scale-105`}
          >
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Visi</h3>
            <div
              className="text-gray-600 leading-relaxed text-left prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(
                  data?.visi,
                  "Belum ada visi yang ditambahkan."
                ),
              }}
            />
          </div>

          {/* === MISI CARD === */}
          <div
            ref={misiRef}
            className={`bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-dark transform transition-all duration-700 delay-150 ${
              misiInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } hover:shadow-2xl hover:-translate-y-2 hover:scale-105`}
          >
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Misi</h3>
            <div
              className="text-gray-600 leading-relaxed text-left prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(
                  data?.misi,
                  "Belum ada misi yang ditambahkan."
                ),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisiSection;
