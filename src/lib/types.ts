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
  ipAddress?: string; // Added user's IP address
}

// Updated to cap at 100MB for real download tests
export type FileSizeOption = "1MB" | "5MB" | "10MB" | "50MB" | "100MB";
