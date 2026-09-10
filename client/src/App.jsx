import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ExcelUploaderModal from './components/ExcelUploaderModal';
import HomeDashboard from './pages/HomeDashboard';
import ExamSessionPage from './pages/ExamSessionPage';
import SessionResultsPage from './pages/SessionResultsPage';
import SessionHistoryPage from './pages/SessionHistoryPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'history', 'exam', 'results'
  const [examConfig, setExamConfig] = useState(null);
  const [currentSessionResult, setCurrentSessionResult] = useState(null);
  
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleStartExam = (config) => {
    setExamConfig(config);
    setActiveTab('exam');
  };

  const handleCompleteSession = (sessionData) => {
    setCurrentSessionResult(sessionData);
    setActiveTab('results');
  };

  const handleViewSessionDetail = (sessionData) => {
    setCurrentSessionResult(sessionData);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
      
      {/* Top Navbar */}
      {activeTab !== 'exam' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenExcelModal={() => setIsExcelModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <HomeDashboard
            onStartExam={handleStartExam}
            onOpenExcelModal={() => setIsExcelModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'exam' && examConfig && (
          <ExamSessionPage
            config={examConfig}
            onCompleteSession={handleCompleteSession}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'results' && currentSessionResult && (
          <SessionResultsPage
            session={currentSessionResult}
            onRetake={() => handleStartExam(examConfig || { mode: 'simulated', domain: 'All', limit: 50 })}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'history' && (
          <SessionHistoryPage
            onViewSessionDetail={handleViewSessionDetail}
          />
        )}
      </main>

      {/* Footer */}
      {activeTab !== 'exam' && (
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ScrumMaster Pro. Certified ScrumMaster (CSM) Exam Practice Platform.</p>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-600">Built with React, Node.js Express, & Excel Question Databases.</p>
        </footer>
      )}

      {/* Modals */}
      <ExcelUploaderModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />

      <AuthPage
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
