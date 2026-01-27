import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const NewIdea: React.FC = () => {
  const navigate = useNavigate();

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Team
  const [submissionType, setSubmissionType] = useState<'individual' | 'team'>('individual');
  const [teamMembers, setTeamMembers] = useState('');

  // Details
  const [category, setCategory] = useState('Processos Internos');
  const [expectedBenefits, setExpectedBenefits] = useState('');
  const [resourcesNeeded, setResourcesNeeded] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('Médio');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [references, setReferences] = useState('');

  // Optional / Admin
  const [campaignId, setCampaignId] = useState('');
  const [horizon, setHorizon] = useState('');

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
      is_team_submission: submissionType === 'team',
      team_members: teamMembers,
      category,
      expected_benefits: expectedBenefits,
      resources_needed: resourcesNeeded,
      expected_impact: expectedImpact,
      estimated_time: estimatedTime,
      references,
      campaign_id: campaignId || null,
      horizon: horizon || null,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-mindmarket-1">Submissão de Ideias</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">

        {/* Identificação / Equipe */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Identificação</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Como deseja submeter?</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-mindmarket-1"
                  name="submissionType"
                  value="individual"
                  checked={submissionType === 'individual'}
                  onChange={() => setSubmissionType('individual')}
                />
                <span className="ml-2">Apenas eu</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-mindmarket-1"
                  name="submissionType"
                  value="team"
                  checked={submissionType === 'team'}
                  onChange={() => setSubmissionType('team')}
                />
                <span className="ml-2">Com uma equipe</span>
              </label>
            </div>
          </div>

          {submissionType === 'team' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome dos colaboradores (opcional)</label>
              <input
                type="text"
                value={teamMembers}
                onChange={e => setTeamMembers(e.target.value)}
                placeholder="Ex: João Silva, Maria Souza..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          )}
        </div>

        {/* Detalhes da Ideia */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
           <h2 className="text-lg font-semibold mb-4 text-gray-800">2. Descrição Detalhada</h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Título da Ideia *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Categoria *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option>Processos Internos</option>
                  <option>Atendimento ao Cliente</option>
                  <option>Tecnologia</option>
                  <option>Sustentabilidade</option>
                  <option>Outros</option>
                </select>
             </div>
           </div>

           <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Descrição Detalhada *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
           </div>

           <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Benefícios Esperados *</label>
              <textarea
                value={expectedBenefits}
                onChange={e => setExpectedBenefits(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
           </div>

           <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Recursos Necessários</label>
              <textarea
                value={resourcesNeeded}
                onChange={e => setResourcesNeeded(e.target.value)}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Impacto Esperado *</label>
                <select
                  value={expectedImpact}
                  onChange={e => setExpectedImpact(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option>Alto</option>
                  <option>Médio</option>
                  <option>Baixo</option>
                </select>
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Campanha (Opcional)</label>
                  <select
                    value={campaignId}
                    onChange={e => setCampaignId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Selecione...</option>
                    {campaigns?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
               </div>
           </div>
        </div>

        {/* Info Adicional */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
           <h2 className="text-lg font-semibold mb-4 text-gray-800">3. Informações Adicionais</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Prazo Estimado</label>
                <input
                  type="text"
                  value={estimatedTime}
                  onChange={e => setEstimatedTime(e.target.value)}
                  placeholder="Ex: 3 meses"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Horizonte (Opcional)</label>
                <select
                  value={horizon}
                  onChange={e => setHorizon(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Selecione...</option>
                  <option value="H1">H1 - Melhoria Contínua</option>
                  <option value="H2">H2 - Adjacente</option>
                  <option value="H3">H3 - Disruptiva</option>
                </select>
             </div>
           </div>
           <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Inspiração / Referências</label>
              <textarea
                value={references}
                onChange={e => setReferences(e.target.value)}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
           </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-mindmarket-1 hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {mutation.isPending ? 'Enviando...' : 'Enviar Ideia'}
        </button>
      </form>
    </div>
  );
};

export default NewIdea;
