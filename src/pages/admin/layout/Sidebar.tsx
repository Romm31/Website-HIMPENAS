import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const menuItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Berita", href: "/admin/berita" },
  { label: "Event", href: "/admin/event" },
  { label: "Galeri", href: "/admin/galeri" },
  { label: "Visi & Misi", href: "/admin/visi-misi" },
  { label: "Slide", href: "/admin/slide" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-emerald-himp text-white min-h-screen p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center">HIMPENAS</h1>
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                router.pathname === item.href
                  ? "bg-emerald-light text-white"
                  : "hover:bg-emerald-light/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
      >
        Logout
      </button>
    </aside>
  );
}
