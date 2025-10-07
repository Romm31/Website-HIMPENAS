// src/pages/admin/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,          // <- PENTING: harus "email"
      password,       // <- PENTING: harus "password"
      callbackUrl: "/admin",
    });

    if (res?.ok) {
      router.push("/admin");
    } else {
      setError(res?.error || "Email atau password salah");
    }
  };

  return (
    <>
      <Head>
        <title>Login Admin - HIMPENAS</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-emerald-himp">
        <div className="bg-white text-gray-800 shadow-xl rounded-2xl p-8 w-96">
          <h1 className="text-2xl font-bold text-center mb-6 text-emerald-himp">
            Login Admin
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-himp"
                required
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-himp"
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-himp hover:bg-emerald-light text-white font-semibold py-2 rounded-md transition"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
