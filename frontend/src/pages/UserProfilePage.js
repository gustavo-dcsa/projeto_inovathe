import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ideaService from '../services/ideaService';

const UserProfilePage = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    if (user) {
      ideaService.getIdeasByUser(user.email).then(res => setIdeas(res.data));
    }
  }, [user]);

  if (!user) return <div>Faça login para ver seu perfil.</div>;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Perfil de {user.username}</h2>
      <img src={user.profile_photo || '/images/default.png'} alt="Foto de perfil" className="w-24 h-24 rounded-full mb-4" />
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Departamento:</strong> {user.department}</p>
      <p><strong>Cargo:</strong> {user.position}</p>
      <h3 className="mt-8 text-xl font-bold">Minhas Ideias</h3>
      <ul>
        {ideas.map(idea => (
          <li key={idea.id}>{idea.title} - Status: {idea.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfilePage;