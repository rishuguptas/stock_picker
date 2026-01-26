import React from 'react';
import { LayoutDashboard, TrendingUp, Info } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-6 justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <TrendingUp className="text-white h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                        BharatCap
                    </h1>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        Stock Screener
                    </span>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <button className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                        <LayoutDashboard className="h-4 w-4" />
                        Discovery
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                        Insights (AI)
                    </button>
                </nav>
                <div className="h-4 w-[1px] bg-slate-200" />
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Info className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};
