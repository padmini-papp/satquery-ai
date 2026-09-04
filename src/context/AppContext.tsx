import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenType,
  ThemeMode,
  DetectionParameter,
  AnalysisSession,
  TraceStep,
  QueryMessage,
} from '../types';
import {
  DEFAULT_SESSION,
  DEFAULT_TRACE_STEPS,
  INITIAL_CHAT_MESSAGES,
  MOCK_HISTORY_SESSIONS,
  STITCH_IMAGES,
} from '../services/mockAnalysisService';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  targetCoordinates: string;
  setTargetCoordinates: (coord: string) => void;
  uploadedFiles: string[];
  addUploadedFile: (filename: string) => void;
  selectedParameters: DetectionParameter[];
  toggleParameter: (param: DetectionParameter) => void;
  session: AnalysisSession;
  setSession: (session: AnalysisSession) => void;
  traceSteps: TraceStep[];
  chatMessages: QueryMessage[];
  sendChatMessage: (text: string) => void;
  startAnalysisFlow: (queryText?: string, imageUrl?: string) => void;
  isProcessing: boolean;
  historySessions: AnalysisSession[];
  selectHistorySession: (session: AnalysisSession) => void;
  currentImage: string;
  setCurrentImage: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [theme, setTheme] = useState<ThemeMode>('navy');
  const [targetCoordinates, setTargetCoordinates] = useState<string>(
    "26.2341° N, 54.3412° E (Strait of Hormuz)"
  );
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'sentinel2_sector7g_b04_b08.tif',
  ]);
  const [selectedParameters, setSelectedParameters] = useState<DetectionParameter[]>([
    'VESSELS',
    'INFRASTRUCTURE',
  ]);
  const [session, setSession] = useState<AnalysisSession>(DEFAULT_SESSION);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>(DEFAULT_TRACE_STEPS);
  const [chatMessages, setChatMessages] = useState<QueryMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [historySessions] = useState<AnalysisSession[]>(MOCK_HISTORY_SESSIONS);
  const [currentImage, setCurrentImage] = useState<string>(STITCH_IMAGES.hormuzStrait);

  // Sync theme class with HTML document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'midnight') {
      root.classList.add('theme-midnight');
      document.body.style.backgroundColor = '#000000';
    } else {
      root.classList.remove('theme-midnight');
      document.body.style.backgroundColor = '#0c1324';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'navy' ? 'midnight' : 'navy'));
  };

  const toggleParameter = (param: DetectionParameter) => {
    setSelectedParameters((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const addUploadedFile = (filename: string) => {
    setUploadedFiles((prev) => [...prev, filename]);
  };

  const selectHistorySession = (selected: AnalysisSession) => {
    setSession(selected);
    setCurrentImage(selected.imageryUrl);
    setTargetCoordinates(selected.coordinates);
    setCurrentScreen('result');
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: QueryMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Simulate Agent response
    setTimeout(() => {
      let replyText = 'Telemetry query acknowledged. Neural feature extraction completed across optical bands.';
      let alertMsg: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('water') || lower.includes('lake') || lower.includes('ocean')) {
        replyText = 'Hydrographic segmentation complete: NDWI spectral response detected 2 primary water retention basins.';
        alertMsg = 'Boundary confidence 96.2%. No anomalous reservoir drawdown detected in last 14 days.';
      } else if (lower.includes('change') || lower.includes('temporal') || lower.includes('sector 7')) {
        replyText = 'Bi-temporal comparison running against baseline acquisition (2023-08-15)...';
        alertMsg = 'Alert: 14.2 ha structural delta identified. New container terminal footprints classified.';
      } else if (lower.includes('vessel') || lower.includes('ship') || lower.includes('tanker')) {
        replyText = 'Processing historical AIS transponder telemetry against high-res synthetic aperture radar...';
        alertMsg = 'Alert: 3 vessels have altered course simultaneously, converging on coordinates [26.23, 54.34].';
      }

      const agentMsg: QueryMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: replyText,
        alertText: alertMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        confidence: 94,
      };

      setChatMessages((prev) => [...prev, agentMsg]);
    }, 800);
  };

  // Automated step-by-step processing simulation
  const startAnalysisFlow = (queryText?: string, imageUrl?: string) => {
    if (queryText) {
      sendChatMessage(queryText);
    }
    if (imageUrl) {
      setCurrentImage(imageUrl);
    }
    setIsProcessing(true);
    setCurrentScreen('processing');

    // Reset steps
    setTraceSteps([
      { id: 's1', name: 'validate_image', status: 'running', latencyMs: undefined, details: 'Validating GSD & GeoTIFF headers...' },
      { id: 's2', name: 'classify_modality', status: 'pending', latencyMs: undefined, details: 'Awaiting sensor classification' },
      { id: 's3', name: 'ChangeChat Inference', status: 'pending', latencyMs: undefined, details: 'Awaiting neural inference' },
      { id: 's4', name: 'generate_visual_evidence', status: 'pending', latencyMs: undefined, details: 'Awaiting mask extraction' },
    ]);

    // Step 1 done
    setTimeout(() => {
      setTraceSteps((prev) =>
        prev.map((s, idx) =>
          idx === 0
            ? { ...s, status: 'completed', latencyMs: 2, details: 'Resolution: 0.5m GSD. OK.' }
            : idx === 1
            ? { ...s, status: 'running', details: 'Identifying multi-spectral bands...' }
            : s
        )
      );
    }, 600);

    // Step 2 done
    setTimeout(() => {
      setTraceSteps((prev) =>
        prev.map((s, idx) =>
          idx === 1
            ? { ...s, status: 'completed', latencyMs: 12, details: 'Detected: Optical (RGB) + SAR Cross-Modal' }
            : idx === 2
            ? { ...s, status: 'running', details: 'Running bi-temporal change detection neural net...' }
            : s
        )
      );
    }, 1300);

    // Step 3 done
    setTimeout(() => {
      setTraceSteps((prev) =>
        prev.map((s, idx) =>
          idx === 2
            ? { ...s, status: 'completed', latencyMs: 32, details: 'ChangeChat inference completed. 1 anomaly cluster identified.' }
            : idx === 3
            ? { ...s, status: 'running', details: 'Rendering bounding boxes & confidence score...' }
            : s
        )
      );
    }, 2000);

    // Step 4 done and switch to results
    setTimeout(() => {
      setTraceSteps((prev) =>
        prev.map((s, idx) =>
          idx === 3
            ? { ...s, status: 'completed', latencyMs: 6, details: 'Bounding masks linked: T2: NEW STRUCTURE (94% confidence).' }
            : s
        )
      );
      setIsProcessing(false);
      setCurrentScreen('result');
    }, 2600);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        theme,
        toggleTheme,
        targetCoordinates,
        setTargetCoordinates,
        uploadedFiles,
        addUploadedFile,
        selectedParameters,
        toggleParameter,
        session,
        setSession,
        traceSteps,
        chatMessages,
        sendChatMessage,
        startAnalysisFlow,
        isProcessing,
        historySessions,
        selectHistorySession,
        currentImage,
        setCurrentImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
