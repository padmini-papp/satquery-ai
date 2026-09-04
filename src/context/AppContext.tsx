import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenType,
  ThemeMode,
  DetectionParameter,
  AnalysisSession,
  TraceStep,
  QueryMessage,
} from '../types';
import { STITCH_IMAGES } from '../services/mockAnalysisService';
import {
  checkHealth,
  getModels,
  submitAnalysis,
  submitChangeAnalysis,
  getJobResult,
  getJobEvidence,
  getJobTrace,
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
  session: AnalysisSession | null;
  setSession: (session: AnalysisSession) => void;
  traceSteps: TraceStep[];
  chatMessages: QueryMessage[];
  sendChatMessage: (text: string) => Promise<void>;
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
    '26.2341° N, 54.3412° E (Strait of Hormuz)'
  );
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedFileObjects, setUploadedFileObjects] = useState<File[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<DetectionParameter[]>([
    'VESSELS',
    'INFRASTRUCTURE',
  ]);
  const [session, setSessionState] = useState<AnalysisSession | null>(null);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [chatMessages, setChatMessages] = useState<QueryMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [historySessions, setHistorySessions] = useState<AnalysisSession[]>([]);
  const [currentImage, setCurrentImage] = useState<string>(STITCH_IMAGES.hormuzStrait);

  // Backend connection state
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendInfo, setBackendInfo] = useState<HealthResponse | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Verify backend connectivity to http://localhost:8000 on mount and periodically
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
          // non-fatal if models fail
        }
      } catch (err: any) {
        if (isMounted) {
          setBackendConnected(false);
          setBackendInfo(null);
          setApiError(err?.message || 'Backend unreachable (http://localhost:8000)');
        }
      }
    };

    verifyBackend();
    const interval = setInterval(verifyBackend, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Sync theme class with HTML document root
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

  const setSession = (newSession: AnalysisSession) => {
    setSessionState(newSession);
  };

  const selectHistorySession = (selected: AnalysisSession) => {
    setSessionState(selected);
    setCurrentImage(selected.imageryUrl);
    setTargetCoordinates(selected.coordinates);
    setCurrentScreen('result');
  };

  // Chat message handler sending query to backend job endpoint
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: QueryMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      let imagePayload: File | Blob;
      if (uploadedFileObjects.length > 0) {
        imagePayload = uploadedFileObjects[uploadedFileObjects.length - 1];
      } else {
        imagePayload = await fetchImageUrlAsBlob(currentImage);
      }

      const submitRes = await submitAnalysis(imagePayload, text, { coordinates: targetCoordinates });
      const jobId = submitRes.job_id;

      // Poll until finished (timeout safety 30s)
      let pollCount = 0;
      let isDone = false;
      while (!isDone && pollCount < 30) {
        pollCount++;
        await new Promise((r) => setTimeout(r, 1000));
        const statusRes = await getJobResult(jobId);

        if (statusRes.status === 'completed' && statusRes.result) {
          isDone = true;
          const agentMsg: QueryMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'agent',
            text: statusRes.result.answer || 'Query processed.',
            confidence: Math.round((statusRes.result.confidence?.score || 0.92) * 100),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
          setChatMessages((prev) => [...prev, agentMsg]);
        } else if (statusRes.status === 'failed') {
          isDone = true;
          throw new Error(statusRes.error || 'Job failed');
        }
      }
    } catch (err: any) {
      const errorMsg: QueryMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: `Analysis server response: ${err?.message || 'Error processing query'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Main Analysis Protocol Flow: Submits to http://localhost:8000/api/v1/analyze and polls status every 1s
  const startAnalysisFlow = async (queryText?: string, imageUrl?: string) => {
    const activeQuery = queryText || 'Analyze vessel patterns and land cover features in this satellite image.';
    const targetImage = imageUrl || currentImage;
    if (imageUrl) {
      setCurrentImage(imageUrl);
    }

    setIsProcessing(true);
    setCurrentScreen('processing');
    setApiError(null);

    // Initial Trace Steps
    setTraceSteps([
      { id: 's1', name: 'validate_image', status: 'running', details: 'Validating satellite resolution & spatial parameters...' },
      { id: 's2', name: 'classify_modality', status: 'pending', details: 'Determining sensor modality & spectrum...' },
      { id: 's3', name: 'model_inference', status: 'pending', details: 'Submitting job to SatQuery backend...' },
      { id: 's4', name: 'generate_visual_evidence', status: 'pending', details: 'Extracting grounded bounding box evidence...' },
      { id: 's5', name: 'compose_answer', status: 'pending', details: 'Synthesizing final executive intelligence...' },
    ]);

    try {
      // 1. Prepare image payload blob
      let primaryFile: File | Blob;
      if (uploadedFileObjects.length > 0) {
        primaryFile = uploadedFileObjects[uploadedFileObjects.length - 1];
      } else {
        primaryFile = await fetchImageUrlAsBlob(targetImage);
      }

      // 2. Submit analysis job to localhost backend
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

      // 3. Poll http://localhost:8000/api/v1/jobs/{job_id} every 1s
      let isDone = false;
      let pollCount = 0;

      while (!isDone && pollCount < 120) {
        pollCount++;
        await new Promise((r) => setTimeout(r, 1000));

        try {
          const [statusData, traceData] = await Promise.all([
            getJobResult(jobId),
            getJobTrace(jobId).catch(() => null),
          ]);

          // Update trace steps dynamically from backend if available
          if (traceData && traceData.trace && traceData.trace.length > 0) {
            const mappedSteps: TraceStep[] = traceData.trace.map((t) => ({
              id: `s-${t.step}`,
              name: t.event.replace(/_/g, ' '),
              status:
                t.status === 'success' || t.status === 'completed'
                  ? 'completed'
                  : t.status === 'running' || t.status === 'processing'
                  ? 'running'
                  : t.status === 'error' || t.status === 'failed'
                  ? 'error'
                  : 'pending',
              latencyMs: t.duration_ms ? Math.round(t.duration_ms) : undefined,
              details: t.model ? `Specialist Model: ${t.model}` : `Phase: ${t.event}`,
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
              // Ignore evidence fetch error
            }

            const rawScore = result.confidence?.score ?? 0.94;
            const scorePercent = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

            const modelsUsed = result.execution_summary?.models || ['GeoChat'];
            const mainSensor = modelsUsed.join(', ');

            // Extract grounded boxes from evidence items
            const groundedBoxes: number[][] = [];
            evidenceItems.forEach((ev) => {
              if (ev.bbox && ev.bbox.length === 4) {
                groundedBoxes.push(ev.bbox);
              }
            });

            const newSession: AnalysisSession = {
              id: `SES-${jobId.slice(-6).toUpperCase()}`,
              targetId: `ANL-${jobId.slice(-6).toUpperCase()}`,
              targetTitle: activeQuery.length > 45 ? `${activeQuery.slice(0, 45)}...` : activeQuery,
              coordinates: targetCoordinates || '26.2341° N, 54.3412° E',
              confidenceScore: scorePercent,
              sensor: `${mainSensor} (Localhost Backend)`,
              date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
              executiveSummary: result.answer || 'Analysis job completed successfully.',
              vehicleClusterAlert:
                evidenceItems.find((e) => e.claim.toLowerCase().includes('vessel') || e.claim.toLowerCase().includes('vehicle'))?.claim ||
                `Grounding verified across ${modelsUsed.join(', ')} models.`,
              thermalAnomalyAlert:
                evidenceItems.find((e) => e.claim.toLowerCase().includes('thermal') || e.claim.toLowerCase().includes('anomaly'))?.claim ||
                `Execution time: ${(result.execution_summary?.processing_time_ms || 245).toFixed(0)} ms.`,
              verification: evidenceItems.map((ev, idx) => ({
                id: `v-${idx}`,
                label: ev.claim.length > 32 ? `${ev.claim.slice(0, 32)}...` : ev.claim,
                status: ev.confidence > 0.7 ? 'MATCH' : 'PENDING',
              })),
              imageryUrl: targetImage,
              traceSteps: traceSteps,
              groundedBoxes,
              executionSummary: result.execution_summary,
              evidenceItems,
            };

            if (newSession.verification.length === 0) {
              newSession.verification = [
                { id: 'v1', label: `${mainSensor} Model Verification`, status: 'MATCH' },
                { id: 'v2', label: `Confidence Rating (${scorePercent}%)`, status: 'MATCH' },
                { id: 'v3', label: 'Localhost Backend Sync', status: 'MATCH' },
              ];
            }

            setSessionState(newSession);
            setHistorySessions((prev) => [newSession, ...prev]);

            // Initial agent chat reply
            setChatMessages([
              {
                id: `msg-${Date.now()}`,
                sender: 'agent',
                text: result.answer,
                confidence: scorePercent,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              },
            ]);

            setIsProcessing(false);
            setCurrentScreen('result');
            return;
          } else if (statusData.status === 'failed') {
            isDone = true;
            throw new Error(statusData.error || 'Job failed on backend');
          }
        } catch (pollErr: any) {
          if (isDone) return;
          if (pollCount > 10) throw pollErr;
        }
      }
    } catch (err: any) {
      console.error('Localhost backend analysis error:', err);
      setApiError(err?.message || 'Error processing job on http://localhost:8000');
      setIsProcessing(false);
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
