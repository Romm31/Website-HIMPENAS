import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("lastEmail", email);
        router.push("/admin");
      } else {
        setError(data.message || "Email atau password salah");
        const form = document.getElementById("login-form");
        form?.classList.add("animate-shake");
        setTimeout(() => form?.classList.remove("animate-shake"), 500);
      }
    } catch (err) {
      setError("Terjadi error. Silakan coba lagi.");
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
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-emerald-dark p-12 text-white text-center"
        >
          <Image src="/logo/logo.png" alt="HIMPENAS Logo" width={120} height={120} priority />
          <h1 className="mt-6 text-4xl font-bold">HIMPENAS</h1>
          <p className="mt-2 text-lg text-emerald-200">Selamat Datang di Panel Administrator</p>
        </motion.div>

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

            <form id="login-form" onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  required
                  className="peer block w-full rounded-md border border-gray-300 px-3 py-3 pl-10"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer block w-full rounded-md border border-gray-300 px-3 py-3 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-emerald-dark px-4 py-3 text-white"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Masuk"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
