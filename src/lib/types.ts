
export type Language = 'en' | 'ar';

export interface TestResult {
  id: string;
  date: string; // ISO string format
  download: number; // Mbps
  upload: number; // Mbps
  ping: number; // ms
  fileSize: string; // e.g., "10MB"
  serverName: string;
  serverLocation: string;
  ipAddress?: string; 
}

export type FileSizeOption = "1MB" | "5MB" | "10MB" | "50MB" | "100MB";

// Define a more specific type for your translation message keys if possible
// This is a generic placeholder. Ideally, it would be auto-generated from your JSON files.
export type Messages = {
  [key: string]: string;
  networkingTermsTitle: string;
  selectNetworkTermPlaceholder: string;
  selectTermPrompt: string;
  termName5gNsa: string;
  termExplanation5gNsa: string;
  termNameRsrp: string;
  termExplanationRsrp: string;
  termNamePci: string;
  termExplanationPci: string;
  termNameSinr: string;
  termExplanationSinr: string;
  termNameImei: string;
  termExplanationImei: string;
  termNameRsrq: string;
  termExplanationRsrq: string;
  termName5gConnectedBand: string;
  termExplanation5gConnectedBand: string;
  termName5gSignalStrength: string;
  termExplanation5gSignalStrength: string;
  termName4gSignalStrength: string;
  termExplanation4gSignalStrength: string;
  termName5gSa: string;
  termExplanation5gSa: string;
  termName5gSinr: string;
  termExplanation5gSinr: string;
  termNameEcio: string;
  termExplanationEcio: string;
  termNameCellId: string;
  termExplanationCellId: string;
  termNameLac: string;
  termExplanationLac: string;
  termNameMcc: string;
  termExplanationMcc: string;
  termNameMnc: string;
  termExplanationMnc: string;
  termNameGsm: string;
  termExplanationGsm: string;
  termNameLte: string;
  termExplanationLte: string;
  termNameHsdpa: string;
  termExplanationHsdpa: string;
  termNameTac: string;
  termExplanationTac: string;
  termNameHPlus: string;
  termExplanationHPlus: string;
  termNameAsu: string;
  termExplanationAsu: string;
  termNameIp: string;
  termExplanationIp: string;
  termNameIpv4: string;
  termExplanationIpv4: string;
  termNameIpv6: string;
  termExplanationIpv6: string;
  // ... add other existing keys from your en.json/ar.json
  appName: string;
  tagline: string;
  downloadSpeed: string;
  uploadSpeed: string;
  ping: string;
  server: string;
  testHistory: string;
  selectFileSize: string;
  startTest: string;
  testingInProgress: string;
  results: string;
  mbps: string;
  ms: string;
  date: string;
  fileSize: string;
  language: string;
  english: string;
  arabic: string;
  theme: string;
  light: string;
  dark: string;
  noHistory: string;
  serverInfo: string;
  defaultServerName: string;
  defaultServerLocation: string;
  stopTest: string;
  shareResults: string;
  clearHistory: string;
  confirmClearHistory: string;
  cancel: string;
  confirm: string;
  yourIpAddress: string;
  fetchingLocation: string;
  testEndpoint: string;
  networkProvider: string;
};
