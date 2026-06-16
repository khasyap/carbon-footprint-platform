'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import useGoals from '../../hooks/useGoals';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import GoalCard from '../../components/GoalCard';
import { Target, AlertCircle, Plus, Sparkles } from 'lucide-react';

export default function GoalsPage() {
  const { user, loading: authLoading } = useAuth();
  const { goals, loading: goalsLoading, error, fetchGoals, addNewGoal, removeGoal } = useGoals();
  const router = useRouter();

  const [targetVal, setTargetVal] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchGoals();
    }
  }, [user, authLoading, router, fetchGoals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const parsed = parseFloat(targetVal);
    if (!parsed || parsed <= 0) {
      setFormError('Please enter a valid target budget emission value greater than 0');
      return;
    }

    const res = await addNewGoal(parsed);
    if (res.success) {
      setTargetVal('');
    } else {
      setFormError(res.message);
    }
  };

  if (authLoading || (user && goalsLoading && goals.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading Carbon Budgets..." />
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
            <h2 className="text-xl font-bold text-slate-100">Carbon Budgets & Goals</h2>
            <p className="text-xs text-slate-400 mt-1">Set limit thresholds. Your score progress will update dynamically based on logging date ranges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form to create a new budget goal */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-5 sticky top-24">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Set New Carbon Budget</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Define your target emission budget limit (kg CO₂)</p>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-800/30 text-rose-400 text-xs px-3.5 py-2 rounded-lg">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Budget Value (kg)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 200"
                      value={targetVal}
                      onChange={(e) => setTargetVal(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                  >
                    Create Budget Goal
                  </button>
                </form>

                <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Goal calculations measure all emissions logged starting from the goal creation timestamp.
                  </p>
                </div>
              </div>
            </div>

            {/* List active goals */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Budgets</h3>
              
              {error && (
                <div className="bg-rose-950/30 border border-rose-800/30 text-rose-400 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {goals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {goals.map((g) => (
                    <GoalCard key={g._id} goal={g} onDelete={removeGoal} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl">
                  <Target className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-300">No Carbon Budgets Configured</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Keep your emissions low by scheduling budget targets on the left form dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
