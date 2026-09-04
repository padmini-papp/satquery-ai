import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const TemporalAnalysisScreen: React.FC = () => {
  const { session, setCurrentScreen, startChangeAnalysisFlow, isProcessing } = useApp();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [queryInput, setQueryInput] = useState<string>('');

  const [t1File, setT1File] = useState<File | null>(null);
  const [t2File, setT2File] = useState<File | null>(null);
  const [t1Preview, setT1Preview] = useState<string>('');
  const [t2Preview, setT2Preview] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  const handleT1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setT1File(file);
      setT1Preview(URL.createObjectURL(file));
    }
  };

  const handleT2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setT2File(file);
      setT2Preview(URL.createObjectURL(file));
    }
  };

  const handleRunChangeAnalysis = () => {
    if (!t1File || !t2File) {
      alert('Please upload both T1 (Before) and T2 (After) satellite image acquisitions.');
      return;
    }
    startChangeAnalysisFlow(t1File, t2File, queryInput);
  };

  const beforeImage = session?.beforeImageryUrl || t1Preview;
  const afterImage = session?.afterImageryUrl || t2Preview;

  return (
    <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden bg-grid-pattern relative">
      {/* 1. Comparison Canvas Viewport */}
      <div className="flex-1 glass-panel rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden relative shadow-2xl min-h-[480px] lg:min-h-0 bg-black">
        <div className="corner-tl"></div>
        <div className="corner-tr"></div>
        <div className="corner-bl"></div>
        <div className="corner-br"></div>

        {/* Viewport Toolbar */}
        <div className="h-12 border-b border-outline-variant/30 flex items-center justify-between px-4 bg-surface-container/60 z-20 shrink-0">
          <div className="flex items-center gap-3 font-mono-label text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span className="text-secondary font-bold">T1 (PRE-ACQUISITION)</span>
            </div>
            <span className="text-outline-variant">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
              <span className="text-tertiary font-bold">T2 (POST-ACQUISITION)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('console')}
              className="px-2.5 py-1 rounded bg-surface-bright/70 border border-outline-variant/40 hover:border-primary text-xs font-mono-data text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">space_dashboard</span>
              <span className="hidden sm:inline">Workspace</span>
            </button>
          </div>
        </div>

        {/* Comparison Canvas */}
        {beforeImage && afterImage ? (
          <div
            ref={containerRef}
            onTouchMove={handleTouchMove}
            className="flex-1 relative overflow-hidden select-none cursor-ew-resize bg-black"
          >
            {/* After Image (T2) */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('${afterImage}')`,
                filter: 'brightness(0.9) contrast(1.15)',
              }}
            />

            {/* Before Image (T1) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-primary"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-cover bg-center"
                style={{
                  width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw',
                  backgroundImage: `url('${beforeImage}')`,
                  filter: 'brightness(0.9) contrast(1.15)',
                }}
              />
            </div>

            {/* Draggable Handle */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-auto"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-white flex items-center justify-center text-surface-dim shadow-[0_0_16px_rgba(34,211,238,0.9)] cursor-ew-resize">
                <span className="material-symbols-outlined text-[18px] font-bold">swap_horiz</span>
              </div>
            </div>

            {/* Grounded Change Boxes */}
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
                    className="absolute border-2 border-tertiary bg-tertiary/15 rounded pointer-events-none shadow-[0_0_16px_rgba(104,245,184,0.4)] animate-pulse"
                    style={{
                      top: `${Math.max(5, Math.min(top, 75))}%`,
                      left: `${Math.max(5, Math.min(left, 75))}%`,
                      width: `${Math.max(10, Math.min(width, 85))}%`,
                      height: `${Math.max(10, Math.min(height, 85))}%`,
                    }}
                  >
                    <div className="absolute -top-5 left-0 bg-tertiary/90 px-1.5 py-0.5 text-[9px] font-mono-label text-black font-bold whitespace-nowrap">
                      CHANGE DETECTED #{idx + 1}
                    </div>
                  </div>
                );
              })
            )}

            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-outline-variant/30 text-[10px] font-mono-data text-primary pointer-events-none">
              DRAG CURTAIN TO COMPARE TEMPORAL FRAMES
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <span className="material-symbols-outlined text-primary text-[48px]">compare</span>
            <div className="max-w-md space-y-2">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">BITEMPORAL CHANGE DETECTION</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Upload pre-acquisition (T1) and post-acquisition (T2) satellite images to execute ChangeChat neural change localization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              {/* T1 File Input */}
              <label className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${t1File ? 'border-tertiary bg-tertiary/10' : 'border-outline-variant hover:border-primary'}`}>
                <input type="file" accept="image/*" onChange={handleT1Change} className="hidden" />
                <span className="material-symbols-outlined text-xs text-primary mb-1">upload_file</span>
                <span className="font-mono-label text-xs font-bold text-on-surface">T1 (BEFORE IMAGE)</span>
                <span className="font-mono-data text-[10px] text-on-surface-variant truncate mt-1 max-w-[180px]">
                  {t1File ? t1File.name : 'Select file...'}
                </span>
              </label>

              {/* T2 File Input */}
              <label className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${t2File ? 'border-tertiary bg-tertiary/10' : 'border-outline-variant hover:border-primary'}`}>
                <input type="file" accept="image/*" onChange={handleT2Change} className="hidden" />
                <span className="material-symbols-outlined text-xs text-primary mb-1">upload_file</span>
                <span className="font-mono-label text-xs font-bold text-on-surface">T2 (AFTER IMAGE)</span>
                <span className="font-mono-data text-[10px] text-on-surface-variant truncate mt-1 max-w-[180px]">
                  {t2File ? t2File.name : 'Select file...'}
                </span>
              </label>
            </div>

            <div className="w-full max-w-lg space-y-3">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Query prompt e.g. 'Detect new structures or container volume changes'"
                className="w-full bg-surface-container-lowest border-b border-outline-variant px-3 py-2 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleRunChangeAnalysis}
                disabled={isProcessing || !t1File || !t2File}
                className="w-full bg-primary-container text-surface-dim font-mono-label text-xs py-3 rounded font-bold hover:bg-primary-fixed-dim shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
              >
                {isProcessing ? 'PROCESSING CHANGE ANALYSIS...' : 'RUN CHANGECHAT ANALYSIS'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Detection Metrics Panel */}
      <aside className="w-full lg:w-[380px] flex flex-col gap-4 shrink-0 overflow-y-auto">
        <div className="pb-1">
          <h3 className="font-headline-md text-xl font-bold text-on-surface">
            {session?.targetTitle || 'Temporal Analysis'}
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant">ChangeChat Neural Inference</p>
        </div>

        {/* Change Report Summary */}
        {session ? (
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3 tech-border shadow-xl">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
              <h4 className="font-mono-label text-xs text-primary font-bold tracking-widest uppercase">
                ANALYSIS SUMMARY
              </h4>
            </div>

            <div className="bg-surface-container/60 p-3 rounded border border-outline-variant/20 flex justify-between items-center">
              <span className="font-mono-label text-[10px] text-on-surface-variant uppercase">CONFIDENCE SCORE</span>
              <span className="font-mono-data text-lg text-tertiary font-bold">{session.confidenceScore}%</span>
            </div>

            <div className="bg-surface-container/60 p-3 rounded border border-outline-variant/20 text-xs font-body-sm space-y-1">
              <span className="font-mono-label text-[10px] text-on-surface-variant block uppercase">
                EXECUTIVE INTELLIGENCE
              </span>
              <p className="text-on-surface leading-relaxed text-xs">
                {session.executiveSummary}
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 text-center text-xs font-mono-data text-outline">
            Upload T1 and T2 images above to run live ChangeChat analysis.
          </div>
        )}
      </aside>
    </div>
  );
};
