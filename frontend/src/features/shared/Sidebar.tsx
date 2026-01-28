import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useStockStore } from '../../store/useStockStore';

export const Sidebar: React.FC = () => {
    const { criteria, updateCriteria, applyScreening, resetFilters, loading } = useStockStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateCriteria({ [name]: value === '' ? undefined : Number(value) });
    };

    return (
        <aside className="w-80 border-r border-slate-200 bg-white min-h-screen p-6 hidden lg:block overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                    <Filter className="h-4 w-4 text-blue-600" />
                    Screening Criteria
                </div>
                <button
                    onClick={resetFilters}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                    title="Reset All Filters"
                >
                    <RotateCcw className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Market Cap Section */}
                <section className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Market Cap (Cr)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            name="min_market_cap"
                            placeholder="Min"
                            value={criteria.min_market_cap || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <input
                            type="number"
                            name="max_market_cap"
                            placeholder="Max"
                            value={criteria.max_market_cap || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </section>

                {/* P/E Ratio Section */}
                <section className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        P/E Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            name="min_pe"
                            placeholder="Min"
                            value={criteria.min_pe || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <input
                            type="number"
                            name="max_pe"
                            placeholder="Max"
                            value={criteria.max_pe || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </section>

                {/* Momentum Section */}
                <section className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Min 1Y Return (%)
                    </label>
                    <input
                        type="number"
                        name="min_return_1y"
                        placeholder="e.g. 20"
                        value={criteria.min_return_1y || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                </section>

                <button
                    onClick={() => applyScreening()}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-8"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Search className="h-4 w-4" />
                            Apply Screener
                        </>
                    )}
                </button>
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100 hidden lg:block">
                <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        Data sourced directly from NSE Bhavcopy.
                    </p>
                </div>
            </div>
        </aside>
    );
};
