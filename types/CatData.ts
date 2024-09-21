import { Pet } from './Pet';

export interface CatData {
    petId: Pet['id'];
    lastMeal: string;
    lastVetAppointment: string;
    weight: string;
    lastGrooming: string;
    lastMedication: string;
}

export interface WeightEntry {
    date: string;
    weight: number;
}