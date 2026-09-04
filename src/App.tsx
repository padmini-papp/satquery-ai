import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAppBar } from './components/layout/TopAppBar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { LandingScreen } from './components/landing/LandingScreen';
import { AnalysisConsole } from './components/console/AnalysisConsole';
import { ProcessingScreen } from './components/processing/ProcessingScreen';
import { AnalysisResultScreen } from './components/results/AnalysisResultScreen';
import { TemporalAnalysisScreen } from './components/temporal/TemporalAnalysisScreen';
import { ProcessingHistoryScreen } from './components/history/ProcessingHistoryScreen';

const MainContent: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <TopAppBar />

      <main className="flex-1 flex flex-col">
        {currentScreen === 'landing' && <LandingScreen />}
        {currentScreen === 'console' && <AnalysisConsole />}
        {currentScreen === 'processing' && <ProcessingScreen />}
        {currentScreen === 'result' && <AnalysisResultScreen />}
        {currentScreen === 'temporal' && <TemporalAnalysisScreen />}
        {currentScreen === 'history' && <ProcessingHistoryScreen />}
      </main>

      {/* Bottom Navigation Bar for Mobile Devices */}
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
