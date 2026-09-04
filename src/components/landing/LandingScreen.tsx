import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetectionParameter } from '../../types';

export const LandingScreen: React.FC = () => {
  const {
    setCurrentScreen,
    targetCoordinates,
    setTargetCoordinates,
    uploadedFiles,
    addUploadedFile,
    selectedParameters,
    toggleParameter,
    startAnalysisFlow,
    setCurrentImage,
    availableModels,
    backendConnected,
  } = useApp();

  const [queryInput, setQueryInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const parameterList: DetectionParameter[] = ['VESSELS', 'AIRCRAFT', 'INFRASTRUCTURE', 'VEHICLES'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      addUploadedFile(file.name, file);
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      addUploadedFile(file.name, file);
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleExecute = () => {
    startAnalysisFlow(queryInput);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] mt-16 flex flex-col items-center justify-center p-4 md:p-margin-desktop overflow-x-hidden">
      {/* Background Grid & Ambient Glow */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-ambient-glow pointer-events-none z-0"></div>

      {/* Main Canvas */}
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-xl items-center relative z-10 my-auto py-6">
        {/* Left: Headline & Live Backend Status */}
        <div className="flex-1 space-y-md md:space-y-lg text-center lg:text-left">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono-label ${
              backendConnected
                ? 'border-tertiary/30 bg-tertiary/10 text-tertiary'
                : 'border-error/30 bg-error/10 text-error'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">radar</span>
            {backendConnected ? 'LOCAL BACKEND ONLINE (PORT 8000)' : 'CONNECTING TO BACKEND...'}
          </div>

          <h1 className="font-display-lg text-headline-lg-mobile sm:text-headline-lg lg:text-display-lg text-on-surface font-bold tracking-tight">
            Synthesize Global Intelligence in{' '}
            <span className="text-primary-container drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]">
              Real-Time
            </span>
          </h1>

          <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
            Deploy neural specialist models against multi-modal satellite imagery. Initiate complex spatial queries and receive instantaneous, actionable telemetry from your backend.
          </p>

          {/* Registered Models List from Backend */}
          {availableModels.length > 0 && (
            <div className="pt-2">
              <span className="font-mono-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2">
                REGISTERED BACKEND MODELS
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                {availableModels.map((m) => (
                  <span
                    key={m.name}
                    className="px-2.5 py-1 rounded font-mono-data text-xs bg-surface-container/60 border border-outline-variant/30 text-primary flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-md pt-sm">
            <button
              onClick={() => setCurrentScreen('console')}
              className="bg-primary-container text-surface-container-lowest font-mono-label text-mono-label px-lg py-md rounded hover:bg-primary-fixed-dim transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 duration-150 font-bold"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
              INITIALIZE WORKSPACE
            </button>

            <button
              onClick={() => setCurrentScreen('temporal')}
              className="border border-secondary text-secondary bg-transparent font-mono-label text-mono-label px-lg py-md rounded hover:bg-secondary/10 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">compare</span>
              TEMPORAL ANALYSIS
            </button>
          </div>
        </div>

        {/* Right: Live Neural Query Interface Panel */}
        <div className="w-full max-w-md lg:max-w-lg glass-panel p-md sm:p-lg rounded-xl tech-border shadow-2xl relative">
          <div className="corner-tl"></div>
          <div className="corner-tr"></div>
          <div className="corner-bl"></div>
          <div className="corner-br"></div>

          <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
            <span className="font-mono-label text-mono-label text-on-surface-variant flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-primary text-[16px]">memory</span>
              NEURAL QUERY INTERFACE
            </span>
            <span className="font-mono-data text-mono-data text-tertiary text-xs px-2 py-0.5 rounded bg-tertiary/10 border border-tertiary/30">
              http://localhost:8000
            </span>
          </div>

          <div className="space-y-md">
            {/* Target Location Input */}
            <div>
              <label className="font-mono-label text-mono-label text-primary block mb-1.5 tracking-wider">
                TARGET COORDINATES / LOCATION ALIAS
              </label>
              <input
                type="text"
                value={targetCoordinates}
                onChange={(e) => setTargetCoordinates(e.target.value)}
                className="w-full bg-surface-container-lowest border-b border-outline-variant text-on-surface font-mono-data text-mono-data py-2 px-3 focus:outline-none focus:border-primary transition-all rounded-t"
                placeholder="Enter target coordinates (e.g. 26.23° N, 54.34° E or Sector name)"
              />
            </div>

            {/* Drag & Drop Upload */}
            <div>
              <label className="font-mono-label text-mono-label text-primary block mb-1.5 tracking-wider">
                REFERENCE IMAGERY UPLOAD
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".tif,.tiff,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded flex flex-col items-center justify-center p-md sm:p-lg cursor-pointer transition-all group ${
                  isDragging
                    ? 'border-primary bg-primary/10 scale-[0.99]'
                    : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest/50'
                }`}
              >
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-[32px] mb-1.5 transition-colors">
                  cloud_upload
                </span>
                <span className="font-mono-label text-mono-label text-on-surface-variant group-hover:text-primary transition-colors text-center">
                  DRAG &amp; DROP SATELLITE IMAGE (.TIFF, .PNG, .JPG)
                </span>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 justify-center">
                    {uploadedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="font-mono-data text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[10px]">image</span>
                        {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detection Parameter Chips */}
            <div>
              <label className="font-mono-label text-mono-label text-primary block mb-1.5 tracking-wider">
                DETECTION PARAMETERS
              </label>
              <div className="flex flex-wrap gap-2">
                {parameterList.map((param) => {
                  const isSelected = selectedParameters.includes(param);
                  return (
                    <button
                      key={param}
                      type="button"
                      onClick={() => toggleParameter(param)}
                      className={`px-2.5 py-1 rounded font-mono-label text-[10px] flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-tertiary/20 text-tertiary border border-tertiary/40 shadow-[0_0_8px_rgba(104,245,184,0.3)]'
                          : 'bg-surface-bright text-on-surface-variant border border-outline-variant/50 hover:border-primary/40'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[12px]">check</span>
                      )}
                      {param}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orbital Query Textarea & Execute Button */}
            <div>
              <label className="font-mono-label text-mono-label text-primary block mb-1.5 tracking-wider">
                NATURAL LANGUAGE QUERY
              </label>
              <div className="relative group/box">
                <div className="relative flex flex-col bg-surface-container-lowest border border-primary/30 rounded overflow-hidden">
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border-none focus:ring-0 p-2.5 font-mono-data text-mono-data text-primary placeholder:text-primary/30 resize-none text-xs focus:outline-none"
                    placeholder="Enter satellite imagery query prompt..."
                  />
                  <div className="flex justify-between items-center p-2 bg-primary/5 border-t border-primary/10">
                    <span className="font-mono-data text-[10px] text-on-surface-variant/60 pl-1">
                      Ready for backend inference
                    </span>
                    <button
                      onClick={handleExecute}
                      className="flex items-center gap-1 px-4 py-1.5 bg-primary-container text-surface-dim font-mono-label text-mono-label rounded hover:bg-primary-fixed-dim transition-all group/btn shadow-[0_0_12px_rgba(34,211,238,0.3)] font-semibold"
                    >
                      <span>EXECUTE</span>
                      <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
