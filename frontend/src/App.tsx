import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Academic from './pages/Academic';
import Fitness from './pages/Fitness';
import Nutrition from './pages/Nutrition';
import Productivity from './pages/Productivity';
import Finance from './pages/Finance';
import Career from './pages/Career';
import FutureSelf from './pages/FutureSelf';
import AskMyTwin from './pages/AskMyTwin';
import WeeklyReview from './pages/WeeklyReview';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Regreter from './pages/Regreter';

function App() {
  const hasOnboarded = localStorage.getItem('studentTwin_onboarded') === 'true';

  if (!hasOnboarded) {
    return (
      <Onboarding onComplete={() => {
        localStorage.setItem('studentTwin_onboarded', 'true');
        window.location.reload();
      }} />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="academic" element={<Academic />} />
          <Route path="fitness" element={<Fitness />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="finance" element={<Finance />} />
          <Route path="career" element={<Career />} />
          <Route path="future-self" element={<FutureSelf />} />
          <Route path="regreter" element={<Regreter />} />
          <Route path="ask-twin" element={<AskMyTwin />} />
          <Route path="weekly-review" element={<WeeklyReview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
