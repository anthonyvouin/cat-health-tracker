'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pet } from '@/types/Pet';
import { v4 as uuidv4 } from 'uuid';

interface PetSelectorProps {
  onPetSelect: (pet: Pet | null) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ onPetSelect }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Pet>({ id: '', name: '', species: '', age: 0, imageUrl: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedPets = localStorage.getItem('pets');
    if (storedPets) {
      setPets(JSON.parse(storedPets));
    }
  }, []);

  const handlePetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPetId = event.target.value;
    const pet = pets.find(p => p.name === selectedPetId) || null;
    onPetSelect(pet);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPet(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPet(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const petWithId = { ...newPet, id: uuidv4() };
    const updatedPets = [...pets, petWithId];
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    onPetSelect(petWithId);
    setNewPet({ id: '', name: '', species: '', age: 0, imageUrl: '', type: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {pets.length > 0 ? (
        <Select onValueChange={(value) => handlePetChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un animal" />
          </SelectTrigger>
          <SelectContent>
            {pets.map((pet) => (
              <SelectItem key={pet.name} value={pet.name}>{pet.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p>Aucun animal trouvé.</p>
      )}
      
      <Dialog>
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
              <Input id="name" name="name" value={newPet.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="species">Espèce</Label>
              <Input id="species" name="species" value={newPet.species} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="age">Âge</Label>
              <Input id="age" name="age" type="number" value={newPet.age} onChange={handleInputChange} required min="0" />
            </div>
            <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
            <div className="flex justify-end space-x-2">
              <Button type="submit">Ajouter</Button>
              <Button type="button" variant="outline">Annuler</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetSelector;