import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const NewIdea: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [horizon, setHorizon] = useState('H1');
  const [campaignId, setCampaignId] = useState('');

  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await api.get('/campaigns');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newIdea: any) => {
      return await api.post('/ideas', newIdea);
    },
    onSuccess: () => {
      navigate('/dashboard');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      description,
      horizon,
      campaign_id: campaignId
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Submit New Idea</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign</label>
          <select
            value={campaignId}
            onChange={e => setCampaignId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select a Campaign</option>
            {campaigns?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Innovation Horizon</label>
          <select
            value={horizon}
            onChange={e => setHorizon(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="H1">H1 - Optimization</option>
            <option value="H2">H2 - Adjacent</option>
            <option value="H3">H3 - Disruptive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  );
};

export default NewIdea;
