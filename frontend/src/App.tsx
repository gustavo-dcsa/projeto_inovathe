import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
// Assuming these will be created/refactored later. Using placeholders for now.
const Header = () => <header className="bg-white shadow-md p-4 text-deep-teal font-bold">Idea Bank Header</header>;
const Footer = () => <footer className="bg-deep-teal text-white p-4 text-center">© 2024 Idea Bank</footer>;
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>; // Simplified placeholder

// Page Components
import HomePage from './pages/HomePage';
import SubmitIdeaPage from './pages/SubmitIdeaPage';
import TrackIdeaPage from './pages/TrackIdeaPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import DashboardPage from './pages/DashboardPage';
import AgendaPage from './pages/AgendaPage';
import FaqPage from './pages/FaqPage';
import AboutPage from './pages/AboutPage';

// Styles
import './index.css';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-bg-light">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/track-idea" element={<TrackIdeaPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected Routes */}
              <Route path="/submit-idea" element={<ProtectedRoute><SubmitIdeaPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/users/me" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
