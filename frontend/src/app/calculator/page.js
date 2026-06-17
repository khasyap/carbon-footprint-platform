'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import useCarbon from '../../hooks/useCarbon';
import { calculateCarbonEstimate } from '../../utils/carbonCalculator';
import { TRANSPORT_TYPES, FOOD_TYPES } from '../../utils/constants';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { Leaf, Award, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CalculatorPage() {
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const { logNewActivity, loading: logLoading } = useCarbon();
  const router = useRouter();

  const [estimate, setEstimate] = useState({ transport: 0, electricity: 0, water: 0, food: 0, waste: 0, total: 0 });
  const [successResult, setSuccessResult] = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      transportType: 'None',
      distance: 0,
      electricityUnits: 0,
      waterUsage: 0,
      foodType: 'None',
      wasteGenerated: 0
    }
  });

  // Watch inputs individually for live estimation to prevent infinite re-renders
  const transportType = watch('transportType');
  const distance = watch('distance');
  const electricityUnits = watch('electricityUnits');
  const waterUsage = watch('waterUsage');
  const foodType = watch('foodType');
  const wasteGenerated = watch('wasteGenerated');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const calc = calculateCarbonEstimate({
      transportType,
      distance,
      electricityUnits,
      waterUsage,
      foodType,
      wasteGenerated
    });
    setEstimate(calc);
  }, [transportType, distance, electricityUnits, waterUsage, foodType, wasteGenerated]);

  const onSubmit = async (data) => {
    const res = await logNewActivity({
      transportType: data.transportType,
      distance: parseFloat(data.distance) || 0,
      electricityUnits: parseFloat(data.electricityUnits) || 0,
      waterUsage: parseFloat(data.waterUsage) || 0,
      foodType: data.foodType,
      wasteGenerated: parseFloat(data.wasteGenerated) || 0
    });

    if (res.success) {
      setSuccessResult(res.data);
      refreshProfile(); // refresh header points
      reset();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading Calculator..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Carbon Footprint Calculator</h2>
            <p className="text-xs text-slate-400 mt-1">Log your daily or weekly consumption to update your scores.</p>
          </div>

          {successResult ? (
            <div className="bg-slate-900/60 border border-emerald-500/20 p-8 rounded-2xl max-w-2xl mx-auto text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-100">Habits Logged Successfully!</h3>
                <p className="text-sm text-slate-400">Your carbon calculations have been computed and saved.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex items-center justify-around divide-x divide-slate-800">
                <div className="text-center px-4">
                  <span className="block text-2xl font-black text-emerald-400">+{successResult.pointsEarned}</span>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Points Earned</span>
                </div>
                <div className="text-center px-4">
                  <span className="block text-2xl font-black text-slate-200">{successResult.carbonRecord?.totalEmission.toFixed(1)} kg</span>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total CO₂ Output</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSuccessResult(null)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700/50"
                >
                  Log Another Entry
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Form panel */}
              <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
                
                {/* Section 1: Transportation */}
                <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Transportation</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="transportType" className="text-xs font-semibold text-slate-400">Transit Mode</label>
                      <select
                        id="transportType"
                        {...register('transportType')}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      >
                        {TRANSPORT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="distance" className="text-xs font-semibold text-slate-400">Distance Travelled (km)</label>
                      <input
                        id="distance"
                        type="number"
                        step="any"
                        placeholder="0"
                        {...register('distance', { min: 0 })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Home Energy & Water */}
                <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Energy & Water</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="electricityUnits" className="text-xs font-semibold text-slate-400">Electricity Consumed (kWh)</label>
                      <input
                        id="electricityUnits"
                        type="number"
                        step="any"
                        placeholder="0"
                        {...register('electricityUnits', { min: 0 })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="waterUsage" className="text-xs font-semibold text-slate-400">Water Consumption (Litres)</label>
                      <input
                        id="waterUsage"
                        type="number"
                        step="any"
                        placeholder="0"
                        {...register('waterUsage', { min: 0 })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Diet & Waste */}
                <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Diet & Waste</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="foodType" className="text-xs font-semibold text-slate-400">Diet Habit</label>
                      <select
                        id="foodType"
                        {...register('foodType')}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      >
                        {FOOD_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="wasteGenerated" className="text-xs font-semibold text-slate-400">Waste Generated (kg)</label>
                      <input
                        id="wasteGenerated"
                        type="number"
                        step="any"
                        placeholder="0"
                        {...register('wasteGenerated', { min: 0 })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={logLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-3.5 px-6 font-bold text-base rounded-xl transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.99] disabled:opacity-50"
                >
                  {logLoading ? 'Submitting calculations...' : 'Calculate and Save Entry'}
                </button>
              </form>

              {/* Estimation breakdown panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-6 sticky top-24">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Live Carbon Estimate</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Estimated output calculated on input</p>
                  </div>

                  <div className="flex flex-col items-center justify-center py-6 bg-slate-950 border border-slate-900 rounded-xl">
                    <span className="text-4xl font-black text-emerald-400">{estimate.total.toFixed(1)}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Est. kg CO₂ total</span>
                  </div>

                  <div className="space-y-4 divide-y divide-slate-800/40 text-xs">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400 font-semibold">Transport</span>
                      <span className="text-slate-200 font-bold">{estimate.transport.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-400 font-semibold">Electricity</span>
                      <span className="text-slate-200 font-bold">{estimate.electricity.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-400 font-semibold">Water Usage</span>
                      <span className="text-slate-200 font-bold">{(estimate.water || 0).toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-400 font-semibold">Food Habits</span>
                      <span className="text-slate-200 font-bold">{estimate.food.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-400 font-semibold">Waste</span>
                      <span className="text-slate-200 font-bold">{estimate.waste.toFixed(1)} kg</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex items-start gap-2.5">
                    <Compass className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Every low emissions entry rewards you bonus Green Points, helping unlock status achievements.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
