import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ideaService from '../services/ideaService';

const HomePage = () => {
  const [featuredIdeas, setFeaturedIdeas] = useState([]);
  const [likedIdeas, setLikedIdeas] = useState({});

  useEffect(() => {
    ideaService.getFeaturedIdeas()
      .then(response => {
        setFeaturedIdeas(response.data);
      })
      .catch(error => {
        console.error('Error fetching featured ideas:', error);
      });
  }, []);

  const handleLike = (ideaId) => {
    // This is a visual effect for now.
    // A real implementation would call the API to like the idea.
    setLikedIdeas(prev => ({ ...prev, [ideaId]: !prev[ideaId] }));
  };

  return (
    <div className="bg-[#CFE4BD] text-[#014D49]">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Unlock Your Inner Innovator</h1>
        <p className="text-xl mb-8">
          Got a brilliant idea? We want to hear it. Let's build the future, together.
        </p>
        <Link
          to="/submit-idea"
          className="bg-[#00995D] text-white font-bold py-3 px-8 rounded-full hover:bg-[#B1D14A] transition duration-300"
        >
          Submit Your Idea
        </Link>
      </div>

      {/* Featured Ideas Section */}
      <div className="py-20 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Ideas</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredIdeas.length > 0 ? (
            featuredIdeas.map(idea => (
              <div key={idea.id} className="bg-gray-100 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
                <p className="text-sm mb-4">{idea.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Submitted by: {idea.submitted_by_email}</span>
                  <button
                    onClick={() => handleLike(idea.id)}
                    className={`text-white text-sm py-1 px-3 rounded-full transition-colors duration-300 ${likedIdeas[idea.id] ? 'bg-red-500' : 'bg-[#F57921]'}`}
                  >
                    {likedIdeas[idea.id] ? 'Liked!' : 'Like'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3">No featured ideas yet. Be the first to submit!</p>
          )}
        </div>
      </div>

      {/* Motivational Cards Section */}
      <div className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Share Your Ideas?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-[#00995D] mb-4">Drive Change</h3>
            <p>Your ideas have the power to transform our business and our industry.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-[#00995D] mb-4">Foster Collaboration</h3>
            <p>Join a community of innovators and work together to bring ideas to life.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-[#00995D] mb-4">Earn Recognition</h3>
            <p>Get rewarded for your creativity and see your contributions make a real impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
