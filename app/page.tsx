'use client';
import React, { useState } from 'react';
import PetSelector from '@/components/PetSelector';
import PetInfo from '@/components/PetInfo';
import CatHealthTracker from '@/components/CatHealthTracker';
import { Pet } from '@/types/Pet';

export default function Home() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handlePetSelect = (pet: Pet | null) => {
    setSelectedPet(pet);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PetSelector onPetSelect={handlePetSelect} />
      {selectedPet && <PetInfo pet={selectedPet} />}
      {selectedPet && <CatHealthTracker />}
    </main>
  );
}