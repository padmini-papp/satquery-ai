import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnalysisSession } from '../../types';

export const ProcessingHistoryScreen: React.FC = () => {
  const { historySessions, selectHistorySession, setCurrentScreen } = useApp();
  const [filter, setFilter] = useState<'all' | 'maritime' | 'infrastructure' | 'environmental'>('all');

  const filteredSessions = historySessions.filter((s) => {
    if (filter === 'maritime') return s.targetTitle.toLowerCase().includes('hormuz') || s.targetTitle.toLowerCase().includes('vessel');
    if (filter === 'infrastructure') return s.targetTitle.toLowerCase().includes('sector') || s.targetTitle.toLowerCase().includes('rotterdam');
    if (filter === 'environmental') return s.targetTitle.toLowerCase().includes('amazon') || s.targetTitle.toLowerCase().includes('deforestation');
    return true;
  });

  return (
    <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-64px)] bg-grid-pattern relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-label text-[10px] text-tertiary border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 rounded uppercase">
              DEEP ARCHIVE // AUDIT LOG
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[28px]">history</span>
            Processing History &amp; Intelligence Logs
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Historical query executions, neural inferences, and verified satellite targets.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'maritime', 'infrastructure', 'environmental'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded font-mono-label text-[11px] uppercase tracking-wider transition-all ${
                filter === cat
                  ? 'bg-primary text-surface-dim font-bold shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                  : 'bg-surface-bright/50 border border-outline-variant/40 text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of History Sessions */}
      {filteredSessions.length === 0 ? (
        <div className="glass-panel p-8 rounded-xl border border-outline-variant/30 text-center space-y-3">
          <span className="material-symbols-outlined text-outline-variant text-[40px]">history_toggle_off</span>
          <h3 className="font-headline-md text-base font-bold text-on-surface">NO PROCESSING HISTORY YET</h3>
          <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto">
            No historical session logs recorded yet. Execute query protocols from the workspace console to record live inference sessions.
          </p>
          <button
            onClick={() => setCurrentScreen('console')}
            className="px-4 py-2 bg-primary-container text-surface-dim font-mono-label text-xs font-bold rounded hover:bg-primary-fixed-dim transition-all"
          >
            START NEW ANALYSIS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {filteredSessions.map((item: AnalysisSession) => (
            <div
              key={item.id}
              onClick={() => selectHistorySession(item)}
              className="glass-panel p-5 rounded-xl border border-outline-variant/40 hover:border-primary/60 transition-all cursor-pointer group tech-border relative shadow-xl hover:scale-[1.01] flex flex-col justify-between"
            >
              {/* 4 Corner L-Brackets */}
              <div className="corner-tl"></div>
              <div className="corner-tr"></div>
              <div className="corner-bl"></div>
              <div className="corner-br"></div>

              <div>
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono-data text-[10px] text-primary/80 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      ID: {item.targetId}
                    </span>
                    <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors mt-1.5">
                      {item.targetTitle}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="font-display-lg text-xl font-bold text-tertiary">
                      {item.confidenceScore}%
                    </div>
                    <span className="font-mono-data text-[9px] text-outline">CONFIDENCE</span>
                  </div>
                </div>

                {/* Satellite Thumbnail & Metadata Preview */}
                <div className="flex gap-3 mb-3">
                  <div
                    className="w-24 h-20 rounded bg-cover bg-center border border-outline-variant/40 shrink-0 relative overflow-hidden"
                    style={{ backgroundImage: `url('${item.imageryUrl}')` }}
                  >
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                  </div>

                  <div className="flex-1 space-y-1 font-mono-data text-[11px] text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                      <span className="text-on-surface">{item.coordinates}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-tertiary">sensors</span>
                      <span>{item.sensor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-outline">schedule</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Brief Summary */}
                <p className="font-body-sm text-xs text-on-surface-variant/90 line-clamp-2 leading-relaxed">
                  {item.executiveSummary}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 mt-3 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                <span className="font-mono-label text-[10px] text-tertiary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  VERIFIED TARGET
                </span>

                <span className="font-mono-label text-xs text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  <span>INSPECT INTEL</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return to Workspace Shortcut */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setCurrentScreen('console')}
          className="font-mono-label text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Live Workspace Viewport</span>
        </button>
      </div>
    </div>
  );
};
