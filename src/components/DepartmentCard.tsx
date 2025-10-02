import React from 'react';
import Image from 'next/image';

interface PersonMini {
  name: string;
  imageUrl: string;
}

interface DepartmentCardProps {
  title: string;
  staffCount: number;
  ketua: PersonMini;
  wakil: PersonMini;
  sekretaris: PersonMini;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  title,
  staffCount,
  ketua,
  wakil,
  sekretaris,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-t-4 border-emerald-himp p-6 flex flex-col text-center min-h-[420px] hover:shadow-2xl hover:scale-105 transition-transform duration-300">
      {/* Judul */}
      <h3 className="text-lg md:text-xl font-bold text-emerald-dark mb-6 break-words">{title}</h3>

      {/* Podium Layout */}
      <div className="flex flex-col items-center gap-6 mb-6">
        {/* Ketua */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={ketua.imageUrl}
              alt={ketua.name}
              fill
              sizes="96px"
              className="object-cover border-4 border-emerald-himp rounded-full"
            />
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-2 text-center line-clamp-2">
            {ketua.name}
          </p>
          <p className="text-xs text-gray-500">Ketua</p>
        </div>

        {/* Wakil & Sekretaris */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {[{ person: wakil, role: 'Wakil' }, { person: sekretaris, role: 'Sekretaris' }].map(
            ({ person, role }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    sizes="80px"
                    className="object-cover border-4 border-emerald-himp rounded-full"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-2 text-center line-clamp-2">
                  {person.name}
                </p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <p className="text-sm md:text-base font-bold text-white bg-emerald-himp rounded-full py-1.5 px-4 inline-block">
          Jumlah Staff: {staffCount}
        </p>
      </div>
    </div>
  );
};

export default DepartmentCard;
