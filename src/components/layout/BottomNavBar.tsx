import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenType } from '../../types';

export const BottomNavBar: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  const items: { label: string; screen: ScreenType; icon: string }[] = [
    { label: 'Workspace', screen: 'console', icon: 'dashboard' },
    { label: 'Temporal', screen: 'temporal', icon: 'compare' },
    { label: 'History', screen: 'history', icon: 'history' },
    { label: 'Landing', screen: 'landing', icon: 'explore' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-highest/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-2xl flex justify-around items-center h-16 px-2">
      {items.map((item) => {
        const isActive = currentScreen === item.screen;
        return (
          <button
            key={item.label}
            onClick={() => setCurrentScreen(item.screen)}
            className={`flex flex-col items-center justify-center p-1.5 transition-all ${
              isActive
                ? 'text-primary bg-primary/10 rounded-full px-3 py-1 scale-105 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-mono-label text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
