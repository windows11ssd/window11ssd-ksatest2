
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import type { Messages } from '@/lib/types'; // Assuming Messages type is defined for your locale structure

interface NetworkingTerm {
  id: string;
  nameKey: keyof Messages;
  explanationKey: keyof Messages;
}

const terms: NetworkingTerm[] = [
  { id: '5g_nsa', nameKey: 'termName5gNsa', explanationKey: 'termExplanation5gNsa' },
  { id: 'rsrp', nameKey: 'termNameRsrp', explanationKey: 'termExplanationRsrp' },
  { id: 'pci', nameKey: 'termNamePci', explanationKey: 'termExplanationPci' },
  { id: 'sinr', nameKey: 'termNameSinr', explanationKey: 'termExplanationSinr' },
  { id: 'imei', nameKey: 'termNameImei', explanationKey: 'termExplanationImei' },
  { id: 'rsrq', nameKey: 'termNameRsrq', explanationKey: 'termExplanationRsrq' },
  { id: '5g_connected_band', nameKey: 'termName5gConnectedBand', explanationKey: 'termExplanation5gConnectedBand' },
  { id: '5g_signal_strength', nameKey: 'termName5gSignalStrength', explanationKey: 'termExplanation5gSignalStrength' },
  { id: '4g_signal_strength', nameKey: 'termName4gSignalStrength', explanationKey: 'termExplanation4gSignalStrength' },
  { id: '5g_sa', nameKey: 'termName5gSa', explanationKey: 'termExplanation5gSa' },
  { id: '5g_sinr', nameKey: 'termName5gSinr', explanationKey: 'termExplanation5gSinr' },
  { id: 'ecio', nameKey: 'termNameEcio', explanationKey: 'termExplanationEcio' },
  { id: 'cell_id', nameKey: 'termNameCellId', explanationKey: 'termExplanationCellId' },
  { id: 'lac', nameKey: 'termNameLac', explanationKey: 'termExplanationLac' },
  { id: 'mcc', nameKey: 'termNameMcc', explanationKey: 'termExplanationMcc' },
  { id: 'mnc', nameKey: 'termNameMnc', explanationKey: 'termExplanationMnc' },
  { id: 'gsm', nameKey: 'termNameGsm', explanationKey: 'termExplanationGsm' },
  { id: 'lte', nameKey: 'termNameLte', explanationKey: 'termExplanationLte' },
  { id: 'hsdpa', nameKey: 'termNameHsdpa', explanationKey: 'termExplanationHsdpa' },
  { id: 'tac', nameKey: 'termNameTac', explanationKey: 'termExplanationTac' },
  { id: 'h_plus', nameKey: 'termNameHPlus', explanationKey: 'termExplanationHPlus' },
  { id: 'asu', nameKey: 'termNameAsu', explanationKey: 'termExplanationAsu' },
  { id: 'ip', nameKey: 'termNameIp', explanationKey: 'termExplanationIp' },
  { id: 'ipv4', nameKey: 'termNameIpv4', explanationKey: 'termExplanationIpv4' },
  { id: 'ipv6', nameKey: 'termNameIpv6', explanationKey: 'termExplanationIpv6' },
];

const NetworkingTermsExplainer: React.FC = () => {
  const { translate, language, dir } = useTranslation();
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [currentExplanation, setCurrentExplanation] = useState<string>('');

  useEffect(() => {
    if (selectedTermId) {
      const term = terms.find(t => t.id === selectedTermId);
      if (term) {
        setCurrentExplanation(translate(term.explanationKey));
      }
    } else {
      setCurrentExplanation(translate('selectTermPrompt'));
    }
  }, [selectedTermId, language, translate]);

  const handleTermChange = (value: string) => {
    setSelectedTermId(value);
  };

  return (
    <Card className="mt-8 mb-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          {/* You can add an icon here if you like, e.g., <BookOpen className="w-6 h-6 text-primary" /> */}
          {translate('networkingTermsTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleTermChange} dir={dir}>
          <SelectTrigger className="w-full" aria-label={translate('selectNetworkTermPlaceholder')}>
            <SelectValue placeholder={translate('selectNetworkTermPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {terms.map(term => (
              <SelectItem key={term.id} value={term.id}>
                {translate(term.nameKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] text-sm">
          <p className="text-foreground whitespace-pre-wrap">{currentExplanation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkingTermsExplainer;
