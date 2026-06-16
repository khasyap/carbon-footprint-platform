'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import * as carbonService from '../../services/carbonService';
import * as aiService from '../../services/aiService';
import * as goalService from '../../services/goalService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import CarbonCard from '../../components/CarbonCard';
import CarbonChart from '../../components/CarbonChart';
import GoalCard from '../../components/GoalCard';
import RecommendationCard from '../../components/RecommendationCard';
import { Sparkles, Trophy, Award, ShieldAlert, Plus, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [dashData, setDashData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [goalsLoading, setGoalsLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await carbonService.getDashboard();
      if (res.success) {
        setDashData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchDashboard();
    }
  }, [user, authLoading, router]);

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const res = await aiService.getRecommendations();
      if (res.success) {
        setAiData(res.data);
      }
    } catch (err) {
      console.error('Error loading AI tips:', err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    setGoalsLoading(true);
    try {
      await goalService.deleteGoal(id);
      await fetchDashboard();
    } catch (err) {
      console.error('Error removing goal:', err.message);
    } finally {
      setGoalsLoading(false);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading EcoCarbon Dashboard..." />
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
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <h2 className="text-xl font-bold text-slate-100">Welcome, {user.name}! 👋</h2>
              <p className="text-xs text-slate-400 mt-1">Here is your carbon footprint analysis and sustainability stats.</p>
            </div>
            
            <Link
              href="/calculator"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Log Daily Activities
            </Link>
          </div>

          {/* Quick Metrics & Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sustainability Score */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sustainability Score</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Based on footprint averages & points</p>
                </div>
                <div className="p-2 bg-emerald-950/40 border border-emerald-900/30 rounded-xl text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-black text-emerald-400">{dashData?.sustainabilityScore || 50}</span>
                <span className="text-slate-400 text-xs font-bold">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {dashData?.sustainabilityScore >= 75 ? '🌱 Excellent status! Keep protecting the earth.' : '⚠️ Tips from the AI Coach can help improve your score.'}
              </div>
            </div>

            {/* Weekly Footprint */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Output</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Emissions generated past 7 days</p>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-black text-slate-100">{dashData?.weeklyTotal?.toFixed(1) || '0.0'}</span>
                <span className="text-slate-400 text-xs font-bold">kg CO₂</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Leveling up greenPoints helps offset daily scores.
              </div>
            </div>

            {/* Monthly Footprint */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Output</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Emissions generated past 30 days</p>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-black text-slate-100">{dashData?.monthlyTotal?.toFixed(1) || '0.0'}</span>
                <span className="text-slate-400 text-xs font-bold">kg CO₂</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                National average is approximately 350 kg / month.
              </div>
            </div>

          </div>

          {/* Breakdown cards & Trends chart */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CarbonCard stats={dashData?.weeklyBreakdown ? {
                totalTransport: dashData.weeklyBreakdown.transport,
                totalElectricity: dashData.weeklyBreakdown.electricity,
                totalFood: dashData.weeklyBreakdown.food,
                totalWaste: dashData.weeklyBreakdown.waste,
                totalEmissions: dashData.weeklyTotal
              } : null} />
            </div>
            
            <div className="lg:col-span-3">
              <CarbonChart trendData={dashData?.emissionTrend || []} />
            </div>
          </div>

          {/* Carbon Budget Goals */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-200">Carbon Reduction Goals</h3>
                <p className="text-xs text-slate-400">Budgets set to control weekly emissions</p>
              </div>
              <Link
                href="/goals"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Manage Budgets →
              </Link>
            </div>

            {dashData?.goalProgress && dashData.goalProgress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dashData.goalProgress.map((g) => (
                  <GoalCard key={g._id} goal={g} onDelete={handleDeleteGoal} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/20 border border-slate-800 rounded-2xl">
                <Target className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-400">No active carbon budgets</p>
                <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                  Set carbon limit goals to maintain budget records when logging habits.
                </p>
                <Link
                  href="/goals"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300 border border-slate-700/50 mt-4 transition-colors"
                >
                  Create Budget Target
                </Link>
              </div>
            )}
          </div>

          {/* AI Sustainability Coach */}
          <RecommendationCard
            aiData={aiData}
            onGenerate={handleGenerateAI}
            loading={aiLoading}
          />
        </main>
      </div>
    </div>
  );
}
