import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { Home, Search, Plus, MessageSquare, User as UserIcon } from 'lucide-react';
import { User } from '../types';

export type TabType = 'feed' | 'search' | 'create' | 'inbox' | 'profile';

interface BottomNavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User | null;
  unreadCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  unreadCount = 0,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <nav
      id="bottom-navigation-bar"
      className="relative z-30 flex items-center justify-around h-14 border-t select-none max-w-md mx-auto w-full transition-colors"
      style={{
        backgroundColor: theme.navBackground,
        borderColor: theme.border,
      }}
    >
      {/* 1. Accueil / Feed */}
      <button
        id="tab-btn-feed"
        onClick={() => onSelectTab('feed')}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
          currentTab === 'feed' ? 'text-blue-500' : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label={t.home}
      >
        <Home size={22} className={currentTab === 'feed' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] font-semibold mt-0.5">{t.home}</span>
      </button>

      {/* 2. Recherche */}
      <button
        id="tab-btn-search"
        onClick={() => onSelectTab('search')}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
          currentTab === 'search' ? 'text-blue-500' : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label={t.search}
      >
        <Search size={22} className={currentTab === 'search' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] font-semibold mt-0.5">{t.search}</span>
      </button>

      {/* 3. Créer (+) Center Button */}
      <div className="flex-1 flex items-center justify-center h-full">
        <button
          id="tab-btn-create"
          onClick={() => onSelectTab('create')}
          className="w-11 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md active:scale-90 transition-transform"
          aria-label={t.create}
        >
          <Plus size={22} className="stroke-[3]" />
        </button>
      </div>

      {/* 4. Boîte de réception (Inbox / Messages) */}
      <button
        id="tab-btn-inbox"
        onClick={() => onSelectTab('inbox')}
        className={`relative flex-1 flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
          currentTab === 'inbox' ? 'text-blue-500' : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label={t.messages}
      >
        <MessageSquare size={22} className={currentTab === 'inbox' ? 'stroke-[2.5]' : 'stroke-2'} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-red-500 ring-2 ring-black" />
        )}
        <span className="text-[10px] font-semibold mt-0.5">{t.messages}</span>
      </button>

      {/* 5. Profil */}
      <button
        id="tab-btn-profile"
        onClick={() => onSelectTab('profile')}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
          currentTab === 'profile' ? 'text-blue-500' : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label={t.profile}
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className={`w-6 h-6 rounded-full object-cover border ${
              currentTab === 'profile' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-neutral-600'
            }`}
          />
        ) : (
          <UserIcon size={22} className={currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'} />
        )}
        <span className="text-[10px] font-semibold mt-0.5">{t.profile}</span>
      </button>
    </nav>
  );
};
