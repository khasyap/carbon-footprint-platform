'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import * as challengeService from '../../services/challengeService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import ChallengeCard from '../../components/ChallengeCard';
import { Trophy, AlertCircle, CheckCircle } from 'lucide-react';

export default function ChallengesPage() {
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchChallenges = async () => {
    try {
      const res = await challengeService.getChallenges();
      if (res.success) {
        setChallenges(res.data);
      }
    } catch (err) {
      console.error('Error fetching challenges:', err.message);
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
      fetchChallenges();
    }
  }, [user, authLoading, router]);

  const handleJoin = async (id) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await challengeService.joinChallenge(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'You have joined the challenge! Good luck 🌱' });
        await fetchChallenges();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Error joining challenge' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await challengeService.completeChallenge(id);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        await fetchChallenges();
        await refreshProfile(); // Refresh points in Navbar header
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Error completing challenge' });
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || (user && loading && challenges.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading Eco Challenges..." />
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
            <h2 className="text-xl font-bold text-slate-100">Eco-Friendly Challenges</h2>
            <p className="text-xs text-slate-400 mt-1">Complete daily or weekly challenges to earn bonus Green Points and badges.</p>
          </div>

          {feedback && (
            <div className={`flex items-center gap-3 p-4 rounded-xl text-sm border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                : 'bg-rose-950/20 border-rose-900/30 text-rose-400'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((c) => (
                <ChallengeCard
                  key={c._id}
                  challenge={c}
                  userId={user._id}
                  onJoin={handleJoin}
                  onComplete={handleComplete}
                  loading={actionLoading}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl">
              <Trophy className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">No Challenges Available</p>
              <p className="text-xs text-slate-500 mt-1">We are seeding challenges. Check back in a moment.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
