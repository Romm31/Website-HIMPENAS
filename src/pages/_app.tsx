// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-quill/dist/quill.snow.css";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "@/components/LoadingScreen";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  // Handle initial load
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
      setShowContent(false);
    };

    const handleRouteChangeComplete = () => {
      // Small delay to show loading screen
      setTimeout(() => {
        handleLoadingComplete();
      }, 100);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <title>HIMPENAS - Himpunan Pengolahan Sawit</title>
        <meta name="description" content="Portal resmi Himpunan Pengolahan Sawit (HIMPENAS)" />
        <link rel="icon" href="/logo/logo.png" />
      </Head>

      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}

      {/* Main Content - Only render after loading complete */}
      {showContent && (
        <main className="min-h-screen bg-gray-50 text-gray-900 animate-fadeIn">
          <Component {...pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#046A38",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 16px",
                fontWeight: "500",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#fff",
                  secondary: "#046A38",
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: "#dc2626",
                },
              },
            }}
          />
        </main>
      )}

      {/* Custom Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </SessionProvider>
  );
}

export default MyApp;