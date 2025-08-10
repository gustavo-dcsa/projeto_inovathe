import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SubmitIdeaPage from './pages/NewSubmitIdeaPage.js';
import TrackIdeaPage from './pages/TrackIdeaPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NewSubmitIdeaPage from './pages/NewSubmitIdeaPage';
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
            <Route path="/new-submit-idea" element={<NewSubmitIdeaPage />} />
            {/* I will add the other routes here later */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
