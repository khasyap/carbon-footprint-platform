import React from 'react';

export default function Loader({ size = 'medium', message = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div
        className={`${sizeClasses[size]} border-t-emerald-500 border-r-transparent border-slate-800 rounded-full animate-spin`}
      />
      {message && <p className="text-slate-400 text-sm animate-pulse">{message}</p>}
    </div>
  );
}
