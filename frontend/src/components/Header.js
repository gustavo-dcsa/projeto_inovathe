import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// I'm assuming the logo is named 'abelha.png' as requested.
// I will need to confirm the actual filename once I can see the files.
import logo from '../assets/abelha.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#014D49] text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Idea Bank Logo" className="h-10 w-10 mr-4" />
        <h1 className="text-2xl font-bold">Idea Bank</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-[#B1D14A]">Home</Link></li>
          <li><Link to="/submit-idea" className="hover:text-[#B1D14A]">Submit Idea</Link></li>
          <li><Link to="/track-idea" className="hover:text-[#B1D14A]">Track Idea</Link></li>
          <li><Link to="/dashboard" className="hover:text-[#B1D14A]">Dashboard</Link></li>
          <li><Link to="/innovation-hub" className="hover:text-[#B1D14A]">Innovation Hub</Link></li>
          <li><Link to="/faq" className="hover:text-[#B1D14A]">FAQ</Link></li>
          <li><Link to="/about-us" className="hover:text-[#B1D14A]">About Us</Link></li>
        </ul>
      </nav>
      <div>
        {user ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-[#F57921] hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-[#00995D] hover:bg-[#B1D14A] text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
