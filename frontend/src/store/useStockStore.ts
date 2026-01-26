import { create } from 'zustand';
import type { Stock, ScreeningCriteria } from '../types';
import { apiService } from '../services/api';

const MOCK_STOCKS: Stock[] = [
    { symbol: 'MOCK_RELIANCE', name: 'Reliance Industries', last_price: 2500, close_price: 2400, open_price: 2450, high_price: 2550, low_price: 2380, prev_close: 2400, volume: 100000, market_cap: 1600000, pe_ratio: 25, p_change: 4.1, return_1y: 15.5 },
];

interface StockState {
    stocks: Stock[];
    loading: boolean;
    error: string | null;
    criteria: ScreeningCriteria;

    // Actions
    fetchStocks: () => Promise<void>;
    updateCriteria: (newCriteria: Partial<ScreeningCriteria>) => void;
    applyScreening: () => Promise<void>;
    resetFilters: () => void;
}

export const useStockStore = create<StockState>((set, get) => ({
    stocks: [],
    loading: false,
    error: null,
    criteria: {
        min_market_cap: 1000,
    },

    fetchStocks: async () => {
        set({ loading: true, error: null });
        try {
            console.log("STORE: Fetching REAL stocks from API...");
            const response = await apiService.getAllStocks();
            set({ stocks: response.data, loading: false });
        } catch (err: any) {
            console.error("STORE ERROR:", err);
            set({ error: err.message || 'Failed to fetch stocks', loading: false });
        }
    },

    updateCriteria: (newCriteria) => {
        set((state) => ({
            criteria: { ...state.criteria, ...newCriteria }
        }));
    },

    applyScreening: async () => {
        set({ loading: true, error: null });
        try {
            console.log("STORE: Screening REAL stocks...", get().criteria);
            const response = await apiService.screenStocks(get().criteria);
            set({ stocks: response.data, loading: false });
        } catch (err: any) {
            console.error("STORE SCREENING ERROR:", err);
            set({ error: err.message || 'Screening failed', loading: false });
        }
    },

    resetFilters: () => {
        set({ criteria: {} });
        get().fetchStocks();
    }
}));
