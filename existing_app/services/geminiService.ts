
import { GoogleGenAI, Type } from "@google/genai";
import { Stock, ScreeningCriteria } from "../types";

export class GeminiService {
  async screenStocks(criteria: ScreeningCriteria): Promise<{ stocks: Stock[], sources: any[] }> {
    // Correctly initialize with named parameter and direct process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Emulating the precision of nselib data points
    const systemInstruction = `
      You are a Python-based Financial Data Engine emulating the 'nselib' library behavior for the NSE (National Stock Exchange of India).
      
      Your execution logic:
      1. ACCESS: Identify the current NSE Midcap 100/150 list.
      2. FETCH: For each symbol, retrieve:
         - Current Market Price (CMP)
         - Market Capitalization (Convert to ₹ Crores)
         - Debt-to-Equity Ratio (Latest Annual/Quarterly)
         - ROE (Average of the last 3 fiscal years)
         - 1-Year Price Change %
      3. FILTER: Apply strict Pythonic boolean logic:
         - IF (marketCap >= ${criteria.minMarketCap} AND marketCap <= ${criteria.maxMarketCap})
         - AND (debtToEquity < ${criteria.maxDebtToEquity})
         - AND (avg_roe_3yr > ${criteria.minRoe})
         - AND (price_change_1yr < ${criteria.maxOneYearReturn})
      4. OUTPUT: Return only the matches in a precise JSON schema.
      
      Ensure symbols follow the 'SYMBOL.NS' format. Handle rounding to 2 decimal places.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Execute NSE screening logic for Indian Mid-cap universe.",
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stocks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    symbol: { type: Type.STRING },
                    name: { type: Type.STRING },
                    currentPrice: { type: Type.NUMBER },
                    marketCap: { type: Type.NUMBER },
                    debtToEquity: { type: Type.NUMBER },
                    roe: { type: Type.NUMBER },
                    oneYearReturn: { type: Type.NUMBER },
                    sector: { type: Type.STRING },
                    lastUpdated: { type: Type.STRING }
                  },
                  required: ["symbol", "name", "currentPrice", "marketCap", "debtToEquity", "roe", "oneYearReturn", "sector"]
                }
              }
            },
            required: ["stocks"]
          }
        }
      });

      // Property access .text (not a method)
      const jsonStr = response.text?.trim() || '{"stocks": []}';
      const result = JSON.parse(jsonStr);
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      return {
        stocks: result.stocks || [],
        sources: sources
      };
    } catch (error: any) {
      console.error("Error screening stocks:", error);
      // Follow the error handling guideline for "Requested entity was not found."
      if (error?.message?.includes("Requested entity was not found.")) {
        if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
          (window as any).aistudio.openSelectKey();
        }
      }
      throw error;
    }
  }

  async getMarketInsights(stocks: Stock[]): Promise<string> {
    // Correctly initialize with named parameter and direct process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const symbols = stocks.map(s => s.symbol).join(', ');
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these screened stocks: ${symbols}. Why does their current valuation represent a mid-cap opportunity relative to their 3-year ROE?`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      // Property access .text (not a method)
      return response.text || "No insights available.";
    } catch (error) {
      return "Error fetching insights.";
    }
  }
}

export const geminiService = new GeminiService();
