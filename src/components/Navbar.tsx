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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Berita', href: '/berita' },
    { name: 'Event', href: '/event' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Visi & Misi', href: '/visi-misi' },
    { name: 'Tentang Kami', href: '/tentang' },
  ];

  const navbarClasses = `
    fixed top-0 left-0 w-full z-50 font-sans
    transition-all duration-500 ease-in-out
    bg-emerald-himp text-white
    ${isScrolled 
      ? 'backdrop-blur-md shadow-2xl py-3' 
      : 'backdrop-blur-sm py-5'
    }
  `;

  const logoSize = isScrolled ? 40 : 50;

  return (
    <header className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8">
        {/* Logo + Nama dengan efek glow */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative">
            <Image
              src="/logo/logo.png"
              alt="Logo HIMPENAS"
              width={logoSize}
              height={logoSize}
              className="rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-green-400/20 blur-lg scale-0 group-hover:scale-150 transition-transform duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className={`font-bold tracking-wide text-white transition-all duration-300 group-hover:text-green-200 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
              HIMPENAS
            </span>
            {!isScrolled && (
              <span className="text-xs text-green-200/80 font-light tracking-wider">
                Himpunan Mahasiswa
              </span>
            )}
          </div>
        </Link>

        {/* Menu Desktop dengan hover effects */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link, index) => {
            const isActive = router.pathname === link.href;
            
            // Icon untuk setiap menu dengan animasi
            const getIcon = (name: string) => {
              const iconClass = `w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`;
              switch(name) {
                case 'Home':
                  return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  );
                case 'Berita':
                  return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  );
                case 'Event':
                  return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  );
                case 'Galeri':
                  return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  );
                case 'Visi & Misi':
                  return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  );
                case 'Tentang Kami':
                  return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  );
                default:
                  return null;
              }
            };

            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative group px-4 py-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className={`
                  relative z-10 text-base lg:text-lg font-medium
                  transition-all duration-300 flex items-center gap-2
                  ${isActive 
                    ? 'text-green-200' 
                    : 'text-white group-hover:text-green-200'
                  }
                `}>
                  {getIcon(link.name)}
                  {link.name}
                </span>
                
                {/* Underline animation */}
                <span className={`
                  absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-300 to-emerald-400
                  transform transition-all duration-300 origin-left
                  ${isActive 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                  }
                `}></span>
                
                {/* Background hover effect */}
                <span className="
                  absolute inset-0 rounded-lg bg-white/5
                  transform scale-0 group-hover:scale-100
                  transition-transform duration-300
                "></span>

                {/* Active indicator glow */}
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-green-300/20 animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger Button dengan animasi */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden relative w-10 h-10 flex items-center justify-center
                     text-white hover:text-green-200 transition-colors duration-300
                     focus:outline-none group"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`
              block h-0.5 w-full bg-current rounded-full
              transition-all duration-300 origin-left
              ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}
            `}></span>
            <span className={`
              block h-0.5 w-full bg-current rounded-full
              transition-all duration-300
              ${isMenuOpen ? 'opacity-0 translate-x-3' : ''}
            `}></span>
            <span className={`
              block h-0.5 w-full bg-current rounded-full
              transition-all duration-300 origin-left
              ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}
            `}></span>
          </div>
        </button>
      </div>

      {/* Menu Mobile dengan slide animation */}
      <div className={`
        md:hidden overflow-hidden transition-all duration-500 ease-in-out
        ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="bg-emerald-himp shadow-inner">
          <nav className="flex flex-col py-4">
            {navLinks.map((link, index) => {
              const isActive = router.pathname === link.href;
              
              // Icon untuk mobile menu dengan animasi
              const getIcon = (name: string) => {
                const iconClass = `w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 text-green-300' : ''}`;
                switch(name) {
                  case 'Home':
                    return (
                      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    );
                  case 'Berita':
                    return (
                      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    );
                  case 'Event':
                    return (
                      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    );
                  case 'Galeri':
                    return (
                      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    );
                  case 'Visi & Misi':
                    return (
                      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    );
                  case 'Tentang Kami':
                    return (
                      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    );
                  default:
                    return null;
                }
              };
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    relative px-8 py-4 text-lg font-medium
                    transition-all duration-300
                    flex items-center gap-3
                    ${isActive 
                      ? 'text-green-200 bg-white/10 pl-12' 
                      : 'text-white hover:text-green-200 hover:bg-white/5 hover:pl-10'
                    }
                  `}
                  style={{
                    animation: isMenuOpen ? `slideIn 0.3s ease-out ${index * 50}ms both` : 'none'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {/* Left accent bar for active */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-300"></span>
                  )}
                  
                  {getIcon(link.name)}
                  <span className="flex-1">{link.name}</span>
                  
                  {/* Arrow indicator */}
                  <svg 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  
                  {/* Border bottom */}
                  {index < navLinks.length - 1 && (
                    <span className="absolute bottom-0 left-8 right-8 h-px bg-white/10"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;