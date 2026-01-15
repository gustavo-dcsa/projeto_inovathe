import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import IdeaCard from '@/components/IdeaCard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { data: ideas, isLoading, error } = useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const response = await api.get('/ideas');
      return response.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading ideas...</div>;
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
                {ideas?.map((idea: any) => (
                    <IdeaCard key={idea.id} idea={idea} />
                ))}
            </div>
            {ideas?.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    No ideas found. Be the first to innovate!
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
