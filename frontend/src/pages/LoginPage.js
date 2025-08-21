import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    authService.login(email, password)
      .then(response => {
        setIsLoading(false);
        // Storing the token in local storage for now.
        // A context-based solution would be better for a real app.
        localStorage.setItem('token', response.data.key);
        navigate(response.data.user.role === 'admin' ? '/admin' : '/users/me'); // Redirect based on user role
      })
      .catch(error => {
        setIsLoading(false);
        setErrorMessage('Falha ao fazer login. Por favor, verifique suas credenciais.');
        console.error('Login error:', error);
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#014D49]">Entrar</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-[#014D49] font-bold mb-2">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
