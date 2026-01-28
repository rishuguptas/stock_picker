export interface Stock {
    symbol: string;
    name: string;
    last_price: number;
    close_price: number;
    open_price: number;
    high_price: number;
    low_price: number;
    prev_close: number;
    volume: number;
    market_cap: number | null;
    pe_ratio: number | null;
    p_change: number;
    return_1y: number | null;
    instrument_type: string;
}

export interface ScreeningCriteria {
    min_market_cap?: number;
    max_market_cap?: number;
    min_pe?: number;
    max_pe?: number;
    min_return_1y?: number;
}

export interface ApiResponse<T> {
    data: T;
    count: number;
    total_available: number;
    error: { code: string; message: string } | null;
}
