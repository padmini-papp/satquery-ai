import { TelemetryData, DetectedEntity, TraceStep, AnalysisSession, QueryMessage } from '../types';

// Reference imagery from Stitch export
export const STITCH_IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQLxJChJsfi3_lTZVqgSxUL5zvOKtaZ7g_iUeIRpG8iux9Sg5MDR6IpZdPsE2rQFILSNDr6ZTs1VdYFs8Vyu-DKZf4u4vcgreRvG9VccJACVJt3m8w_H7oDw0MV8iSdJSzXsAosIS8AWA_DGlQ1KD5HoVIoDy4gWD4vw4S51CCE_hPbIedyJuKuNVV1V6Lh-7Koa5l1wGFJEmMMTA6088yj7ZaRDXZXOs2CcW8CbAjfTaZXZb5SZQw',
  rotterdamPort: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8HS1Fa4NAil5NWEVjR7nL-kXporN7Q26iAuV7k4U6m9Z7xxfkyyg3JTpRAk2jpKK0FJFfyjxNq4uws9FJlCgvIp7qrPiMIgcnTC4ohn8umuLAlaWIR3x9TOhyBM9zjw0U3EaR02YxLkfHL2ZiKR8lP7f5_5zMXbk6D3cc2p5xe9CDiwGfKEXO-lvedo_tON04tCTspX7hy8H_f5tPgfSNVF785sha6Mi5RWkZt3Ej6wyqjnfHVbUZ',
  hormuzStrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbdUiWOt8D2VSLxe45Cazy6v9LKHShNtQm2lsdFukyLQIJo1EqIg5Vd7R22zYmZ6u2HmhFP4kna_6ando5RstlIrdSaKioNdEHztLzRuJGpMYHINV8K6Zdc3jmKx5vlcqbNU9F16aq-UC60VWSxcQcxmAjXsezHyMx37Kwrrbo_rGzBhp011PD-xq0DpIjdVtqz_KA0bszCNpMVj2cUJbojPenaZkKq0WENKhGLG3byi4AmWYCrs4-',
  sector7gPort: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGJk90GA2NckF4ygfppmNh9_Cvbmi9BwGZPov5U9fCHP-0g7Npqgamdm57rPr6DfR4-4H3Z_3qBid2nuadFywUvVaQwgTQ6u5WnectNjGhOarOMPtqF6SyW99EeEFHuluBd2SpGwyv_SkOiUpPr51Htz3Ligjr5DetwWsWTpiX8hU0z_9B4YKAP2ktXRfBmAYre9TjopPkpz3PozP6VAZJ2s4nh_xD3fFKWVVCcpUV8ylpcrpvLT4D',
  temporalBefore: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbepdI6vbnOhwJzvRdA8TdYnYECcJI8MdumOT798S_ZOBZ7z3BslBhAViakCwwmyabsQHAyCOBAgdSOQsAB7SWjJj50DH21L7yjc0PlEF0w0yH43ocxSHH7MScP8VP3hKfO8cQuMpkhwNZXo3LSL1AEigouCQo8WV93iCVujU5Yn5FHQK6zjb-kpMbp7n3MHl-26Rj0IayWe98NvHo-EEuzcYNbA-AaFpSGTIPLJR8Bd3MuOymMGhx',
  temporalAfter: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBam899_F_-DbzYsc1DKF2cPE3DTxNlT8PJS90Z8mYfBTPXEkTKieC6k6q0raZwI4Wxgi8MvmpSsi1aWdbHzloFynna501K69ElH6DjTCPRXV2819BU7Ttk6jZ8aYueMR_TaPqXq8RFn3XgiVIPixK8rqsS-21kr91qD3sJgBx2dkDFZY6lQ7w9Xazf0_UYcoloardcsJsUijGZBDNHXZH749l4A7AdGPkfd0vfwKvDUjzFX2t9Z6pb',
  analystAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiUo7Oz2Q5vol4XL1d9wHrDJLekydZXEoLvDKv-0W2tq9_mDgefgEAlUBlejH2LVsfK6UMzEWfMqzOni_7aqO2Nm0GaZpTeoesZ1Cz1BBMUi5uvZYpxwhFNjWJxsl0Kba7LqoszvxwMCbObK6-apYmjO4QnBKxARqamngXVU7wdfV-OErDl-f_kQB3Juvrc7jaQIOh8wU3GXP60dAqryl9xxvsH68p2QtxTUJpyEssK9_bl7CoH5nK',
  urbanDeforestation: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzThZHtApFH6ZZzJz8ccCJXJLhbP-nPWMgFN9Q3fsxfG-n-2XElyL1idUEAo7L7T5IDQjOv2qXPYnu3MQuYVCLcMGvnsP8cbKuT0ltd_wG9kk3o2jQgon9iTGbR-oBh4c8hwOu6GCVluNr-xZfW_fKlcIvFsJglFP-MtRbO7d3TEgR5-_Q34X5ocl7pOpEv0vUl99zTd8w5hfn4u4WqH9TKWJiX8WRBJSWSXY-lqzihaGkdthv5KnB',
};

export const DEFAULT_TELEMETRY: TelemetryData = {
  altitude: '450.2 KM',
  velocity: '7.66 KM/S',
  sensor: 'OPTICAL MULTI-SPECTRAL',
  source: 'Sentinel-2',
  date: '2024-03-12',
  resolution: '0.5m GSD',
  cloudCover: '12%',
  coordinates: {
    lat: 26.2341,
    lng: 54.3412,
    formatted: "26.2341° N, 54.3412° E",
  },
};

export const DEFAULT_DETECTED_ENTITIES: DetectedEntity[] = [
  { id: '1', label: 'TANKER', confidence: 98, type: 'high' },
  { id: '2', label: 'SUPPORT VESSEL', confidence: 85, type: 'medium' },
  { id: '3', label: 'UNIDENTIFIED', confidence: 42, type: 'low' },
];

export const DEFAULT_TRACE_STEPS: TraceStep[] = [
  {
    id: 's1',
    name: 'validate_image',
    status: 'completed',
    latencyMs: 2,
    details: 'Resolution: 0.5m GSD. OK.',
  },
  {
    id: 's2',
    name: 'classify_modality',
    status: 'completed',
    latencyMs: 12,
    details: 'Detected: Optical (RGB)',
  },
  {
    id: 's3',
    name: 'ChangeChat Inference',
    status: 'completed',
    latencyMs: 32,
    details: 'Running bi-temporal analysis...',
  },
  {
    id: 's4',
    name: 'generate_visual_evidence',
    status: 'completed',
    latencyMs: 6,
    details: 'Bounding masks generated: 1 target polygon.',
  },
];

export const MOCK_HISTORY_SESSIONS: AnalysisSession[] = [
  {
    id: 'SES-0842-X',
    targetId: 'ANL-8492-X',
    targetTitle: 'Sector 7G Activity Analysis',
    coordinates: "34°05'N 118°15'W",
    confidenceScore: 94,
    sensor: 'SAR-X Band',
    date: '2024-03-14 08:30 UTC',
    executiveSummary:
      'Temporal analysis indicates significant structural alterations in Sector 7G over the last 72 hours. Neural network detected pattern anomalies consistent with rapid deployment of temporary logistics infrastructure.',
    vehicleClusterAlert: 'Increased heavy transport presence identified at coordinates alpha-tango.',
    thermalAnomalyAlert: 'Elevated thermal signatures in secondary processing facility. Potential active operations.',
    verification: [
      { id: 'v1', label: 'Structural Geometry', status: 'MATCH' },
      { id: 'v2', label: 'Spectral Signature', status: 'MATCH' },
      { id: 'v3', label: 'SAR Coherence', status: 'PENDING' },
    ],
    imageryUrl: STITCH_IMAGES.sector7gPort,
    traceSteps: DEFAULT_TRACE_STEPS,
  },
  {
    id: 'SES-0771-M',
    targetId: 'ANL-7721-M',
    targetTitle: 'Strait of Hormuz Maritime Patrol',
    coordinates: "26.2341° N, 54.3412° E",
    confidenceScore: 98,
    sensor: 'Optical Multi-Spectral',
    date: '2024-03-12 14:15 UTC',
    executiveSummary:
      'Surveillance sweep detected 3 commercial supertankers and 2 unidentified support vessels deviating from established maritime transit channels. Neural vector matching indicates 98% confidence on class recognition.',
    vehicleClusterAlert: 'Convoy formation detected entering northern territorial perimeter.',
    thermalAnomalyAlert: 'Normal engine heat dispersion. No hostile thermal bloom.',
    verification: [
      { id: 'v1', label: 'Structural Geometry', status: 'MATCH' },
      { id: 'v2', label: 'Spectral Signature', status: 'MATCH' },
      { id: 'v3', label: 'SAR Coherence', status: 'MATCH' },
    ],
    imageryUrl: STITCH_IMAGES.hormuzStrait,
    traceSteps: DEFAULT_TRACE_STEPS,
  },
  {
    id: 'SES-0620-R',
    targetId: 'ANL-6210-R',
    targetTitle: 'Port of Rotterdam Logistics Flow',
    coordinates: "51.9493° N, 4.1481° E",
    confidenceScore: 92,
    sensor: 'Sentinel-2 (10m GSD)',
    date: '2024-03-10 11:00 UTC',
    executiveSummary:
      'Container stacking turnover shows a 24.5% surge over baseline weekly averages. Bi-temporal differential highlights 14.2 ha of relocated freight containers and cranes in quay zone 4.',
    vehicleClusterAlert: 'Automated Guided Vehicle (AGV) traffic optimal at 42 units/hr.',
    thermalAnomalyAlert: 'Cold storage unit 12 running at expected cryogenic threshold.',
    verification: [
      { id: 'v1', label: 'Structural Geometry', status: 'MATCH' },
      { id: 'v2', label: 'Spectral Signature', status: 'MATCH' },
      { id: 'v3', label: 'SAR Coherence', status: 'PENDING' },
    ],
    imageryUrl: STITCH_IMAGES.rotterdamPort,
    traceSteps: DEFAULT_TRACE_STEPS,
  },
  {
    id: 'SES-0550-B',
    targetId: 'ANL-5509-B',
    targetTitle: 'Western Amazon Deforestation Delta',
    coordinates: "03°12'S 60°02'W",
    confidenceScore: 96,
    sensor: 'Landsat-9 / Sentinel-1 SAR',
    date: '2024-03-08 16:45 UTC',
    executiveSummary:
      'Significant canopy loss identified along logging spur road. Estimated 3.1 ha tree clearance detected in last 14 days with 96% high confidence.',
    vehicleClusterAlert: 'Heavy machinery signature located at road terminus.',
    thermalAnomalyAlert: 'Brush burning hot spots observed via SWIR bands.',
    verification: [
      { id: 'v1', label: 'Structural Geometry', status: 'MATCH' },
      { id: 'v2', label: 'Spectral Signature', status: 'MATCH' },
      { id: 'v3', label: 'SAR Coherence', status: 'MATCH' },
    ],
    imageryUrl: STITCH_IMAGES.urbanDeforestation,
    traceSteps: DEFAULT_TRACE_STEPS,
  },
];

export const DEFAULT_SESSION: AnalysisSession = MOCK_HISTORY_SESSIONS[0];

export const INITIAL_CHAT_MESSAGES: QueryMessage[] = [
  {
    id: 'm1',
    sender: 'user',
    text: 'Analyze vessel patterns in sector 7G. Any deviations from standard maritime routes?',
    timestamp: '14:22:01',
  },
  {
    id: 'm2',
    sender: 'agent',
    text: 'Processing historical AIS data against current telemetry...',
    alertText: '3 vessels have altered course simultaneously, converging on coordinates [26.23, 54.34]. Confidence high.',
    timestamp: '14:22:04',
    confidence: 94,
  },
];
