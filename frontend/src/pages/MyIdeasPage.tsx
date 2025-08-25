import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Idea, PaginatedResponse } from '../types';

// Re-using the IdeaCard from HomePage, maybe move it to a shared components folder later
const IdeaCard = ({ idea }: { idea: Idea }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-2xl font-bold mb-2">{idea.title}</h2>
    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>Status: <span className="font-semibold">{idea.status}</span></span>
      <span>Stage: <span className="font-semibold">{idea.stage}</span></span>
    </div>
  </div>
);

const fetchMyIdeas = async (): Promise<PaginatedResponse<Idea>> => {
    const { data } = await api.get('/my-ideas/');
    return data;
};

const MyIdeasPage = () => {
  const { data, isLoading, error } = useQuery<PaginatedResponse<Idea>>({
    queryKey: ['myIdeas'],
    queryFn: fetchMyIdeas,
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">My Submitted Ideas</h1>
      {isLoading && <p>Loading your ideas...</p>}
      {error && <p className="text-red-500">Failed to fetch your ideas.</p>}
      {data && (
        <div>
          {data.results.length > 0 ? (
            data.results.map(idea => <IdeaCard key={idea.id} idea={idea} />)
          ) : (
            <p>You have not submitted any ideas yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyIdeasPage;
