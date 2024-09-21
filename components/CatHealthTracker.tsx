"use client";

import React, { useState } from 'react';
import CatDataDisplay from './CatDataDisplay';
import CatDataChart from './CatDataChart';
import ReminderSystem from './ReminderSystem';
import UpdateModal from './UpdateModal';
import { usePetData } from '../hooks/usePetData';
import { useWeightHistory } from '../hooks/useWeightHistory';
import { CatData } from '../types/CatData';
import { Pet } from '../types/Pet';

interface CatHealthTrackerProps {
  petId: Pet['id'];
  petName: string;
}

const CatHealthTracker: React.FC<CatHealthTrackerProps> = ({ petId, petName }) => {
  const stringPetId = petId.toString();
  const { catData, updateCatData, deletePet } = usePetData(stringPetId);
  const { weightHistory, addWeightEntry } = useWeightHistory(stringPetId);
  const [updateModal, setUpdateModal] = useState<{ isOpen: boolean; field: keyof CatData | null }>({ isOpen: false, field: null });

  const handleDataUpdate = async (newData: Partial<CatData>) => {
    await updateCatData(newData);
    if (newData.weight) {
      await addWeightEntry(parseFloat(newData.weight));
    }
  };

  const handleDeletePet = async () => {
    if (window.confirm(`Are you sure you want to delete ${petName}? This action cannot be undone.`)) {
      const success = await deletePet();
      if (success) {
        window.location.href = '/';
      } else {
        alert('Failed to delete pet. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>{petName} Health Tracker (ID: {petId})</h1>
      <button onClick={handleDeletePet} className="bg-red-500 text-white px-4 py-2 rounded">Delete Pet</button>
      {catData && (
        <CatDataDisplay 
          catData={catData} 
          onUpdateClick={(field: string) => setUpdateModal({ isOpen: true, field: field as keyof CatData })} 
        />
      )}
      {weightHistory.length > 0 && <CatDataChart weightHistory={weightHistory} />}
      {catData?.lastMeal || catData?.lastVetAppointment || catData?.lastGrooming ? (
        <ReminderSystem catData={catData} />
      ) : null}
      {updateModal.isOpen && updateModal.field && (
        <UpdateModal
          field={updateModal.field}
          currentValue={String(catData?.[updateModal.field] ?? '')}
          onClose={() => setUpdateModal({ isOpen: false, field: null })}
          onUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
};

export default CatHealthTracker;



