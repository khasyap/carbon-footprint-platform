import React from 'react';
import { Car, Lightbulb, Utensils, Trash2 } from 'lucide-react';

export default function CarbonCard({ stats }) {
  if (!stats) return null;

  const categories = [
    {
      name: 'Transport',
      value: stats.totalTransport || 0,
      icon: Car,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/20 border-amber-800/20'
    },
    {
      name: 'Electricity',
      value: stats.totalElectricity || 0,
      icon: Lightbulb,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/20 border-sky-800/20'
    },
    {
      name: 'Food',
      value: stats.totalFood || 0,
      icon: Utensils,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20 border-emerald-800/20'
    },
    {
      name: 'Waste',
      value: stats.totalWaste || 0,
      icon: Trash2,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/20 border-rose-800/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Carbon Footprint</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-100">{stats.totalEmissions?.toFixed(1) || '0.0'}</span>
          <span className="text-slate-400 text-sm font-semibold">kg CO₂</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className={`p-5 rounded-2xl border ${cat.bgColor} flex flex-col justify-between h-32`}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-slate-300">{cat.name}</span>
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-2xl font-extrabold text-slate-100">{cat.value.toFixed(1)}</span>
                <span className="text-xs text-slate-500 font-semibold">kg</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
