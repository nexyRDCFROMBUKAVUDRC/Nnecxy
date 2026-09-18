import React, { useState, useEffect, useRef } from 'react';
import { User, Video } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { dataService } from '../services/dataService';
import {
  Settings as SettingsIcon,
  Camera,
  Play,
  Heart,
  Grid,
  Trash2,
  X,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser: User | null;
  onOpenSettings: () => void;
  onNavigateToFeed: () => void;
  onUpdateUser: (updated: User) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onOpenSettings,
  onNavigateToFeed,
  onUpdateUser,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'my_videos' | 'liked_videos'>('my_videos');
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentUser?.bio || '');

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const refreshData = () => {
    if (currentUser) {
      setUserVideos(dataService.getUserVideos(currentUser.id));
      setLikedVideos(dataService.getLikedVideos());
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-neutral-400">Veuillez vous connecter.</p>
      </div>
    );
  }

  // Handle avatar update (Section 40 & 41)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newAvatarUrl = URL.createObjectURL(file);
    const updated = dataService.updateProfile(currentUser.id, { avatar: newAvatarUrl });
    if (updated) {
      onUpdateUser(updated);
      refreshData();
    }
  };

  // Save bio
  const handleSaveBio = () => {
    const updated = dataService.updateProfile(currentUser.id, { bio: bioText });
    if (updated) {
      onUpdateUser(updated);
      setIsEditingBio(false);
    }
  };

  // Delete video (Section 42)
  const handleDeleteVideo = (videoId: string) => {
    dataService.deleteVideo(videoId, currentUser.id);
    setConfirmDeleteId(null);
    setSelectedVideo(null);
    refreshData();
  };

  return (
    <div
      id="profile-screen"
      className="flex flex-col h-full w-full max-w-md mx-auto select-none overflow-y-auto scrollbar-none"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20 backdrop-blur-md"
        style={{ borderColor: theme.border, backgroundColor: theme.background + 'EE' }}
      >
        <span className="font-extrabold text-base tracking-tight">@{currentUser.handle}</span>
        <button
          id="profile-settings-btn"
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:opacity-80 active:scale-95 transition-transform"
          aria-label={t.settings}
        >
          <SettingsIcon size={20} style={{ color: theme.text }} />
        </button>
      </div>

      {/* Profile Header & Stats */}
      <div className="p-4 flex flex-col items-center text-center space-y-3">
        {/* Avatar with clickable camera overlay */}
        <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full object-cover border-2 shadow-lg transition-transform group-hover:scale-105"
            style={{ borderColor: theme.accent }}
          />
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
          <div className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full text-white shadow-md">
            <Camera size={12} />
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-lg font-bold">
              {currentUser.name} {currentUser.surname}
            </h1>
            {currentUser.isVerified && (
              <CheckCircle2 size={16} className="text-blue-500 fill-blue-500 text-white" />
            )}
          </div>
          <p className="text-xs text-neutral-400">@{currentUser.handle}</p>
        </div>

        {/* Bio */}
        {isEditingBio ? (
          <div className="w-full flex flex-col gap-2">
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              maxLength={120}
              placeholder={t.bioPlaceholder}
              className="w-full px-3 py-2 text-xs rounded-xl border bg-transparent resize-none focus:outline-none focus:border-blue-500"
              style={{ borderColor: theme.border, color: theme.text }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingBio(false)}
                className="px-3 py-1 text-xs rounded-lg border border-neutral-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveBio}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white"
              >
                {t.save}
              </button>
            </div>
          </div>
        ) : (
          <p
            onClick={() => setIsEditingBio(true)}
            className="text-xs leading-relaxed max-w-xs text-neutral-400 cursor-pointer hover:text-neutral-200"
          >
            {currentUser.bio || 'Ajouter une bio...'}
          </p>
        )}

        {/* Real Stats Counters (Section 40: aucune statistique fictive) */}
        <div
          className="w-full py-3 px-4 rounded-2xl border flex items-center justify-around"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <div className="flex flex-col items-center">
            <span className="text-base font-extrabold">{currentUser.followingCount}</span>
            <span className="text-[10px] uppercase font-semibold text-neutral-400">
              {t.subscriptions}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-neutral-700/50" />
          <div className="flex flex-col items-center">
            <span className="text-base font-extrabold">{currentUser.followersCount}</span>
            <span className="text-[10px] uppercase font-semibold text-neutral-400">
              {t.followers}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-neutral-700/50" />
          <div className="flex flex-col items-center">
            <span className="text-base font-extrabold">{userVideos.length}</span>
            <span className="text-[10px] uppercase font-semibold text-neutral-400">
              {t.myVideos}
            </span>
          </div>
        </div>

        {/* Account Deletion Scheduled Notice if applicable (Section 22) */}
        {currentUser.deletionScheduledAt && (
          <div className="w-full p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="font-semibold text-left">
                Compte en cours de suppression (14 jours de grâce).
              </span>
            </div>
            <button
              onClick={() => {
                dataService.cancelAccountDeletion(currentUser.id);
                onUpdateUser({ ...currentUser, deletionScheduledAt: null });
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold"
            >
              Restaurer
            </button>
          </div>
        )}
      </div>

      {/* Tabs: My Videos / Liked Videos */}
      <div
        className="flex border-b sticky top-[53px] z-10"
        style={{ borderColor: theme.border, backgroundColor: theme.background }}
      >
        <button
          onClick={() => setActiveTab('my_videos')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'my_videos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Grid size={15} />
          <span>
            {t.myVideos} ({userVideos.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('liked_videos')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'liked_videos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-neutral-400'
          }`}
        >
          <Heart size={15} />
          <span>
            {t.likedVideos} ({likedVideos.length})
          </span>
        </button>
      </div>

      {/* Video Grid */}
      <div className="p-2 flex-1">
        {activeTab === 'my_videos' ? (
          userVideos.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400">
              <p className="font-semibold">Vous n'avez pas encore publié de vidéo.</p>
              <button
                onClick={onNavigateToFeed}
                className="mt-3 text-blue-500 hover:underline font-bold"
              >
                Explorer le feed
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {userVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden bg-neutral-900 cursor-pointer group"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] text-white font-medium">
                    <Heart size={10} className="fill-white" />
                    <span>{video.likesCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : likedVideos.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            <p className="font-semibold">Aucune vidéo aimée pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {likedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="relative aspect-[9/16] rounded-lg overflow-hidden bg-neutral-900 cursor-pointer group"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] text-white font-medium">
                  <Play size={10} className="fill-white" />
                  <span>{video.viewsCount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Detail Modal when opened from profile (Section 43) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-sm h-[75vh] bg-black rounded-3xl overflow-hidden border border-neutral-800 flex flex-col shadow-2xl">
            {/* Top Navigation */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80"
              >
                <ArrowLeft size={18} />
              </button>
              {selectedVideo.userId === currentUser.id && (
                <button
                  onClick={() => setConfirmDeleteId(selectedVideo.id)}
                  className="p-2 bg-red-600/80 backdrop-blur-md rounded-full text-white hover:bg-red-700"
                  title={t.deleteVideo}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Video Player */}
            <video
              src={selectedVideo.videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Bottom Caption */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
              <p className="text-xs font-semibold">{selectedVideo.caption}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-400">
                <span>{selectedVideo.likesCount} J'aime</span>
                <span>{selectedVideo.commentsCount} Commentaires</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Video Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-xs rounded-2xl p-4 border space-y-4 shadow-2xl text-center"
            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
          >
            <AlertTriangle size={32} className="mx-auto text-red-500" />
            <div>
              <h4 className="text-sm font-bold">{t.deleteVideo}</h4>
              <p className="text-xs text-neutral-400 mt-1">{t.deleteVideoConfirm}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-neutral-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleDeleteVideo(confirmDeleteId)}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                {t.deleteComment}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
