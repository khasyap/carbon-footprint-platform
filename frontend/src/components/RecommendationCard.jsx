import React from 'react';
import { Sparkles, ArrowDownRight, Compass, ShieldAlert, Award } from 'lucide-react';

export default function RecommendationCard({ aiData, onGenerate, loading }) {
  const diffColors = {
    Easy: 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30',
    Medium: 'bg-amber-950/40 text-amber-400 border border-amber-900/30',
    Hard: 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
  };

  return (
    <div id="ai-coach" className="bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-100">AI Sustainability Coach</h3>
          </div>
          <p className="text-xs text-slate-400">Personalized daily habits analysis compiled by Gemini 2.5 Flash</p>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-95 transition-all text-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Analyzing Habits...' : 'Generate Suggestions'}
        </button>
      </div>

      {aiData ? (
        <div className="space-y-6">
          {/* Coach Speech Tip */}
          <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl flex items-start gap-3">
            <Compass className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-emerald-400">Coach Tip:</span> {aiData.coachingTip}
            </p>
          </div>

          {/* Recommendations List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiData.recommendations?.map((rec, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-slate-900 p-5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {rec.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColors[rec.difficulty] || 'bg-slate-800'}`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {rec.suggestion}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs pt-4 border-t border-slate-900/80 mt-4">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Est. Offset: -{rec.impact} kg CO₂ / mo</span>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate Offset Banner */}
          <div className="bg-slate-950/60 border border-slate-900/80 p-5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-slate-300">Total Monthly Savings Potential</p>
                <p className="text-[10px] text-slate-500">If all recommendations are implemented</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-400">-{aiData.estimatedTotalReduction} kg CO₂</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-950/40 rounded-2xl border border-slate-900 border-dashed">
          <ShieldAlert className="w-8 h-8 text-slate-500 mb-3" />
          <p className="text-sm font-semibold text-slate-300">No AI Recommendations Loaded</p>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Click the button above to analyze your recent logs and generate tailored ecological advice.
          </p>
        </div>
      )}
    </div>
  );
}
