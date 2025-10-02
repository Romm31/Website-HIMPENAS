import React from 'react';
import Image from 'next/image';

interface TeamCardProps {
  imageUrl: string;
  name: string;
  role: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ imageUrl, name, role }) => {
  return (
    <div className="w-full max-w-[280px] md:max-w-[300px] text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300">
      <div className="relative w-36 h-36 md:w-40 md:h-40 mx-auto mb-4">
        <Image
          src={imageUrl}
          alt="" // hilangin teks di dalam bulatan
          layout="fill"
          objectFit="cover"
          className="rounded-full border-4 border-emerald-himp"
        />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 break-words">{name}</h3>
      <p className="text-emerald-himp font-medium">{role}</p>
    </div>
  );
};

export default TeamCard;
