import React, { useState } from 'react';
import ideaService from '../services/ideaService';

const SubmitIdeaPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submittedByEmail, setSubmittedByEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const ideaData = {
      title,
      description,
      submitted_by_email: submittedByEmail,
    };

    ideaService.submitIdea(ideaData)
      .then(response => {
        setIsSubmitting(false);
        setSubmitMessage(`Ideia enviada com sucesso! O ID da sua ideia é ${response.data.id}`);
        setTitle('');
        setDescription('');
        setSubmittedByEmail('');
      })
      .catch(error => {
        setIsSubmitting(false);
        setSubmitMessage('Ocorreu um erro ao enviar sua ideia. Por favor, tente novamente.');
        console.error('Error submitting idea:', error);
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#014D49]">Envie sua Ideia</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-[#014D49] font-bold mb-2">Título da Ideia</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-[#014D49] font-bold mb-2">Seu E-mail</label>
          <input
            type="email"
            id="email"
            value={submittedByEmail}
            onChange={(e) => setSubmittedByEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-[#014D49] font-bold mb-2">Descreva sua Ideia</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows="6"
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#00995D] text-white font-bold py-3 px-8 rounded-full hover:bg-[#B1D14A] transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Ideia'}
          </button>
        </div>
        {submitMessage && <p className="text-center mt-4">{submitMessage}</p>}
      </form>
    </div>
  );
};

export default SubmitIdeaPage;
