import { useState, useEffect } from 'react';
import { WeightEntry } from '../types/CatData';
const API_URL = '/api';

export function useWeightHistory(petId: string) {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);

  const fetchWeightHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/pets/${petId}/weight-history`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching weight history:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchWeightHistory().then(setWeightHistory);
  }, [petId]);

  useEffect(() => {
    localStorage.setItem(`weightHistory_${petId}`, JSON.stringify(weightHistory));
  }, [weightHistory, petId]);

  const addWeightEntry = async (weight: number) => {
    const newEntry = { date: new Date().toISOString(), weight };
    setWeightHistory([...weightHistory, newEntry]);
    try {
      await fetch(`${API_URL}/pets/${petId}/weight-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(newEntry),
      });
    } catch (error) {
      console.error('Error saving weight history:', error);
    }
  };

  return { weightHistory, addWeightEntry };
}