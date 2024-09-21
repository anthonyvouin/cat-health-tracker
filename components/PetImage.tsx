import React from 'react';
import Image from 'next/image';

interface PetImageProps {
  imageUrl: string;
  name: string;
  className?: string;
}

export default function PetImage({ imageUrl, name, className }: PetImageProps) {
  return (
    <div className="relative w-full h-64">
      <Image
        src={imageUrl}
        alt={`Image of ${name}`}
        layout="fill"
        objectFit="cover"
        className={className}
      />
    </div>
  );
}