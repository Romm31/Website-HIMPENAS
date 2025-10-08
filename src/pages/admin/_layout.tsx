import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
// Impor ikon dengan nama yang benar
import {
  LayoutDashboard,
  Newspaper,
  Shapes,
  Calendar,
  Image,
  LogOut,
  Presentation,
  Info,
  Goal,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  // Menu diperbarui dengan ikon yang benar
  const menu = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Slide Show", href: "/admin/slide", icon: <Presentation size={20} /> }, // <-- Ikon diperbaiki
    { name: "Berita", href: "/admin/berita", icon: <Newspaper size={20} /> },
    { name: "Kategori", href: "/admin/kategori", icon: <Shapes size={20} /> },
    { name: "Event", href: "/admin/event", icon: <Calendar size={20} /> },
    { name: "Galeri", href: "/admin/galeri", icon: <Image size={20} /> },
    { name: "Tentang Kami", href: "/admin/about ", icon: <Info size={20} /> },
    { name: "Visi & Misi", href: "/admin/visimisi", icon: <Goal size={20} /> },
  ];

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    setShowLogout(false);
    router.push("/admin/login");
  };

  // ... sisa kode tetap sama
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === SIDEBAR === */}
      <aside className="w-64 bg-emerald-dark text-white flex flex-col justify-between shadow-lg">
        <div>
          <div className="p-5 border-b border-white/10">
            <h1 className="text-2xl font-bold">Admin HIMPENAS</h1>
            <p className="text-sm text-emerald-300">Dashboard Panel</p>
          </div>

          <nav className="mt-6 flex flex-col space-y-2 px-4">
            {menu.map((item) => {
              const active =
                item.href === "/admin"
                  ? router.pathname === item.href
                  : router.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
                    active
                      ? "bg-white/10 text-white font-semibold border-l-4 border-white"
                      : "text-emerald-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <p className="text-xs text-center text-emerald-300 mt-3">
            © {new Date().getFullYear()} HIMPENAS
          </p>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {children}
        </div>
      </main>

      {/* === LOGOUT MODAL === */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[340px] p-6 text-center animate-fade-in-up">
            <h2 className="text-lg font-semibold text-gray-800">
              Konfirmasi Logout
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Apakah Anda yakin ingin keluar dari dashboard?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowLogout(false)}
                className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}