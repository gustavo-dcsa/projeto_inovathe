import React from 'react';

type InputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const hasError = Boolean(error);
  const isActivated = Boolean(value);

  // Base classes for the label
  const labelBaseClasses = 'absolute text-base text-neutral duration-300 transform -translate-y-1/2 top-1/2 left-3 origin-[0] pointer-events-none transition-all';

  // Classes for when the label is in its "floating" (activated) state
  const labelActivatedClasses = 'scale-75 -translate-y-5 top-0 bg-bg-light px-2';

  // Classes for when the input is focused (via peer)
  const peerFocusClasses = 'peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:top-0 peer-focus:bg-bg-light peer-focus:px-2';

  // Dynamically build the className string
  const labelClassName = `
    ${labelBaseClasses}
    ${isActivated ? labelActivatedClasses : `${peerFocusClasses}`}
    ${isActivated && hasError ? 'text-red-500' : ''}
    ${isActivated && !hasError ? 'text-accent' : ''}
    ${!isActivated && hasError ? 'text-red-500' : ''}
    ${!isActivated ? (hasError ? 'peer-focus:text-red-500' : 'peer-focus:text-accent') : ''}
  `;

  return (
    <div className="relative mt-4">
      <input
        id={name}
        name={name}
        type={type}
        placeholder=" " // A space placeholder is crucial for the peer-focus selector to work correctly.
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`
          peer
          w-full
          px-3
          py-2.5
          text-deep-teal
          bg-transparent
          border
          rounded-md
          focus:outline-none
          focus:ring-0
          ${hasError
            ? 'border-red-500 focus:border-red-500'
            : 'border-neutral/60 focus:border-accent focus:ring-1 focus:ring-accent'
          }
          ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}
        `}
      />
      <label
        htmlFor={name}
        className={labelClassName}
      >
        {label}
      </label>
      {hasError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
