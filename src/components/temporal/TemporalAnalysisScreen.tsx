import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { STITCH_IMAGES } from '../../services/mockAnalysisService';

export const TemporalAnalysisScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showThresholdModal, setShowThresholdModal] = useState<boolean>(false);
  const [sensitivityThreshold, setSensitivityThreshold] = useState<number>(75);

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

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Temporal Change Detection Intelligence Briefing (PDF) downloaded.');
    }, 1200);
  };

  return (
    <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden bg-grid-pattern relative">
      {/* 1. Left / Center: Interactive Comparison Slider Viewport */}
      <div className="flex-1 glass-panel rounded-xl border border-outline-variant/30 flex flex-col overflow-hidden relative shadow-2xl min-h-[480px] lg:min-h-0 bg-black">
        {/* 4 Corner L-Brackets */}
        <div className="corner-tl"></div>
        <div className="corner-tr"></div>
        <div className="corner-bl"></div>
        <div className="corner-br"></div>

        {/* Viewport Toolbar */}
        <div className="h-12 border-b border-outline-variant/30 flex items-center justify-between px-4 bg-surface-container/60 z-20 shrink-0">
          <div className="flex items-center gap-3 font-mono-label text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span className="text-secondary font-bold">T1: 2023-08-15 (PRE)</span>
            </div>
            <span className="text-outline-variant">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
              <span className="text-tertiary font-bold">T2: 2023-11-22 (POST)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('result')}
              className="px-2.5 py-1 rounded bg-surface-bright/70 border border-outline-variant/40 hover:border-primary text-xs font-mono-data text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">analytics</span>
              <span className="hidden sm:inline">Results</span>
            </button>
            <button
              onClick={() => setCurrentScreen('console')}
              className="px-2.5 py-1 rounded bg-surface-bright/70 border border-outline-variant/40 hover:border-primary text-xs font-mono-data text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">space_dashboard</span>
              <span className="hidden sm:inline">Workspace</span>
            </button>
          </div>
        </div>

        {/* The Split Comparison Canvas */}
        <div
          ref={containerRef}
          onTouchMove={handleTouchMove}
          className="flex-1 relative overflow-hidden select-none cursor-ew-resize bg-black"
        >
          {/* Base Image: T2 / After Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${STITCH_IMAGES.temporalAfter}')`,
              filter: 'brightness(0.9) contrast(1.15)',
            }}
          />

          {/* Overlay Image: T1 / Before Image, clipped via width */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-primary"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-cover bg-center"
              style={{
                width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw',
                backgroundImage: `url('${STITCH_IMAGES.temporalBefore}')`,
                filter: 'brightness(0.9) contrast(1.15)',
              }}
            />
          </div>

          {/* Draggable Slider Divider Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-auto"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-white flex items-center justify-center text-surface-dim shadow-[0_0_16px_rgba(34,211,238,0.9)] cursor-ew-resize transition-transform hover:scale-110">
              <span className="material-symbols-outlined text-[18px] font-bold">swap_horiz</span>
            </div>
          </div>

          {/* Change Highlight Polygons (simulated on After side) */}
          {sliderPosition < 70 && (
            <div className="absolute top-[28%] left-[58%] w-24 h-24 border-2 border-tertiary bg-tertiary/15 rounded pointer-events-none shadow-[0_0_16px_rgba(104,245,184,0.4)] animate-pulse">
              <div className="absolute -top-5 left-0 bg-tertiary/90 px-1.5 py-0.5 text-[9px] font-mono-label text-black font-bold whitespace-nowrap">
                NEW STRUCTURE (+8 UNITS)
              </div>
            </div>
          )}

          {/* Coordinates HUD */}
          <div className="absolute bottom-4 right-4 bg-surface-container/85 backdrop-blur px-3 py-1.5 rounded border border-outline-variant/50 font-mono-data text-xs text-on-surface-variant pointer-events-none shadow-lg">
            34° 03' 08" N | 118° 14' 37" W
          </div>

          {/* Drag Instruction Banner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-outline-variant/30 text-[10px] font-mono-data text-primary pointer-events-none">
            DRAG CURTAIN TO COMPARE TEMPORAL FRAMES
          </div>
        </div>
      </div>

      {/* 2. Right: Analysis Panel & Detection Metrics */}
      <aside className="w-full lg:w-[380px] flex flex-col gap-4 shrink-0 overflow-y-auto">
        {/* Action Header */}
        <div className="flex justify-between items-end pb-1">
          <div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Port Expansion Sector 7</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">Change Detection Analysis</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-primary hover:bg-primary-fixed-dim text-surface-dim font-mono-label text-xs px-3.5 py-2 rounded font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>{isExporting ? 'EXPORTING...' : 'EXPORT REPORT'}</span>
          </button>
        </div>

        {/* Summary Statistics Card */}
        <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3 tech-border shadow-xl">
          <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
            <h4 className="font-mono-label text-xs text-primary font-bold tracking-widest uppercase">
              SUMMARY STATISTICS
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-surface-container/60 p-3 rounded border border-outline-variant/20 flex flex-col">
              <span className="font-mono-label text-[10px] text-on-surface-variant uppercase">TOTAL AREA CHANGED</span>
              <span className="font-mono-data text-lg text-primary font-bold mt-0.5">14.2 ha</span>
            </div>
            <div className="bg-surface-container/60 p-3 rounded border border-outline-variant/20 flex flex-col">
              <span className="font-mono-label text-[10px] text-on-surface-variant uppercase">CONFIDENCE SCORE</span>
              <span className="font-mono-data text-lg text-tertiary font-bold mt-0.5">94.8%</span>
            </div>
          </div>

          <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20 text-xs font-body-sm">
            <span className="font-mono-label text-[10px] text-on-surface-variant block mb-1 uppercase">
              PRIMARY DRIVER
            </span>
            <p className="text-on-surface leading-relaxed text-xs">
              Industrial infrastructure construction and increased container stockpiling across the western pier.
            </p>
          </div>
        </div>

        {/* Detection Classes Breakdown */}
        <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-2.5 tech-border shadow-xl">
          <div className="font-mono-label text-xs text-on-surface-variant uppercase tracking-wider mb-1">
            DETECTION CLASSES
          </div>
          <div className="space-y-2 text-xs font-mono-data">
            <div className="flex justify-between items-center py-1 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-tertiary"></span>
                <span className="text-on-surface">New Structures</span>
              </div>
              <span className="text-tertiary font-bold">+8 units</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-secondary"></span>
                <span className="text-on-surface">Container Volume</span>
              </div>
              <span className="text-secondary font-bold">+24.5%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-error"></span>
                <span className="text-on-surface">Vegetation Loss</span>
              </div>
              <span className="text-error font-bold">-3.1 ha</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                <span className="text-on-surface">Waterway Alteration</span>
              </div>
              <span className="text-on-surface-variant">Minimal</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="glass-panel p-3.5 rounded-xl border border-outline-variant/30 flex flex-col gap-2 tech-border">
          <span className="font-mono-label text-[10px] text-on-surface-variant uppercase tracking-wider">
            LEGEND & SPECTRAL SIGNATURE
          </span>
          <div className="flex items-center justify-between text-xs font-mono-data">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-error/30 border border-error"></span>
              <span className="text-on-surface">Significant Change</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-primary/20 border border-primary"></span>
              <span className="text-on-surface">Stable Baseline</span>
            </div>
          </div>
        </div>

        {/* Adjust Thresholds Interactive Modal / Controls */}
        <div>
          <button
            onClick={() => setShowThresholdModal(!showThresholdModal)}
            className="w-full py-2.5 border border-primary/50 text-primary font-mono-label text-xs rounded hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>{showThresholdModal ? 'HIDE THRESHOLDS' : 'ADJUST DETECTION THRESHOLDS'}</span>
          </button>

          {showThresholdModal && (
            <div className="mt-2 p-3 bg-surface-container-highest/50 border border-outline-variant/40 rounded-lg space-y-2">
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-on-surface-variant">CHANGE SENSITIVITY:</span>
                <span className="text-primary font-bold">{sensitivityThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="99"
                value={sensitivityThreshold}
                onChange={(e) => setSensitivityThreshold(Number(e.target.value))}
                className="w-full h-1 bg-surface-container-lowest appearance-none rounded cursor-pointer accent-primary"
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
