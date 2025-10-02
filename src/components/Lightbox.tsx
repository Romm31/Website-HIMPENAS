import React, { useEffect } from "react";
import Image from "next/image";

export interface MediaItem {
  id: number;
  title?: string | null;
  url: string;
  type: "IMAGE" | "VIDEO";
  thumbnailUrl?: string | null;
}

interface LightboxProps {
  media: MediaItem;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  media,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  // biar bisa pakai keyboard ← → ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-emerald-400"
      >
        ✕
      </button>

      {/* Tombol Navigasi Kiri */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-5xl font-bold hover:text-emerald-400"
        >
          ‹
        </button>
      )}

      {/* Konten */}
      {media.type === "IMAGE" ? (
        <div className="relative max-w-6xl max-h-[90vh] w-full flex justify-center">
          <Image
            src={media.url}
            alt={media.title ?? "Media"}
            width={1600}
            height={1000}
            className="rounded-lg object-contain max-h-[90vh] transition-transform duration-500 hover:scale-110 cursor-zoom-in"
          />
        </div>
      ) : (
        <video
          src={media.url}
          controls
          autoPlay
          className="max-w-5xl max-h-[90vh] w-full rounded-lg"
        />
      )}

      {/* Tombol Navigasi Kanan */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-5xl font-bold hover:text-emerald-400"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default Lightbox;
