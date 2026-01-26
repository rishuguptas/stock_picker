import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStockStore } from '../../store/useStockStore';
import type { Stock } from '../../types';

export const StockTable: React.FC = () => {
    const { stocks, loading, error } = useStockStore();

    const formatCurrency = (val: number | null) => {
        if (val === null) return '-';
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
        }).format(val);
    };

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-100 rounded-2xl text-red-600">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price (₹)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Change (%)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mkt Cap (Cr)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">P/E</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">1Y Return</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [...Array(10)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : stocks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                                    No stocks match the selected criteria.
                                </td>
                            </tr>
                        ) : (
                            stocks.map((stock: Stock) => (
                                <tr key={stock.symbol} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{stock.symbol}</div>
                                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{stock.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-slate-700">{formatCurrency(stock.last_price)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center gap-1 font-medium ${stock.p_change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {stock.p_change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {Math.abs(stock.p_change).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                                        ₹{formatCurrency(stock.market_cap)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-800">
                                        {stock.pe_ratio ? stock.pe_ratio.toFixed(1) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${(stock.return_1y || 0) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            {(stock.return_1y || 0) > 0 ? '+' : ''}{stock.return_1y?.toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
