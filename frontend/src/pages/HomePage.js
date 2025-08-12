import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ideaService from '../services/ideaService';

const HomePage = () => {
  const [featuredIdeas, setFeaturedIdeas] = useState([]);

  useEffect(() => {
    ideaService.getFeaturedIdeas()
      .then(response => {
        setFeaturedIdeas(response.data);
      })
      .catch(error => {
        console.error('Error fetching featured ideas:', error);
      });
  }, []);

  return (
    <div className="bg-[#CFE4BD] text-[#014D49]">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Desperte seu Inovador Interior</h1>
        <p className="text-xl mb-8">
          Tem uma ideia brilhante? Queremos ouvi-la. Vamos construir o futuro, juntos.
        </p>
        <Link
          to="/submit-idea"
          className="bg-[#00995D] text-white font-bold py-3 px-8 rounded-full hover:bg-[#B1D14A] transition duration-300"
        >
          Envie sua Ideia
        </Link>
      </div>

      {/* Motivational Cards Section */}
      <div className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Por que compartilhar suas ideias?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#00995D] mb-4">Impulsione a Mudança</h3>
            <p>Suas ideias têm o poder de transformar nosso negócio e nossa indústria.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#00995D] mb-4">Promova a Colaboração</h3>
            <p>Junte-se a uma comunidade de inovadores e trabalhe em conjunto para dar vida às ideias.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-[#00995D] mb-4">Ganhe Reconhecimento</h3>
            <p>Seja recompensado por sua criatividade e veja suas contribuições causarem um impacto real.</p>
          </div>
        </div>
      </div>

      {/* Featured Ideas Section */}
      <div className="py-20 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Ideias em Destaque</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredIdeas.length > 0 ? (
            featuredIdeas.map(idea => (
              <div key={idea.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
                <p className="text-sm mb-4">{idea.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Enviada por: {idea.submitted_by_email}</span>
                  <button className="bg-[#F57921] text-white text-sm py-1 px-3 rounded-full hover:bg-opacity-80">
                    Curtir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3">Nenhuma ideia em destaque ainda. Seja o primeiro a enviar!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
