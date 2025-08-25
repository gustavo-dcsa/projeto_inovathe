import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  loading?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  loading = false,
  children,
  ariaLabel,
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-green-700 focus:ring-accent transform hover:-translate-y-1 hover:scale-101 hover:shadow-lift-md',
    secondary: 'bg-highlight text-white hover:bg-orange-600 focus:ring-highlight transform hover:-translate-y-1 hover:scale-101 hover:shadow-lift-md',
    ghost: 'bg-transparent text-neutral hover:bg-gray-100 focus:ring-neutral',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const loadingClasses = loading ? 'cursor-not-allowed opacity-75' : '';
  const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';

  const spinner = (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loadingClasses} ${disabledClasses}`}
      disabled={loading || disabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      role="button"
    >
      {loading && spinner}
      <span>{children}</span>
    </button>
  );
};

export default Button;
