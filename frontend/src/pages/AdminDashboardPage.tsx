import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Idea, PaginatedResponse } from '../types';
import ChangeStatusModal from '../components/admin/ChangeStatusModal';

const fetchAllIdeas = async (): Promise<PaginatedResponse<Idea>> => {
  const { data } = await api.get('/ideas/'); // No filters, get all ideas
  return data;
};

const AdminDashboardPage = () => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const { data, isLoading, error } = useQuery<PaginatedResponse<Idea>>({
    queryKey: ['allIdeas'],
    queryFn: fetchAllIdeas,
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard: All Ideas</h1>
      {isLoading && <p>Loading ideas...</p>}
      {error && <p className="text-red-500">Failed to fetch ideas.</p>}
      {data && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.results.map((idea) => (
                <tr key={idea.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idea.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.stage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedIdea(idea)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedIdea && (
        <ChangeStatusModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
