import React from 'react';
import { User } from '../types';
import { TikTokAuthView } from '../components/TikTokAuthView';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onOpenRules: () => void;
  onAuthSuccess?: (user: User) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLogin,
  onOpenRules,
  onAuthSuccess,
}) => {
  return (
    <TikTokAuthView
      initialMode="login"
      onSuccess={(user) => {
        if (onAuthSuccess) onAuthSuccess(user);
        else onLogin();
      }}
      onOpenRules={onOpenRules}
    />
  );
};
