
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wifi } from 'lucide-react'; // Using Wifi as a generic icon for bands
import { useTranslation } from '@/hooks/use-translation';

interface BandInfo {
  frequency: string;
  band: string;
}

const fddBands: BandInfo[] = [
  { frequency: "700 MHz", band: "B28" },
  { frequency: "800 MHz", band: "B20" },
  { frequency: "900 MHz", band: "B8" },
  { frequency: "1800 MHz", band: "B3" },
  { frequency: "2100 MHz", band: "B1" },
  { frequency: "2600 MHz", band: "B7" },
];

const tddBands: BandInfo[] = [
  { frequency: "2300 MHz", band: "B40" },
  { frequency: "2500 MHz", band: "B41" },
  { frequency: "2600 MHz", band: "B38" },
];

const FrequencyBandsTable: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <Card className="mt-8 mb-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Wifi className="w-6 h-6 text-primary" />
          {translate('frequencyBandsTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">{translate('fddBands')}</h3>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">{translate('frequencyColumn')}</TableHead>
                    <TableHead>{translate('bandColumn')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fddBands.map((item) => (
                    <TableRow key={`fdd-${item.band}`}>
                      <TableCell className="font-medium">{item.frequency}</TableCell>
                      <TableCell>{item.band}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">{translate('tdBands')}</h3>
             <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">{translate('frequencyColumn')}</TableHead>
                    <TableHead>{translate('bandColumn')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tddBands.map((item) => (
                    <TableRow key={`tdd-${item.band}`}>
                      <TableCell className="font-medium">{item.frequency}</TableCell>
                      <TableCell>{item.band}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyBandsTable;
