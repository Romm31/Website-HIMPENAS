import { GetServerSideProps, NextPage } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Users, GraduationCap, Calendar, Award, User, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AlumniPageProps {
  alumni: any;
}

const AlumniPage: NextPage<AlumniPageProps> = ({ alumni }) => {
  if (!alumni) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-700">Data alumni tidak ditemukan.</p>
            <Link href="/tentang#alumni">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
              >
                Kembali ke Daftar Alumni
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO HEADER */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <Link href="/tentang#alumni">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -5 }}
              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 mb-8 group cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm group-hover:shadow-md transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="font-semibold">Kembali ke Daftar Alumni</span>
            </motion.div>
          </Link>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30"></div>
              <Image
                src="/logo/logo.png"
                width={140}
                height={140}
                alt="Logo Himpunan"
                className="relative drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                Alumni {alumni.year}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center mb-4"
          >
            {alumni.program ?? "Program Tidak Ada"}
            {alumni.batch && ` Batch ${alumni.batch}`}
            {alumni.batchYear && ` (${alumni.batchYear})`}
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto rounded-full mb-6"
          />

          {/* Members Count */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-600 font-medium">Total Anggota</p>
                <p className="text-2xl font-bold text-emerald-700">{alumni.members.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* LIST ALUMNI */}
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-4">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                Daftar Alumni
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Anggota Alumni</h2>
          </motion.div>

          {alumni.members.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 text-center"
            >
              <Users size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-semibold text-gray-700">Belum ada data alumni</p>
              <p className="text-gray-500 mt-2">Data alumni untuk tahun ini belum tersedia.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.members.map((member: any, index: number) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                  <div className="p-6">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 group-hover:from-emerald-500 group-hover:to-green-600 transition-all mb-4"
                    >
                      <User className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                      {member.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {member.description || "Tidak ada deskripsi"}
                    </p>

                    {/* Period */}
                    {member.periodStart && member.periodEnd && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                        <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-emerald-700">
                          {member.periodStart} - {member.periodEnd}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover Shimmer Effect */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                  />

                  {/* Decorative Corner */}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 opacity-0 group-hover:opacity-30 transition-opacity"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AlumniPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);

  const alumni = await prisma.alumniYear.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });

  return {
    props: {
      alumni: JSON.parse(JSON.stringify(alumni)),
    },
  };
};