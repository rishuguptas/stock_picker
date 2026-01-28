import React, { useEffect } from 'react';
import { Header } from '../shared/Header';
import { Sidebar } from '../shared/Sidebar';
import { StockTable } from './StockTable';
import { useStockStore } from '../../store/useStockStore';

export const Dashboard: React.FC = () => {
    const { fetchStocks } = useStockStore();

    useEffect(() => {
        // Fetch stocks on mount
        fetchStocks();
    }, [fetchStocks]);

    return (
        <div style={{ padding: '0px' }}>
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <StockTable />
                    </div>
                </main>
            </div>
        </div>
    );
};
