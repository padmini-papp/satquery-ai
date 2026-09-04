export type ScreenType = 'landing' | 'console' | 'processing' | 'result' | 'temporal' | 'history';

export type ThemeMode = 'navy' | 'midnight';

export type DetectionParameter = 'VESSELS' | 'AIRCRAFT' | 'INFRASTRUCTURE' | 'VEHICLES';

export interface TraceStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  latencyMs?: number;
  details?: string;
}

export interface DetectedEntity {
  id: string;
  label: string;
  confidence: number;
  type: 'high' | 'medium' | 'low';
}

export interface TelemetryData {
  altitude: string;
  velocity: string;
  sensor: string;
  source: string;
  date: string;
  resolution: string;
  cloudCover: string;
  coordinates: {
    lat: number;
    lng: number;
    formatted: string;
  };
}

export interface VerificationItem {
  id: string;
  label: string;
  status: 'MATCH' | 'PENDING' | 'DISCREPANCY';
}

export interface QueryMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  alertText?: string;
  confidence?: number;
}

export interface AnalysisSession {
  id: string;
  targetId: string;
  targetTitle: string;
  coordinates: string;
  confidenceScore: number;
  sensor: string;
  date: string;
  executiveSummary: string;
  vehicleClusterAlert: string;
  thermalAnomalyAlert: string;
  verification: VerificationItem[];
  imageryUrl: string;
  traceSteps: TraceStep[];
}
