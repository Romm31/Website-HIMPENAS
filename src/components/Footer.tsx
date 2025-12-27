// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube, ChevronRight, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: 'Berita', href: '/berita' },
    { name: 'Event', href: '/event' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Visi & Misi', href: '/visi-misi' },
    { name: 'Tentang Kami', href: '/tentang' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/himpenas_itsb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', color: 'hover:text-pink-400' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-400 font-sans overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="#f9fafb" opacity="0.05"></path>
        </svg>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-himp/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-dark/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto py-16 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Kolom 1: Branding */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <Image 
                  src="/logo/logo.png" 
                  alt="Logo HIMPENAS" 
                  width={50} 
                  height={50} 
                  className="rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
                />
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold text-3xl text-white group-hover:text-emerald-300 transition-colors duration-300">
                HIMPENAS
              </span>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              Himpunan Pengolahan Sawit - Wadah kreativitas dan inovasi mahasiswa untuk masa depan yang lebih baik.
            </p>
            
            {/* Achievement Highlights */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-emerald-himp/10 transition-all duration-300 group border border-gray-800 hover:border-emerald-himp/30">
                <div className="text-2xl font-bold text-emerald-400 mb-1 group-hover:scale-110 transition-transform">
                  500+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Anggota</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-emerald-himp/10 transition-all duration-300 group border border-gray-800 hover:border-emerald-himp/30">
                <div className="text-2xl font-bold text-emerald-400 mb-1 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Event</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-emerald-himp/10 transition-all duration-300 group border border-gray-800 hover:border-emerald-himp/30">
                <div className="text-2xl font-bold text-emerald-400 mb-1 group-hover:scale-110 transition-transform">
                  10+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Prestasi</div>
              </div>
            </div>

            {/* Tagline */}
            <div className="mt-6 px-4 py-3 bg-gradient-to-r from-emerald-900/20 to-transparent rounded-lg border-l-4 border-emerald-himp">
              <p className="text-sm text-gray-300 italic">
                "Bersama Membangun Masa Depan yang Berkelanjutan"
              </p>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-white text-xl mb-6 relative inline-block">
              Navigasi
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-emerald-himp rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center text-gray-400 hover:text-emerald-300 transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Hubungi Kami */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-white text-xl mb-6 relative inline-block">
              Hubungi Kami
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-emerald-himp rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:himpenas@gmail.com" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-emerald-300 transition-colors duration-300"
                >
                  <div className="p-2 bg-gray-800 rounded-lg mr-3 group-hover:bg-emerald-himp/20 transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">himpenas@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="group flex items-center justify-center md:justify-start text-gray-400">
                  <div className="p-2 bg-gray-800 rounded-lg mr-3 group-hover:bg-emerald-himp/20 transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Kota Deltamas Lot-A1 CBD,<br/>Jl. Ganesha Boulevard No.1 Blok A,<br/>Pasirranji, Kec. Cikarang Pusat,<br/>Kabupaten Bekasi, Jawa Barat</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-white text-xl mb-6 relative inline-block">
              Sosial Media
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-emerald-himp rounded-full"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Ikuti kami di media sosial untuk update terbaru
            </p>
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.name}
                    href={social.href} 
                    className={`group p-3 bg-gray-800 rounded-xl ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>


          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {currentYear} HIMPENAS. All rights reserved.
            </p>
             
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-emerald-300 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-emerald-300 transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;