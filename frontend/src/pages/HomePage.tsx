import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Idea, PaginatedResponse } from '../types';

const IdeaCard = ({ idea }: { idea: Idea }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-2xl font-bold mb-2">{idea.title}</h2>
    <p className="text-gray-700 mb-4">{idea.description.substring(0, 150)}...</p>
    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>By: {idea.full_name}</span>
      <span>Category: {idea.idea_category}</span>
      <span>Likes: {idea.likes_count}</span>
    </div>
  </div>
);

const HomePage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<PaginatedResponse<Idea>>('/ideas/', {
          params: { status: 'approved', ordering: '-created_at' }
        });
        setIdeas(response.data.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch ideas. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Ideas Feed</h1>
      {isLoading && <p>Loading ideas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div>
          {ideas.length > 0 ? (
            ideas.map(idea => <IdeaCard key={idea.id} idea={idea} />)
          ) : (
            <p>No ideas found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
