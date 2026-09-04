import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STITCH_IMAGES } from '../../services/mockAnalysisService';
import { DetectionParameter } from '../../types';

export const AnalysisConsole: React.FC = () => {
  const {
    setCurrentScreen,
    targetCoordinates,
    setTargetCoordinates,
    selectedParameters,
    toggleParameter,
    startAnalysisFlow,
    chatMessages,
    sendChatMessage,
    currentImage,
    setCurrentImage,
    addUploadedFile,
    session,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activePreset, setActivePreset] = useState<'hormuz' | 'sector7g' | 'rotterdam' | 'amazon'>('hormuz');

  const presets = [
    {
      id: 'hormuz',
      label: 'Strait of Hormuz',
      coords: '26.2341° N, 54.3412° E',
      image: STITCH_IMAGES.hormuzStrait,
      sensor: 'Optical Multi-Spectral',
    },
    {
      id: 'sector7g',
      label: 'Sector 7G Port',
      coords: "34°05'N 118°15'W",
      image: STITCH_IMAGES.sector7gPort,
      sensor: 'SAR-X Band',
    },
    {
      id: 'rotterdam',
      label: 'Port of Rotterdam',
      coords: '51.9493° N, 4.1481° E',
      image: STITCH_IMAGES.rotterdamPort,
      sensor: 'Sentinel-2 (10m GSD)',
    },
    {
      id: 'amazon',
      label: 'Amazon Basin',
      coords: "03°12'S 60°02'W",
      image: STITCH_IMAGES.urbanDeforestation,
      sensor: 'Landsat-9 / Sentinel-1',
    },
  ];

  const quickQueries = [
    'Analyze vessel patterns in sector 7G. Any deviations from standard maritime routes?',
    'Identify water bodies and calculate moisture index',
    'Detect changes against baseline acquisition',
    'Measure industrial container volume expansion',
  ];

  const parameterList: DetectionParameter[] = ['VESSELS', 'AIRCRAFT', 'INFRASTRUCTURE', 'VEHICLES'];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setActivePreset(preset.id as any);
    setCurrentImage(preset.image);
    setTargetCoordinates(preset.coords);
  };

  const handleSendQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;
    sendChatMessage(inputQuery);
    setInputQuery('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      addUploadedFile(file.name, file);
      // create preview URL
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
    }
  };

  return (
    <div className="flex-1 mt-16 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-grid-pattern relative select-none">
      {/* 1. Left Navigation & Analysis Controls Rail (Desktop) */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-surface-container-low/95 backdrop-blur-2xl border-r border-outline-variant/20 h-full shadow-2xl z-30 shrink-0 overflow-y-auto">
        {/* Mission Control Header */}
        <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <h2 className="font-headline-md text-sm font-bold tracking-wider text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">space_dashboard</span>
            MISSION CONTROL
          </h2>
          <span className="font-mono-data text-[10px] text-tertiary px-1.5 py-0.5 rounded bg-tertiary/10 border border-tertiary/30">
            ACTIVE
          </span>
        </div>

        {/* View Switcher Links */}
        <nav className="p-3 space-y-1">
          <button
            onClick={() => setCurrentScreen('console')}
            className="w-full bg-primary-container/20 text-primary border-r-2 border-primary px-3 py-2.5 flex items-center gap-3 rounded-l font-body-sm font-medium text-xs transition-all text-left"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span>Workspace Viewport</span>
          </button>
          <button
            onClick={() => setCurrentScreen('temporal')}
            className="w-full text-on-surface-variant px-3 py-2.5 flex items-center gap-3 hover:bg-surface-bright/50 hover:text-primary transition-all rounded font-body-sm text-xs text-left"
          >
            <span className="material-symbols-outlined text-[18px]">compare</span>
            <span>Temporal Analysis</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className="w-full text-on-surface-variant px-3 py-2.5 flex items-center gap-3 hover:bg-surface-bright/50 hover:text-primary transition-all rounded font-body-sm text-xs text-left"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Processing History</span>
          </button>
        </nav>

        {/* Operational Theaters / Presets */}
        <div className="p-3 border-t border-outline-variant/10">
          <span className="font-mono-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2 px-1">
            TARGET SECTORS
          </span>
          <div className="space-y-1.5">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`w-full p-2 rounded text-left transition-all flex flex-col gap-0.5 text-xs font-mono-data ${
                  activePreset === p.id
                    ? 'bg-primary/10 border border-primary/40 text-primary shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'bg-surface-container/40 border border-outline-variant/20 text-on-surface-variant hover:border-primary/30 hover:text-on-surface'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{p.label}</span>
                  {activePreset === p.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  )}
                </div>
                <span className="text-[10px] opacity-70">{p.coords}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload Zone in Left Rail */}
        <div className="p-3 mt-auto border-t border-outline-variant/10">
          <span className="font-mono-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2 px-1">
            CUSTOM IMAGERY UPLOAD
          </span>
          <label className="border border-dashed border-outline-variant hover:border-primary/50 bg-surface-container-lowest/50 rounded p-3 flex flex-col items-center justify-center cursor-pointer transition-all group text-center">
            <input
              type="file"
              accept=".tif,.tiff,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-[24px] mb-1">
              cloud_upload
            </span>
            <span className="font-mono-label text-[10px] text-on-surface-variant group-hover:text-primary">
              DROP GEOTIFF / SAR FILE
            </span>
            <span className="font-mono-data text-[9px] text-outline mt-0.5">
              MAX 500MB (RGB/SAR)
            </span>
          </label>
        </div>
      </aside>

      {/* 2. Center: Large Satellite Image Viewport */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-black">
        {/* Top Floating Viewport HUD */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-none">
          {/* Target Title & Mode */}
          <div className="bg-surface/85 backdrop-blur-md px-3 py-1.5 rounded border border-outline-variant/40 flex items-center gap-2 pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-mono-label text-xs text-primary font-bold">
              {presets.find((p) => p.id === activePreset)?.label.toUpperCase() || 'SATELLITE VIEWPORT'}
            </span>
            <span className="text-outline-variant">|</span>
            <span className="font-mono-data text-[11px] text-on-surface-variant">
              GSD 0.5M // LIVE FEED
            </span>
          </div>

          {/* Floating Map Controls */}
          <div className="flex gap-1.5 bg-surface/85 backdrop-blur-md p-1 rounded border border-outline-variant/40 pointer-events-auto shadow-lg">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              className="p-1 rounded hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-colors"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-1 rounded hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-colors"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded hover:bg-surface-bright text-on-surface-variant hover:text-primary transition-colors"
              title="Reset Zoom"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
            <button
              onClick={() => setCurrentScreen('temporal')}
              className="p-1 rounded hover:bg-surface-bright text-primary transition-colors"
              title="Compare Temporal Overlays"
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
            </button>
          </div>
        </div>

        {/* Central Satellite Image Canvas Container */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center cursor-crosshair">
          {/* Base Satellite Imagery */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
            style={{
              backgroundImage: `url('${currentImage}')`,
              transform: `scale(${zoomLevel})`,
              filter: 'brightness(0.9) contrast(1.15)',
            }}
          />

          {/* Grid Overlay for Instrumental Realism */}
          <div className="absolute inset-0 bg-grid-dense pointer-events-none opacity-40"></div>

          {/* Center Targeting Reticle / Crosshairs Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Outer Circular Reticle */}
            <div className="w-40 h-40 border border-primary/25 rounded-full relative flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 border border-primary/40 rounded-full"></div>
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-primary/40"></div>
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary/40"></div>
              {/* Center Glowing Dot */}
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_rgba(34,211,238,1)]"></div>
            </div>

            {/* Corner Brackets on Viewport */}
            <div className="corner-tl"></div>
            <div className="corner-tr"></div>
            <div className="corner-bl"></div>
            <div className="corner-br"></div>
          </div>

          {/* Simulated Detection Bounding Box */}
          <div className="absolute top-[28%] left-[38%] border border-tertiary bg-tertiary/10 p-1 pointer-events-none shadow-[0_0_12px_rgba(104,245,184,0.3)]">
            <span className="font-mono-label text-[9px] text-tertiary bg-black/80 px-1 py-0.5 rounded block">
              TARGET_LOCK: TANKER (98%)
            </span>
          </div>

          {/* Bottom Floating Coordinates HUD */}
          <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md border border-outline-variant/40 px-3 py-1.5 rounded flex items-center gap-3 font-mono-data text-xs text-secondary shadow-lg z-20">
            <span>{targetCoordinates}</span>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <span className="text-tertiary">Z: {Math.round(zoomLevel * 14)}</span>
          </div>

          {/* Quick Mobile Upload Trigger */}
          <div className="block lg:hidden absolute bottom-4 right-4 z-20">
            <label className="bg-primary-container text-surface-dim p-2.5 rounded-full shadow-lg flex items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
            </label>
          </div>
        </div>
      </main>

      {/* 3. Right: Telemetry, Parameters & AI Query Panel */}
      <aside className="w-full lg:w-[380px] bg-surface/95 backdrop-blur-2xl border-l border-outline-variant/30 flex flex-col z-30 shrink-0 h-auto lg:h-full max-h-[50vh] lg:max-h-full overflow-y-auto">
        {/* Telemetry Section Header */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-mono-label text-xs text-on-surface-variant flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-primary text-[16px]">query_stats</span>
              TELEMETRY & SENSOR SUITE
            </h3>
            <span className="font-mono-data text-[10px] text-tertiary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              LIVE SYNC
            </span>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-surface-container-highest/40 border border-outline-variant/30 p-2.5 rounded tech-border">
              <div className="font-mono-label text-[10px] text-on-surface-variant/70">ALTITUDE</div>
              <div className="font-mono-data text-primary text-base font-bold">450.2 KM</div>
            </div>
            <div className="bg-surface-container-highest/40 border border-outline-variant/30 p-2.5 rounded tech-border">
              <div className="font-mono-label text-[10px] text-on-surface-variant/70">VELOCITY</div>
              <div className="font-mono-data text-tertiary text-base font-bold">7.66 KM/S</div>
            </div>
            <div className="bg-surface-container-highest/40 border border-outline-variant/30 p-2.5 rounded col-span-2 flex justify-between items-center">
              <div>
                <div className="font-mono-label text-[10px] text-on-surface-variant/70">SENSOR / PLATFORM</div>
                <div className="font-mono-data text-on-surface text-xs font-medium">
                  {session?.sensor || 'GeoChat-7B (VLM Gateway)'}
                </div>
              </div>
              <span className="font-mono-data text-[10px] text-secondary border border-secondary/30 px-1.5 py-0.5 rounded">
                Sentinel-2
              </span>
            </div>
          </div>

          {/* Detected Entities / Categories Tags */}
          <div className="mt-3">
            <div className="font-mono-label text-[10px] text-on-surface-variant/70 mb-1.5 uppercase">
              DETECTED ENTITIES IN VIEWPORT
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session?.categories && session.categories.length > 0 ? (
                session.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded font-mono-label text-[10px] flex items-center gap-1 border bg-tertiary/10 border-tertiary/30 text-tertiary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    {cat.toUpperCase()} ({session.confidenceScore || 90}%)
                  </span>
                ))
              ) : selectedParameters.length > 0 ? (
                selectedParameters.map((param) => (
                  <span
                    key={param}
                    className="px-2 py-0.5 rounded font-mono-label text-[10px] flex items-center gap-1 border bg-secondary/10 border-secondary/30 text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {param}
                  </span>
                ))
              ) : (
                <span className="font-mono-data text-[10px] text-outline">No active detection tags</span>
              )}
            </div>
          </div>
        </div>

        {/* Detection Task Parameter Chips */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="font-mono-label text-[10px] text-primary mb-2 tracking-wider">
            ACTIVE DETECTION FILTERS
          </div>
          <div className="flex flex-wrap gap-1.5">
            {parameterList.map((param) => {
              const active = selectedParameters.includes(param);
              return (
                <button
                  key={param}
                  onClick={() => toggleParameter(param)}
                  className={`px-2.5 py-1 rounded font-mono-label text-[10px] flex items-center gap-1 transition-all ${
                    active
                      ? 'bg-tertiary/20 text-tertiary border border-tertiary/50 shadow-[0_0_8px_rgba(104,245,184,0.2)]'
                      : 'bg-surface-bright text-on-surface-variant border border-outline-variant/50 hover:border-primary/40'
                  }`}
                >
                  {active && <span className="material-symbols-outlined text-[12px]">check</span>}
                  {param}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Query Chips */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="font-mono-label text-[10px] text-on-surface-variant mb-2 tracking-wider">
            SUGGESTED QUERIES
          </div>
          <div className="space-y-1.5">
            {quickQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputQuery(q);
                  sendChatMessage(q);
                }}
                className="w-full text-left text-[11px] font-mono-data text-primary/90 bg-surface-container-lowest/80 border border-primary/20 hover:border-primary/50 hover:bg-primary/5 p-2 rounded transition-all flex items-start gap-1.5 group"
              >
                <span className="material-symbols-outlined text-[13px] text-primary shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                  terminal
                </span>
                <span className="line-clamp-1">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Neural Query Interface & Primary Action */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono-label text-xs text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                NEURAL QUERY INTERFACE
              </span>
              <span className="font-mono-data text-[10px] text-outline">v4.2.0</span>
            </div>

            {/* Chat Dialog Stream */}
            <div className="bg-surface-container-lowest/90 border border-outline-variant/30 rounded p-2.5 max-h-36 overflow-y-auto space-y-2 mb-3 text-xs font-body-sm">
              {chatMessages.slice(-2).map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-1 font-mono-label text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[12px]">
                      {msg.sender === 'user' ? 'person' : 'smart_toy'}
                    </span>
                    <span>{msg.sender === 'user' ? 'ANALYST' : 'SATQUERY AGENT'}</span>
                    <span className="text-[9px] opacity-60 ml-auto">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`p-2 rounded ${
                      msg.sender === 'user'
                        ? 'bg-surface-variant/40 text-on-surface-variant'
                        : 'bg-primary/10 border border-primary/20 text-on-surface'
                    }`}
                  >
                    {msg.text}
                    {msg.alertText && (
                      <div className="text-tertiary mt-1 font-mono-data text-[11px] font-medium">
                        {msg.alertText}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Query Input Field */}
            <form onSubmit={handleSendQuery} className="relative mb-3">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about this satellite imagery..."
                className="w-full bg-surface-container-lowest border-b border-outline-variant/60 focus:border-primary px-3 py-2 pr-10 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-fixed-dim transition-colors"
                title="Send query"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>

          {/* Primary ANALYZE / EXECUTE Button */}
          <button
            onClick={() => startAnalysisFlow(inputQuery || quickQueries[0], currentImage)}
            className="w-full bg-primary-container text-surface-dim font-mono-label text-xs py-3 px-4 rounded hover:bg-primary-fixed-dim font-bold flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
            <span>ANALYZE & EXECUTE PROTOCOL</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
