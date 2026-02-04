/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Link } from 'react-router-dom';

interface Idea {
    id: string;
    title: string;
    description: string;
    votes_count: number;
    status: string;
    stage: string;
    horizon: string;
    author_id: string;
    created_at?: string;
}

const MyIdeas: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          try {
              api.get('/users/me').then(res => setUserId(res.data.id)).catch(() => {});
          } catch {
              // ignore
          }
      }
  }, []);

  const { data: user } = useQuery({
      queryKey: ['me'],
      queryFn: async () => {
          return (await api.get('/users/me')).data;
      },
      retry: false
  });

  const { data: ideas, isLoading } = useQuery<Idea[]>({
    queryKey: ['my-ideas', filterStatus, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      let url = `/ideas?owner_id=${user.id}&limit=100`;
      if (filterStatus) {
          url += `&status=${filterStatus}`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user?.id
  });

  // Use userId to silence unused var warning if needed, or remove it.
  if (userId) { /* no-op */ }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Minhas Ideias</h1>
            <Link to="/dashboard" className="text-mindmarket-1 hover:underline">Voltar ao Dashboard</Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <label className="mr-2 font-medium">Filtrar por Status:</label>
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded p-2"
            >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Reprovada">Reprovada</option>
            </select>
        </div>

        {isLoading ? (
            <div>Carregando...</div>
        ) : (
            <div className="space-y-4">
                {ideas?.map(idea => (
                    <div key={idea.id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{idea.title}</h3>
                            <div className="text-sm text-gray-500">Submetido em: {new Date(idea.created_at || '').toLocaleDateString()}</div>
                            <div className="mt-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800`}>
                                    {idea.status}
                                </span>
                                <span className="ml-2 text-xs text-gray-600">Etapa: {idea.stage}</span>
                            </div>
                        </div>
                        {/* Link to detail page if implemented, for now placeholder */}
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Ver Detalhes</span>
                    </div>
                ))}
                {ideas?.length === 0 && <div>Nenhuma ideia encontrada.</div>}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyIdeas;
