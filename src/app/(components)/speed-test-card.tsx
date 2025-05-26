
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Gauge from './gauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Zap, Server as ServerIcon, Play, Pause, BarChartHorizontalBig, MapPin, Network } from 'lucide-react';
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

const parseFileSizeToMB = (fileSize: FileSizeOption): number => {
  const match = fileSize.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 10; // Default to 10MB if parsing fails or for unexpected format
};

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

  // Abort controller for stopping ongoing fetch/simulation
  const [abortController, setAbortController] = useState<AbortController | null>(null);


  useEffect(() => {
    const fetchClientInfo = async () => {
      setIsLoadingClientInfo(true);
      setClientInfo(null);
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
        setClientInfo({ ip: 'N/A', city: 'N/A', country: 'N/A', network: 'N/A' });
      } finally {
        setIsLoadingClientInfo(false);
      }
    };

    fetchClientInfo();
  }, []);

  useEffect(() => {
    if (clientInfo && clientInfo.ip !== 'N/A' && clientInfo.city !== 'N/A' && clientInfo.country !== 'N/A') {
      setServerName(translate('testEndpoint'));
      setServerLocation(`${clientInfo.city}, ${clientInfo.country}`);
    } else {
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
    const controller = new AbortController();
    setAbortController(controller);
    setIsTesting(true);
    resetMetrics();

    const fileSizeMB = parseFileSizeToMB(selectedFileSize);
    // Base "amount of data" to simulate transferring for a 10MB file.
    // These values are arbitrary and just for simulation scaling.
    const baseDownloadAmount = 150; 
    const baseUploadAmount = 100;

    const targetSimulatedDownloadAmount = (fileSizeMB / 10) * baseDownloadAmount * (Math.random() * 0.4 + 0.8); // Add some randomness
    const targetSimulatedUploadAmount = (fileSizeMB / 10) * baseUploadAmount * (Math.random() * 0.4 + 0.8);


    setCurrentTestPhase(translate('ping'));
    setProgress(10);
    const pingTimeout = setTimeout(() => {
      if (controller.signal.aborted) return;
      const simulatedPing = Math.floor(Math.random() * 100) + 5;
      setPing(simulatedPing);
      setProgress(33);

      setCurrentTestPhase(translate('downloadSpeed'));
      let currentSimulatedDownloaded = 0;
      const downloadInterval = setInterval(() => {
        if (controller.signal.aborted) {
          clearInterval(downloadInterval);
          return;
        }
        // Simulate data chunk being downloaded
        currentSimulatedDownloaded += Math.random() * 5 + (fileSizeMB / 50); // Increment chunk size slightly with file size
        setDownloadSpeed(Math.min(Math.random() * 500 + 50, 550)); // Random current speed, capped
        
        const downloadProgress = Math.min((currentSimulatedDownloaded / targetSimulatedDownloadAmount) * 33, 33);
        setProgress(33 + downloadProgress);

        if (currentSimulatedDownloaded >= targetSimulatedDownloadAmount || progress >= 66) {
          setDownloadSpeed(Math.random() * 500 + 50); // Final random speed
          clearInterval(downloadInterval);
          setProgress(66);

          setCurrentTestPhase(translate('uploadSpeed'));
          let currentSimulatedUploaded = 0;
          const uploadInterval = setInterval(() => {
            if (controller.signal.aborted) {
              clearInterval(uploadInterval);
              return;
            }
            currentSimulatedUploaded += Math.random() * 4 + (fileSizeMB / 60);
            setUploadSpeed(Math.min(Math.random() * 300 + 30, 350));
            
            const uploadProgress = Math.min((currentSimulatedUploaded / targetSimulatedUploadAmount) * 34, 34);
            setProgress(66 + uploadProgress);

            if (currentSimulatedUploaded >= targetSimulatedUploadAmount || progress >= 99) {
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
                serverName: serverName || translate('defaultServerName'),
                serverLocation: serverLocation || translate('defaultServerLocation'),
                ipAddress: clientInfo?.ip || 'N/A',
              };
              onTestComplete(result);
              setDownloadSpeed(finalDownloadSpeed);
              setUploadSpeed(finalUploadSpeed);
              setAbortController(null);
            }
          }, 200);
        }
      }, 200);
    }, 1000);

    controller.signal.addEventListener('abort', () => {
        clearTimeout(pingTimeout);
        // @ts-ignore
        clearInterval(downloadInterval);
        // @ts-ignore
        clearInterval(uploadInterval);
        resetMetrics();
        setIsTesting(false);
        setCurrentTestPhase(translate('testHistory')); // Or some "test cancelled" message
        setAbortController(null);
    });
  };

  const handleStartTest = () => {
    if (isTesting && abortController) {
        abortController.abort();
    } else {
        simulateTest();
    }
  };

  const displayServerName = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (serverName || translate('defaultServerName'));
  const displayServerLocation = isLoadingClientInfo && !clientInfo ? '...' : (serverLocation || translate('defaultServerLocation'));
  const displayIpAddress = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (clientInfo?.ip || 'N/A');
  const displayNetworkProvider = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (clientInfo?.network || 'N/A');


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

            {/* Network Provider Info */}
            <div className="flex items-center gap-2 text-sm">
              <Network className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{translate('networkProvider')}</p>
                <p className="text-xs text-muted-foreground">{displayNetworkProvider}</p>
              </div>
            </div>
          </div>

          {/* File Size Selector */}
          <div className="w-full flex sm:justify-end mt-4 sm:mt-0">
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
              <Pause className={`w-6 h-6 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {translate('stopTest')}
            </>
          ) : (
            <>
              <Play className={`w-6 h-6 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {translate('startTest')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpeedTestCard;

    