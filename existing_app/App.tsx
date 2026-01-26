
import React, { useState, useEffect, useCallback } from 'react';
import { Stock, ScreeningCriteria } from './types';
import { pythonService } from './services/pythonService';
import { geminiService } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const [criteria, setCriteria] = useState<ScreeningCriteria>({
    minMarketCap: 10000,
    maxMarketCap: 25000,
    maxDebtToEquity: 2,
    minRoe: 20,
    maxOneYearReturn: -10
  });

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg].slice(-10));
  };

  const handleScreen = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]);
    
    try {
      const screenedStocks = await pythonService.screenStocks(criteria, addLog);
      setStocks(screenedStocks);
      
      // We only use Gemini now for qualitative analysis of the REAL data fetched by nselib
      if (screenedStocks.length > 0) {
        addLog("Requesting Gemini for qualitative insights...");
        const insightText = await geminiService.getMarketInsights(screenedStocks);
        setInsights(insightText);
      } else {
        setInsights("Adjust filters to find more opportunities.");
      }
    } catch (err: any) {
      setError(`Screener Error: ${err.message}. Ensure you have an active internet connection for the CORS proxy.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [criteria]);

  useEffect(() => {
    handleScreen();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          criteria={criteria} 
          setCriteria={setCriteria} 
          onRefresh={handleScreen}
          isLoading={isLoading}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <Dashboard 
            stocks={stocks} 
            isLoading={isLoading} 
            insights={insights}
            sources={sources}
            error={error}
            externalLogs={logs}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
