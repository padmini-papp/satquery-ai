import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AnalysisResultScreen: React.FC = () => {
  const { session, setCurrentScreen, currentImage } = useApp();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!session) {
    return (
      <div className="flex-1 mt-16 p-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-grid-pattern text-center">
        <div className="glass-panel p-8 rounded-xl border border-outline-variant/30 max-w-md space-y-4">
          <span className="material-symbols-outlined text-primary text-[48px]">radar</span>
          <h2 className="font-headline-md text-xl font-bold text-on-surface">NO ACTIVE ANALYSIS SESSION</h2>
          <p className="font-body-sm text-xs text-on-surface-variant">
            No intelligence session has been generated yet. Select a target or submit a query protocol from the workspace.
          </p>
          <button
            onClick={() => setCurrentScreen('console')}
            className="w-full bg-primary-container text-surface-dim font-mono-label text-xs py-2.5 rounded font-bold hover:bg-primary-fixed-dim transition-all"
          >
            OPEN WORKSPACE CONSOLE
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`https://satquery.ai/intel/${session.targetId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Executive Intelligence PDF Report for ${session.targetTitle} (${session.targetId}) generated.`);
    }, 1200);
  };

  return (
    <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-64px)] bg-grid-pattern relative">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono-label text-[11px] text-tertiary border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 rounded">
              TARGET ACQUIRED
            </span>
            <span className="font-mono-data text-xs text-on-surface-variant opacity-70">
              ID: {session.targetId}
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-primary-fixed drop-shadow-[0_0_12px_rgba(162,238,255,0.35)] font-bold tracking-tight">
            {session.targetTitle}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action: Launch Temporal Analysis */}
          <button
            onClick={() => setCurrentScreen('temporal')}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-surface-dim rounded font-mono-label text-xs font-bold hover:bg-primary-fixed-dim shadow-[0_0_16px_rgba(34,211,238,0.4)] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">compare</span>
            <span>TEMPORAL ANALYSIS</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-secondary text-secondary rounded font-mono-label text-xs hover:bg-secondary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'share'}
            </span>
            <span>{copied ? 'COPIED' : 'SHARE'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-bright border border-outline-variant text-on-surface rounded font-mono-label text-xs hover:border-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {downloading ? 'hourglass_top' : 'download'}
            </span>
            <span>{downloading ? 'GENERATING...' : 'REPORT'}</span>
          </button>
          <button
            onClick={() => setCurrentScreen('console')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-bright/80 border border-outline-variant text-on-surface-variant hover:text-primary rounded font-mono-label text-xs transition-colors"
            title="Return to Analysis Console"
          >
            <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
            <span>WORKSPACE</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Imagery & Telemetry Strip (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Main Analyzed Image Viewer */}
          <div className="glass-panel rounded-xl relative overflow-hidden group tech-border min-h-[420px] lg:min-h-[500px] flex items-center justify-center bg-black">
            {/* 4 Corner L-Brackets */}
            <div className="corner-tl"></div>
            <div className="corner-tr"></div>
            <div className="corner-bl"></div>
            <div className="corner-br"></div>

            {/* Satellite Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url('${session.imageryUrl || currentImage}')` }}
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-dense pointer-events-none opacity-30"></div>

            {/* Top HUD Overlay Controls */}
            <div className="absolute top-3 left-3 right-3 flex justify-between z-10 pointer-events-none">
              <div className="bg-surface/85 backdrop-blur-md px-3 py-1 border border-outline-variant/40 rounded pointer-events-auto shadow-md">
                <span className="font-mono-label text-xs text-primary">LIVE MODEL INFERENCE</span>
              </div>
              <div className="flex gap-1.5 pointer-events-auto">
                <button
                  onClick={() => setCurrentScreen('temporal')}
                  className="bg-surface/85 backdrop-blur-md px-2.5 py-1 border border-outline-variant/40 rounded hover:border-primary text-xs font-mono-data text-tertiary flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span>Compare Before/After</span>
                </button>
              </div>
            </div>

            {/* Targeting Reticle & Crosshairs */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-primary/20"></div>
              <div className="h-full w-[1px] bg-primary/20 absolute"></div>
              <div className="w-16 h-16 border border-primary/40 rounded-full absolute flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
              </div>
            </div>

            {/* Grounded Bounding Boxes Overlay from Backend */}
            {session.groundedBoxes && session.groundedBoxes.length > 0 ? (
              session.groundedBoxes.map((box, idx) => {
                const [y1, x1, y2, x2] = box;
                const top = y1 > 1 ? (y1 / 1000) * 100 : y1 * 100;
                const left = x1 > 1 ? (x1 / 1000) * 100 : x1 * 100;
                const height = y2 > 1 ? ((y2 - y1) / 1000) * 100 : (y2 - y1) * 100;
                const width = x2 > 1 ? ((x2 - x1) / 1000) * 100 : (x2 - x1) * 100;

                return (
                  <div
                    key={idx}
                    className="absolute border-2 border-tertiary bg-tertiary/10 p-1 pointer-events-none shadow-[0_0_16px_rgba(104,245,184,0.4)] transition-all"
                    style={{
                      top: `${Math.max(5, Math.min(top, 75))}%`,
                      left: `${Math.max(5, Math.min(left, 75))}%`,
                      width: `${Math.max(10, Math.min(width, 85))}%`,
                      height: `${Math.max(10, Math.min(height, 85))}%`,
                    }}
                  >
                    <div className="font-mono-label text-[9px] text-black bg-tertiary px-1.5 py-0.5 rounded -top-4 left-0 absolute whitespace-nowrap font-bold">
                      GROUNDED TARGET #{idx + 1} ({session.confidenceScore}%)
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute top-[28%] left-[38%] border border-primary bg-primary/10 p-1 pointer-events-none shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                <span className="font-mono-label text-[9px] text-primary bg-black/80 px-1 py-0.5 rounded block">
                  TARGET LOCK // {session.modelUsed ? session.modelUsed.toUpperCase() : 'NEURAL MATCH'} ({session.confidenceScore}%)
                </span>
              </div>
            )}

            {/* Bottom Coordinate Readout */}
            <div className="absolute bottom-3 left-3 bg-surface/85 backdrop-blur-md px-3 py-1 rounded border border-outline-variant/40 font-mono-data text-xs text-secondary pointer-events-none">
              {session.coordinates}
            </div>
          </div>

          {/* 4-Metric Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-3 rounded-lg flex flex-col border-l-2 border-l-tertiary">
              <span className="font-mono-label text-[10px] text-on-surface-variant">LAT/LONG</span>
              <span className="font-mono-data text-xs text-primary font-bold mt-0.5 truncate">
                {session.coordinates}
              </span>
            </div>
            <div className="glass-panel p-3 rounded-lg flex flex-col border-l-2 border-l-primary">
              <span className="font-mono-label text-[10px] text-on-surface-variant">MODEL / SENSOR</span>
              <span className="font-mono-data text-xs text-primary font-bold mt-0.5 truncate">
                {session.sensor}
              </span>
            </div>
            <div className="glass-panel p-3 rounded-lg flex flex-col border-l-2 border-l-secondary">
              <span className="font-mono-label text-[10px] text-on-surface-variant">CONFIDENCE SCORE</span>
              <span className="font-mono-data text-xs text-secondary font-bold mt-0.5">
                {session.confidenceScore}%
              </span>
            </div>
            <div className="glass-panel p-3 rounded-lg flex flex-col border-l-2 border-l-outline-variant">
              <span className="font-mono-label text-[10px] text-on-surface-variant">TIMESTAMP</span>
              <span className="font-mono-data text-xs text-on-surface font-bold mt-0.5 truncate">
                {session.date}
              </span>
            </div>
          </div>

          {/* Optional Execution Summary Metrics */}
          {session.executionSummary && (
            <div className="glass-panel rounded-xl p-4 tech-border shadow-xl space-y-2 font-mono-data text-xs">
              <div className="font-mono-label text-xs text-primary uppercase tracking-wider font-bold">
                NEURAL EXECUTION METRICS
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface-variant">PROCESSING TIME</span>
                <span className="text-tertiary font-bold">
                  {session.executionSummary.processing_time_ms.toFixed(0)} ms
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">MODELS DISPATCHED</span>
                <span className="text-primary font-bold">
                  {(session.executionSummary.models || []).join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Confidence, Executive Summary, Verification (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* AI Confidence Score Card */}
          <div className="glass-panel rounded-xl p-5 relative overflow-hidden tech-border shadow-xl">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="font-mono-label text-xs text-on-surface-variant tracking-widest uppercase">
                AI CONFIDENCE RATING
              </h3>
              <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
            </div>

            <div className="flex items-baseline gap-1 relative z-10">
              <span className="font-display-lg text-4xl sm:text-5xl text-primary drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] font-bold">
                {session.confidenceScore}
              </span>
              <span className="font-headline-md text-xl text-primary font-medium">%</span>
              <span className="font-mono-data text-xs text-tertiary ml-auto bg-tertiary/10 border border-tertiary/30 px-2 py-0.5 rounded">
                HIGH CONFIDENCE
              </span>
            </div>

            {/* Luminous Progress Bar */}
            <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-3 overflow-hidden relative z-10 border border-outline-variant/30">
              <div
                className="h-full bg-primary shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                style={{ width: `${session.confidenceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Executive Summary & Grounding Details */}
          <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 tech-border shadow-xl">
            <h3 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">analytics</span>
              Executive Summary
            </h3>

            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              {session.executiveSummary}
            </p>

            {/* Grounding Observations */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 bg-surface-container/60 rounded border border-tertiary/30 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-tertiary mt-1 shrink-0 shadow-[0_0_6px_rgba(104,245,184,0.8)]"></span>
                <div>
                  <h4 className="font-mono-label text-[11px] text-tertiary font-bold uppercase">FEATURE GROUNDING</h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant/90 mt-0.5">
                    {session.vehicleClusterAlert}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-surface-container/60 rounded border border-secondary/30 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-secondary mt-1 shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
                <div>
                  <h4 className="font-mono-label text-[11px] text-secondary font-bold uppercase">LATENCY &amp; PERFORMANCE</h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant/90 mt-0.5">
                    {session.thermalAnomalyAlert}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Factor Verification Status Card */}
          <div className="glass-panel rounded-xl p-5 tech-border shadow-xl space-y-2.5">
            <h3 className="font-mono-label text-xs text-on-surface-variant uppercase tracking-wider">
              MULTI-FACTOR VERIFICATION
            </h3>
            <div className="space-y-2">
              {session.verification.map((v) => (
                <div key={v.id} className="flex justify-between items-center text-xs font-mono-data py-1 border-b border-outline-variant/10">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        v.status === 'MATCH' ? 'text-tertiary' : 'text-outline-variant'
                      }`}
                    >
                      {v.status === 'MATCH' ? 'check_circle' : 'pending'}
                    </span>
                    {v.label}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      v.status === 'MATCH'
                        ? 'bg-tertiary/10 border-tertiary/30 text-tertiary'
                        : 'bg-surface-bright border-outline-variant text-outline'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
