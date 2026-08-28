import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', children, className = '', ...props }) => {
  const variantClass = variant === 'primary' ? 'atlas-button-primary' : '';
  return (
    <button className={`atlas-button ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
