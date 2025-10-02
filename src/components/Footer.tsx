// src/components/Footer.tsx (Versi Final dengan Ikon)
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 font-sans">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          {/* Kolom 1: Branding */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image src="/logo/logo.png" alt="Logo HIMPENAS" width={40} height={40} className="rounded-full" />
              <span className="font-bold text-2xl text-white">HIMPENAS</span>
            </Link>
            <p className="text-gray-400 text-sm">Wadah kreativitas mahasiswa</p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4 border-b-2 border-emerald-himp pb-2 inline-block">Navigasi</h3>
            <ul className="space-y-3 text-base">
              <li><Link href="#berita" className="hover:text-emerald-light transition-colors">Berita</Link></li>
              <li><Link href="#event" className="hover:text-emerald-light transition-colors">Event</Link></li>
              <li><Link href="#galeri" className="hover:text-emerald-light transition-colors">Galeri</Link></li>
              <li><Link href="#visi-misi" className="hover:text-emerald-light transition-colors">Visi & Misi</Link></li>
              <li><Link href="#tentang" className="hover:text-emerald-light transition-colors">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="hover:text-emerald-light transition-colors">Kontak</Link></li>
              
            </ul>
          </div>

          {/* Kolom 3: Hubungi Kami */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4 border-b-2 border-emerald-himp pb-2 inline-block">Hubungi Kami</h3>
            <ul className="space-y-3 text-base">
              <li>
                <a href="mailto:info@himpenas.org" className="flex items-center justify-center md:justify-start hover:text-emerald-light transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  info@himpenas.org
                </a>
              </li>
              <li>
                <div className="flex items-center justify-center md:justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Gedung A, Kampus Kita
                </div>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media (INI BAGIAN YANG DIPERBAIKI) */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4 border-b-2 border-emerald-himp pb-2 inline-block">Sosial Media</h3>
            <div className="flex space-x-4 justify-center md:justify-start mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} HIMPENAS. All rights reserved.</p>
          <p className="mt-2">Didesain dengan <span className="text-red-500">♥</span> oleh tim HIMPENAS.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;