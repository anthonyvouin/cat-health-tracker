import { useState, useCallback } from 'react';
import { Pet } from '@/types/Pet';

const API_URL = '/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async (): Promise<Pet[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addPet = useCallback(async (pet: Omit<Pet, 'id'>): Promise<Pet | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      if (!response.ok) throw new Error('Failed to add pet');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePet = useCallback(async (id: string, pet: Partial<Pet>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      if (!response.ok) throw new Error('Failed to update pet');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePet = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/pets/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete pet');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchPets, addPet, updatePet, deletePet, loading, error };
}
