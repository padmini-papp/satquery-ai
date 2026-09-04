import React from 'react';
import { useApp } from '../../context/AppContext';

export const ProcessingScreen: React.FC = () => {
  const { traceSteps, setCurrentScreen } = useApp();

  return (
    <div className="flex-1 mt-16 flex flex-col items-center justify-center p-4 relative min-h-[calc(100vh-64px)] overflow-hidden bg-grid-pattern">
      {/* Ambient Pulsing Glow */}
      <div className="fixed inset-0 bg-ambient-glow pointer-events-none z-0"></div>

      {/* Center Cinematic Bento Box */}
      <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-xl tech-border shadow-2xl relative z-10 space-y-6">
        {/* 4 Corner L-Brackets */}
        <div className="corner-tl"></div>
        <div className="corner-tr"></div>
        <div className="corner-bl"></div>
        <div className="corner-br"></div>

        {/* Processing State Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined animate-spin text-[22px]">settings</span>
            <h2 className="font-mono-label text-sm sm:text-base tracking-widest uppercase font-bold">
              SATQUERY AGENT: PROCESSING
            </h2>
          </div>
          <span className="font-mono-data text-xs text-tertiary bg-tertiary/10 border border-tertiary/30 px-2 py-0.5 rounded animate-pulse">
            LIVE INFERENCE
          </span>
        </div>

        {/* Step-by-Step Progress List */}
        <div className="space-y-3.5 font-mono-data">
          {traceSteps.map((step) => {
            const isDone = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className={`p-3 rounded border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-surface-container-lowest/80 border-tertiary/30'
                    : isRunning
                    ? 'bg-primary/10 border-primary/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                    : 'bg-surface-container-lowest/30 border-outline-variant/20 opacity-40'
                }`}
              >
                {/* Icon State */}
                <div className="shrink-0 mt-0.5">
                  {isDone && (
                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                      check_circle
                    </span>
                  )}
                  {isRunning && (
                    <span className="material-symbols-outlined text-primary text-[20px] animate-spin">
                      sync
                    </span>
                  )}
                  {step.status === 'pending' && (
                    <span className="material-symbols-outlined text-outline-variant text-[20px]">
                      schedule
                    </span>
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-xs">
                    <span
                      className={`font-semibold tracking-wide uppercase ${
                        isDone ? 'text-on-surface' : isRunning ? 'text-primary' : 'text-outline'
                      }`}
                    >
                      {step.name.replace(/_/g, ' ')}
                    </span>
                    {step.latencyMs !== undefined && (
                      <span className="text-[10px] text-tertiary font-mono-data">
                        {step.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                    {step.details || (isRunning ? 'Processing spatial telemetry...' : 'In queue')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinematic Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-mono-data text-on-surface-variant">
            <span>EXECUTING CHANGE DETECTION PIPELINE</span>
            <span className="text-primary font-bold">94%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/40">
            <div className="h-full bg-gradient-to-r from-primary via-tertiary to-primary-container w-[94%] shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></div>
          </div>
        </div>

        {/* Action Skip Trigger (Optional fallback if user wants to proceed immediately) */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setCurrentScreen('result')}
            className="text-[11px] font-mono-label text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>Skip to Results</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
