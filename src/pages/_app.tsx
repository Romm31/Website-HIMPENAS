// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import "react-quill/dist/quill.snow.css";
import { Toaster } from "react-hot-toast";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <title>Dashboard Admin HIMPENAS</title>
      </Head>

      <main className="min-h-screen bg-gray-50 text-gray-900">
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#046A38",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 16px",
            },
          }}
        />
      </main>
    </SessionProvider>
  );
}

export default MyApp;
