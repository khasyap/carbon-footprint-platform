'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calculator,
  Target,
  Trophy,
  Sparkles,
  User
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Calculator', path: '/calculator', icon: Calculator },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
    { name: 'AI Coach', path: '/dashboard#ai-coach', icon: Sparkles },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-6">
      <div className="space-y-6">
        <div className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </div>
        <nav className="space-y-1 px-3" aria-label="Sidebar Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path.startsWith('/dashboard#') && pathname === '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-950/40 text-emerald-400 border-l-4 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="px-6 text-center text-xs text-slate-500">
        EcoCarbon v1.0.0
      </div>
    </aside>
  );
}
