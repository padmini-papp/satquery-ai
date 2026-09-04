import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
    uploadedFiles,
    session,
    availableModels,
    selectedModel,
    setSelectedModel,
    backendConnected,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const parameterList: DetectionParameter[] = ['VESSELS', 'AIRCRAFT', 'INFRASTRUCTURE', 'VEHICLES'];

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
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);
    }
  };

  return (
    <div className="flex-1 mt-16 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-grid-pattern relative select-none">
      {/* 1. Left Navigation & Specialist Model Suite Rail */}
      <aside className="hidden lg:flex flex-col w-[300px] bg-surface-container-low/95 backdrop-blur-2xl border-r border-outline-variant/20 h-full shadow-2xl z-30 shrink-0 overflow-y-auto">
        {/* Mission Control Header */}
        <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <h2 className="font-headline-md text-sm font-bold tracking-wider text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">space_dashboard</span>
            MISSION CONTROL
          </h2>
          <span
            className={`font-mono-data text-[10px] px-1.5 py-0.5 rounded border ${
              backendConnected
                ? 'text-tertiary bg-tertiary/10 border-tertiary/30'
                : 'text-error bg-error/10 border-error/30'
            }`}
          >
            {backendConnected ? 'LIVE BACKEND' : 'OFFLINE'}
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

        {/* Registered Specialist Models from Backend */}
        <div className="p-3 border-t border-outline-variant/10 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="font-mono-label text-[10px] text-on-surface-variant uppercase tracking-widest block">
              SPECIALIST MODELS ({availableModels.length})
            </span>
            <span className="font-mono-data text-[9px] text-tertiary">http://localhost:8000</span>
          </div>

          <div className="space-y-2">
            {availableModels.length > 0 ? (
              availableModels.map((m) => {
                const isSelected = selectedModel.toLowerCase() === m.name.toLowerCase();
                return (
                  <button
                    key={m.name}
                    onClick={() => setSelectedModel(m.name)}
                    className={`w-full p-2.5 rounded text-left transition-all flex flex-col gap-1 text-xs font-mono-data border ${
                      isSelected
                        ? 'bg-primary/10 border-primary/50 text-primary shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                        : 'bg-surface-container/40 border-outline-variant/20 text-on-surface-variant hover:border-primary/30 hover:text-on-surface'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-primary">memory</span>
                        {m.name}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      )}
                    </div>
                    {m.capabilities?.description && (
                      <p className="text-[10px] opacity-75 font-body-sm line-clamp-2 leading-tight">
                        {m.capabilities.description}
                      </p>
                    )}
                    {m.capabilities?.supported_modalities && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {m.capabilities.supported_modalities.map((mod) => (
                          <span
                            key={mod}
                            className="text-[9px] px-1 py-0.2 rounded bg-surface-bright text-outline-variant uppercase"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-3 bg-surface-container/30 border border-outline-variant/20 rounded text-[11px] font-mono-data text-outline">
                Fetching registered models from backend...
              </div>
            )}
          </div>
        </div>

        {/* Custom Imagery Upload */}
        <div className="p-3 border-t border-outline-variant/10">
          <span className="font-mono-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2 px-1">
            TARGET IMAGERY UPLOAD
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
              UPLOAD SATELLITE FILE
            </span>
            <span className="font-mono-data text-[9px] text-outline mt-0.5">
              RGB / MULTISPECTRAL / SAR
            </span>
          </label>
        </div>
      </aside>

      {/* 2. Center: Satellite Viewport Canvas */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-black">
        {/* Viewport HUD Header */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-none">
          <div className="bg-surface/85 backdrop-blur-md px-3 py-1.5 rounded border border-outline-variant/40 flex items-center gap-2 pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-mono-label text-xs text-primary font-bold uppercase">
              {selectedModel} // WORKSPACE VIEWPORT
            </span>
          </div>

          {/* Controls */}
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
          </div>
        </div>

        {/* Satellite Canvas */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center cursor-crosshair">
          {currentImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
              style={{
                backgroundImage: `url('${currentImage}')`,
                transform: `scale(${zoomLevel})`,
                filter: 'brightness(0.9) contrast(1.15)',
              }}
            />
          ) : (
            <div className="p-8 text-center space-y-3 relative z-10 max-w-sm">
              <label className="border-2 border-dashed border-primary/40 hover:border-primary p-8 rounded-xl bg-surface-container-lowest/40 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <input type="file" accept=".tif,.tiff,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
                <span className="material-symbols-outlined text-primary text-[48px] mb-2 group-hover:scale-110 transition-transform">
                  add_photo_alternate
                </span>
                <span className="font-mono-label text-xs text-primary font-bold">
                  UPLOAD SATELLITE IMAGERY
                </span>
                <span className="font-mono-data text-[10px] text-on-surface-variant mt-1">
                  Drag &amp; drop GeoTIFF / SAR file or click to select file
                </span>
              </label>
            </div>
          )}

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-grid-dense pointer-events-none opacity-40"></div>

          {/* Targeting Reticle */}
          {currentImage && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-40 h-40 border border-primary/25 rounded-full relative flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 border border-primary/40 rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-primary/40"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary/40"></div>
                <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_rgba(34,211,238,1)]"></div>
              </div>

              <div className="corner-tl"></div>
              <div className="corner-tr"></div>
              <div className="corner-bl"></div>
              <div className="corner-br"></div>
            </div>
          )}

          {/* Grounded Boxes if Session Exists */}
          {session?.groundedBoxes && session.groundedBoxes.length > 0 && (
            session.groundedBoxes.map((box, idx) => {
              const [y1, x1, y2, x2] = box;
              const top = y1 > 1 ? (y1 / 1000) * 100 : y1 * 100;
              const left = x1 > 1 ? (x1 / 1000) * 100 : x1 * 100;
              const height = y2 > 1 ? ((y2 - y1) / 1000) * 100 : (y2 - y1) * 100;
              const width = x2 > 1 ? ((x2 - x1) / 1000) * 100 : (x2 - x1) * 100;

              return (
                <div
                  key={idx}
                  className="absolute border-2 border-tertiary bg-tertiary/10 p-1 pointer-events-none shadow-[0_0_16px_rgba(104,245,184,0.4)]"
                  style={{
                    top: `${Math.max(5, Math.min(top, 75))}%`,
                    left: `${Math.max(5, Math.min(left, 75))}%`,
                    width: `${Math.max(10, Math.min(width, 85))}%`,
                    height: `${Math.max(10, Math.min(height, 85))}%`,
                  }}
                >
                  <span className="font-mono-label text-[9px] text-black bg-tertiary px-1 py-0.5 rounded -top-4 left-0 absolute font-bold">
                    TARGET #{idx + 1}
                  </span>
                </div>
              );
            })
          )}

          {/* Coordinates HUD */}
          {targetCoordinates && (
            <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md border border-outline-variant/40 px-3 py-1.5 rounded flex items-center gap-3 font-mono-data text-xs text-secondary shadow-lg z-20">
              <span>{targetCoordinates}</span>
              <span className="w-[1px] h-3 bg-outline-variant"></span>
              <span className="text-tertiary">ZOOM: {Math.round(zoomLevel * 100)}%</span>
            </div>
          )}
        </div>
      </main>

      {/* 3. Right: Telemetry & Neural Query Panel */}
      <aside className="w-full lg:w-[380px] bg-surface/95 backdrop-blur-2xl border-l border-outline-variant/30 flex flex-col z-30 shrink-0 h-auto lg:h-full max-h-[50vh] lg:max-h-full overflow-y-auto">
        {/* Telemetry Section Header */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-mono-label text-xs text-on-surface-variant flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-primary text-[16px]">query_stats</span>
              TELEMETRY &amp; SENSOR SUITE
            </h3>
            <span className="font-mono-data text-[10px] text-tertiary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-surface-container-highest/40 border border-outline-variant/30 p-2.5 rounded flex justify-between items-center">
              <div>
                <div className="font-mono-label text-[10px] text-on-surface-variant/70">ACTIVE MODEL</div>
                <div className="font-mono-data text-primary text-sm font-bold">{selectedModel}</div>
              </div>
              <span className="font-mono-data text-[10px] text-tertiary border border-tertiary/30 px-1.5 py-0.5 rounded">
                GPU READY
              </span>
            </div>
            <div className="bg-surface-container-highest/40 border border-outline-variant/30 p-2.5 rounded">
              <div className="font-mono-label text-[10px] text-on-surface-variant/70 mb-1">TARGET COORDINATES</div>
              <input
                type="text"
                value={targetCoordinates}
                onChange={(e) => setTargetCoordinates(e.target.value)}
                placeholder="Enter target coordinates (e.g. 26.23° N, 54.34° E)..."
                className="w-full bg-surface-container-lowest border-b border-outline-variant/50 px-2 py-1 text-xs font-mono-data text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Uploaded Files Chips */}
          {uploadedFiles.length > 0 && (
            <div className="mt-3">
              <div className="font-mono-label text-[10px] text-on-surface-variant/70 mb-1.5 uppercase">
                LOADED SATELLITE PAYLOADS ({uploadedFiles.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {uploadedFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded font-mono-data text-[10px] text-primary bg-primary/10 border border-primary/20 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[10px]">image</span>
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detection Filters */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="font-mono-label text-[10px] text-primary mb-2 tracking-wider">
            DETECTION FILTERS
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

        {/* Neural Query Stream */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono-label text-xs text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                NEURAL QUERY INTERFACE
              </span>
            </div>

            {/* Chat Dialog Stream */}
            <div className="bg-surface-container-lowest/90 border border-outline-variant/30 rounded p-2.5 max-h-36 overflow-y-auto space-y-2 mb-3 text-xs font-body-sm">
              {chatMessages.length > 0 ? (
                chatMessages.slice(-2).map((msg) => (
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-outline text-[11px] font-mono-data py-2 text-center">
                  Submit a query to begin live inference stream.
                </div>
              )}
            </div>

            {/* Interactive Input */}
            <form onSubmit={handleSendQuery} className="relative mb-3">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about this imagery..."
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

          {/* Primary Action Button */}
          <button
            onClick={() => startAnalysisFlow(inputQuery)}
            className="w-full bg-primary-container text-surface-dim font-mono-label text-xs py-3 px-4 rounded hover:bg-primary-fixed-dim font-bold flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
            <span>EXECUTE ANALYSIS PROTOCOL</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
