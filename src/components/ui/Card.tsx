import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
};

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, onClick }) => {
  const baseClasses = 'bg-white rounded-lg shadow-lift-sm p-6';
  const hoverClasses = hoverEffect ? 'transition-all duration-200 ease-in-out hover:shadow-lift-md hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
