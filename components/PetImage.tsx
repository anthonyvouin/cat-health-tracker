import React from 'react';

interface PetImageProps {
  imageUrl: string;
  name: string;
  className?: string;
}

export default function PetImage({ imageUrl, name, className }: PetImageProps) {
  return <img src={imageUrl} alt={name} className={className} />;
}