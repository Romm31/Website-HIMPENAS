import React from 'react';

const ShapeDivider: React.FC = () => {
  return (
    <div className="relative w-full h-20 md:h-28 lg:h-32 overflow-hidden leading-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        <polygon
          points="1200 0 0 120 0 0 1200 0"
          fill="#f9fafb" // warna abu muda (bg-gray-50)
        />
      </svg>
    </div>
  );
};

export default ShapeDivider;
