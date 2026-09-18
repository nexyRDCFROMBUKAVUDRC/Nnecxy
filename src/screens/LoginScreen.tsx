import React from 'react';
import { User } from '../types';
import { TikTokAuthView } from '../components/TikTokAuthView';

interface LoginScreenProps {
  onSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
  logoutNotice?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSuccess,
  onBack,
  logoutNotice,
}) => {
  return (
    <TikTokAuthView
      initialMode="login"
      logoutNotice={logoutNotice}
      onSuccess={onSuccess}
      onBack={onBack}
    />
  );
};
