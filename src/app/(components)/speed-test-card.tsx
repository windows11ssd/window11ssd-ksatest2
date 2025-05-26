"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Gauge from './gauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Zap, Server as ServerIcon, Play, Pause, RotateCcw, BarChartHorizontalBig } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { TestResult, FileSizeOption } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface SpeedTestCardProps {
  onTestComplete: (result: TestResult) => void;
}

const fileSizes: FileSizeOption[] = ["1MB", "5MB", "10MB", "50MB", "100MB", "500MB", "1000MB"];

const SpeedTestCard: React.FC<SpeedTestCardProps> = ({ onTestComplete }) => {
  const { translate, dir } = useTranslation();
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [selectedFileSize, setSelectedFileSize] = useState<FileSizeOption>("10MB");
  const [progress, setProgress] = useState(0);
  const [currentTestPhase, setCurrentTestPhase] = useState<string>(""); // "ping", "download", "upload"

  const serverInfo = {
    name: translate('defaultServerName'),
    location: translate('defaultServerLocation'),
  };

  const resetMetrics = useCallback(() => {
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setCurrentTestPhase("");
  }, []);
  
  useEffect(() => {
    // Reset metrics if language changes to reflect new server name potentially
    resetMetrics();
  }, [translate, resetMetrics]);


  const simulateTest = () => {
    setIsTesting(true);
    resetMetrics();

    // Ping simulation
    setCurrentTestPhase(translate('ping'));
    setProgress(10);
    setTimeout(() => {
      const simulatedPing = Math.floor(Math.random() * 100) + 5; // 5-105 ms
      setPing(simulatedPing);
      setProgress(33);

      // Download simulation
      setCurrentTestPhase(translate('downloadSpeed'));
      let currentDownload = 0;
      const downloadInterval = setInterval(() => {
        currentDownload += Math.random() * 20; // Simulate increasing speed
        setDownloadSpeed(Math.min(currentDownload, Math.random() * 500 + 50)); // Cap at a random max
        setProgress(p => Math.min(p + 5, 66));
        if (currentDownload >= (Math.random() * 400 + 50) || progress >= 66) { // Some condition to end download phase
            setDownloadSpeed(Math.random() * 500 + 50); // Final download speed
            clearInterval(downloadInterval);
            setProgress(66);

            // Upload simulation
            setCurrentTestPhase(translate('uploadSpeed'));
            let currentUpload = 0;
            const uploadInterval = setInterval(() => {
                currentUpload += Math.random() * 15;
                setUploadSpeed(Math.min(currentUpload, Math.random() * 300 + 30)); // Cap at a random max
                setProgress(p => Math.min(p + 5, 100));
                 if (currentUpload >= (Math.random() * 250 + 30) || progress >= 99) {
                    setUploadSpeed(Math.random() * 300 + 30); // Final upload speed
                    clearInterval(uploadInterval);
                    setProgress(100);
                    
                    // Test complete
                    setIsTesting(false);
                    setCurrentTestPhase(translate('results'));
                    const result: TestResult = {
                        id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
                        date: new Date().toISOString(),
                        download: parseFloat(downloadSpeed.toFixed(2)),
                        upload: parseFloat(uploadSpeed.toFixed(2)),
                        ping: simulatedPing,
                        fileSize: selectedFileSize,
                        serverName: serverInfo.name,
                        serverLocation: serverInfo.location,
                    };
                    onTestComplete(result);
                }
            }, 200);
        }
      }, 200);
    }, 1000);
  };

  const handleStartTest = () => {
    if (isTesting) {
        // Logic to stop test (not fully implemented for simulation)
        setIsTesting(false);
        resetMetrics();
        setCurrentTestPhase(translate('testHistory')); // Or some "stopped" state
    } else {
        simulateTest();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <BarChartHorizontalBig className="w-8 h-8" />
          {translate('appName')}
        </CardTitle>
        <CardDescription>{translate('tagline')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          <Gauge value={downloadSpeed} maxValue={600} label={translate('downloadSpeed')} unit={translate('mbps')} />
          <Gauge value={uploadSpeed} maxValue={400} label={translate('uploadSpeed')} unit={translate('mbps')} />
          <Gauge value={ping} maxValue={150} label={translate('ping')} unit={translate('ms')} />
        </div>

        {isTesting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentTestPhase}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <ServerIcon className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold">{serverInfo.name}</p>
                <p className="text-xs text-muted-foreground">{serverInfo.location}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
                <Select
                    dir={dir}
                    value={selectedFileSize}
                    onValueChange={(value) => setSelectedFileSize(value as FileSizeOption)}
                    disabled={isTesting}
                >
                    <SelectTrigger className="w-full sm:w-[180px]" aria-label={translate('selectFileSize')}>
                    <SelectValue placeholder={translate('selectFileSize')} />
                    </SelectTrigger>
                    <SelectContent>
                    {fileSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                        {size}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          size="lg"
          onClick={handleStartTest}
          className="w-48 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          variant={isTesting ? "destructive" : "default"}
        >
          {isTesting ? (
            <>
              <Pause className={`w-6 h-6 ${dir === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {translate('stopTest')}
            </>
          ) : (
            <>
              <Play className={`w-6 h-6 ${dir === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {translate('startTest')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpeedTestCard;
