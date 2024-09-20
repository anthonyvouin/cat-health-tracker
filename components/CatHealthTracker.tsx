"use client";

import React, { useState, useEffect } from 'react';
import CatDataDisplay from './CatDataDisplay';
import CatDataChart from './CatDataChart';
import ReminderSystem from './ReminderSystem';
import UpdateModal from './UpdateModal';
import { CatData } from '../types/CatData';
import { Pet } from '../types/Pet';

interface CatHealthTrackerProps {
  petId: Pet['id'];
  petName: string;
}

interface WeightEntry {
  date: string;
  weight: number;
}

const CatHealthTracker: React.FC<CatHealthTrackerProps> = ({ petId, petName }) => {
  console.log("CatHealthTracker rendered with petId:", petId);

  const [catData, setCatData] = useState<CatData>(() => ({
    petId,
    lastMeal: '',
    lastVetAppointment: '',
    weight: '',
    lastGrooming: '',
    lastMedication: '',
  }));

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [updateModal, setUpdateModal] = useState<{ isOpen: boolean; field: keyof CatData | null }>({ isOpen: false, field: null });

  useEffect(() => {
    console.log("Loading data for petId:", petId);
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(`catData_${petId}`);
      console.log("Saved data from localStorage:", savedData);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Parsed data:", parsedData);
        setCatData({ ...parsedData, petId }); // Ensure petId is always set
      } else {
        setCatData({
          petId,
          lastMeal: '',
          lastVetAppointment: '',
          weight: '',
          lastGrooming: '',
          lastMedication: '',
        });
      }

      const savedWeights = localStorage.getItem(`weightHistory_${petId}`);
      setWeightHistory(savedWeights ? JSON.parse(savedWeights) : []);
    }
  }, [petId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataToSave = { ...catData, petId };
      console.log("Saving data to localStorage:", dataToSave);
      localStorage.setItem(`catData_${petId}`, JSON.stringify(dataToSave));
    }
  }, [catData, petId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`weightHistory_${petId}`, JSON.stringify(weightHistory));
    }
  }, [weightHistory, petId]);

  useEffect(() => {
    console.log("CatHealthTracker mounted or updated");
  }, []);

  const handleDataUpdate = (newData: Partial<CatData>) => {
    setCatData((prevState) => {
      const updatedData: CatData = {
        ...prevState,
        ...newData,
        petId, // Ensure petId is always included
      };
      console.log("Updating catData:", updatedData);
      return updatedData;
    });
  };

  return (
    <div>
      <h1>{petName}'s Health Tracker (ID: {petId})</h1>
      <CatDataDisplay 
        catData={catData} 
        onUpdateClick={(field: string) => setUpdateModal({ isOpen: true, field: field as keyof CatData })} 
      />
      <CatDataChart weightHistory={weightHistory} />
      {catData.lastMeal || catData.lastVetAppointment || catData.lastGrooming ? (
        <ReminderSystem catData={catData} />
      ) : null}
      {updateModal.isOpen && updateModal.field && (
        <UpdateModal
          field={updateModal.field}
          currentValue={String(catData[updateModal.field])}
          onClose={() => setUpdateModal({ isOpen: false, field: null })}
          onUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
};

export default CatHealthTracker;



