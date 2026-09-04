// API Service for SatQuery AI Localhost Backend (http://localhost:8000)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthResponse {
  status: string;
  service?: string;
  mode?: string;
  llm_provider?: string;
  models?: string[];
}

export interface ModelCapabilities {
  name: string;
  type: string;
  tasks: string[];
  supported_modalities: string[];
  requires_images: number;
  description: string;
}

export interface ModelInfo {
  name: string;
  status: string;
  endpoint: string | null;
  capabilities: ModelCapabilities;
  healthy: boolean;
  reason: string | null;
}

export interface SubmitAnalysisResponse {
  job_id: string;
  status: string;
  message: string;
  image_count?: number;
}

export interface EvidenceItem {
  id: string;
  type: string;
  description: string;
  claim: string;
  confidence: number;
  bbox?: number[];
  metadata?: Record<string, any>;
}

export interface ExecutionSummary {
  task: string;
  models: string[];
  tools: string[];
  parameters: Record<string, any>;
  processing_time_ms: number;
}

export interface JobResultResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string | null;
  result?: {
    job_id: string;
    answer: string;
    task?: string;
    confidence?: {
      score: number;
      level?: string;
      label?: string;
      reasoning?: string;
    };
    evidence?: EvidenceItem[];
    execution_summary?: ExecutionSummary;
    metadata?: Record<string, any>;
  } | null;
}

export interface JobEvidenceResponse {
  job_id: string;
  evidence: EvidenceItem[];
}

export interface JobTraceItem {
  step: number;
  event: string;
  status: string;
  task?: string;
  model?: string | null;
  duration_ms?: number;
  details?: Record<string, any>;
}

export interface JobTraceResponse {
  job_id: string;
  trace: JobTraceItem[];
}

// --- 1. Health Check (GET /health) ---
export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// --- 2. List Models (GET /api/v1/models) ---
export async function getModels(): Promise<ModelInfo[]> {
  const res = await fetch(`${API_BASE}/api/v1/models`);
  if (!res.ok) throw new Error(`Get models failed: ${res.status}`);
  return res.json();
}

// --- 3. Submit Analysis Job (POST /api/v1/analyze) ---
export async function submitAnalysis(
  imageFile?: File | Blob | null,
  query: string = '',
  metadata?: Record<string, any>
): Promise<SubmitAnalysisResponse> {
  const formData = new FormData();
  formData.append('query', query);

  if (imageFile) {
    formData.append('images', imageFile, (imageFile as File).name || 'satellite_image.jpg');
  }

  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  const res = await fetch(`${API_BASE}/api/v1/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Submit analysis failed (${res.status}): ${errText}`);
  }

  return res.json();
}

// --- 4. Submit Change Analysis Job (POST /api/v1/analyze/change) ---
export async function submitChangeAnalysis(
  imageBefore: File | Blob,
  imageAfter: File | Blob,
  query: string = ''
): Promise<SubmitAnalysisResponse> {
  const formData = new FormData();
  formData.append('query', query);
  formData.append('image_before', imageBefore, (imageBefore as File).name || 'before.jpg');
  formData.append('image_after', imageAfter, (imageAfter as File).name || 'after.jpg');

  const res = await fetch(`${API_BASE}/api/v1/analyze/change`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Submit change analysis failed (${res.status}): ${errText}`);
  }

  return res.json();
}

// --- 5. Poll Job Status (GET /api/v1/jobs/{job_id}) ---
export async function getJobResult(jobId: string): Promise<JobResultResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`);
  if (!res.ok) throw new Error(`Get job result failed (${res.status})`);
  return res.json();
}

// --- 6. Fetch Job Evidence (GET /api/v1/jobs/{job_id}/evidence) ---
export async function getJobEvidence(jobId: string): Promise<JobEvidenceResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/evidence`);
  if (!res.ok) throw new Error(`Get job evidence failed (${res.status})`);
  return res.json();
}

// --- 7. Fetch Job Execution Trace (GET /api/v1/jobs/{job_id}/trace) ---
export async function getJobTrace(jobId: string): Promise<JobTraceResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/trace`);
  if (!res.ok) throw new Error(`Get job trace failed (${res.status})`);
  return res.json();
}

// --- Helper: Fetch Image URL as Blob ---
export async function fetchImageUrlAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image URL as blob: ${res.status}`);
  return res.blob();
}

// --- Helpers: Base64 Conversions ---
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] || dataUrl;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function imageUrlToBase64(url: string): Promise<string> {
  if (url.startsWith('data:image')) {
    return url.split(',')[1] || '';
  }
  try {
    const blob = await fetchImageUrlAsBlob(url);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1] || dataUrl;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}
