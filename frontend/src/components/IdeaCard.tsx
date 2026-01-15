import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

interface Idea {
  id: string;
  title: string;
  description: string;
  votes_count: number;
  status: string;
  horizon: string;
  author_id: string;
}

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (val: number) => {
      await api.post(`/ideas/${idea.id}/vote`, { value: val });
    },
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] });
      const previousIdeas = queryClient.getQueryData(['ideas']);

      queryClient.setQueryData(['ideas'], (old: Idea[] | undefined) => {
        if (!old) return [];
        return old.map((i) =>
          i.id === idea.id ? { ...i, votes_count: i.votes_count + newValue } : i
        );
      });

      return { previousIdeas };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['ideas'], context?.previousIdeas);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800">{idea.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${idea.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {idea.status}
        </span>
      </div>
      <p className="text-gray-600 mt-2 line-clamp-3">{idea.description}</p>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-blue-600 font-medium">{idea.horizon}</span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => voteMutation.mutate(1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-green-600"
          >
            ▲
          </button>
          <span className="font-bold">{idea.votes_count}</span>
          <button
            onClick={() => voteMutation.mutate(-1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
