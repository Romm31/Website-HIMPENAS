// src/components/Layout.tsx
import Navbar from './Navbar';
import Footer from './Footer';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      {/* offset biar konten gak ketabrak navbar */}
      <main className="pt-24 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
