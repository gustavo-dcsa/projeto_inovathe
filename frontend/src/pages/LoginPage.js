import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await login(identifier, password); // Envie o valor digitado
      navigate('/');
    } catch (error) {
      setErrorMessage('Falha ao fazer login. Por favor, verifique suas credenciais.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#014D49]">Entrar</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="identifier" className="block text-[#014D49] font-bold mb-2">E-mail ou Usuário</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-[#014D49] font-bold mb-2">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
        {errorMessage && <p className="text-center mt-4 text-red-500">{errorMessage}</p>}
        <p className="text-center mt-4">
          Não tem uma conta? <Link to="/signup" className="text-[#00995D] hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
