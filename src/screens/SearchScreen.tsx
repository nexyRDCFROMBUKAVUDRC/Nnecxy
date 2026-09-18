import React, { useState } from 'react';
import { User, Video } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { dataService } from '../services/dataService';
import { Search as SearchIcon, X, CheckCircle2, Heart, Play, ArrowLeft } from 'lucide-react';

interface SearchScreenProps {
  onOpenCreator: (userId: string) => void;
  onBack: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onOpenCreator, onBack }) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'users' | 'videos'>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const results = dataService.search(query);

  return (
    <div
      id="search-screen"
      className="flex flex-col h-full w-full max-w-md mx-auto select-none overflow-hidden"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Header Search Input */}
      <div
        className="p-3 border-b flex items-center gap-2 sticky top-0 z-20"
        style={{ borderColor: theme.border, backgroundColor: theme.background }}
      >
        <button onClick={onBack} className="p-1 rounded-full hover:opacity-80">
          <ArrowLeft size={18} style={{ color: theme.text }} />
        </button>

        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full border text-xs"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <SearchIcon size={16} className="text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher créateurs, vidéos, hashtags..."
            className="flex-1 bg-transparent focus:outline-none"
            style={{ color: theme.text }}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex px-4 py-2 border-b gap-2 text-xs font-semibold"
        style={{ borderColor: theme.border }}
      >
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full transition-all ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Tout
        </button>
        <button
          onClick={() => setActiveFilter('users')}
          className={`px-3 py-1 rounded-full transition-all ${
            activeFilter === 'users'
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Créateurs ({results.users.length})
        </button>
        <button
          onClick={() => setActiveFilter('videos')}
          className={`px-3 py-1 rounded-full transition-all ${
            activeFilter === 'videos'
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Vidéos ({results.videos.length})
        </button>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-none">
        {!query.trim() ? (
          <div className="py-16 text-center text-xs text-neutral-400 space-y-2">
            <SearchIcon size={32} className="mx-auto text-neutral-500 opacity-50" />
            <p className="font-semibold">Explorez le monde NNECXY.</p>
            <p className="text-[11px]">Tapez un nom de créateur, un mot-clé ou un hashtag.</p>
          </div>
        ) : results.users.length === 0 && results.videos.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            Aucun résultat pour "{query}".
          </div>
        ) : (
          <>
            {/* Users section */}
            {(activeFilter === 'all' || activeFilter === 'users') && results.users.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Créateurs
                </h3>
                <div className="space-y-2">
                  {results.users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => onOpenCreator(user.id)}
                      className="p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer hover:opacity-90 active:scale-98 transition-all"
                      style={{ backgroundColor: theme.card, borderColor: theme.border }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold">
                              {user.name} {user.surname}
                            </span>
                            {user.isVerified && (
                              <CheckCircle2 size={13} className="text-blue-500 fill-blue-500 text-white" />
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400">@{user.handle}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-500">
                        {user.followersCount} abonnés
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos section */}
            {(activeFilter === 'all' || activeFilter === 'videos') && results.videos.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Vidéos
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {results.videos.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className="relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group shadow"
                    >
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] text-white font-medium">
                        <Play size={10} className="fill-white" />
                        <span>{vid.viewsCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal if opened from search */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-sm h-[75vh] bg-black rounded-3xl overflow-hidden border border-neutral-800 flex flex-col shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 left-3 z-30 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80"
            >
              <ArrowLeft size={18} />
            </button>
            <video
              src={selectedVideo.videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
              <p className="text-xs font-semibold">{selectedVideo.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
