
import React from 'react';
import { ScreeningCriteria } from '../types';

interface SidebarProps {
  criteria: ScreeningCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<ScreeningCriteria>>;
  onRefresh: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ criteria, setCriteria, onRefresh, isLoading }) => {
  const handleChange = (field: keyof ScreeningCriteria, value: number) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-900/30 p-6 flex flex-col gap-8 hidden md:flex">
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Screening Filters</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Market Cap (₹ Cr)</label>
              <span className="text-xs text-indigo-400 font-mono">{criteria.minMarketCap} - {criteria.maxMarketCap}</span>
            </div>
            <div className="flex gap-2">
                <input 
                    type="number" 
                    value={criteria.minMarketCap}
                    onChange={(e) => handleChange('minMarketCap', Number(e.target.value))}
                    className="w-1/2 bg-zinc-800 border border-zinc-700 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Min"
                />
                <input 
                    type="number" 
                    value={criteria.maxMarketCap}
                    onChange={(e) => handleChange('maxMarketCap', Number(e.target.value))}
                    className="w-1/2 bg-zinc-800 border border-zinc-700 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Max"
                />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Max Debt/Equity</label>
              <span className="text-xs text-indigo-400 font-mono">{criteria.maxDebtToEquity}x</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.1"
              value={criteria.maxDebtToEquity}
              onChange={(e) => handleChange('maxDebtToEquity', Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Min ROE (%)</label>
              <span className="text-xs text-indigo-400 font-mono">{criteria.minRoe}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="1"
              value={criteria.minRoe}
              onChange={(e) => handleChange('minRoe', Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">1Y Return Below (%)</label>
              <span className="text-xs text-red-400 font-mono">{criteria.maxOneYearReturn}%</span>
            </div>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              step="1"
              value={criteria.maxOneYearReturn}
              onChange={(e) => handleChange('maxOneYearReturn', Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="mt-auto w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-zinc-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            Scanning...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Run Screener
          </>
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
