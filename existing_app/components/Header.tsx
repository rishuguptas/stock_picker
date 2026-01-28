
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Bharat<span className="text-indigo-500">Cap</span></h1>
          <p className="text-xs text-zinc-500 font-medium">Mid-Cap Value Discovery</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          NSE Market Open
        </div>
      </div>
    </header>
  );
};

export default Header;
