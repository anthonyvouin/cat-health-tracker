import { Pet } from '@/types/Pet';
// import PetImage from './PetImage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PetInfoProps {
  pet: Pet;
}

export default function PetInfo({ pet }: PetInfoProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{pet.name}</CardTitle>
        <Badge variant="secondary">{pet.species}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 
            <PetImage 
              imageUrl={pet.imageUrl} 
              name={pet.name} 
              className="w-full h-48 object-cover rounded-md"
            />
        */}
          <p className="text-sm text-muted-foreground">Âge: {pet.age} ans</p>
        </div>
      </CardContent>
    </Card>
  );
}