import React, { useState } from 'react';
import ideaService from '../services/ideaService';

const TrackIdeaPage = () => {
  const [email, setEmail] = useState('');
  const [ideaId, setIdeaId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await ideaService.getIdeaById(ideaId, email);
      setResult(res.data);
    } catch (err) {
      setError('Ideia não encontrada ou dados incorretos.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Acompanhar Ideia</h2>
      <form onSubmit={handleTrack} className="mb-4">
        <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required className="border px-3 py-2 mr-2" />
        <input type="text" placeholder="ID da ideia" value={ideaId} onChange={e => setIdeaId(e.target.value)} required className="border px-3 py-2 mr-2" />
        <button type="submit" className="bg-[#00995D] text-white px-4 py-2 rounded">Buscar</button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Título:</strong> {result.title}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Etapa:</strong> {result.stage}</p>
          <p><strong>Feedback:</strong> {result.feedback || 'Nenhum feedback ainda.'}</p>
        </div>
      )}
    </div>
  );
};

export default TrackIdeaPage;
