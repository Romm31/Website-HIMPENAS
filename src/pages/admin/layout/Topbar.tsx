// src/pages/admin/layout/Topbar.tsx
import { useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">Dashboard Admin</h2>

      <div className="flex items-center space-x-3">
        <span className="text-gray-700 text-sm">
          {status === "loading"
            ? "Memuat…"
            : session?.user?.email || "Admin"}
        </span>
        <img
          src="/logo/logo.png"
          alt="avatar"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
      </div>
    </header>
  );
}
