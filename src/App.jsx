import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ChatModal from './components/ChatModal.jsx';
import FloatingChatButton from './components/FloatingChatButton.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Students from './pages/Students.jsx';
import DocGen from './pages/DocGen.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LawyerProfile from './pages/LawyerProfile.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <ChatProvider>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? '' : 'min-h-screen'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/students" element={<Students />} />
          <Route path="/docgen" element={<DocGen />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <FloatingChatButton />}
      <ChatModal />
    </ChatProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
      <div className="text-7xl">404</div>
      <h1 className="font-display text-2xl font-bold text-navy mt-4">Бет табылмады</h1>
      <a href="/" className="btn-primary mt-6">Басты бетке</a>
    </div>
  );
}
