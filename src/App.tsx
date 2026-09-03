import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAppBar } from './components/layout/TopAppBar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { LandingScreen } from './components/landing/LandingScreen';

const MainContent: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <TopAppBar />

      <main className="flex-1 flex flex-col">
        {currentScreen === 'landing' && <LandingScreen />}

        {/* Temporary preview containers for subsequent screens in the flow */}
        {currentScreen !== 'landing' && (
          <div className="flex-1 mt-16 p-8 flex flex-col items-center justify-center text-center">
            <div className="glass-panel p-8 rounded-xl tech-border max-w-lg w-full space-y-4">
              <div className="corner-tl"></div>
              <div className="corner-tr"></div>
              <div className="corner-bl"></div>
              <div className="corner-br"></div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary font-mono-label text-xs">
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                FLOW STATE: {currentScreen.toUpperCase()}
              </div>

              <h2 className="font-headline-md text-headline-md text-primary font-bold">
                {currentScreen === 'console' && 'Analysis Console Active'}
                {currentScreen === 'processing' && 'SatQuery Agent: Processing...'}
                {currentScreen === 'result' && 'Sector 7G Activity Analysis'}
                {currentScreen === 'temporal' && 'Temporal Analysis - Change Detection'}
              </h2>

              <p className="font-body-md text-on-surface-variant text-sm">
                Ready for subsequent stage implementation. You can navigate back to the Landing screen or switch views using the top bar.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentScreen('landing')}
                  className="px-4 py-2 bg-primary text-surface-dim font-mono-label text-xs rounded font-bold hover:bg-primary-fixed-dim transition-colors"
                >
                  Return to Landing
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav Bar for Mobile Devices */}
      <BottomNavBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
