import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SubmitIdeaPage from './pages/SubmitIdeaPage';
import TrackIdeaPage from './pages/TrackIdeaPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './index.css'; // I'm importing index.css here to get the Tailwind styles

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit-idea" element={<SubmitIdeaPage />} />
            <Route path="/track-idea" element={<TrackIdeaPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* I will add the other routes here later */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
