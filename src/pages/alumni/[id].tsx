import { GetServerSideProps, NextPage } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Users, GraduationCap } from "lucide-react";

interface AlumniPageProps {
  alumni: any;
}

const AlumniPage: NextPage<AlumniPageProps> = ({ alumni }) => {
  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data alumni tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <section className="pt-32 pb-16 bg-white text-center relative">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo/logo.png"
            width={160}
            height={160}
            alt="Logo Himpunan"
            className="drop-shadow-lg"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {alumni.program ?? "Program Tidak Ada"} Batch {alumni.batch ?? "-"} Tahun{" "}
          {alumni.batchYear ?? "-"}
        </h1>

        {/* SUBTITLE */}
        <p className="text-lg text-gray-600 font-medium">Alumni {alumni.year}</p>

        {/* MEMBERS COUNT */}
        <div className="flex justify-center items-center gap-2 mt-3 text-gray-600">
          <Users size={18} />
          <span>{alumni.members.length} anggota alumni</span>
        </div>

        <div className="w-full h-16 bg-gradient-to-b from-white to-gray-50 absolute bottom-0 left-0"></div>
      </section>

      {/* LIST ALUMNI */}
      <main className="flex-grow pt-6 pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <GraduationCap className="text-emerald-himp" /> Daftar Alumni
          </h2>

          {alumni.members.length === 0 ? (
            <p className="text-gray-500">Belum ada data alumni untuk tahun ini.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alumni.members.map((member: any) => (
                <div
                  key={member.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  {/* NAME */}
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mt-1">
                    {member.description || "Tidak ada deskripsi"}
                  </p>

                  {/* PERIOD (NEW) */}
                  {member.periodStart && member.periodEnd && (
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                      {" "}
                      <span className="text-gray-700">
                        {member.periodStart} - {member.periodEnd}
                      </span>
                    </p>
                  )}
                </div>
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
