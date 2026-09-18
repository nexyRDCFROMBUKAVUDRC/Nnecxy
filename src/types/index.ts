export interface User {
  id: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  birthDate: string; // YYYY-MM-DD
  avatar: string;
  handle: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  isVerified: boolean;
  createdAt: string;
  authProvider?: 'email' | 'google' | 'phone' | 'facebook' | 'apple' | 'twitter';
  deletionScheduledAt?: string | null; // For 14-day deletion rule
}

export interface Video {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
  };
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isFollowed?: boolean;
  duration?: number;
  audioTitle?: string;
  sizeBytes?: number;
  allowDownload?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  actor: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
  };
  videoId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  groupAdminId?: string;
  memberIds: string[];
  members: User[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface VideoDraft {
  uri: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  duration?: number;
  audioTrack?: string;
  audioVolume?: number;
  textOverlays?: Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
  }>;
  stickers?: Array<{
    id: string;
    sticker: string;
    x: number;
    y: number;
    scale: number;
  }>;
  caption?: string;
  tags?: string[];
}

export type SupportedLanguage = 'fr' | 'en' | 'sw' | 'lng' | 'ha' | 'pt' | 'ar' | 'es' | 'zh' | 'hi';

export type AppThemeMode = 'light' | 'dark' | 'system';
