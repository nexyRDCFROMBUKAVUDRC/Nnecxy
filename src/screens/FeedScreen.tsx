import React, { useState, useEffect, useRef } from 'react';
import { Video, User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { dataService } from '../services/dataService';
import { NnecxyLogo } from '../components/NnecxyLogo';
import { CommentsModal } from '../components/CommentsModal';
import { ReportModal } from '../components/ReportModal';
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  AlertCircle,
  Volume2,
  VolumeX,
  Plus,
  UserPlus,
  Check,
  Flag,
  Music,
  RefreshCw,
} from 'lucide-react';

interface FeedScreenProps {
  currentUser: User | null;
  onOpenCreatorProfile: (userId: string) => void;
  onOpenCreate: () => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  currentUser,
  onOpenCreatorProfile,
  onOpenCreate,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ x: number; y: number } | null>(null);
  const [activeCommentVideoId, setActiveCommentVideoId] = useState<string | null>(null);
  const [activeReportVideoId, setActiveReportVideoId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastTapRef = useRef<number>(0);

  const loadFeed = () => {
    const list = dataService.getVideos();
    setVideos(list);
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // Handle active video playback & pause others
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;
      if (index === activeIndex) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {
          // Autoplay policy fallback: mute & play
          videoEl.muted = true;
          setIsMuted(true);
          videoEl.play().catch(() => {});
        });
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex, videos]);

  // Handle scroll detection for vertical snap
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < videos.length) {
      setActiveIndex(newIndex);
    }
  };

  // Section 25: At 100% video completion, the screen scrolls automatically to the next video!
  const handleVideoEnded = (index: number) => {
    const video = videos[index];
    if (video) {
      dataService.recordWatchEvent(video.id, video.duration || 15, true);
    }

    if (index < videos.length - 1 && containerRef.current) {
      const nextTop = (index + 1) * containerRef.current.clientHeight;
      containerRef.current.scrollTo({ top: nextTop, behavior: 'smooth' });
      setActiveIndex(index + 1);
    }
  };

  // Like handler (Single tap button or double-tap video)
  const handleLike = (video: Video) => {
    const result = dataService.toggleLike(video.id);
    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, isLiked: result.isLiked, likesCount: result.newCount } : v
      )
    );
  };

  // Double tap to like (Master prompt section 27)
  const handleVideoAreaClick = (e: React.MouseEvent<HTMLDivElement>, video: Video) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      setDoubleTapHeart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTimeout(() => setDoubleTapHeart(null), 800);

      if (!video.isLiked) {
        handleLike(video);
      }
    }
    lastTapRef.current = now;
  };

  // Follow creator toggle (Section 29)
  const handleFollow = (video: Video) => {
    if (!currentUser) return;
    const result = dataService.toggleFollow(video.userId);
    setVideos((prev) =>
      prev.map((v) =>
        v.userId === video.userId ? { ...v, isFollowed: result.isFollowed } : v
      )
    );
  };

  // Share handler
  const handleShare = async (video: Video) => {
    dataService.recordShare(video.id);
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, sharesCount: v.sharesCount + 1 } : v))
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NNECXY V1',
          text: video.caption,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }

    navigator.clipboard?.writeText(window.location.href);
    setShareToast(t.copiedLink);
    setTimeout(() => setShareToast(null), 2500);
  };

  // Download handler (Section 31: real download with watermark notification)
  const handleDownload = (video: Video) => {
    setShareToast(t.downloadStarted);
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = video.videoUrl;
      a.download = `NNECXY_${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShareToast(null);
    }, 1200);
  };

  // Empty state if no videos exist (Section 24: "Aucune vidéo disponible pour le moment. Publiez la première vidéo.")
  if (videos.length === 0) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <NnecxyLogo size="lg" />
        <h2 className="mt-5 text-base font-bold">{t.noVideosTitle}</h2>
        <p className="mt-1 text-xs text-neutral-400 max-w-xs">{t.noVideosDesc}</p>
        <button
          onClick={onOpenCreate}
          className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform shadow-lg"
        >
          {t.create}
        </button>
      </div>
    );
  }

  return (
    <div
      id="feed-screen"
      ref={containerRef}
      onScroll={handleScroll}
      className="relative w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none bg-black select-none"
    >
      {/* Toast Notice */}
      {shareToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/80 backdrop-blur-md border border-cyan-400/30 rounded-full text-xs font-semibold text-cyan-300 shadow-xl animate-fade-in">
          {shareToast}
        </div>
      )}

      {videos.map((video, index) => {
        const isActive = index === activeIndex;
        const isOwnVideo = currentUser?.id === video.userId;

        return (
          <div
            key={video.id}
            id={`feed-item-${video.id}`}
            className="relative w-full h-full snap-start snap-always flex items-center justify-center overflow-hidden bg-black"
          >
            {/* Real HTML5 Video Player */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              className="w-full h-full object-cover"
              loop={false}
              playsInline
              muted={isMuted}
              onEnded={() => handleVideoEnded(index)}
              onClick={(e) => handleVideoAreaClick(e, video)}
            />

            {/* Official NNECXY Logo (En haut à gauche) */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-90 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-md border border-white/10">
              <NnecxyLogo size="sm" glow={false} />
              <span className="text-[11px] font-extrabold tracking-wider text-cyan-400">NNECXY</span>
            </div>

            {/* Top Mute / Unmute overlay toggle (En haut à droite) */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 active:scale-95 transition-all"
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-cyan-400" />}
            </button>

            {/* Double Tap Heart Animation */}
            {doubleTapHeart && isActive && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
                style={{ left: doubleTapHeart.x, top: doubleTapHeart.y }}
              >
                <Heart size={80} className="fill-red-500 text-red-500 drop-shadow-2xl" />
              </div>
            )}

            {/* Gradient shadow for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

            {/* Right Action Buttons Sidebar */}
            <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
              {/* Creator Avatar with Facebook-style Follow Badge */}
              <div className="relative">
                <img
                  src={video.user.avatar}
                  alt={video.user.name}
                  referrerPolicy="no-referrer"
                  onClick={() => onOpenCreatorProfile(video.userId)}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white cursor-pointer active:scale-95 transition-transform"
                />
                {!isOwnVideo && (
                  <button
                    id={`btn-follow-avatar-${video.userId}`}
                    onClick={() => handleFollow(video)}
                    title={video.isFollowed ? t.following : t.follow}
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-90 ${
                      video.isFollowed
                        ? 'bg-neutral-800 border border-white/40 text-emerald-400'
                        : 'bg-[#1877F2] hover:bg-[#166fe5] ring-2 ring-black/40'
                    }`}
                  >
                    {video.isFollowed ? <Check size={11} className="text-white" /> : <Plus size={12} />}
                  </button>
                )}
              </div>

              {/* Like Button */}
              <button
                id={`btn-like-${video.id}`}
                onClick={() => handleLike(video)}
                className="flex flex-col items-center gap-1 group active:scale-80 transition-transform"
              >
                <div
                  className={`w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors ${
                    video.isLiked ? 'text-red-500' : 'text-white group-hover:text-red-400'
                  }`}
                >
                  <Heart
                    size={24}
                    className={video.isLiked ? 'fill-red-500 text-red-500' : ''}
                  />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {video.likesCount}
                </span>
              </button>

              {/* Comments Button */}
              <button
                id={`btn-comments-${video.id}`}
                onClick={() => setActiveCommentVideoId(video.id)}
                className="flex flex-col items-center gap-1 group active:scale-80 transition-transform"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:text-cyan-300">
                  <MessageCircle size={24} />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {video.commentsCount}
                </span>
              </button>

              {/* Share Button */}
              <button
                id={`btn-share-${video.id}`}
                onClick={() => handleShare(video)}
                className="flex flex-col items-center gap-1 group active:scale-80 transition-transform"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:text-emerald-300">
                  <Share2 size={22} />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {video.sharesCount}
                </span>
              </button>

              {/* Download Button */}
              {video.allowDownload && (
                <button
                  id={`btn-download-${video.id}`}
                  onClick={() => handleDownload(video)}
                  className="flex flex-col items-center gap-1 group active:scale-80 transition-transform"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:text-amber-300">
                    <Download size={20} />
                  </div>
                  <span className="text-[10px] font-semibold text-white/90 drop-shadow">
                    Sauvegarder
                  </span>
                </button>
              )}

              {/* Report Button */}
              <button
                id={`btn-report-${video.id}`}
                onClick={() => setActiveReportVideoId(video.id)}
                className="p-2 text-white/60 hover:text-red-400 active:scale-90 transition-transform"
                title={t.report}
              >
                <Flag size={16} />
              </button>
            </div>

            {/* Bottom Left Info: Creator name, Facebook-style Follow button, caption, audio track */}
            <div className="absolute left-4 bottom-6 right-16 z-20 text-white space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div
                  onClick={() => onOpenCreatorProfile(video.userId)}
                  className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95 transition-transform"
                >
                  <span className="font-bold text-sm drop-shadow">{video.user.name}</span>
                  {video.user.isVerified && (
                    <span className="w-3.5 h-3.5 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-[8px] font-black shadow-xs">
                      ✓
                    </span>
                  )}
                  <span className="text-xs text-cyan-300/90 font-medium drop-shadow">
                    @{video.user.handle}
                  </span>
                </div>

                {/* Facebook-style Follow (Suivre / Abonné) Button */}
                {!isOwnVideo && (
                  <button
                    id={`btn-facebook-follow-${video.userId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(video);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95 select-none ${
                      video.isFollowed
                        ? 'bg-neutral-800/80 hover:bg-neutral-700/90 text-neutral-100 backdrop-blur-md border border-white/20'
                        : 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-blue-500/25 ring-1 ring-white/10'
                    }`}
                  >
                    {video.isFollowed ? (
                      <>
                        <Check size={13} className="text-emerald-400 stroke-[2.5]" />
                        <span>{t.following}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} className="text-white stroke-[2.2]" />
                        <span>{t.follow}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <p className="text-xs leading-relaxed line-clamp-3 text-white/95 drop-shadow">
                {video.caption}
              </p>

              {video.audioTitle && (
                <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium">
                  <Music size={13} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="truncate max-w-[200px]">{video.audioTitle}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Comments Modal Bottom Sheet */}
      {activeCommentVideoId && (
        <CommentsModal
          videoId={activeCommentVideoId}
          isOpen={Boolean(activeCommentVideoId)}
          onClose={() => {
            setActiveCommentVideoId(null);
            loadFeed();
          }}
          currentUser={currentUser}
        />
      )}

      {/* Report Modal */}
      {activeReportVideoId && (
        <ReportModal
          targetId={activeReportVideoId}
          targetType="video"
          isOpen={Boolean(activeReportVideoId)}
          onClose={() => setActiveReportVideoId(null)}
          reporterId={currentUser?.id || 'guest'}
        />
      )}
    </div>
  );
};
