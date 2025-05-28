
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Gauge from './gauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Zap, Server as ServerIcon, Play, Pause, MapPin, Network, Activity } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { TestResult, FileSizeOption } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface SpeedTestCardProps {
  onTestComplete: (result: TestResult) => void;
}

interface ClientInfo {
  ip: string;
  city: string;
  country: string;
  network: string;
}

const fileSizes: FileSizeOption[] = ["1MB", "5MB", "10MB", "50MB", "100MB"];
const BASE_DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes=';
const PING_URL = 'https://speed.cloudflare.com/cdn-cgi/trace'; // Small, fast endpoint
const PING_COUNT = 3; // Number of ping attempts to average (or take min)


const parseFileSizeToBytes = (fileSize: FileSizeOption): number => {
  const sizePart = parseInt(fileSize.replace("MB", ""), 10);
  if (isNaN(sizePart)) return 10000000; 
  return sizePart * 1000 * 1000; 
};

const SpeedTestCard: React.FC<SpeedTestCardProps> = ({ onTestComplete }) => {
  const { translate, dir } = useTranslation();
  const { toast } = useToast();
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
  
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    const fetchClientInfo = async () => {
      setIsLoadingClientInfo(true);
      setClientInfo(null);
      try {
        const response = await fetch('https://ip-api.com/json'); // Changed endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch IP info, status: ' + response.status);
        }
        const data = await response.json();
        if (data.status === 'fail') {
          throw new Error('Failed to fetch IP info: ' + (data.message || 'API returned fail status'));
        }
        const fetchedClientInfo: ClientInfo = {
          ip: data.query || 'N/A', // 'query' field for ip-api.com
          city: data.city || 'N/A',
          country: data.country || 'N/A', // 'country' field for ip-api.com (country name)
          network: data.org || 'N/A', // 'org' field for ISP
        };
        setClientInfo(fetchedClientInfo);
      } catch (error: any) {
        console.error("Error fetching client info:", error);
        toast({
            title: translate('errorTitle'),
            description: translate('failedToFetchClientInfo') + (error.message ? `: ${error.message}` : ''),
            variant: "destructive",
        });
        setClientInfo({ ip: 'N/A', city: 'N/A', country: 'N/A', network: 'N/A' });
      } finally {
        setIsLoadingClientInfo(false);
      }
    };
    fetchClientInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, translate]);

  useEffect(() => {
    if (clientInfo && clientInfo.ip !== 'N/A' && clientInfo.city !== 'N/A' && clientInfo.country !== 'N/A') {
      setServerName(translate('testEndpoint'));
      setServerLocation(`${clientInfo.city}, ${clientInfo.country}`);
    } else {
      setServerName(translate('defaultServerName'));
      setServerLocation(translate('defaultServerLocation'));
    }
  }, [clientInfo, translate]);

  const resetTestState = useCallback(() => {
    setIsTesting(false);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setCurrentTestPhase(translate('testHistory')); 
    if (abortController) {
        abortController.abort();
    }
    setAbortController(null);
  }, [translate, abortController]);

  useEffect(() => {
    // Reset speeds and progress if language changes to avoid showing old numbers with new labels
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setCurrentTestPhase("");
  }, [translate]);


  const runSpeedTest = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setIsTesting(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setProgress(0);
    setCurrentTestPhase("");

    let finalDownloadSpeed = 0;
    let finalUploadSpeed = 0;
    let finalPing = 0;

    try {
      // 1. Ping Test (Real HTTP-based)
      setCurrentTestPhase(translate('ping'));
      setProgress(5); 
      let pings = [];
      for (let i = 0; i < PING_COUNT; i++) {
        if (controller.signal.aborted) { resetTestState(); return; }
        const startTime = Date.now();
        try {
            await fetch(PING_URL, { method: 'HEAD', signal: controller.signal, cache: 'no-store' });
            pings.push(Date.now() - startTime);
        } catch (err) {
            console.warn("Ping attempt failed:", err);
            pings.push(1000); 
        }
        await new Promise(resolve => setTimeout(resolve, 100)); 
      }
      if (controller.signal.aborted) { resetTestState(); return; }
      
      finalPing = pings.length > 0 ? Math.min(...pings) : 0;
      setPing(finalPing);
      setProgress(15); 


      // 2. Download Test (Real)
      setCurrentTestPhase(translate('downloadSpeed'));
      const downloadSizeInBytes = parseFileSizeToBytes(selectedFileSize);
      const downloadUrl = `${BASE_DOWNLOAD_URL}${downloadSizeInBytes}`;
      let downloadedBytes = 0;
      const downloadStartTime = Date.now();

      const response = await fetch(downloadUrl, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      if (!response.body) throw new Error('Response body is null for download');
      
      const reader = response.body.getReader();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (controller.signal.aborted) {
          try { await reader.cancel('Test aborted by user'); } catch {}
          resetTestState(); return;
        }
        const { done, value } = await reader.read();
        if (done) break;

        downloadedBytes += value.length;
        const elapsedTimeSeconds = (Date.now() - downloadStartTime) / 1000;
        
        if (elapsedTimeSeconds > 0) {
            const currentSpeedMbps = (downloadedBytes * 8) / (elapsedTimeSeconds * 1000000);
            setDownloadSpeed(currentSpeedMbps); 
        }
        const downloadProgressPercentage = (downloadedBytes / downloadSizeInBytes) * 100;
        setProgress(15 + Math.min((downloadProgressPercentage / 100) * 55, 55));
      }
      if (response.body.locked) {
          try { reader.releaseLock(); } catch {}
      }
      
      const downloadEndTime = Date.now();
      const totalDownloadTimeSeconds = (downloadEndTime - downloadStartTime) / 1000;
      finalDownloadSpeed = totalDownloadTimeSeconds > 0
          ? (downloadedBytes * 8) / (totalDownloadTimeSeconds * 1000000)
          : 0;
      setDownloadSpeed(parseFloat(finalDownloadSpeed.toFixed(2)));
      setProgress(70); 

      // 3. Upload Test (Simulated)
      setCurrentTestPhase(translate('uploadSpeed'));
      const uploadSimulationDuration = 1000 + (downloadSizeInBytes / 1000000) * 100 + Math.random() * 500; 
      const uploadIntervalTime = 150;
      const numUploadIntervals = Math.max(1, Math.round(uploadSimulationDuration / uploadIntervalTime));
      let simulatedUploadedProportion = 0;

      for (let i = 0; i < numUploadIntervals; i++) {
          if (controller.signal.aborted) { resetTestState(); return; }
          await new Promise(resolve => setTimeout(resolve, uploadIntervalTime));
          simulatedUploadedProportion = (i + 1) / numUploadIntervals;
          // Simulate upload speed based on a fraction of download speed, plus some randomness
          const simulatedSpeed = Math.random() * (finalDownloadSpeed / 2 + 50) + 10;
          setUploadSpeed(Math.max(0.1, simulatedSpeed)); // Ensure it's not zero if dl speed was zero
          setProgress(70 + Math.min(simulatedUploadedProportion * 30, 30));
      }
      finalUploadSpeed = parseFloat((Math.random() * (finalDownloadSpeed / 1.5 + 20) + 5).toFixed(2)); 
      setUploadSpeed(Math.max(0.1, finalUploadSpeed));
      setProgress(100); 

      // Test Complete
      setCurrentTestPhase(translate('results'));
      const result: TestResult = {
        id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
        date: new Date().toISOString(),
        download: parseFloat(finalDownloadSpeed.toFixed(2)),
        upload: parseFloat(uploadSpeed.toFixed(2)), // Use the last set upload speed for history
        ping: finalPing,
        fileSize: selectedFileSize,
        serverName: serverName || translate('defaultServerName'),
        serverLocation: serverLocation || translate('defaultServerLocation'),
        ipAddress: clientInfo?.ip || 'N/A',
      };
      onTestComplete(result);

    } catch (error: any) {
      if (controller.signal.aborted || error.name === 'AbortError') {
        console.log("Test explicitly aborted.");
      } else {
        console.error("Speed test error:", error);
        toast({ title: translate('appName'), description: `${translate('testFailed')}: ${error.message}`, variant: "destructive" });
      }
      resetTestState();
      return;
    } finally {
      setIsTesting(false);
      setAbortController(null);
    }
  };

  const handleStartTest = () => {
    if (isTesting && abortController) {
        abortController.abort(); 
    } else {
        runSpeedTest();
    }
  };

  const displayServerName = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (serverName || translate('defaultServerName'));
  const displayServerLocation = isLoadingClientInfo && !clientInfo ? '...' : (serverLocation || translate('defaultServerLocation'));
  const displayIpAddress = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (clientInfo?.ip || 'N/A');
  const displayNetworkProvider = isLoadingClientInfo && !clientInfo ? translate('fetchingLocation') : (clientInfo?.network || 'N/A');

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Activity className="w-7 h-7 sm:w-8 sm:h-8" />
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
            <div className="flex items-center gap-2 text-sm">
              <ServerIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{displayServerName}</p>
                <p className="text-xs text-muted-foreground">{displayServerLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{translate('yourIpAddress')}</p>
                <p className="text-xs text-muted-foreground">{displayIpAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Network className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">{translate('networkProvider')}</p>
                <p className="text-xs text-muted-foreground">{displayNetworkProvider}</p>
              </div>
            </div>
          </div>

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

    