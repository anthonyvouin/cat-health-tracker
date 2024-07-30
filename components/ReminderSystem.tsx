import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ReminderSystemProps {
  catData: { lastMeal: string; lastVetAppointment: string; lastGrooming: string; };
}

const ReminderSystem = ({ catData }: ReminderSystemProps) => {
  const generateReminders = () => {
    const reminders = [];
    const currentDate = new Date();

    if (catData.lastMeal) {
      const lastMealDate = new Date(catData.lastMeal);
      const hoursSinceLastMeal = (Number(currentDate) - Number(lastMealDate)) / (1000 * 60 * 60);
      if (hoursSinceLastMeal > 8) {
        reminders.push("It's been over 8 hours since the last meal. Time to feed your cat!");
      }
    }

    if (catData.lastVetAppointment) {
      const lastVetDate = new Date(catData.lastVetAppointment);
      const monthsSinceLastVet = (Number(currentDate) - Number(lastVetDate)) / (1000 * 60 * 60 * 24 * 30);
      if (monthsSinceLastVet > 6) {
        reminders.push("It's been over 6 months since the last vet appointment. Consider scheduling a check-up.");
      }
    }

    if (catData.lastGrooming) {
      const lastGroomingDate = new Date(catData.lastGrooming);
      const daysSinceLastGrooming = (Number(currentDate) - Number(lastGroomingDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastGrooming > 30) {
        reminders.push("It's been over a month since the last grooming session. Your cat might need some brushing!");
      }
    }

    return reminders;
  };

  const sendNotification = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification('Cat Health Reminder', { body: message });
    }
  };

  useEffect(() => {
    const reminders = generateReminders();
    reminders.forEach(reminder => {
      sendNotification(reminder);
    });
  }, [catData]);

  const reminders = generateReminders();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          reminders.map((reminder, index) => (
            <Alert key={index} className="mb-2">
              <AlertTitle>Reminder</AlertTitle>
              <AlertDescription>{reminder}</AlertDescription>
            </Alert>
          ))
        ) : (
          <p>No reminders at this time.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderSystem;

