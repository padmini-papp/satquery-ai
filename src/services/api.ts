// API Service for SatQuery AI Backend Integration

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthResponse {
  status: string;
  service?: string;
  mode?: string;
  llm_provider?: string;
}

export interface ModelCapabilities {
  name: string;
  type: string;
  tasks: string[];
  supported_modalities: string[];
  requires_images: number;
}

export interface ModelInfo {
  name: string;
  healthy: boolean;
  capabilities: ModelCapabilities;
}

export interface AnalyzeSubmitResponse {
  job_id: string;
  status: string;
  message: string;
  image_count: number;
}

export interface EvidenceItem {
  claim: string;
  bbox: [number, number, number, number]; // [y1, x1, y2, x2]
  source_tool: string;
  confidence: number;
  type?: string;
}

export interface ConfidenceData {
  score: number;
  level: string;
  factors?: string[];
}

export interface ExecutionSummary {
  task: string;
  models: string[];
  tools: string[];
  processing_time_ms: number;
}

export interface JobResult {
  job_id: string;
  answer: string;
  task: string;
  observations?: string[];
  confidence: ConfidenceData;
  evidence: EvidenceItem[];
  artifacts?: any[];
  execution_summary: ExecutionSummary;
}

export interface JobStatusResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string | null;
  result?: JobResult;
}

export interface BackendTraceItem {
  step: number;
  event: string;
  status: string;
  duration_ms?: number;
  model?: string;
}

export interface JobTraceResponse {
  job_id: string;
  trace: BackendTraceItem[];
}

export interface JobEvidenceResponse {
  job_id: string;
  evidence: EvidenceItem[];
}

// Health check
export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return res.json();
}

// List available models
export async function getModels(): Promise<ModelInfo[]> {
  const res = await fetch(`${API_BASE}/api/v1/models`);
  if (!res.ok) {
    throw new Error(`Failed to fetch models with status ${res.status}`);
  }
  return res.json();
}

// Submit analysis — upload image + query
export async function submitAnalysis(
  imageFile: File | Blob,
  query: string,
  metadata: Record<string, any> | null = null
): Promise<AnalyzeSubmitResponse> {
  const formData = new FormData();
  formData.append('query', query);

  // If imageFile is a File, preserve filename, otherwise give default filename
  if (imageFile instanceof File) {
    formData.append('images', imageFile);
  } else {
    formData.append('images', imageFile, 'satellite_imagery.png');
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
    throw new Error(`Submit analysis failed: ${errText}`);
  }

  return res.json(); // { job_id, status, message, image_count }
}

// For change detection — upload two images
export async function submitChangeAnalysis(
  imageFile1: File | Blob,
  imageFile2: File | Blob,
  query: string,
  metadata: Record<string, any> | null = null
): Promise<AnalyzeSubmitResponse> {
  const formData = new FormData();
  formData.append('query', query);

  if (imageFile1 instanceof File) {
    formData.append('images', imageFile1);
  } else {
    formData.append('images', imageFile1, 'satellite_t1.png');
  }

  if (imageFile2 instanceof File) {
    formData.append('images', imageFile2);
  } else {
    formData.append('images', imageFile2, 'satellite_t2.png');
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
    throw new Error(`Submit change analysis failed: ${errText}`);
  }

  return res.json();
}

// Poll for job result
export async function getJobResult(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`);
  if (!res.ok) {
    throw new Error(`Get job result failed for ${jobId}: status ${res.status}`);
  }
  return res.json();
}

// Get execution trace
export async function getJobTrace(jobId: string): Promise<JobTraceResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/trace`);
  if (!res.ok) {
    throw new Error(`Get job trace failed for ${jobId}: status ${res.status}`);
  }
  return res.json();
}

// Get evidence items
export async function getJobEvidence(jobId: string): Promise<JobEvidenceResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/evidence`);
  if (!res.ok) {
    throw new Error(`Get job evidence failed for ${jobId}: status ${res.status}`);
  }
  return res.json();
}

// Helper utility to convert image URL to Blob for HTTP API submission
export async function fetchImageUrlAsBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      return await response.blob();
    }
  } catch (err) {
    console.warn('Could not fetch image URL as Blob:', err);
  }
  // Create 1x1 transparent PNG as fallback blob
  const transparentPngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const byteCharacters = atob(transparentPngBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/png' });
}
