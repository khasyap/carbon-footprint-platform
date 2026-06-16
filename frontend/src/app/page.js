import React from 'react';
import Link from 'next/link';
import { Leaf, Award, Calculator, Sparkles, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-emerald-500 animate-pulse" />
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            EcoCarbon
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 2.5 Flash
        </div>

        <h1 className="text-4xl sm:text-6xl font-black leading-tight bg-gradient-to-r from-slate-100 via-emerald-100 to-emerald-400 bg-clip-text text-transparent mb-6">
          Track, Reduce, and Offset Your Carbon Footprint
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10">
          EcoCarbon empowers you to log activities, visualize your emissions, receive personalized AI recommendations, and earn gamification badges by joining sustainability challenges.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-base font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20"
          >
            Create Your Free Account
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-base font-bold rounded-xl transition-all"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
            <Calculator className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-bold text-slate-200 mb-2">Calculator</h3>
            <p className="text-sm text-slate-400">Log transportation, energy, diet, and waste with instant client-side math.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
            <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-bold text-slate-200 mb-2">AI Coach</h3>
            <p className="text-sm text-slate-400">Receive smart, customized guidelines compiled by Gemini 2.5 Flash.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
            <Trophy className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-bold text-slate-200 mb-2">Challenges</h3>
            <p className="text-sm text-slate-400">Participate in zero-waste and green commuting milestones to grow habits.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
            <Award className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-bold text-slate-200 mb-2">Gamification</h3>
            <p className="text-sm text-slate-400">Earn points for low carbon logs and unlock cool status badges.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-sm text-slate-500">
        © 2026 EcoCarbon. Built for Hackathons & Global Sustainability.
      </footer>
    </main>
  );
}
