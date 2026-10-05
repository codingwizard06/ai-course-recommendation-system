import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './pages/AuthModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CatalogPage from './pages/CatalogPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import MyLearningPage from './pages/MyLearningPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function MainApp() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState(isAuthenticated ? 'dashboard' : 'landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Automatically update view if auth state changes
  React.useEffect(() => {
    if (isAuthenticated && currentView === 'landing') {
      setCurrentView('dashboard');
    } else if (!isAuthenticated && currentView !== 'catalog') {
      setCurrentView('landing');
    }
  }, [isAuthenticated]);

  const handleNavigate = (viewId) => {
    if (!isAuthenticated && viewId !== 'landing' && viewId !== 'catalog') {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onExploreCatalog={() => setCurrentView('catalog')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
        {currentView === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'recommendations' && <RecommendationsPage onNavigate={handleNavigate} />}
        {currentView === 'skillgap' && <SkillGapPage onNavigate={handleNavigate} />}
        {currentView === 'roadmap' && <RoadmapPage />}
        {currentView === 'mylearning' && <MyLearningPage />}
        {currentView === 'assistant' && <AIAssistantPage />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'admin' && isAdmin && <AdminPage />}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentView('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
