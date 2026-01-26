import React from 'react';
import { Header } from '../shared/Header';
import { Sidebar } from '../shared/Sidebar';
import { StockTable } from './StockTable';

export const Dashboard: React.FC = () => {
    return (
        <div style={{ padding: '0px' }}>
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <header className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Market Discoveries</h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    Displaying mock data (Safe Mode)
                                </p>
                            </div>
                        </header>
                        <StockTable />
                    </div>
                </main>
            </div>
        </div>
    );
};
