
"use client";

import React, { useState, useEffect } from 'react';
import Header from './(components)/header';
import Footer from './(components)/footer';
import SpeedTestCard from './(components)/speed-test-card';
import TestHistoryTable from './(components)/test-history-table';
import NetworkingTermsExplainer from './(components)/networking-terms-explainer';
import FrequencyBandsTable from './(components)/frequency-bands-table'; // Added import
import type { TestResult } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast'; 
import { useTranslation } from '@/hooks/use-translation'; 

export default function HomePage() {
  const [testHistory, setTestHistory] = useLocalStorage<TestResult[]>('netgauge-history', []);
  const { toast } = useToast();
  const { translate } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTestComplete = (result: TestResult) => {
    setTestHistory(prevHistory => [result, ...prevHistory].slice(0, 20)); // Keep last 20 results
    toast({
      title: translate('results'),
      description: `${translate('downloadSpeed')}: ${result.download} ${translate('mbps')}, ${translate('uploadSpeed')}: ${result.upload} ${translate('mbps')}`,
    });
  };

  const handleClearHistory = () => {
    setTestHistory([]);
    toast({
      title: translate('testHistory'),
      description: translate('clearHistory') + " " + translate('results') 
    });
  };

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-pulse text-2xl text-primary">{/* Loading... placeholder */}</div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SpeedTestCard onTestComplete={handleTestComplete} />
        <TestHistoryTable history={testHistory} onClearHistory={handleClearHistory} />
        <NetworkingTermsExplainer />
        <FrequencyBandsTable /> {/* Added component */}
      </main>
      <Footer />
    </div>
  );
}
