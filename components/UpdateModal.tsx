import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { CatData } from '../types/CatData';


type CatDataKey = keyof CatData;

interface UpdateModalProps {
  field: CatDataKey | null;
  currentValue: string;
  onClose: () => void;
  onUpdate: (data: Partial<CatData>) => void;
}

const UpdateModal = ({ field, currentValue, onClose, onUpdate }: UpdateModalProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const updatedData: Partial<CatData> = { [field as CatDataKey]: data[field as string]?.toString() };
        onUpdate(updatedData);
      };
    
      const getInputType = (field: CatDataKey) => {
        switch (field) {
          case 'lastMeal':
          case 'lastMedication':
            return 'datetime-local';
          case 'lastVetAppointment':
          case 'lastGrooming':
            return 'date';
          case 'weight':
            return 'number';
          default:
            return 'text';
        }
      };
    
      if (field === null) {
        return null;
      }
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Update {typeof field === 'string' ? field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : ''}
                <Button variant="ghost" onClick={onClose}>
                  <X size={24} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor={field?.toString() || undefined} className="block mb-2">
                    {field !== null ? (field as string).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : ''}
                  </label>
                  <Input 
                    type={getInputType(field)}
                    id={field?.toString() || undefined} 
                    name={field?.toString() || undefined}
                    defaultValue={currentValue}
                    step={field === 'weight' ? '0.1' : undefined}
                  />
                </div>
                <Button type="submit">Update</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
};

export default UpdateModal;
