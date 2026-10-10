import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Academic from './pages/Academic';
import Fitness from './pages/Fitness';
import Nutrition from './pages/Nutrition';
import Health from './pages/Health';
import Productivity from './pages/Productivity';
import Finance from './pages/Finance';
import Career from './pages/Career';
import FutureSelf from './pages/FutureSelf';
import AskMyTwin from './pages/AskMyTwin';
import WeeklyReview from './pages/WeeklyReview';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Regreter from './pages/Regreter';
import RouteGuard from './components/RouteGuard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AuthCallback from './pages/auth/AuthCallback';
import Guardian from './pages/Guardian';
import { api } from './services/api';

function AppContent() {
  const [onboarded, setOnboarded] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const student = await api.getStudent();
        if (student) {
          localStorage.setItem('studentTwin_onboarded', 'true');
          setOnboarded(true);
        } else {
          localStorage.removeItem('studentTwin_onboarded');
          setOnboarded(false);
        }
      } catch (e) {
        // Not logged in or error
        setOnboarded(false);
      } finally {
        setChecking(false);
      }
    };
    checkOnboarding();
  }, []);

  if (checking) {
    return <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">Loading...</div>;
  }

  if (!onboarded && location.pathname !== '/onboarding' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/auth/callback') {
    return <Navigate to="/onboarding" />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/demo" element={<div className="p-4 text-center">Demo mode coming soon</div>} />

      <Route element={<RouteGuard />}>
        <Route path="/onboarding" element={<Onboarding onComplete={() => window.location.href = '/'} />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="academic" element={<Academic />} />
          <Route path="fitness" element={<Fitness />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="health" element={<Health />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="finance" element={<Finance />} />
          <Route path="career" element={<Career />} />
          <Route path="future-self" element={<FutureSelf />} />
          <Route path="regreter" element={<Regreter />} />
          <Route path="ask-twin" element={<AskMyTwin />} />
          <Route path="weekly-review" element={<WeeklyReview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="guardian" element={<Guardian />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
