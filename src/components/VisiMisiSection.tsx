import React from "react";
import { useInView } from "react-intersection-observer";
import { Eye, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface VisiMisiSectionProps {
  data: {
    visi?: string | null;
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

  // Function to format mission content into numbered list
  const formatMisiContent = (content: string | null | undefined): string => {
    if (!content) return "<p class='text-center text-gray-400 italic'>Belum ada misi yang ditambahkan.</p>";
    
    // Check if content contains numbered items like "1. ... 2. ..."
    const numberedPattern = /(\d+)\.\s*([^0-9]+?)(?=\d+\.\s|$)/g;
    const matches = [...content.matchAll(numberedPattern)];
    
    if (matches.length > 0) {
      // Convert to ordered list
      const listItems = matches.map(match => {
        const text = match[2].trim();
        return `<li>${text}</li>`;
      }).join('');
      return `<ol class="list-decimal list-inside space-y-3">${listItems}</ol>`;
    }
    
    // Return sanitized content if no numbered pattern found
    return sanitizeHTML(content, "<p class='text-center text-gray-400 italic'>Belum ada misi yang ditambahkan.</p>");
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl translate-x-1/2"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-himp" />
            <span className="text-sm font-semibold text-emerald-himp uppercase tracking-wide">
              Fondasi Kami
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Visi & <span className="text-emerald-dark">Misi</span>
          </h2>

          {/* Divider */}
          <div className="w-24 h-1 bg-emerald-himp mx-auto rounded-full mb-6"></div>

          {/* Description */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Panduan dan tujuan kami dalam membangun organisasi yang lebih baik
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* === VISI CARD === */}
          <div
            ref={visiRef}
            className={`group relative transform transition-all duration-700 ${
              visiInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden h-full">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-emerald-himp opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>

              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-himp via-emerald-dark to-emerald-himp"></div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon Container */}
              <div className="relative flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                    <Eye className="w-10 h-10 text-emerald-dark" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-emerald-dark mb-6 relative">
                Visi
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-emerald-himp rounded-full"></span>
              </h3>

              {/* Content */}
              <div
                className="text-gray-600 leading-relaxed text-left prose prose-lg max-w-none prose-p:mb-4 prose-ul:my-4 prose-li:my-2"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(
                    data?.visi,
                    "<p class='text-center text-gray-400 italic'>Belum ada visi yang ditambahkan.</p>"
                  ),
                }}
              />

              {/* Decorative Quote Mark */}
              <div className="absolute bottom-6 right-6 text-8xl text-emerald-100 font-serif leading-none opacity-50 pointer-events-none">
                "
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* === MISI CARD === */}
          <div
            ref={misiRef}
            className={`group relative transform transition-all duration-700 delay-150 ${
              misiInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden h-full">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-emerald-himp opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>

              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-himp via-emerald-dark to-emerald-himp"></div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon Container */}
              <div className="relative flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                    <Target className="w-10 h-10 text-emerald-dark" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-emerald-dark mb-6 relative">
                Misi
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-emerald-himp rounded-full"></span>
              </h3>

              {/* Content */}
              <div
                className="text-gray-600 leading-relaxed text-left prose prose-lg max-w-none prose-p:mb-4 prose-ul:my-4 prose-li:my-2 prose-li:before:text-emerald-himp"
                dangerouslySetInnerHTML={{
                  __html: formatMisiContent(data?.misi),
                }}
              />

              {/* Decorative Icon Pattern */}
              <div className="absolute bottom-6 right-6 opacity-50 pointer-events-none">
                <CheckCircle2 className="w-16 h-16 text-emerald-100" />
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-full shadow-md">
            <div className="w-3 h-3 bg-emerald-himp rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-emerald-dark">
              Berkomitmen untuk Keunggulan
            </span>
            <div className="w-3 h-3 bg-emerald-himp rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* Custom Prose Styling */}
      <style jsx global>{`
        .prose ul {
          list-style: none;
          padding-left: 0;
        }
        .prose li {
          position: relative;
          padding-left: 2rem;
        }
        .prose li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #047857;
          font-weight: bold;
          font-size: 1.2em;
        }
      `}</style>
    </section>
  );
};

export default VisiMisiSection;