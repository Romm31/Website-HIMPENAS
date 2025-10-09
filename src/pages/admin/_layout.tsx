import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
import { signOut } from "next-auth/react";
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
  User,
  X,
  Menu,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "User Account", href: "/admin/user", icon: <User size={20} /> },
    { name: "Slide Show", href: "/admin/slide", icon: <Presentation size={20} /> },
    { name: "Berita", href: "/admin/berita", icon: <Newspaper size={20} /> },
    { name: "Kategori", href: "/admin/kategori", icon: <Shapes size={20} /> },
    { name: "Event", href: "/admin/event", icon: <Calendar size={20} /> },
    { name: "Galeri", href: "/admin/galeri", icon: <Image size={20} /> },
    { name: "Tentang Kami", href: "/admin/about", icon: <Info size={20} /> },
    { name: "Visi & Misi", href: "/admin/visimisi", icon: <Goal size={20} /> },
  ];

  const confirmLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
    setShowLogout(false);
  };

  const SidebarContent = () => (
    <>
      <div>
        <div className="p-5 border-b border-white/10 text-center">
          <h1 className="text-2xl font-bold">Admin HIMPENAS</h1>
          <p className="text-sm text-emerald-300">Dashboard Panel</p>
        </div>
        <nav className="mt-6 flex flex-col space-y-1 px-4">
          {menu.map((item, index) => {
            const active =
              item.href === "/admin"
                ? router.pathname === item.href
                : router.pathname.startsWith(item.href);
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-white/10 font-semibold text-white"
                      : "text-emerald-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    ></motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/10 p-4">
        <motion.button
          onClick={() => setShowLogout(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </motion.button>
        <p className="mt-3 text-center text-xs text-emerald-400">
          © {new Date().getFullYear()} HIMPENAS
        </p>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* === SIDEBAR (Desktop) === */}
      <aside className="hidden w-64 flex-col justify-between bg-emerald-dark text-white shadow-lg lg:flex">
        <SidebarContent />
      </aside>

      {/* === SIDEBAR (Mobile) === */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col justify-between bg-emerald-dark text-white shadow-lg"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col">
        {/* === TOP HEADER (Mobile) === */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white p-4 shadow-sm lg:hidden">
          <h1 className="text-xl font-bold text-emerald-dark">Admin HIMPENAS</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
        </header>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* === LOGOUT MODAL === */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-[360px] rounded-xl bg-white p-6 text-center shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Konfirmasi Logout
              </h2>
              <p className="mt-2 text-gray-500">
                Apakah Anda yakin ingin keluar dari dashboard?
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogout(false)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmLogout}
                  className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}