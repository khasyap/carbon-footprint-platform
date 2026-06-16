import React from 'react';
import { Target, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function GoalCard({ goal, onDelete }) {
  const percent = Math.min(100, Math.max(0, goal.percent || 0));

  // Determine indicator colors
  let progressColor = 'bg-emerald-500';
  let borderGlow = 'border-slate-800/80';
  
  if (percent >= 100) {
    progressColor = 'bg-rose-500'; // Target reached or exceeded (budget exceeded)
    borderGlow = 'border-rose-950/20';
  } else if (percent > 75) {
    progressColor = 'bg-amber-500'; // Nearing budget limits
    borderGlow = 'border-amber-950/20';
  }

  return (
    <div className={`bg-slate-900/40 border ${borderGlow} p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-950/20`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-950/40 border border-emerald-900/30 rounded-xl text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Carbon Budget</h4>
            <p className="text-xs text-slate-400">Target budget: {goal.targetEmission} kg CO₂</p>
          </div>
        </div>

        <button
          onClick={() => onDelete(goal._id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
          title="Delete Goal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Current Footprint</span>
          <span className="text-slate-200">{goal.currentEmission} / {goal.targetEmission} kg</span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden w-full relative">
          <div
            className={`h-full ${progressColor} transition-all duration-500 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] mt-2 font-medium">
          <span className="text-slate-500">{percent}% of budget consumed</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
            goal.status === 'COMPLETED'
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/20'
              : 'bg-amber-950/40 text-amber-400 border border-amber-900/20'
          }`}>
            {goal.status === 'COMPLETED' ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Active
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
