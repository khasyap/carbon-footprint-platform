'use client';

import React from 'react';
import useAuth from '../hooks/useAuth';
import { LogOut, Leaf, Award } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-emerald-500 animate-pulse" />
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          EcoCarbon
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full text-emerald-400 text-sm font-medium">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>{user.greenPoints} Green Points</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-200">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
