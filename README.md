# SatQuery AI — Frontend

React + TypeScript frontend for SatQuery AI, a satellite imagery analysis platform powered by neural networks.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS** (styling)

## Getting Started

```bash
npm install
npm run dev
```

App runs at **http://localhost:3000**

## Connecting to the Backend

The frontend connects to the [SatQuery AI Backend](https://github.com/devangdileep/satqueryai-llm) at `http://localhost:8000` by default.

To use a different backend URL, create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If the backend is not running, the app falls back to a local simulation so the UI remains fully functional.

### Backend Setup (Quick Reference)

```bash
git clone https://github.com/devangdileep/satqueryai-llm.git
cd satqueryai-llm
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
src/
├── App.tsx                          # Root app with screen routing
├── main.tsx                         # Entry point
├── index.css                        # Global styles & design tokens
├── vite-env.d.ts                    # Vite type definitions
├── components/
│   ├── landing/LandingScreen.tsx     # Landing page with query interface
│   ├── console/AnalysisConsole.tsx   # Workspace with satellite viewport
│   ├── processing/ProcessingScreen.tsx  # Step-by-step processing view
│   ├── results/AnalysisResultScreen.tsx # Analysis results dashboard
│   ├── temporal/TemporalAnalysisScreen.tsx # Before/after comparison slider
│   ├── history/ProcessingHistoryScreen.tsx # Past analysis sessions
│   └── layout/
│       ├── TopAppBar.tsx             # Header with nav & status
│       └── BottomNavBar.tsx          # Mobile navigation
├── context/AppContext.tsx           # Global state, backend polling, analysis flow
├── services/
│   ├── api.ts                       # Backend API client
│   └── mockAnalysisService.ts       # Mock data for offline/demo mode
└── types/index.ts                   # TypeScript interfaces
```

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend health check |
| GET | `/api/v1/models` | List available models |
| POST | `/api/v1/analyze` | Submit image + query for analysis |
| GET | `/api/v1/jobs/{job_id}` | Poll job status & result |
| GET | `/api/v1/jobs/{job_id}/trace` | Execution trace (step-by-step) |
| GET | `/api/v1/jobs/{job_id}/evidence` | Evidence items with bounding boxes |

## Build

```bash
npm run build
```

Output goes to `dist/`.
