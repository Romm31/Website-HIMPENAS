// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Berita', href: '/berita' },
    { name: 'Event', href: '/event' },
    { name: 'Visi & Misi', href: '/#visi-misi' },
    { name: 'Tentang Kami', href: '/tentang' },
     { name: 'Gallery', href: '/Gallery' },
  ];

  const navbarClasses = `
    sticky top-0 z-50 text-white font-sans
    transition-all duration-300 ease-in-out
    bg-emerald-himp
    ${isScrolled ? 'shadow-lg py-3' : 'py-5'}
  `;

  const logoSize = isScrolled ? 40 : 48;
  const textSize = isScrolled ? 'text-xl' : 'text-2xl';

  return (
    <header className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
        {/* Logo + Nama */}
        <Link
          href="/"
          className="flex items-center space-x-3 transform transition-transform duration-300 hover:scale-105 hover:drop-shadow-lg"
        >
          <Image
            src="/logo/logo.png"
            alt="Logo HIMPENAS"
            width={logoSize}
            height={logoSize}
            className="rounded-full transition-all duration-300"
          />
          <span
            className={`font-bold tracking-wide transition-all duration-300 ${textSize} text-white`}
          >
            HIMPENAS
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6 lg:space-x-10 text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative hover:text-green-200 transition-colors group ${
                router.pathname === link.href ? 'text-green-200 font-semibold' : 'text-white'
              }`}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          ))}
        </nav>

        {/* Toggle Button (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            className="text-white hover:text-green-200 transition-colors"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-himp shadow-inner pb-4">
          <nav className="flex flex-col items-center space-y-4 py-4 text-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`hover:text-green-200 transition-colors ${
                  router.pathname === link.href ? 'text-green-200 font-semibold' : 'text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
