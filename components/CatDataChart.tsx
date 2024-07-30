import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightEntry {
  date: string;
  weight: number;
}

interface CatDataChartProps {
  weightHistory: WeightEntry[];
}

const CatDataChart = ({ weightHistory }: CatDataChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-72">
          {/* ResponsiveContainer ensures the chart is responsive */}
          <ResponsiveContainer>
            <LineChart data={weightHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()} 
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatDataChart;
