import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { GoogleIcon } from './GoogleAuthModal';

interface GoogleSignInButtonProps {
  onClick: () => void;
  text?: string;
  variant?: 'primary' | 'outline';
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  text = 'Continuer avec Google',
  variant = 'primary',
  className = '',
  id = 'google-signin-btn',
  disabled = false,
}) => {
  const { isDark } = useTheme();

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full py-3.5 px-5 rounded-full font-bold text-xs flex items-center justify-center gap-3 transition-all duration-150 active:scale-98 shadow-sm ${
        isDark
          ? 'bg-white hover:bg-neutral-100 text-neutral-900 active:bg-neutral-200'
          : 'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 active:bg-neutral-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <GoogleIcon size={18} />
      <span className="tracking-tight">{text}</span>
    </button>
  );
};
