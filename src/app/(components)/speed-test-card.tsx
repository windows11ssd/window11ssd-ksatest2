
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Gauge from './gauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Zap, Server as ServerIcon, Play, Pause, BarChartHorizontalBig, MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { TestResult, FileSizeOption } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface SpeedTestCardProps {
  onTestComplete: (result: TestResult) => void;
}

interface ClientInfo {
  ip: string;
  city: string;
  country: string;
  network: string; 
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
  const [currentTestPhase, setCurrentTestPhase] = useState<string>(""); 

  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoadingClientInfo, setIsLoadingClientInfo] = useState(true);
  const [serverName, setServerName] = useState<string>(() => translate('defaultServerName'));
  const [serverLocation, setServerLocation] = useState<string>(() => translate('defaultServerLocation'));

  useEffect(() => {
    const fetchClientInfo = async () => {
      setIsLoadingClientInfo(true);
      setClientInfo(null); // Reset client info before fetching
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch IP info');
        }
        const data = await response.json();
        const fetchedClientInfo: ClientInfo = {
          ip: data.ip || 'N/A',
          city: data.city || 'N/A',
          country: data.country_name || 'N/A',
          network: data.org || 'N/A', 
        };
        setClientInfo(fetchedClientInfo);
      } catch (error) {
        console.error("Error fetching client info:", error);
        setClientInfo({ ip: 'N/A', city: 'N/A', country: 'N/A', network: 'N/A' }); // Set to N/A on error
      } finally {
        setIsLoadingClientInfo(false);
      }
    };

    fetchClientInfo();
  }, []); // Fetch only on mount

  useEffect(() => {
    // This effect updates serverName and serverLocation based on fetched clientInfo or language changes.
    if (clientInfo && clientInfo.ip !== 'N/A' && clientInfo.city !== 'N/A' && clientInfo.country !== 'N/A') {
      setServerName(translate('testEndpoint'));
      setServerLocation(`${clientInfo.city}, ${clientInfo.country}`);
    } else {
      // Fallback if clientInfo is not available or fetch failed
      setServerName(translate('defaultServerName'));
      setServerLocation(translate('defaultServerLocation'));
    }
  }, [clientInfo, translate]);


  const resetMetrics = useCallback(() => {
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setCurrentTestPhase("");
  }, []);
  
  useEffect(() => {
    resetMetrics();
  }, [translate, resetMetrics]);


  const simulateTest = () => {
    setIsTesting(true);
    resetMetrics();

    setCurrentTestPhase(translate('ping'));
    setProgress(10);
    setTimeout(() => {
      const simulatedPing = Math.floor(Math.random() * 100) + 5; 
      setPing(simulatedPing);
      setProgress(33);

      setCurrentTestPhase(translate('downloadSpeed'));
      let currentDownload = 0;
      const downloadInterval = setInterval(() => {
        currentDownload += Math.random() * 20; 
        setDownloadSpeed(Math.min(currentDownload, Math.random() * 500 + 50)); 
        setProgress(p => Math.min(p + 5, 66));
        if (currentDownload >= (Math.random() * 400 + 50) || progress >= 66) { 
            setDownloadSpeed(Math.random() * 500 + 50); 
            clearInterval(downloadInterval);
            setProgress(66);

            setCurrentTestPhase(translate('uploadSpeed'));
            let currentUpload = 0;
            const uploadInterval = setInterval(() => {
                currentUpload += Math.random() * 15;
                setUploadSpeed(Math.min(currentUpload, Math.random() * 300 + 30)); 
                setProgress(p => Math.min(p + 5, 100));
                 if (currentUpload >= (Math.random() * 250 + 30) || progress >= 99) {
                    setUploadSpeed(Math.random() * 300 + 30); 
                    clearInterval(uploadInterval);
                    setProgress(100);
                    
                    setIsTesting(false);
                    setCurrentTestPhase(translate('results'));
                    const finalDownloadSpeed = parseFloat((Math.random() * 500 + 50).toFixed(2));
                    const finalUploadSpeed = parseFloat((Math.random() * 300 + 30).toFixed(2));

                    const result: TestResult = {
                        id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
                        date: new Date().toISOString(),
                        download: finalDownloadSpeed,
                        upload: finalUploadSpeed,
                        ping: simulatedPing,
                        fileSize: selectedFileSize,
                        serverName: serverName, 
                        serverLocation: serverLocation,
                        ipAddress: clientInfo?.ip || 'N/A',
                    };
                    onTestComplete(result);
                    setDownloadSpeed(finalDownloadSpeed);
                    setUploadSpeed(finalUploadSpeed);
                }
            }, 200);
        }
      }, 200);
    }, 1000);
  };

  const handleStartTest = () => {
    if (isTesting) {
        setIsTesting(false);
        resetMetrics();
        setCurrentTestPhase(translate('testHistory')); 
    } else {
        simulateTest();
    }
  };

  const displayServerName = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : serverName;
  const displayServerLocation = isLoadingClientInfo && !clientInfo ? '...' : serverLocation;
  const displayIpAddress = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (clientInfo?.ip || 'N/A');

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

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Server Info */}
            <div className="flex items-center gap-2 text-sm">
              <ServerIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{displayServerName}</p>
                <p className="text-xs text-muted-foreground">{displayServerLocation}</p>
              </div>
            </div>

            {/* IP Address Info */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{translate('yourIpAddress')}</p>
                <p className="text-xs text-muted-foreground">{displayIpAddress}</p>
              </div>
            </div>
          </div>

          {/* File Size Selector */}
          <div className="w-full flex sm:justify-end">
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
