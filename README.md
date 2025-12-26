# HIMPENAS Web

Website resmi Himpunan Pengolahan Sawit (HIMPENAS) - Institut Teknologi Sains Bandung. Aplikasi ini berfungsi sebagai portal informasi organisasi yang menyediakan manajemen konten untuk berita, event, galeri, alumni, dan profil organisasi dengan panel administrasi terintegrasi.

## Latar Belakang

Organisasi kemahasiswaan memerlukan platform digital yang dapat mengelola dan menyajikan informasi secara terstruktur kepada anggota dan publik. Website ini dibangun untuk mengatasi kebutuhan tersebut dengan menyediakan:

- Sistem manajemen konten yang mudah digunakan oleh pengurus
- Tampilan publik yang informatif dan responsif
- Pengelolaan data alumni lintas angkatan
- Dokumentasi kegiatan dalam bentuk galeri multimedia

Pemilihan teknologi Next.js dengan Pages Router memungkinkan pengembangan full-stack dalam satu codebase, sementara Prisma ORM mempermudah interaksi dengan database PostgreSQL secara type-safe.

## Fitur Utama

### Autentikasi

- Login admin dengan email dan password
- Proteksi brute force dengan lockout mechanism berdasarkan IP
- JWT-based session management
- Middleware untuk proteksi route admin

### Manajemen Konten

- **Berita**: CRUD berita dengan kategorisasi, WYSIWYG editor (React-Quill), upload gambar
- **Event**: Pengelolaan agenda kegiatan dengan tanggal, lokasi, dan deskripsi
- **Galeri**: Album foto dan video dengan media items
- **Slide**: Manajemen banner/slideshow halaman utama

### Halaman Publik

- Beranda dengan slideshow dan highlight konten
- Daftar berita dengan filter kategori dan pencarian
- Kalender event (mendatang dan arsip)
- Galeri multimedia dengan filter tipe media
- Visi Misi organisasi
- Profil dan struktur organisasi
- Daftar alumni per angkatan

### Dashboard Admin

- Statistik overview (total berita, event, galeri, dll)
- Manajemen user admin
- Manajemen kategori berita
- Upload file dengan preview
- Editor konten WYSIWYG
- Manajemen data alumni dan angkatan

## Teknologi yang Digunakan

| Kategori         | Teknologi                 | Versi   |
| ---------------- | ------------------------- | ------- |
| Framework        | Next.js (Pages Router)    | 16.1.1  |
| UI Library       | React                     | 18.3.1  |
| Styling          | Tailwind CSS              | 3.4.x   |
| Database ORM     | Prisma                    | 5.14.0+ |
| Database         | PostgreSQL                | -       |
| Animation        | Framer Motion             | 12.x    |
| Icons            | Lucide React, React Icons | -       |
| Rich Text Editor | React-Quill               | 0.0.2   |
| Auth             | Custom JWT (jose)         | -       |
| Type Checking    | TypeScript                | 5.x     |

## Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    Next.js Application                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Pages (SSR/SSG)                      ││
│  │  - Public Pages (berita, event, galeri, tentang, dll)   ││
│  │  - Admin Pages (dashboard, CRUD operations)             ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    API Routes                           ││
│  │  - /api/auth/* (login, session)                         ││
│  │  - /api/admin/* (CRUD operations)                       ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Middleware                           ││
│  │  - JWT Verification                                     ││
│  │  - Route Protection                                     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                     Prisma ORM                               │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   PostgreSQL Database                        │
└─────────────────────────────────────────────────────────────┘
```

### Alur Data

1. Request dari browser diterima oleh Next.js
2. Middleware memvalidasi JWT untuk route yang diproteksi
3. Pages menggunakan `getServerSideProps` untuk data fetching
4. API Routes menangani operasi CRUD
5. Prisma ORM mengeksekusi query ke PostgreSQL
6. Response dikembalikan dalam format JSON atau rendered HTML

## Persyaratan Sistem

- Node.js >= 18.x
- npm >= 9.x atau pnpm
- PostgreSQL >= 14.x
- Git

## Instalasi dan Setup

### 1. Clone Repository

```bash
git clone https://github.com/Romm31/Website-HIMPENAS.git
cd Website-HIMPENAS
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

Catatan: Flag `--legacy-peer-deps` diperlukan karena beberapa dependency memiliki peer dependency conflicts.

### 3. Setup Environment Variables

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Kemudian sesuaikan nilai variabel.

### 4. Migrasi Database

```bash
npx prisma generate
npx prisma db push
```

Untuk development dengan data awal:

```bash
npx prisma db seed
```

### 5. Menjalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/himpenas_db"

# Authentication
JWT_SECRET="your-jwt-secret-key-minimum-32-characters"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

| Variable              | Deskripsi                          |
| --------------------- | ---------------------------------- |
| `DATABASE_URL`        | Connection string PostgreSQL       |
| `JWT_SECRET`          | Secret key untuk signing JWT token |
| `NEXTAUTH_SECRET`     | Secret key untuk NextAuth session  |
| `NEXT_PUBLIC_APP_URL` | Base URL aplikasi                  |

## Scripts yang Tersedia

| Script  | Perintah        | Deskripsi                       |
| ------- | --------------- | ------------------------------- |
| `dev`   | `npm run dev`   | Menjalankan development server  |
| `build` | `npm run build` | Build production dengan Webpack |
| `start` | `npm start`     | Menjalankan production server   |
| `lint`  | `npm run lint`  | Menjalankan ESLint              |

## Build dan Deployment

### Build Production

```bash
npm run build
```

Build menggunakan flag `--webpack` karena Turbopack masih memiliki issues dengan beberapa dependencies.

### Menjalankan Production Build

```bash
npm start
```

### Catatan Deployment

- Pastikan semua environment variables tersedia di environment production
- Database PostgreSQL harus dapat diakses dari server production
- Jalankan `npx prisma generate` sebelum build
- Untuk Vercel: tambahkan build command override jika diperlukan
- Folder `public/` berisi assets statis yang perlu di-serve

## Keamanan

### Validasi Input

- Validasi server-side pada semua API routes
- Sanitasi HTML content dari WYSIWYG editor
- Type checking dengan TypeScript dan Prisma

### Proteksi Autentikasi

- Brute force protection dengan IP-based lockout (maksimal 5 percobaan, lockout 2 jam)
- JWT token dengan expiration
- Middleware proteksi untuk semua route `/admin/*`
- Password hashing dengan bcrypt

### Environment Variables

- Semua secrets disimpan di environment variables
- File `.env` tidak di-commit ke repository
- Gunakan secrets management di production

### Dependency

- Tidak ada vulnerability HIGH atau CRITICAL (verified dengan `npm audit`)
- Dependencies di-update ke versi stabil terbaru

## Struktur Folder

```
himpunan-web/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── public/
│   ├── logo/               # Logo assets
│   ├── header/             # Header background images
│   └── struktur/           # Struktur organisasi images
├── src/
│   ├── components/         # React components
│   ├── lib/                # Utility functions dan Prisma client
│   ├── middleware.ts       # Next.js middleware
│   ├── pages/
│   │   ├── admin/          # Admin panel pages
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   └── admin/      # Admin CRUD endpoints
│   │   ├── berita/         # Public news pages
│   │   ├── galeri/         # Public gallery pages
│   │   └── ...             # Other public pages
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── .env.example            # Environment variables template
├── docker-compose.yml      # Docker configuration for PostgreSQL
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Catatan Pengembangan

### Best Practices

1. **Component Organization**: Pisahkan komponen presentational dan container
2. **API Routes**: Gunakan try-catch untuk error handling yang konsisten
3. **Database Queries**: Gunakan Prisma relations untuk menghindari N+1 queries
4. **Images**: Gunakan Next.js Image component untuk optimasi otomatis
5. **Type Safety**: Definisikan types untuk semua data structures

### Hal yang Perlu Diperhatikan

1. **Build**: Gunakan `--webpack` flag karena Turbopack belum stabil dengan semua dependencies
2. **CSS Imports**: Import Quill CSS dari `quill/dist/quill.snow.css`, bukan dari `react-quill`
3. **Multiline className**: Hindari multiline string dalam className JSX (gunakan template literals atau single line)
4. **Legacy Peer Deps**: Beberapa packages memerlukan `--legacy-peer-deps` saat install
5. **Prisma Client**: Regenerate Prisma client setelah perubahan schema

### Database Schema Updates

```bash
# Setelah mengubah schema.prisma
npx prisma generate
npx prisma db push    # Development
npx prisma migrate dev --name migration_name  # Dengan migration
```

## Docker (Development)

File `docker-compose.yml` tersedia untuk menjalankan PostgreSQL secara lokal:

```bash
docker-compose up -d
```

## Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk detail lengkap.

---
