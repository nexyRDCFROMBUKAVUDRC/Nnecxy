import React, { useState, useEffect } from 'react';
import { User, NotificationItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { dataService } from '../services/dataService';
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';

interface NotificationsScreenProps {
  currentUser: User | null;
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  currentUser,
  onBack,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (currentUser) {
      setNotifications(dataService.getNotifications(currentUser.id));
    }
  }, [currentUser]);

  const handleMarkRead = (notifId: string) => {
    dataService.markNotificationAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={14} className="fill-red-500 text-red-500" />;
      case 'comment':
        return <MessageCircle size={14} className="text-cyan-400" />;
      case 'follow':
        return <UserPlus size={14} className="text-blue-500" />;
      default:
        return <Bell size={14} className="text-amber-400" />;
    }
  };

  return (
    <div
      id="notifications-screen"
      className="flex flex-col h-full w-full max-w-md mx-auto select-none overflow-hidden"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20"
        style={{ borderColor: theme.border, backgroundColor: theme.background }}
      >
        <button onClick={onBack} className="p-1 rounded-full hover:opacity-80">
          <ArrowLeft size={18} style={{ color: theme.text }} />
        </button>
        <h2 className="text-base font-bold">{t.notifications}</h2>
        <div className="w-8" />
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
        {notifications.length === 0 ? (
          <div className="py-20 text-center text-xs text-neutral-400">
            <Bell size={32} className="mx-auto text-neutral-500 opacity-50 mb-2" />
            <p className="font-semibold">Aucune notification pour le moment.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                notif.read ? 'opacity-70' : 'border-blue-500/40 bg-blue-500/5'
              }`}
              style={{
                backgroundColor: notif.read ? theme.card : undefined,
                borderColor: notif.read ? theme.border : undefined,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={notif.actor.avatar}
                    alt={notif.actor.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black/80 border border-neutral-700">
                    {getIcon(notif.type)}
                  </div>
                </div>

                <div className="min-w-0 text-xs">
                  <p className="leading-snug">
                    <span className="font-bold">{notif.actor.name}</span>{' '}
                    <span className="text-neutral-300">{notif.message}</span>
                  </p>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
