import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';

export const TopAppBar: React.FC = () => {
  const { currentScreen, setCurrentScreen, theme, toggleTheme } = useApp();

  const navItems: { label: string; screen: ScreenType }[] = [
    { label: 'Workspace', screen: 'console' },
    { label: 'Temporal Analysis', screen: 'temporal' },
    { label: 'Processing History', screen: 'history' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 flex justify-between items-center px-4 md:px-margin-desktop h-16 transition-colors duration-200">
      {/* Brand Identity */}
      <div
        className="flex items-center gap-sm cursor-pointer group"
        onClick={() => setCurrentScreen('landing')}
        title="Return to SatQuery AI Landing"
      >
        <span
          className="material-symbols-outlined text-primary font-headline-md text-headline-md transition-transform group-hover:scale-105"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          satellite_alt
        </span>
        <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
          SATQUERY AI
        </span>
      </div>

      {/* Desktop Horizontal Navigation Links */}
      <nav className="hidden md:flex gap-md lg:gap-lg items-center">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.label}
              onClick={() => setCurrentScreen(item.screen)}
              className={`font-mono-label text-mono-label px-3 py-1.5 rounded transition-all duration-150 ${
                isActive
                  ? 'text-primary font-bold bg-primary/10 border-b border-primary shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                  : 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {/* Dynamic tab for Active Analysis Result if user is currently viewing results */}
        {currentScreen === 'result' && (
          <button
            onClick={() => setCurrentScreen('result')}
            className="font-mono-label text-mono-label px-3 py-1.5 rounded transition-all duration-150 text-tertiary font-bold bg-tertiary/10 border-b border-tertiary shadow-[0_0_8px_rgba(104,245,184,0.2)]"
          >
            Analysis Results
          </button>
        )}
      </nav>

      {/* Status Indicators & Theme Control */}
      <div className="flex items-center gap-sm md:gap-md">
        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1 px-2.5 py-1 rounded border border-outline-variant/40 bg-surface-container-lowest/80 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all text-xs font-mono-label"
          title={`Switch Theme (Current: ${theme === 'navy' ? 'Deep Space Navy' : 'Midnight OLED'})`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {theme === 'navy' ? 'dark_mode' : 'brightness_medium'}
          </span>
          <span className="hidden sm:inline">
            {theme === 'navy' ? 'NAVY' : 'MIDNIGHT'}
          </span>
        </button>

        {/* Pulsing System Online Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-mono-label text-mono-label text-primary tracking-wider">
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </header>
  );
};
