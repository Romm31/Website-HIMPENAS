import React from 'react';
import Image from 'next/image';

interface TeamCardProps {
  imageUrl: string;
  name: string;
  role: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ imageUrl, name, role }) => {
  return (
    <div className="text-center bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 card-hover-effect">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src={imageUrl}
          alt="" // <-- PERUBAHAN DI SINI: Ganti 'name' menjadi string kosong
          layout="fill"
          objectFit="cover"
          className="rounded-full border-4 border-emerald-himp"
        />
      </div>
      <h3 className="text-xl font-bold font-heading text-gray-800">{name}</h3>
      <p className="text-emerald-himp font-semibold">{role}</p>
    </div>
  );
};

export default TeamCard;