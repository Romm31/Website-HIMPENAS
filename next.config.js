/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile packages that have CSS imports or aren't fully ESM compatible
  transpilePackages: ['react-quill'],
  images: {
    // Updated untuk Next.js 16: domains deprecated, gunakan remotePatterns
    remotePatterns: [
      // Tambahkan domain eksternal jika ada
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/**',
      // },
    ],
  },
}
module.exports = nextConfig