import { create } from 'zustand';
import type { Stock, ScreeningCriteria, ApiResponse } from '../types';
import { apiService } from '../services/api';

interface StockState {
    stocks: Stock[];
    totalAvailable: number;
    loading: boolean;
    error: string | null;
    criteria: ScreeningCriteria;
    sortBy: string | null;
    sortOrder: 'asc' | 'desc';

    // Actions
    fetchStocks: () => Promise<void>;
    updateCriteria: (newCriteria: Partial<ScreeningCriteria>) => void;
    applyScreening: () => Promise<void>;
    resetFilters: () => void;
    setSorting: (sortBy: string | null, sortOrder: 'asc' | 'desc') => void;
}

export const useStockStore = create<StockState>((set, get) => ({
    stocks: [],
    totalAvailable: 0,
    loading: false,
    error: null,
    criteria: {},
    sortBy: null,
    sortOrder: 'asc',

    fetchStocks: async () => {
        set({ loading: true, error: null });
        try {
            console.log("STORE: Fetching REAL stocks from API...");
            const { sortBy, sortOrder } = get();
            const response: ApiResponse<Stock[]> = await apiService.getAllStocks(sortBy || undefined, sortOrder);
            set({
                stocks: response.data || [],
                totalAvailable: response.total_available || 0,
                loading: false
            });
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
            const { sortBy, sortOrder } = get();
            const response: ApiResponse<Stock[]> = await apiService.screenStocks(get().criteria, sortBy || undefined, sortOrder);
            set({
                stocks: response.data || [],
                totalAvailable: response.total_available || 0,
                loading: false
            });
        } catch (err: any) {
            console.error("STORE SCREENING ERROR:", err);
            set({ error: err.message || 'Screening failed', loading: false });
        }
    },

    resetFilters: () => {
        set({ criteria: {}, sortBy: null, sortOrder: 'asc' });
        get().fetchStocks();
    },

    setSorting: (sortBy: string | null, sortOrder: 'asc' | 'desc') => {
        set({ sortBy, sortOrder });
        // Trigger refetch with new sorting
        const { criteria } = get();
        if (Object.keys(criteria).length > 0) {
            get().applyScreening();
        } else {
            get().fetchStocks();
        }
    }
}));
