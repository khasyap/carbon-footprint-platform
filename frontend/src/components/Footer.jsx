import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-emerald-500" />
        <span className="font-bold text-slate-400">EcoCarbon</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-4 font-semibold text-slate-400">
        <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">Documentation</a>
        <span>•</span>
        <a href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</a>
      </div>
    </footer>
  );
}
