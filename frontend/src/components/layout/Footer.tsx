import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#014D49] text-white p-4 text-center">
      <p>&copy; {new Date().getFullYear()} Banco de Ideias. Todos os Direitos Reservados.</p>
      <p className="text-sm">Fomentando a Inovação Juntos</p>
    </footer>
  );
};

export default Footer;
