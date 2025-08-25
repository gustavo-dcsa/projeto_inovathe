import React, { useState } from 'react';
import api from '../lib/api';
import { Idea } from '../types';

const IdeaDetails = ({ idea }: { idea: Idea }) => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-2">{idea.title}</h2>
    <p className="text-gray-600 mb-4"><strong>Status:</strong> {idea.status}</p>
    <p className="text-gray-600 mb-4"><strong>Stage:</strong> {idea.stage}</p>
    <p className="text-gray-800">{idea.description}</p>
    {/* Display other idea details as needed */}
  </div>
);

const TrackIdeaPage = () => {
  const [ideaId, setIdeaId] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIdea(null);

    if (!ideaId || !email) {
      setError("Please provide both an Idea ID and an email.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<Idea>(`/ideas/${ideaId}/`, {
        params: { email }
      });
      setIdea(response.data);
    } catch (err) {
      setError('Idea not found or email does not match. Please check your details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Track Your Idea</h1>
      <form onSubmit={handleSearch} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="ideaId" className="block text-sm font-medium text-gray-700">Idea ID</label>
          <input
            type="text"
            id="ideaId"
            value={ideaId}
            onChange={(e) => setIdeaId(e.target.value)}
            placeholder="e.g., idea-xxxxxx"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
          {isLoading ? 'Searching...' : 'Track Idea'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {idea && <IdeaDetails idea={idea} />}
    </div>
  );
};

export default TrackIdeaPage;
