import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'choice';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isSelected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isSelected = false,
  className = '',
  disabled,
  ...props
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    isSelected ? 'btn--selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      aria-pressed={isSelected ? true : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
