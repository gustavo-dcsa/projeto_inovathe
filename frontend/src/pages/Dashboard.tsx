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

  if (isLoading && page === 1) return <div className="p-8 text-center">Carregando ideias...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erro ao carregar ideias</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Motivational Banner */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-mindmarket-1 mb-2">
              Transforme suas ideias em inovação na Unimed Teresina
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              O cooperativismo nos fortalece e sua criatividade nos impulsiona. Juntos, podemos construir um futuro ainda melhor.
            </p>
            <div className="flex justify-center gap-6 mb-8">
               <div className="flex flex-col items-center">
                  <span className="text-2xl">🤝</span>
                  <span className="text-sm text-gray-500 mt-1">Cooperar para inovar</span>
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-2xl">🧩</span>
                  <span className="text-sm text-gray-500 mt-1">Sua peça é fundamental</span>
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-2xl">📈</span>
                  <span className="text-sm text-gray-500 mt-1">Crescimento contínuo</span>
               </div>
            </div>
            <Link
              to="/ideas/new"
              className="inline-block bg-mindmarket-1 text-white text-lg font-bold px-8 py-3 rounded-full hover:bg-blue-600 transition shadow-lg transform hover:scale-105"
            >
               Submeta sua ideia agora
            </Link>
        </div>
      </div>

      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-800">Feed de Ideias</h2>
               <div className="text-sm text-gray-500">Iniciativas recentes da nossa comunidade</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea: any) => (
                    <IdeaCard key={idea.id} idea={idea} />
                ))}
            </div>

            {ideas.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm">
                    Nenhuma ideia encontrada. Seja o primeiro a inovar!
                </div>
            )}

            {newIdeas && newIdeas.length === limit && (
               <div className="mt-12 text-center">
                 <button
                    onClick={() => setPage(p => p + 1)}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
                    disabled={isLoading}
                 >
                    {isLoading ? 'Carregando...' : 'Carregar Mais Ideias'}
                 </button>
               </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
