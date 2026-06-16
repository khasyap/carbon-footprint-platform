import React from 'react';
import { Trophy, Clock, Check, Plus, Star } from 'lucide-react';

export default function ChallengeCard({ challenge, userId, onJoin, onComplete, loading }) {
  // Find current user's participation status
  const participation = challenge.participants?.find(p => p.userId === userId);
  const isJoined = !!participation;
  const isCompleted = participation?.status === 'COMPLETED';

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all hover:border-slate-700/60">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-teal-950/40 border border-teal-900/30 text-teal-400 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-900/30 px-2 py-1 rounded-lg text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>+{challenge.rewardPoints} Pts</span>
          </div>
        </div>

        <h4 className="text-base font-bold text-slate-200 mb-1">{challenge.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{challenge.description}</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800/60 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Duration: {challenge.duration}</span>
        </div>

        {isCompleted ? (
          <div className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-950/20 border border-emerald-900/20 text-emerald-400 text-sm font-bold rounded-xl">
            <Check className="w-4 h-4" />
            <span>Challenge Completed</span>
          </div>
        ) : isJoined ? (
          <button
            onClick={() => onComplete(challenge._id)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 text-sm font-bold rounded-xl shadow-lg shadow-teal-500/10 transition-all disabled:opacity-50"
          >
            <span>Complete Challenge</span>
          </button>
        ) : (
          <button
            onClick={() => onJoin(challenge._id)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-bold rounded-xl border border-slate-700/50 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Join Challenge</span>
          </button>
        )}
      </div>
    </div>
  );
}
