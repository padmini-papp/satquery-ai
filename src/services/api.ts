// API Service for SatQuery AI Model Gateway

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://denture-snugly-ending.ngrok-free.dev';

// All model slugs available on the gateway
export const MODEL_SLUGS = ['geochat', 'changechat', 'prithvi', 'sar_fusion', 'bigearthnet'] as const;
export type ModelSlug = typeof MODEL_SLUGS[number];

// Common headers for all requests (ngrok interstitial bypass)
const HEADERS: Record<string, string> = {
  'ngrok-skip-browser-warning': 'true',
};

// --- Response Types ---

export interface HealthResponse {
  status: string;
  models: string[];
}

export interface ModelHealthResponse {
  status: string;
  model: string;
  gpu?: string;
}

export interface PredictResultData {
  response_text: string;
  grounded_boxes: number[][];
  confidence: number;
  identified_categories: string[];
}

export interface PredictResponse {
  result: PredictResultData;
  artifacts: any[];
}

export interface PredictRequest {
  image_base64?: string;
  query: string;
  task?: string;
  parameters?: Record<string, any>;
}

// --- API Functions ---

// Gateway health check
export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// Per-model health check
export async function checkModelHealth(model: string): Promise<ModelHealthResponse> {
  const res = await fetch(`${API_BASE}/${model}/v1/health`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Model health check failed for ${model}: ${res.status}`);
  return res.json();
}

// List available models from the gateway health endpoint
export async function listModels(): Promise<string[]> {
  const health = await checkHealth();
  return health.models || [];
}

// Run prediction on a specific model (synchronous — returns result directly)
export async function predictWithModel(
  model: string,
  imageBase64: string,
  query: string,
  task: string = 'single_image_vqa',
  parameters: Record<string, any> = {}
): Promise<PredictResponse> {
  const body: PredictRequest = {
    image_base64: imageBase64,
    query,
    task,
    parameters,
  };

  const res = await fetch(`${API_BASE}/${model}/v1/predict`, {
    method: 'POST',
    headers: {
      ...HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Predict failed for ${model}: ${errText}`);
  }

  return res.json();
}

// Convert a File to a base64 string (without the data URI prefix)
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

// Convert an image URL or Blob URL to a base64 string
export async function imageUrlToBase64(url: string): Promise<string> {
  if (url.startsWith('data:image')) {
    return url.split(',')[1] || '';
  }
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
    const blob = await res.blob();
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
  } catch (e) {
    console.warn('Could not convert image URL to base64 directly, returning empty string fallback:', e);
    return '';
  }
}

// Select the best model for a given query
export function selectModelForQuery(query: string): ModelSlug {
  const lower = query.toLowerCase();
  if (lower.includes('change') || lower.includes('temporal') || lower.includes('before') || lower.includes('after')) {
    return 'changechat';
  }
  if (lower.includes('sar') || lower.includes('radar') || lower.includes('fusion')) {
    return 'sar_fusion';
  }
  if (lower.includes('classify') || lower.includes('land cover') || lower.includes('land use') || lower.includes('category')) {
    return 'bigearthnet';
  }
  if (lower.includes('flood') || lower.includes('wildfire') || lower.includes('disaster') || lower.includes('climate')) {
    return 'prithvi';
  }
  // Default: GeoChat for general VQA
  return 'geochat';
}

