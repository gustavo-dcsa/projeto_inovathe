import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setErrorMessage("As senhas não correspondem.");
      return;
    }
    setIsLoading(true);
    setErrorMessage('');

    authService.signup(username, email, password, password2)
      .then(response => {
        setIsLoading(false);
        // After successful signup, dj-rest-auth sends back a key
        // so we can log the user in directly.
        localStorage.setItem('token', response.data.key);
        navigate('/'); // Redirect to home page
      })
      .catch(error => {
        setIsLoading(false);
        // This needs more granular error handling based on the API response
        setErrorMessage('Falha ao se cadastrar. Por favor, tente novamente.');
        console.error('Signup error:', error);
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#014D49]">Cadastre-se</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-[#014D49] font-bold mb-2">Nome de usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="password2" className="block text-[#014D49] font-bold mb-2">Confirme a Senha</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
            {isLoading ? 'Cadastrando...' : 'Cadastre-se'}
          </button>
        </div>
        {errorMessage && <p className="text-center mt-4 text-red-500">{errorMessage}</p>}
        <p className="text-center mt-4">
          Já tem uma conta? <Link to="/login" className="text-[#00995D] hover:underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
