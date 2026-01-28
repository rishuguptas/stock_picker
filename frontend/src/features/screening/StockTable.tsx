import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useStockStore } from '../../store/useStockStore';
import type { Stock } from '../../types';

type SortKey = keyof Stock;
type SortOrder = 'asc' | 'desc' | 'none';

export const StockTable: React.FC = () => {
    const { stocks, loading, error } = useStockStore();
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
        key: 'symbol',
        order: 'none'
    });

    const formatCurrency = (val: number | null) => {
        if (val === null) return '-';
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
        }).format(val);
    };

    const handleSort = (key: SortKey) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                if (prev.order === 'asc') return { key, order: 'desc' };
                if (prev.order === 'desc') return { key, order: 'none' };
            }
            return { key, order: 'asc' };
        });
    };

    const sortedStocks = useMemo(() => {
        if (sortConfig.order === 'none') return stocks;

        return [...stocks].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal === null) return 1;
            if (bVal === null) return -1;

            if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [stocks, sortConfig]);

    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortConfig.key !== columnKey || sortConfig.order === 'none') {
            return <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
        }
        return sortConfig.order === 'asc'
            ? <ChevronUp className="h-3 w-3 text-blue-600" />
            : <ChevronDown className="h-3 w-3 text-blue-600" />;
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
                    <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 cursor-pointer group hover:text-slate-800 transition-colors" onClick={() => handleSort('symbol')}>
                                <div className="flex items-center gap-1.5">Stock <SortIcon columnKey="symbol" /></div>
                            </th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 cursor-pointer group hover:text-slate-800 transition-colors" onClick={() => handleSort('last_price')}>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">Price (₹) <SortIcon columnKey="last_price" /></div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer group hover:text-slate-800 transition-colors" onClick={() => handleSort('p_change')}>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">Change (%) <SortIcon columnKey="p_change" /></div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer group hover:text-slate-800 transition-colors" onClick={() => handleSort('market_cap')}>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">Mkt Cap (Cr) <SortIcon columnKey="market_cap" /></div>
                            </th>
                            <th className="px-6 py-4 text-center cursor-pointer group hover:text-slate-800 transition-colors" onClick={() => handleSort('pe_ratio')}>
                                <div className="flex items-center justify-center gap-1.5">P/E <SortIcon columnKey="pe_ratio" /></div>
                            </th>
                            <th className="px-6 py-4 text-center cursor-pointer group hover:text-slate-800 transition-colors" onClick={() => handleSort('return_1y')}>
                                <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">1Y Return <SortIcon columnKey="return_1y" /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [...Array(10)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : sortedStocks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                                    No entries match the selected criteria.
                                </td>
                            </tr>
                        ) : (
                            sortedStocks.map((stock: Stock) => (
                                <tr key={stock.symbol} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{stock.symbol}</div>
                                            <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{stock.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight
                                            ${stock.instrument_type === 'Stock' ? 'bg-blue-100 text-blue-700' :
                                                stock.instrument_type === 'Debenture' ? 'bg-amber-100 text-amber-700' :
                                                    stock.instrument_type === 'Option' ? 'bg-purple-100 text-purple-700' :
                                                        stock.instrument_type === 'Future' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-slate-100 text-slate-700'}`}>
                                            {stock.instrument_type}
                                        </span>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                                        {stock.return_1y !== null ? (
                                            <span className={`px-2.5 py-1 rounded-full font-bold ${stock.return_1y > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {stock.return_1y > 0 ? '+' : ''}{stock.return_1y.toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
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
