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
  } = useApp();

  const [queryInput, setQueryInput] = useState<string>('Analyze vessel patterns in sector 7G. Any deviations from standard maritime routes?');
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
    } else {
      addUploadedFile('optical_sar_pair_t1_t2.tif');
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

      {/* Main Responsive Canvas */}
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-xl items-center relative z-10 my-auto py-6">
        {/* Left: Typography & Primary Action (Desktop & Mobile) */}
        <div className="flex-1 space-y-md md:space-y-lg text-center lg:text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary font-mono-label text-mono-label">
            <span className="material-symbols-outlined text-[14px]">radar</span>
            GLOBAL COVERAGE SECURED
          </div>

          {/* Headline with Luminous Accent */}
          <h1 className="font-display-lg text-headline-lg-mobile sm:text-headline-lg lg:text-display-lg text-on-surface font-bold tracking-tight">
            Synthesize Global Intelligence in{' '}
            <span className="text-primary-container drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]">
              Real-Time
            </span>
          </h1>

          {/* Body Narrative */}
          <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
            Deploy neural networks against multi-modal satellite imagery. Initiate complex spatial queries and receive instantaneous, actionable telemetry across designated operational theaters.
          </p>

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

          {/* Mobile Terminal Simulation Stream */}
          <div className="block lg:hidden w-full max-w-md mx-auto bg-surface-dim/90 p-3 rounded border border-outline-variant/30 text-left font-mono-data text-xs space-y-1 mt-4">
            <div className="text-outline-variant/70">&gt; Initializing neural pathways...</div>
            <div className="text-outline-variant/70">&gt; Establishing satellite link...</div>
            <div className="text-tertiary animate-pulse">&gt; Ready for query input_</div>
          </div>
        </div>

        {/* Right: Neural Query Interface Glass Panel */}
        <div className="w-full max-w-md lg:max-w-lg glass-panel p-md sm:p-lg rounded-xl tech-border shadow-2xl relative">
          {/* 4 Corner L-Brackets */}
          <div className="corner-tl"></div>
          <div className="corner-tr"></div>
          <div className="corner-bl"></div>
          <div className="corner-br"></div>

          {/* Card Header */}
          <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
            <span className="font-mono-label text-mono-label text-on-surface-variant flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-primary text-[16px]">memory</span>
              NEURAL QUERY INTERFACE
            </span>
            <span className="font-mono-data text-mono-data text-tertiary text-xs px-2 py-0.5 rounded bg-tertiary/10 border border-tertiary/30">
              v4.2.0
            </span>
          </div>

          <div className="space-y-md">
            {/* Target Area Input */}
            <div>
              <label className="font-mono-label text-mono-label text-primary block mb-1.5 tracking-wider">
                TARGET COORDINATES / ALIAS
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetCoordinates}
                  onChange={(e) => setTargetCoordinates(e.target.value)}
                  className="w-full bg-surface-container-lowest border-b border-outline-variant text-on-surface font-mono-data text-mono-data py-2 px-3 pr-10 focus:outline-none focus:border-primary focus:shadow-[0_2px_12px_-2px_rgba(34,211,238,0.5)] transition-all rounded-t"
                  placeholder="e.g. 34.0522° N, 118.2437° W or 'Port of LA'"
                />
                <button
                  type="button"
                  onClick={() => setTargetCoordinates("26.2341° N, 54.3412° E (Strait of Hormuz)")}
                  className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant hover:text-primary transition-colors text-[18px]"
                  title="Insert Strait of Hormuz preset"
                >
                  my_location
                </button>
              </div>
            </div>

            {/* Drag & Drop Reference Imagery Upload Zone */}
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
                  DRAG & DROP SAR / OPTICAL FILES
                </span>
                <span className="font-mono-data text-mono-data text-outline mt-1 text-[10px]">
                  MAX 500MB (.TIFF, .NTF, .PNG)
                </span>

                {/* Uploaded Files Chips */}
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
                  <div className="flex items-center px-sm py-1 border-b border-primary/10 bg-primary/5">
                    <span className="material-symbols-outlined text-[14px] text-primary mr-1">
                      psychology
                    </span>
                    <span className="font-mono-label text-[10px] text-primary/70 tracking-widest">
                      QUERY_PROTOCOL_BUFFER
                    </span>
                  </div>
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border-none focus:ring-0 p-2.5 font-mono-data text-mono-data text-primary placeholder:text-primary/30 resize-none text-xs focus:outline-none"
                    placeholder="> Enter orbital query..."
                  />
                  <div className="flex justify-between items-center p-2 bg-primary/5 border-t border-primary/10">
                    <span className="font-mono-data text-[10px] text-on-surface-variant/60 pl-1">
                      Ready for inference
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

      {/* Ambient System Telemetry Watermark (Desktop) */}
      <div className="hidden lg:block absolute bottom-6 left-8 z-0 opacity-50 font-mono-data text-mono-data text-outline text-xs leading-relaxed pointer-events-none">
        SYS.OP.MODE: NORMAL<br />
        LATENCY: 42ms<br />
        UPLINK: ACTIVE
      </div>
    </div>
  );
};
