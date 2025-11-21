// src/pages/admin/_layout.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
import NextImage from "next/image";
import {
  LayoutDashboard, Newspaper, Shapes, Calendar,
  LogOut, Presentation, Info, Goal, User, X, Image,
  ChevronRight, Settings
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
}

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const menu = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Admin Account", href: "/admin/user", icon: <User size={20} /> },
    { name: "Slide Show", href: "/admin/slide", icon: <Presentation size={20} /> },
    { name: "Berita", href: "/admin/berita", icon: <Newspaper size={20} /> },
    { name: "Kategori", href: "/admin/kategori", icon: <Shapes size={20} /> },
    { name: "Event", href: "/admin/event", icon: <Calendar size={20} /> },
    { name: "Galeri", href: "/admin/galeri", icon: <Image size={20} /> },
    { name: "Visi & Misi", href: "/admin/visimisi", icon: <Goal size={20} /> },
    { name: "Tentang Kami", href: "/admin/about", icon: <Info size={20} /> },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-emerald-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm p-2 border border-white/20">
              <NextImage
                src="/logo/logo.png"
                alt="HIMPENAS Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HIMPENAS</h1>
              <p className="text-xs text-emerald-200">Admin Panel</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
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
                transition={{ delay: 0.05 * index, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-white text-emerald-dark shadow-lg"
                      : "text-emerald-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="text-emerald-dark"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-emerald-600/30">
        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/20">
          <p className="text-xs text-emerald-200 text-center">
            © {new Date().getFullYear()} HIMPENAS
          </p>
          <p className="text-[10px] text-emerald-300 text-center mt-1">
            All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const confirmLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    setShowLogout(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-72 flex-col bg-gradient-to-b from-emerald-dark to-emerald-800 text-white shadow-2xl">
        <SidebarContent />
        
        {/* Logout Button Desktop */}
        <div className="p-4">
          <motion.button
            onClick={() => setShowLogout(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* SIDEBAR MOBILE */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 flex h-full w-80 flex-col bg-gradient-to-b from-emerald-dark to-emerald-800 text-white shadow-2xl"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
              
              {/* Logout Button Mobile */}
              <div className="p-4">
                <motion.button
                  onClick={() => {
                    setSidebarOpen(false);
                    setShowLogout(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* TOP BAR MOBILE */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden shadow-sm">
          <div className="flex items-center justify-between p-4">
            {/* Menu Button - Left */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0 p-2 rounded-lg bg-emerald-dark text-white hover:bg-emerald-800 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* Logo & Title - Center */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              <div className="relative w-8 h-8 rounded-lg bg-emerald-100 flex-shrink-0">
                <NextImage
                  src="/logo/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-emerald-dark truncate">Admin HIMPENAS</h1>
                <p className="text-[10px] text-gray-500 truncate">Dashboard Panel</p>
              </div>
            </div>
            
            {/* Empty div for balance */}
            <div className="w-10 flex-shrink-0"></div>
          </div>
        </header>

        {/* TOP BAR DESKTOP */}
        <header className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {router.pathname === "/admin" 
                  ? "Dashboard" 
                  : router.pathname.split("/").pop()?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Admin"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Kelola website HIMPENAS dengan mudah
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings size={20} className="text-gray-600" />
              </motion.button>

              <div className="w-px h-6 bg-gray-300"></div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <LogOut size={28} className="text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Konfirmasi Logout
                </h2>
                <p className="text-gray-600 mb-8">
                  Apakah Anda yakin ingin keluar dari dashboard admin?
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogout(false)}
                    className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Batal
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmLogout}
                    className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700"
                  >
                    Ya, Logout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}