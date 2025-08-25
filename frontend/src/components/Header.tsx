import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { token, user } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">IdeaBank</Link>
        <div>
          <Link to="/" className="mr-4 hover:text-gray-300">Home</Link>
          <Link to="/submit" className="mr-4 hover:text-gray-300">Submit Idea</Link>
          <Link to="/track" className="mr-4 hover:text-gray-300">Track Idea</Link>
          {token ? (
            <>
              <Link to="/my-ideas" className="mr-4 hover:text-gray-300">My Ideas</Link>
              <Link to="/users/me" className="hover:text-gray-300">
                Welcome, {user?.full_name || user?.username}!
              </Link>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
