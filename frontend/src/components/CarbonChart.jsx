'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function CarbonChart({ trendData }) {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] bg-slate-900/30 border border-slate-800 rounded-2xl p-6 text-slate-500">
        No recent activities logged to generate trends.
      </div>
    );
  }

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl">
          <p className="text-sm font-bold text-slate-200 mb-2">{label}</p>
          {payload.map((entry) => (
            <div key={entry.name} className="flex justify-between items-center gap-4 text-xs">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-semibold text-slate-100">{entry.value.toFixed(1)} kg CO₂</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl h-[400px] w-full">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">Emissions Trend (Past 7 Days)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              fontSize={12}
              formatter={(value) => <span className="text-xs text-slate-400 font-medium capitalize">{value}</span>}
            />
            <Bar dataKey="transport" name="Transport" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
            <Bar dataKey="energy" name="Energy (Power/Water)" stackId="a" fill="#38bdf8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="food" name="Food" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
            <Bar dataKey="waste" name="Waste" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
