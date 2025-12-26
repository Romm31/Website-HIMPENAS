import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Loader2, Shield, Sparkles, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Desktop Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-dark via-emerald-himp to-emerald-800 p-12 text-white text-center relative overflow-hidden"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full p-6 shadow-2xl mx-auto">
                <Image
                  src="/logo/logo.png"
                  alt="HIMPENAS Logo"
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full"
              ></motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl font-bold font-heading mb-4"
            >
              HIMPENAS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-emerald-100 mb-8"
            >
              Panel Administrator
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {[
                { icon: Shield, text: "Akses Terlindungi" },
                { icon: Zap, text: "Dashboard Cepat" },
                { icon: CheckCircle, text: "Manajemen Konten" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 justify-center">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-emerald-100">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden bg-gradient-to-br from-emerald-dark to-emerald-himp text-white py-8 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full p-3 shadow-xl mb-3">
                <Image
                  src="/logo/logo.png"
                  alt="HIMPENAS Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold">HIMPENAS</h2>
              <p className="text-sm text-emerald-100">Panel Administrator</p>
            </motion.div>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              {/* Card Container */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-4">
                    <Shield className="w-4 h-4 text-emerald-himp" />
                    <span className="text-sm font-semibold text-emerald-dark uppercase tracking-wide">
                      Admin Access
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Selamat Datang
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Silakan masuk untuk melanjutkan ke dashboard
                  </p>
                </div>

                <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Input Email */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedInput === 'email' ? 'text-emerald-himp' : 'text-gray-400'
                      }`}>
                        <Mail size={20} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-himp focus:outline-none transition-all duration-300 text-gray-900"
                        placeholder="admin@himpenas.org"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Input Password */}
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        focusedInput === 'password' ? 'text-emerald-himp' : 'text-gray-400'
                      }`}>
                        <Lock size={20} />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-himp focus:outline-none transition-all duration-300 text-gray-900"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-himp transition-colors duration-300"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="rounded-xl bg-red-50 border border-red-200 p-4"
                      >
                        <p className="text-sm font-medium text-red-700 text-center">
                          {error}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full bg-gradient-to-r from-emerald-himp to-emerald-dark text-white py-4 rounded-xl font-bold text-lg
                               shadow-lg hover:shadow-xl transition-all duration-300
                               disabled:cursor-not-allowed disabled:opacity-70 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    <span className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={22} />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Dashboard</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </>
  );
}

