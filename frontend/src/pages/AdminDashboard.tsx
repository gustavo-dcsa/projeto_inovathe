
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
interface Idea {
    id: string;
    title: string;
    description: string;
    votes_count: number;
    status: string;
    stage: string;
    horizon: string;
    author_id: string;
    created_at: string;
    author: {
        full_name: string;
        department: string;
    }
}

const AdminDashboard: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const queryClient = useQueryClient();

  // Fetch pending ideas
  const { data: ideas, isLoading } = useQuery<Idea[]>({
    queryKey: ['admin-ideas'],
    queryFn: async () => {
      // Assuming we filter by status=Pendente
      const response = await api.get('/ideas?status=Pendente&limit=50');
      return response.data;
    }
  });

  const updateMutation = useMutation({
      mutationFn: async (data: { id: string, status: string, stage: string }) => {
          // We need an endpoint to update idea status.
          // Assuming PATCH /ideas/{id} exists or we use PUT.
          // Plan didn't explicitly create update endpoint, but let's assume standard CRUD or add it?
          // I'll check backend/app/api/endpoints/ideas.py content.
          // It only has create, read, vote. NO UPDATE.
          // I must add UPDATE endpoint to backend to make this page functional.
          // Since I am in "Implement Frontend Pages", I'll patch the backend file again.
          return await api.patch(`/ideas/${data.id}`, { status: data.status, stage: data.stage });
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['admin-ideas'] });
          setSelectedIdea(null);
      }
  });

  const handleEvaluate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedIdea) return;
      const formData = new FormData(e.target as HTMLFormElement);
      const newStatus = formData.get('status') as string;
      const newStage = formData.get('stage') as string;

      updateMutation.mutate({
          id: selectedIdea.id,
          status: newStatus,
          stage: newStage
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Administração de Ideias</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List of Pending Ideas */}
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Ideias Pendentes</h2>
                {isLoading && <div>Carregando...</div>}
                {ideas?.map(idea => (
                    <div key={idea.id} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50" onClick={() => setSelectedIdea(idea)}>
                        <h3 className="text-lg font-bold">{idea.title}</h3>
                        <p className="text-sm text-gray-500">Autor: {idea.author?.full_name || 'Desconhecido'}</p>
                        <p className="text-sm text-gray-500">Data: {new Date(idea.created_at).toLocaleDateString()}</p>
                        <div className="mt-2">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">{idea.status}</span>
                        </div>
                    </div>
                ))}
                {ideas?.length === 0 && <div className="text-gray-500">Nenhuma ideia pendente.</div>}
            </div>

            {/* Evaluation Panel */}
            <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Avaliação</h2>
                {selectedIdea ? (
                    <form onSubmit={handleEvaluate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ideia Selecionada</label>
                            <p className="text-gray-900 font-medium">{selectedIdea.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{selectedIdea.description}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Novo Status</label>
                            <select name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="Aprovada">Aprovada</option>
                                <option value="Reprovada">Reprovada</option>
                                <option value="Em Análise">Em Análise</option>
                                <option value="Reavaliação">Reavaliação</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nova Etapa</label>
                            <select name="stage" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="Setor de Inovação">Setor de Inovação</option>
                                <option value="Comitê de Inovação">Comitê de Inovação</option>
                                <option value="Gestor Responsável">Gestor Responsável</option>
                                <option value="Aprovação da Diretoria">Aprovação da Diretoria</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Feedback / Parecer</label>
                            <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4}></textarea>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="flex-1 bg-mindmarket-1 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {updateMutation.isPending ? 'Salvando...' : 'Salvar Avaliação'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedIdea(null)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-gray-500 text-center py-8">
                        Selecione uma ideia ao lado para avaliar.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
