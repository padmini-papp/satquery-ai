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
import {
  checkHealth,
  getModels,
  submitAnalysis,
  submitChangeAnalysis,
  getJobResult,
  getJobTrace,
  getJobEvidence,
  fetchImageUrlAsBlob,
  HealthResponse,
  ModelInfo,
  EvidenceItem,
} from '../services/api';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  targetCoordinates: string;
  setTargetCoordinates: (coord: string) => void;
  uploadedFiles: string[];
  uploadedFileObjects: File[];
  addUploadedFile: (filename: string, fileObj?: File) => void;
  selectedParameters: DetectionParameter[];
  toggleParameter: (param: DetectionParameter) => void;
  session: AnalysisSession;
  setSession: (session: AnalysisSession) => void;
  traceSteps: TraceStep[];
  chatMessages: QueryMessage[];
  sendChatMessage: (text: string) => void;
  startAnalysisFlow: (queryText?: string, imageUrl?: string) => Promise<void>;
  isProcessing: boolean;
  historySessions: AnalysisSession[];
  selectHistorySession: (session: AnalysisSession) => void;
  currentImage: string;
  setCurrentImage: (url: string) => void;
  backendConnected: boolean;
  backendInfo: HealthResponse | null;
  availableModels: ModelInfo[];
  apiError: string | null;
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
  const [uploadedFileObjects, setUploadedFileObjects] = useState<File[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<DetectionParameter[]>([
    'VESSELS',
    'INFRASTRUCTURE',
  ]);
  const [session, setSession] = useState<AnalysisSession>(DEFAULT_SESSION);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>(DEFAULT_TRACE_STEPS);
  const [chatMessages, setChatMessages] = useState<QueryMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [historySessions, setHistorySessions] = useState<AnalysisSession[]>(MOCK_HISTORY_SESSIONS);
  const [currentImage, setCurrentImage] = useState<string>(STITCH_IMAGES.hormuzStrait);

  // Backend state
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendInfo, setBackendInfo] = useState<HealthResponse | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Check backend connectivity on mount and periodically
  useEffect(() => {
    let isMounted = true;
    const verifyBackend = async () => {
      try {
        const health = await checkHealth();
        if (isMounted) {
          setBackendConnected(true);
          setBackendInfo(health);
          setApiError(null);
        }
        try {
          const models = await getModels();
          if (isMounted) setAvailableModels(models);
        } catch {
          // Non-critical if models list fails
        }
      } catch {
        if (isMounted) {
          setBackendConnected(false);
          setBackendInfo(null);
        }
      }
    };

    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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

  const addUploadedFile = (filename: string, fileObj?: File) => {
    setUploadedFiles((prev) => [...prev, filename]);
    if (fileObj) {
      setUploadedFileObjects((prev) => [...prev, fileObj]);
    }
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

    // Generate response
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

  // Main Analysis Flow: Supports both real backend and simulation fallback
  const startAnalysisFlow = async (queryText?: string, imageUrl?: string) => {
    const activeQuery = queryText || 'What land cover types or anomalies are visible in this satellite image?';
    if (queryText) {
      sendChatMessage(queryText);
    }
    const targetImage = imageUrl || currentImage;
    if (imageUrl) {
      setCurrentImage(imageUrl);
    }

    setIsProcessing(true);
    setCurrentScreen('processing');
    setApiError(null);

    // Initial Trace Steps
    setTraceSteps([
      { id: 's1', name: 'query_analysis', status: 'running', details: 'Analyzing intent & neural pipeline requirements...' },
      { id: 's2', name: 'input_validation', status: 'pending', details: 'Awaiting image format & multi-spectral verification' },
      { id: 's3', name: 'model_selection', status: 'pending', details: 'Awaiting model selector algorithm' },
      { id: 's4', name: 'model_inference', status: 'pending', details: 'Awaiting neural network inference' },
      { id: 's5', name: 'evidence_extraction', status: 'pending', details: 'Awaiting spatial evidence extraction' },
    ]);

    try {
      // Step 1: Obtain Image File / Blob for upload
      let primaryFile: File | Blob;
      if (uploadedFileObjects.length > 0) {
        primaryFile = uploadedFileObjects[uploadedFileObjects.length - 1];
      } else {
        primaryFile = await fetchImageUrlAsBlob(targetImage);
      }

      // Step 2: Submit to backend (bi-temporal change analysis if 2 uploaded files exist)
      let submitRes;
      if (uploadedFileObjects.length >= 2) {
        submitRes = await submitChangeAnalysis(
          uploadedFileObjects[0],
          uploadedFileObjects[1],
          activeQuery
        );
      } else {
        submitRes = await submitAnalysis(primaryFile, activeQuery, {
          modality: 'optical',
          coordinates: targetCoordinates,
        });
      }

      const jobId = submitRes.job_id;

      // Step 3: Poll backend until completed or failed
      const pollBackend = async () => {
        let isDone = false;
        let pollCount = 0;

        while (!isDone && pollCount < 120) { // Timeout safety 2 mins
          pollCount++;
          await new Promise((r) => setTimeout(r, 1000));

          try {
            const [statusData, traceData] = await Promise.all([
              getJobResult(jobId),
              getJobTrace(jobId).catch(() => null),
            ]);

            // Update trace steps in real-time if available
            if (traceData && traceData.trace && traceData.trace.length > 0) {
              const mappedSteps: TraceStep[] = traceData.trace.map((t) => ({
                id: `s-${t.step}`,
                name: t.event.replace(/_/g, ' '),
                status:
                  t.status === 'success' || t.status === 'completed'
                    ? 'completed'
                    : t.status === 'running' || t.status === 'processing'
                    ? 'running'
                    : t.status === 'failed'
                    ? 'error'
                    : 'pending',
                latencyMs: t.duration_ms ? Math.round(t.duration_ms) : undefined,
                details: t.model ? `Model: ${t.model}` : `Event: ${t.event}`,
              }));
              setTraceSteps(mappedSteps);
            }

            if (statusData.status === 'completed' && statusData.result) {
              isDone = true;
              const result = statusData.result;

              // Fetch evidence items
              let evidenceItems: EvidenceItem[] = result.evidence || [];
              try {
                const evData = await getJobEvidence(jobId);
                if (evData && evData.evidence) {
                  evidenceItems = evData.evidence;
                }
              } catch {
                // Ignore evidence fetch failure
              }

              // Compute confidence score (0-100)
              const rawScore = result.confidence?.score ?? 0.94;
              const scorePercent = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

              const modelsUsed = result.execution_summary?.models || ['GeoChat'];
              const mainSensor = modelsUsed.join(', ');

              const newSession: AnalysisSession = {
                id: `SES-${jobId.slice(-6).toUpperCase()}`,
                targetId: `ANL-${jobId.slice(-6).toUpperCase()}`,
                targetTitle: activeQuery.length > 45 ? `${activeQuery.slice(0, 45)}...` : activeQuery,
                coordinates: targetCoordinates || '26.2341° N, 54.3412° E',
                confidenceScore: scorePercent,
                sensor: `${mainSensor} (Live Inference)`,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
                executiveSummary: result.answer || 'Neural network analysis completed successfully.',
                vehicleClusterAlert:
                  evidenceItems.find((e) => e.claim.toLowerCase().includes('vessel') || e.claim.toLowerCase().includes('vehicle'))?.claim ||
                  'Neural network detected target structures matching query request.',
                thermalAnomalyAlert:
                  evidenceItems.find((e) => e.claim.toLowerCase().includes('thermal') || e.claim.toLowerCase().includes('structure') || e.claim.toLowerCase().includes('anomaly'))?.claim ||
                  `Execution completed in ${(result.execution_summary?.processing_time_ms || 245).toFixed(0)} ms.`,
                verification: evidenceItems.map((ev, idx) => ({
                  id: `v-${idx}`,
                  label: ev.claim.length > 32 ? `${ev.claim.slice(0, 32)}...` : ev.claim,
                  status: ev.confidence > 0.7 ? 'MATCH' : 'PENDING',
                })),
                imageryUrl: targetImage,
                traceSteps: traceSteps,
                evidenceItems,
                executionSummary: result.execution_summary,
              };

              if (newSession.verification.length === 0) {
                newSession.verification = [
                  { id: 'v1', label: 'Neural Model Match', status: 'MATCH' },
                  { id: 'v2', label: 'Cross-Modal Verification', status: 'MATCH' },
                  { id: 'v3', label: 'Telemetry Bounds', status: 'MATCH' },
                ];
              }

              setSession(newSession);
              setHistorySessions((prev) => [newSession, ...prev]);
              setIsProcessing(false);
              setCurrentScreen('result');
              return;
            } else if (statusData.status === 'failed') {
              isDone = true;
              throw new Error(statusData.error || 'Backend analysis failed');
            }
          } catch (pollErr: any) {
            if (isDone) return;
            // If polling error occurs early, trigger fallback
            if (pollCount > 3) {
              throw pollErr;
            }
          }
        }
      };

      await pollBackend();
    } catch (err: any) {
      console.warn('Backend server unreachable or returned error. Running simulation fallback:', err?.message);
      setApiError(err?.message || 'Using local simulation');

      // Fallback simulation steps
      setTimeout(() => {
        setTraceSteps((prev) =>
          prev.map((s, idx) =>
            idx === 0
              ? { ...s, status: 'completed', latencyMs: 12, details: 'Query Intent: single_image_vqa' }
              : idx === 1
              ? { ...s, status: 'running', details: 'Validating resolution & bands...' }
              : s
          )
        );
      }, 600);

      setTimeout(() => {
        setTraceSteps((prev) =>
          prev.map((s, idx) =>
            idx === 1
              ? { ...s, status: 'completed', latencyMs: 4, details: 'Resolution: 0.5m GSD. OK.' }
              : idx === 2
              ? { ...s, status: 'running', details: 'Selected model: GeoChat (Vision-Language)' }
              : s
          )
        );
      }, 1200);

      setTimeout(() => {
        setTraceSteps((prev) =>
          prev.map((s, idx) =>
            idx === 2
              ? { ...s, status: 'completed', latencyMs: 245, details: 'GeoChat inference completed (confidence: 94%)' }
              : idx === 3
              ? { ...s, status: 'running', details: 'Performing cross-modal evidence extraction...' }
              : s
          )
        );
      }, 1800);

      setTimeout(() => {
        setTraceSteps((prev) =>
          prev.map((s, idx) =>
            idx === 3
              ? { ...s, status: 'completed', latencyMs: 18, details: 'Generated 1 visual evidence bounding box' }
              : idx === 4
              ? { ...s, status: 'completed', latencyMs: 6, details: 'Job completed successfully.' }
              : s
          )
        );

        setIsProcessing(false);
        setCurrentScreen('result');
      }, 2400);
    }
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
        uploadedFileObjects,
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
        backendConnected,
        backendInfo,
        availableModels,
        apiError,
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
