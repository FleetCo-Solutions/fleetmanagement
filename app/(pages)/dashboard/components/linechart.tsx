'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    month: 'Jan',
    delays: 24,
    violations: 26,
    fuelConsumption: 450,
    kmCovered: 1500,
  },
  {
    month: 'Feb',
    delays: 18,
    violations: 8,
    fuelConsumption: 1500,
    kmCovered: 2800,
  },
  // Add more months as needed
  {
    month: 'Mar',
    delays: 24,
    violations: 30,
    fuelConsumption: 480,
    kmCovered: 1600,
  },
  {
    month: 'Apr',
    delays: 22,
    violations: 10,
    fuelConsumption: 1600,
    kmCovered: 3100,
  },
  {
    month: 'May',
    delays: 16,
    violations: 10,
    fuelConsumption: 2400,
    kmCovered: 1000,
  }
];

const Linechart = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="delays"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="violations"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fuelConsumption"
            stroke="#ffc658"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="kmCovered"
            stroke="#ff7300"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linechart;