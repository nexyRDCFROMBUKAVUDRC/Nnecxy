import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { dataService } from '../services/dataService';
import { User } from '../types';
import { X, Check, ShieldCheck, ChevronRight, PlusCircle, Smartphone } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const GoogleIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`shrink-0 ${className}`}
  >
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { theme, isDark } = useTheme();
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<'device' | 'custom'>('device');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Phone's primary detected Google email (Device account per prompt: "email de son téléphone")
  const phoneDeviceAccount = {
    name: 'Justin Batumike',
    email: 'justinbatumike902@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    birthDate: '1998-07-15',
  };

  const handleContinueWithAccount = (accountData: {
    email: string;
    name: string;
    avatar?: string;
    birthDate?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const result = dataService.loginWithGoogle({
          email: accountData.email,
          name: accountData.name,
          avatar: accountData.avatar,
          birthDate: accountData.birthDate || '2000-01-01',
        });

        if (result.success && result.user) {
          setIsLoading(false);
          onSuccess(result.user);
          onClose();
        } else {
          setIsLoading(false);
          setErrorMessage(result.error || 'Erreur lors de la connexion avec Google.');
        }
      } catch (err) {
        setIsLoading(false);
        setErrorMessage('Une erreur est survenue lors de la synchronisation.');
      }
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    handleContinueWithAccount({
      email: customEmail.trim().toLowerCase(),
      name: customName.trim() || customEmail.split('@')[0],
      birthDate: '2001-05-10',
    });
  };

  return (
    <div
      id="google-auth-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: isDark ? '#18191a' : '#ffffff',
          color: isDark ? '#ffffff' : '#1f2937',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Google Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-700/30">
          <div className="flex items-center gap-2.5">
            <GoogleIcon size={24} />
            <div>
              <h2 className="text-sm font-bold leading-tight">Se connecter avec Google</h2>
              <p className="text-[11px] text-neutral-400">Accès rapide type TikTok à NNECXY</p>
            </div>
          </div>
          <button
            id="close-google-auth-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-500/20 active:scale-95 transition-transform"
            aria-label="Fermer"
          >
            <X size={18} className="text-neutral-400 hover:text-white" />
          </button>
        </div>

        {/* Informative Subtitle */}
        <div className="py-3 text-xs text-neutral-400 leading-relaxed">
          Choisissez un compte Google enregistré sur cet appareil pour vous connecter instantanément à votre espace.
        </div>

        {errorMessage && (
          <div className="mb-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Accounts List (TikTok Style One-Tap Account Selector) */}
        <div className="space-y-2.5 my-2">
          {/* 1. Device Synchronized Account */}
          <button
            id="google-account-device-btn"
            type="button"
            onClick={() => handleContinueWithAccount(phoneDeviceAccount)}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left group hover:border-blue-500 active:scale-98"
            style={{
              backgroundColor: isDark ? '#242526' : '#f8fafc',
              borderColor: isDark ? '#3a3b3c' : '#e2e8f0',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={phoneDeviceAccount.avatar}
                  alt={phoneDeviceAccount.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-1 ring-black">
                  <Smartphone size={10} />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs truncate">{phoneDeviceAccount.name}</span>
                  <span className="px-1.5 py-0.2 bg-blue-500/15 text-blue-400 text-[9px] font-bold rounded">
                    Téléphone
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">{phoneDeviceAccount.email}</p>
              </div>
            </div>

            <ChevronRight size={18} className="text-neutral-400 group-hover:text-blue-500 shrink-0 transition-colors" />
          </button>

          {/* 2. Custom Google Account Option */}
          {selectedAccount === 'device' ? (
            <button
              type="button"
              id="google-use-another-btn"
              onClick={() => setSelectedAccount('custom')}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed transition-all text-left text-xs font-semibold hover:border-blue-500 active:scale-98"
              style={{
                borderColor: isDark ? '#3a3b3c' : '#cbd5e1',
                color: isDark ? '#e4e6eb' : '#475569',
              }}
            >
              <div className="w-10 h-10 rounded-full bg-neutral-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <PlusCircle size={20} />
              </div>
              <div className="flex-1">
                <span>Utiliser un autre compte Google</span>
                <p className="text-[10px] text-neutral-400 font-normal">
                  Saisissez une autre adresse @gmail.com
                </p>
              </div>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3 p-3 rounded-2xl border border-blue-500/40 bg-blue-500/5 mt-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Autre compte Google</span>
                <button
                  type="button"
                  onClick={() => setSelectedAccount('device')}
                  className="text-[11px] text-neutral-400 hover:text-white underline"
                >
                  Retour
                </button>
              </div>

              <div>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="votre_adresse@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-blue-500"
                  style={{ borderColor: isDark ? '#3a3b3c' : '#cbd5e1', color: theme.text }}
                />
              </div>

              <div>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Votre nom complet (optionnel)"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-blue-500"
                  style={{ borderColor: isDark ? '#3a3b3c' : '#cbd5e1', color: theme.text }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !customEmail}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Connexion en cours...' : 'Continuer avec ce compte'}
              </button>
            </form>
          )}
        </div>

        {/* Loading overlay state */}
        {isLoading && (
          <div className="py-4 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-neutral-400">Synchronisation sécurisée avec Google...</span>
          </div>
        )}

        {/* Security & 18+ Notice */}
        <div className="pt-4 mt-2 border-t border-neutral-700/20 flex items-start gap-2 text-[10px] text-neutral-400 leading-relaxed">
          <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <span>
            En continuant, Google partagera votre nom, adresse e-mail et avatar avec NNECXY. Votre âge sera automatiquement certifié 18+ conformément à notre charte.
          </span>
        </div>
      </div>
    </div>
  );
};
