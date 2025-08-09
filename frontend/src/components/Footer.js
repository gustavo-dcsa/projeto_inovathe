import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#014D49] text-white p-4 text-center">
      <p>&copy; {new Date().getFullYear()} Idea Bank. All Rights Reserved.</p>
      <p className="text-sm">Fostering Innovation Together</p>
    </footer>
  );
};

export default Footer;
