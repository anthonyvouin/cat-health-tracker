'use client';
import React, { useState } from 'react';
import PetSelector from '@/components/PetSelector';
import PetInfo from '@/components/PetInfo';
import CatHealthTracker from '@/components/CatHealthTracker';
import { Pet } from '@/types/Pet';

export default function Home() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PetSelector onPetSelect={(pet: Pet | null) => handlePetSelect(pet as Pet)} />
      {selectedPet && (
        <>
          <PetInfo pet={selectedPet} />
          <CatHealthTracker
            key={selectedPet.id}
            petName={selectedPet.name}
            petId={selectedPet.id}
          />
        </>
      )}
    </main>
  );
}