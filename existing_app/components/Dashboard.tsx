
import React from 'react';
import { Stock } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface DashboardProps {
  stocks: Stock[];
  isLoading: boolean;
  insights: string;
  sources: any[];
  error: string | null;
  externalLogs: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ stocks, isLoading, insights, sources, error, externalLogs }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-900/50 rounded-2xl border border-red-900/20">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Python Execution Error</h3>
        <p className="text-zinc-400 max-w-md font-mono text-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Python Console */}
        <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-xs overflow-hidden flex flex-col h-64 lg:h-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Pyodide Shell</span>
            </div>
            <div className="text-[9px] text-indigo-500 font-bold animate-pulse">PYTHON 3.11 WASM</div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {externalLogs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-zinc-600">[{i}]</span>
                <span className="text-emerald-500/90">$ {log}</span>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-2 items-center text-indigo-400 animate-pulse mt-2">
                 <span>$</span>
                 <div className="w-2 h-4 bg-indigo-400"></div>
                 <span className="text-[10px]">executing_nselib_worker...</span>
               </div>
            )}
          </div>
        </div>

        {/* Qualitative AI Insight */}
        <div className="lg:col-span-2 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex flex-col shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="font-bold text-lg">AI Market Reasoning</h3>
          </div>
          <div className="mt-4 flex-1 text-zinc-300 text-sm leading-relaxed overflow-y-auto custom-scrollbar">
            {isLoading ? (
               <div className="space-y-3">
                 <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                 <div className="h-4 bg-zinc-800 rounded w-full animate-pulse"></div>
                 <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse"></div>
               </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                {insights || "Run the screener to generate investment logic and mid-cap analysis based on current NSE data."}
              </div>
            )}
          </div>
          {sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Sources & References</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                   <a key={i} href={src.web?.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
                     [{i+1}] {src.web?.title}
                   </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visualisations Section */}
      {!isLoading && stocks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 h-[400px] shadow-lg">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-500 rounded"></div>
              Return on Equity (%)
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={stocks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="symbol" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#18181b' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="roe" name="ROE %" radius={[4, 4, 0, 0]}>
                  {stocks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#6366f1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 h-[400px] shadow-lg">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded"></div>
              1-Year Price Performance (%)
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={stocks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="symbol" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#18181b' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="oneYearReturn" name="1Y Return %" radius={[4, 4, 0, 0]}>
                  {stocks.map((entry, index) => (
                    <Cell key={`cell-ret-${index}`} fill={entry.oneYearReturn < 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
            <h3 className="font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Discovery Results ({stocks.length})
            </h3>
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest px-2 py-1 bg-zinc-950 rounded">
              Prices: NSE Direct via nselib
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Current Price</th>
                <th className="px-6 py-4">Mkt Cap (Cr)</th>
                <th className="px-6 py-4">Debt/Eq</th>
                <th className="px-6 py-4">3Y Avg ROE</th>
                <th className="px-6 py-4">1Y Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {stocks.length === 0 && !isLoading ? (
                <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 italic">No stocks matching current criteria found in the selected universe.</td>
                </tr>
              ) : (
                stocks.map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-indigo-500/5 transition-colors group">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-400 group-hover:text-indigo-300">{stock.symbol}</td>
                      <td className="px-6 py-4 font-mono">₹{stock.currentPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono">₹{stock.marketCap.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono">{stock.debtToEquity.toFixed(2)}x</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${stock.roe > 20 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                          {stock.roe}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-bold ${stock.oneYearReturn < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {stock.oneYearReturn > 0 ? '+' : ''}{stock.oneYearReturn}%
                        </span>
                      </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
