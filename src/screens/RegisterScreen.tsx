import React from 'react';
import { User } from '../types';
import { TikTokAuthView } from '../components/TikTokAuthView';

interface RegisterScreenProps {
  onSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  onOpenRules: () => void;
  onBack: () => void;
  logoutNotice?: string | null;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onSuccess,
  onOpenRules,
  onBack,
  logoutNotice,
}) => {
  return (
    <TikTokAuthView
      initialMode="signup"
      logoutNotice={logoutNotice}
      onSuccess={onSuccess}
      onBack={onBack}
      onOpenRules={onOpenRules}
    />
  );
};
