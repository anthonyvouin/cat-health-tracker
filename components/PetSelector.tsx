'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Pet } from '@/types/Pet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PetSelectorProps {
  onPetSelect: (pet: Pet | null) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ onPetSelect }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Omit<Pet, 'id'>>({ name: '', species: '', age: 0, imageUrl: '', type: '' });
  const { fetchPets, addPet, loading, error } = useApi();

  useEffect(() => {
    const loadPets = async () => {
      const fetchedPets = await fetchPets();
      setPets(fetchedPets);
    };
    loadPets();
  }, [fetchPets]);

  const handlePetChange = (value: string) => {
    const pet = pets.find(p => p.id === value) || null;
    onPetSelect(pet);
  };

  // Pour annuler 
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addedPet = await addPet(newPet);
    if (addedPet) {
      setPets(prevPets => [...prevPets, addedPet]);
      onPetSelect(addedPet);
      setNewPet({ name: '', species: '', age: 0, imageUrl: '', type: '' });
      setIsDialogOpen(false)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPet(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="space-y-4">
        {pets.length > 0 ? (
          <Select onValueChange={handlePetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un animal" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={String(pet.id)}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>Aucun animal trouvé.</p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un nouvel animal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel animal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name of the pet</Label>
                <Input
                  id="name"
                  name="name"
                  value={newPet.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="species">Espèce</Label>
                <Input
                  id="species"
                  name="species"
                  value={newPet.species}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={newPet.age}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image of the pet</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={newPet.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="submit">Ajouter</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PetSelector;