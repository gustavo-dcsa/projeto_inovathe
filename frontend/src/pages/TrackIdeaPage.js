import React, { useState } from 'react';
import ideaService from '../services/ideaService';

const TrackIdeaPage = () => {
  const [ideaId, setIdeaId] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setIdea(null);

    ideaService.getIdeaById(ideaId, email)
      .then(response => {
        // This is where the email validation should happen on the backend.
        // For now, we assume if the idea is found, it's the correct one.
        if (response.data.submitted_by_email === email) {
          setIdea(response.data);
        } else {
          setErrorMessage("O endereço de e-mail não corresponde ao usado para enviar a ideia.");
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setErrorMessage('Ideia não encontrada. Por favor, verifique o ID e o e-mail e tente novamente.');
        console.error('Error fetching idea:', error);
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#014D49]">Acompanhe sua Ideia</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label htmlFor="ideaId" className="block text-[#014D49] font-bold mb-2">ID da Ideia</label>
          <input
            type="text"
            id="ideaId"
            value={ideaId}
            onChange={(e) => setIdeaId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-[#014D49] font-bold mb-2">Seu E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#00995D] text-white font-bold py-3 px-8 rounded-full hover:bg-[#B1D14A] transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Acompanhar Ideia'}
          </button>
        </div>
      </form>

      {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}

      {idea && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{idea.title}</h2>
          <p className="mb-4">{idea.description}</p>
          <div className="mb-4">
            <p className="font-bold">Situação:</p>
            <p className="capitalize">{idea.status.replace(/_/g, ' ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackIdeaPage;
