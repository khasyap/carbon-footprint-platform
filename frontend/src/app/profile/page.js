'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { BADGE_ICONS } from '../../utils/constants';
import { User, Award, ShieldAlert, CheckCircle, Leaf, Star } from 'lucide-react';

const ALL_BADGES = [
  {
    name: 'Green Beginner',
    description: 'Awarded automatically when you log your first activity.',
    criteria: '1+ Green Points',
    points: 1
  },
  {
    name: 'Carbon Saver',
    description: 'Earned when you build a steady base of carbon reduction activities.',
    criteria: '100+ Green Points',
    points: 100
  },
  {
    name: 'Eco Warrior',
    description: 'Unlocked by actively participating in multiple green challenges.',
    criteria: '500+ Green Points',
    points: 500
  },
  {
    name: 'Sustainability Champion',
    description: 'The ultimate status for carbon-neutral lifecycles.',
    criteria: '1000+ Green Points',
    points: 1000
  }
];

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading Profile..." />
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
            <h2 className="text-xl font-bold text-slate-100">Eco Profile & Achievements</h2>
            <p className="text-xs text-slate-400 mt-1">Manage your details, view milestones, and track unlocked status badges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: User credentials card */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6 text-center relative overflow-hidden">
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 bg-slate-950 border-2 border-slate-800 rounded-full flex items-center justify-center text-slate-400 relative">
                    <User className="w-10 h-10" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full">
                      <Leaf className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{user.name}</h3>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl flex items-center justify-around divide-x divide-slate-800">
                  <div className="text-center px-2">
                    <span className="block text-2xl font-black text-emerald-400">{user.greenPoints}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Points</span>
                  </div>
                  <div className="text-center px-2">
                    <span className="block text-2xl font-black text-amber-400">{user.badges?.length || 0}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Badges</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex items-start gap-2.5 text-left">
                  <Star className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Earn points by commuting by bike, eating vegetarian, reducing waste, and completing eco-challenges.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Badges Grid */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Achievements & Badges</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALL_BADGES.map((badge) => {
                  const isUnlocked = user.badges?.includes(badge.name);
                  const icon = BADGE_ICONS[badge.name] || '🏆';

                  return (
                    <div
                      key={badge.name}
                      className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                        isUnlocked
                          ? 'bg-emerald-950/10 border-emerald-900/30 text-slate-200'
                          : 'bg-slate-900/10 border-slate-900/60 opacity-50 text-slate-500'
                      }`}
                    >
                      <div className="text-3xl p-3 bg-slate-950 border border-slate-900 rounded-xl">
                        {icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                            {badge.name}
                          </h4>
                          {isUnlocked && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {badge.description}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold pt-1">
                          Requires: {badge.criteria}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
