import React, { useState, useEffect } from 'react';
import adminIdeaService from '../services/adminIdeaService';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    adminIdeaService.getAllIdeas()
      .then(response => {
        setIdeas(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch ideas.');
        setIsLoading(false);
        console.error('Error fetching ideas:', error);
      });
  }, []);

  if (!user || user.role !== 'admin') {
    return <div>Acesso restrito. Faça login como administrador.</div>;
  }

  // Handlers for admin actions will go here

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#014D49]">Admin Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">All Ideas</h2>
        {isLoading && <p>Loading ideas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Submitted By</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map(idea => (
              <tr key={idea.id} className="border-b">
                <td className="p-2">{idea.title}</td>
                <td className="p-2">{idea.status}</td>
                <td className="p-2">{idea.submitted_by_email}</td>
                <td className="p-2">
                  {/* Buttons for admin actions will go here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
