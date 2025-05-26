"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Download, Upload, Zap, CalendarDays, FileText, Server, MapPin } from 'lucide-react';
import type { TestResult } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';


interface TestHistoryTableProps {
  history: TestResult[];
  onClearHistory: () => void;
}

const TestHistoryTable: React.FC<TestHistoryTableProps> = ({ history, onClearHistory }) => {
  const { translate, language, dir } = useTranslation();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp', { locale: language === 'ar' ? arSA : enUS });
    } catch (error) {
      return dateString; 
    }
  };

  const handleClearHistory = () => {
    onClearHistory();
    setIsAlertDialogOpen(false);
  }

  return (
    <Card className="mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-primary" />
          {translate('testHistory')}
        </CardTitle>
        <CardDescription>
          {translate('noHistory').split('.')[0] + '.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{translate('noHistory')}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap"><CalendarDays className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('date')}</TableHead>
                  <TableHead className="text-center whitespace-nowrap"><Download className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('downloadSpeed')} ({translate('mbps')})</TableHead>
                  <TableHead className="text-center whitespace-nowrap"><Upload className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('uploadSpeed')} ({translate('mbps')})</TableHead>
                  <TableHead className="text-center whitespace-nowrap"><Zap className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('ping')} ({translate('ms')})</TableHead>
                  <TableHead className="text-center whitespace-nowrap"><FileText className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('fileSize')}</TableHead>
                  <TableHead className="whitespace-nowrap"><Server className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('server')}</TableHead>
                  <TableHead className="whitespace-nowrap"><MapPin className="inline h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0"/>{translate('yourIpAddress')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium whitespace-nowrap">{formatDate(item.date)}</TableCell>
                    <TableCell className="text-center">{item.download.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.upload.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.ping}</TableCell>
                    <TableCell className="text-center">{item.fileSize}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.serverName} <span className="text-xs text-muted-foreground">({item.serverLocation})</span></TableCell>
                    <TableCell className="whitespace-nowrap">{item.ipAddress || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {history.length > 0 && (
        <CardFooter className="flex justify-end">
           <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen} dir={dir}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {translate('clearHistory')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{translate('confirmClearHistory').split('?')[0]}?</AlertDialogTitle>
                <AlertDialogDescription>
                  {translate('confirmClearHistory').split('?')[1]?.trim()}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{translate('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  {translate('confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default TestHistoryTable;
