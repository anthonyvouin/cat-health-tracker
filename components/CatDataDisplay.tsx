import React from 'react';
import { Utensils, Stethoscope, Scale, Scissors, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CatData } from '@/types/CatData';

  interface CatDataDisplayProps {
    catData: CatData;
    onUpdateClick: (field: string) => void;
  }

const CatDataDisplay = ({ catData, onUpdateClick }: CatDataDisplayProps) => {
  const dataItems = [
    { icon: Utensils, title: 'Last Meal', value: catData.lastMeal, field: 'lastMeal' },
    { icon: Stethoscope, title: 'Last Vet Appointment', value: catData.lastVetAppointment, field: 'lastVetAppointment' },
    { icon: Scale, title: 'Weight', value: catData.weight ? `${catData.weight} kg` : 'No data', field: 'weight' },
    { icon: Scissors, title: 'Last Grooming', value: catData.lastGrooming, field: 'lastGrooming' },
    { icon: Pill, title: 'Last Medication', value: catData.lastMedication, field: 'lastMedication' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dataItems.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <item.icon className="mr-2" />
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{item.value || 'No data'}</p>
            <Button onClick={() => onUpdateClick(item.field)} variant="outline">
              Update
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CatDataDisplay;