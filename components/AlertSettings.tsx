import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AlertSettingsProps {
  onSave: (settings: { [key: string]: string }) => void;
}

const AlertSettings = ({ onSave }: AlertSettingsProps) => {
  const [settings, setSettings] = useState<{ [key: string]: string }>({
    feedingInterval: '8', // in hours
    vetAppointmentInterval: '6', // in months
    groomingInterval: '30', // in days
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('alertSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alertSettings', JSON.stringify(settings));
    }
    onSave(settings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="feedingInterval" className="block mb-2">Feeding Interval (hours):</label>
            <Input
              type="number"
              id="feedingInterval"
              name="feedingInterval"
              value={settings.feedingInterval}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="vetAppointmentInterval" className="block mb-2">Vet Appointment Interval (months):</label>
            <Input
              type="number"
              id="vetAppointmentInterval"
              name="vetAppointmentInterval"
              value={settings.vetAppointmentInterval}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="groomingInterval" className="block mb-2">Grooming Interval (days):</label>
            <Input
              type="number"
              id="groomingInterval"
              name="groomingInterval"
              value={settings.groomingInterval}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
