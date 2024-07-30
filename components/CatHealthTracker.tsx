"use client";

import React, { useState, useEffect } from 'react';
import CatDataDisplay from './CatDataDisplay';
import CatDataChart from './CatDataChart';
import ReminderSystem from './ReminderSystem';
import UpdateModal from './UpdateModal';
import CatData from '../lib/CatData';

interface WeightEntry {
  date: string;
  weight: number;
}

const CatTracker = () => {
  const [catData, setCatData] = useState<CatData>({
    lastMeal: '',
    lastVetAppointment: '',
    weight: '',
    lastGrooming: '',
    lastMedication: '',
  });

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [updateModal, setUpdateModal] = useState<{ isOpen: boolean; field: keyof CatData | null }>({ isOpen: false, field: null });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('catData');
      if (savedData) {
        setCatData(JSON.parse(savedData));
      }

      const savedWeights = localStorage.getItem('weightHistory');
      if (savedWeights) {
        setWeightHistory(JSON.parse(savedWeights));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('catData', JSON.stringify(catData));
    }
  }, [catData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
    }
  }, [weightHistory]);

  const handleDataUpdate = (newData: Partial<CatData>) => {

    setCatData((prevState) => {
      const updatedData: CatData = {
        lastMeal: newData.lastMeal ?? prevState.lastMeal,
        lastVetAppointment: newData.lastVetAppointment ?? prevState.lastVetAppointment,
        weight: newData.weight ?? prevState.weight,
        lastGrooming: newData.lastGrooming ?? prevState.lastGrooming,
        lastMedication: newData.lastMedication ?? prevState.lastMedication,
      };

      if (newData.weight) {
        const newWeightEntry: WeightEntry = {
          date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
          weight: parseFloat(newData.weight),
        };
        setWeightHistory((prevHistory) => [...prevHistory, newWeightEntry]);
      }

      return updatedData;
    });
  };

  return (
    <div>
      <h1>Pet Tracker Health System</h1>
      <CatDataDisplay catData={catData} onUpdateClick={(field) => setUpdateModal({ isOpen: true, field })} />
      <CatDataChart weightHistory={weightHistory} />
      {catData.lastMeal || catData.lastVetAppointment || catData.lastGrooming ? (
        <ReminderSystem catData={catData} />
      ) : null}
      {updateModal.isOpen && updateModal.field && (
        <UpdateModal
          field={updateModal.field}
          currentValue={catData[updateModal.field]}
          onClose={() => setUpdateModal({ isOpen: false, field: null })}
          onUpdate={handleDataUpdate}
        />
      )}
    </div>
  );
};

export default CatTracker;



