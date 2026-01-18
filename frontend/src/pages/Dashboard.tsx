import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import IdeaCard from '@/components/IdeaCard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const [ideas, setIdeas] = useState<any[]>([]);
  const limit = 9;

  const { data: newIdeas, isLoading, error } = useQuery({
    queryKey: ['ideas', page],
    queryFn: async () => {
      const skip = (page - 1) * limit;
      const response = await api.get(`/ideas?skip=${skip}&limit=${limit}`);
      return response.data;
    }
  });

  useEffect(() => {
    if (newIdeas) {
      if (page === 1) {
        setIdeas(newIdeas);
      } else {
        setIdeas(prev => [...prev, ...newIdeas]);
      }
    }
  }, [newIdeas, page]);

  if (isLoading && page === 1) return <div className="p-8 text-center">Loading ideas...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading ideas</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Innovation Dashboard</h1>
          <div className="space-x-4">
             <Link to="/ideas/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                + New Idea
             </Link>
             <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="text-gray-600 hover:text-gray-900">
                Logout
             </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea: any) => (
                    <IdeaCard key={idea.id} idea={idea} />
                ))}
            </div>
            {ideas.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-12">
                    No ideas found. Be the first to innovate!
                </div>
            )}

            {newIdeas && newIdeas.length === limit && (
               <div className="mt-8 text-center">
                 <button
                    onClick={() => setPage(p => p + 1)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    disabled={isLoading}
                 >
                    {isLoading ? 'Loading...' : 'Load More'}
                 </button>
               </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
