from pydantic import BaseModel, ConfigDict
from typing import Optional

class StockData(BaseModel):
    model_config = ConfigDict(alias_generator=lambda s: s.lower().replace("_", ""), populate_by_name=True)

    symbol: str
    name: Optional[str] = None
    last_price: float
    close_price: Optional[float] = None
    open_price: Optional[float] = None
    high_price: Optional[float] = None
    low_price: Optional[float] = None
    prev_close: Optional[float] = None
    volume: int
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    p_change: Optional[float] = None # daily % change
    # Performance Returns
    return_1y: Optional[float] = None

class ScreeningCriteria(BaseModel):
    min_market_cap: Optional[float] = None # in Crores
    max_market_cap: Optional[float] = None
    min_pe: Optional[float] = None
    max_pe: Optional[float] = None
    min_return_1y: Optional[float] = None
