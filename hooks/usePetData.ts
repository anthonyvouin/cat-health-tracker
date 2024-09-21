import { useState, useEffect } from 'react';
import { CatData } from '../types/CatData'; // Add this import
const API_URL = '/api';

export function usePetData(petId: string) {
  const [catData, setCatData] = useState<CatData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/pets/${petId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCatData({ ...data, petId });
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchData();
  }, [petId]);

  const updateCatData = async (newData: Partial<CatData>) => {
    const updatedData: CatData = {
      ...catData,
      ...Object.fromEntries(
        Object.entries(newData).filter(([_, value]) => value !== undefined)
      )
    } as CatData;
    setCatData(updatedData);
    try {
      await fetch(`${API_URL}/pets/${petId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error('Error saving pet data:', error);
    }
  };

  const deletePet = async () => {
    try {
      const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return true;
    } catch (error) {
      console.error('Error deleting pet:', error);
      return false;
    }
  };

  return { catData, updateCatData, deletePet };
}