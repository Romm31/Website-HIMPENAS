import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: { [key: string]: string | string[] | undefined };
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
  query,
}) => {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (query?.search) params.set("search", query.search as string);
    if (query?.kategori) params.set("kategori", query.kategori as string);
    if (query?.filter) params.set("filter", query.filter as string);
    params.set("page", page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const prevUrl = currentPage > 1 ? createPageUrl(currentPage - 1) : "#";
  const nextUrl =
    currentPage < totalPages ? createPageUrl(currentPage + 1) : "#";

  const btnClass = (isActive: boolean) =>
    `px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${
      isActive
        ? "bg-emerald-himp text-white font-bold shadow-md border-emerald-himp"
        : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-light hover:text-white"
    }`;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) {
      pageNumbers.push(
        <Link key={1} href={createPageUrl(1)} className={btnClass(1 === currentPage)}>
          1
        </Link>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="px-3 py-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link
          key={i}
          href={createPageUrl(i)}
          aria-current={i === currentPage ? "page" : undefined}
          className={btnClass(i === currentPage)}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="px-3 py-2 text-gray-400">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <Link
          key={totalPages}
          href={createPageUrl(totalPages)}
          className={btnClass(totalPages === currentPage)}
        >
          {totalPages}
        </Link>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center mt-16 mb-24 font-sans space-y-4">
      {/* Mobile: indikator halaman */}
      <span className="md:hidden text-sm text-gray-600">
        Halaman {currentPage} dari {totalPages}
      </span>

      {/* Desktop: pagination lengkap */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Tombol Sebelumnya */}
        <Link
          href={prevUrl}
          className={`flex items-center px-4 py-2 rounded-lg text-sm md:text-base border transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-light hover:text-white shadow-sm"
          }`}
          aria-disabled={currentPage === 1}
        >
          Sebelumnya
        </Link>

        {/* Nomor Halaman */}
        <div className="hidden md:flex">{renderPageNumbers()}</div>

        {/* Tombol Selanjutnya */}
        <Link
          href={nextUrl}
          className={`flex items-center px-4 py-2 rounded-lg text-sm md:text-base border transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-light hover:text-white shadow-sm"
          }`}
          aria-disabled={currentPage === totalPages}
        >
          Selanjutnya
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
