import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { DemoDrawer } from './components/DemoDrawer';
import Landing from './pages/Landing';
import Start from './pages/Start';
import Quiz from './pages/Quiz';
import Teaser from './pages/Teaser';
import Details from './pages/Details';
import Payment from './pages/Payment';
import ReportReady from './pages/ReportReady';
import PortalLogin from './pages/PortalLogin';
import Portal from './pages/Portal';
import Staff from './pages/Staff';

export default function App() {
  // Listen for confetti event from payment page
  useEffect(() => {
    function fireConfetti() {
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#0E7C86', '#D9A441', '#EAF2F3', '#0B3C49', '#ffffff'],
      });
    }
    window.addEventListener('pathora-confetti', fireConfetti);
    return () => window.removeEventListener('pathora-confetti', fireConfetti);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-light)' }}>
      <Header />
      <Routes>
        <Route path="/"             element={<Landing />} />
        <Route path="/start"        element={<Start />} />
        <Route path="/quiz"         element={<Quiz />} />
        <Route path="/teaser"       element={<Teaser />} />
        <Route path="/details"      element={<Details />} />
        <Route path="/payment"      element={<Payment />} />
        <Route path="/report-ready" element={<ReportReady />} />
        <Route path="/portal/login" element={<PortalLogin />} />
        <Route path="/portal"       element={<Portal />} />
        <Route path="/staff"        element={<Staff />} />
        <Route path="*"             element={<Landing />} />
      </Routes>
      <DemoDrawer />
    </div>
  );
}
