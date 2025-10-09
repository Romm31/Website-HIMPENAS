// src/pages/admin/login.tsx
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-load email dari localStorage saat halaman dibuka
  useEffect(() => {
    const savedEmail = localStorage.getItem("lastEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/admin",
      });

      if (res?.ok) {
        // Simpan email terakhir ke localStorage
        localStorage.setItem("lastEmail", email);
        router.push("/admin");
      } else {
        setError(res?.error || "Email atau password salah");
        const form = document.getElementById("login-form");
        form?.classList.add("animate-shake");
        setTimeout(() => form?.classList.remove("animate-shake"), 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Admin - HIMPENAS</title>
      </Head>
      <div className="flex min-h-screen bg-white">
        {/* Kolom Kiri - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-emerald-dark p-12 text-white text-center"
        >
          <Image
            src="/logo/logo.png"
            alt="HIMPENAS Logo"
            width={120}
            height={120}
            priority
          />
          <h1 className="mt-6 text-4xl font-bold font-heading">HIMPENAS</h1>
          <p className="mt-2 text-lg text-emerald-200">
            Selamat Datang di Panel Administrator
          </p>
        </motion.div>

        {/* Kolom Kanan - Form Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden text-center mb-8">
              <Image
                src="/logo/logo.png"
                alt="HIMPENAS Logo"
                width={80}
                height={80}
                className="mx-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
              Admin Login
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Silakan masuk untuk melanjutkan
            </p>

            <form id="login-form" onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Input Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  required
                  className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 pl-10 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0"
                  placeholder="Email"
                  autoComplete="email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-10 top-3 origin-[0] -translate-y-5 scale-75 transform bg-gray-50 px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark"
                >
                  Alamat Email
                </label>
              </div>

              {/* Input Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 pl-10 placeholder-transparent focus:border-emerald-dark focus:outline-none focus:ring-0"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-10 top-3 origin-[0] -translate-y-5 scale-75 transform bg-gray-50 px-1 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-emerald-dark"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-emerald-dark"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-700">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-emerald-dark px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
