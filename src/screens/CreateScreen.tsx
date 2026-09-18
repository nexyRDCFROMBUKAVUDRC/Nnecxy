import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { VideoDraft } from '../types';
import { VideoEditorScreen } from './VideoEditorScreen';
import { PublishScreen } from './PublishScreen';
import {
  Upload,
  AlertCircle,
  Video as VideoIcon,
  Sparkles,
  X,
  FileVideo,
  CheckCircle2,
  ShieldCheck,
  Music,
  Type,
  Smile,
} from 'lucide-react';

interface CreateScreenProps {
  onSelectVideo?: (draft: VideoDraft) => void;
  onPublishComplete?: () => void;
  onClose?: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({
  onSelectVideo,
  onPublishComplete,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [activeStep, setActiveStep] = useState<'select' | 'editor' | 'publish'>('select');
  const [selectedDraft, setSelectedDraft] = useState<VideoDraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Process a selected or dropped video file
  const processVideoFile = (file: File) => {
    setErrorMessage(null);

    // 1. Photo rejection: Only video files can be published on NNECXY
    const isVideoType =
      file.type.startsWith('video/') ||
      /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(file.name);

    if (!isVideoType) {
      setErrorMessage(t.selectVideoNotice || 'Seules les vidéos sont acceptées. Les photos ne peuvent pas être publiées.');
      return;
    }

    // 2. Strict 25MB limit check
    const MAX_SIZE_BYTES = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(
        `${t.sizeLimitError || 'La taille maximale autorisée est de 25 Mo.'} (Votre fichier : ${sizeMB} Mo)`
      );
      return;
    }

    // 3. Create video draft and open NNECXY Editor immediately (Zero intermediate screens)
    const objectUrl = URL.createObjectURL(file);
    const draft: VideoDraft = {
      uri: objectUrl,
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'video/mp4',
      duration: 15,
      audioTrack: 'Son original',
      audioVolume: 100,
      textOverlays: [],
      stickers: [],
    };

    if (onSelectVideo) {
      onSelectVideo(draft);
    } else {
      setSelectedDraft(draft);
      setActiveStep('editor');
    }
  };

  // Upload video from real device file system
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
    // Reset file input value so the same file can be chosen again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  // Quick fallback demo video loader for quick testing in preview without local files
  const handleLoadDemoVideo = (url: string, name: string, sizeBytes: number) => {
    setErrorMessage(null);
    const draft: VideoDraft = {
      uri: url,
      name,
      size: sizeBytes,
      type: 'video/mp4',
      duration: 15,
      audioTrack: 'Son original',
      audioVolume: 100,
      textOverlays: [],
      stickers: [],
    };

    if (onSelectVideo) {
      onSelectVideo(draft);
    } else {
      setSelectedDraft(draft);
      setActiveStep('editor');
    }
  };

  if (activeStep === 'editor' && selectedDraft) {
    return (
      <VideoEditorScreen
        draft={selectedDraft}
        onUpdateDraft={(updated) => setSelectedDraft(updated)}
        onNext={() => setActiveStep('publish')}
        onBack={() => {
          setActiveStep('select');
          setErrorMessage(null);
        }}
      />
    );
  }

  if (activeStep === 'publish' && selectedDraft) {
    return (
      <PublishScreen
        draft={selectedDraft}
        onBack={() => setActiveStep('editor')}
        onComplete={() => {
          setActiveStep('select');
          setSelectedDraft(null);
          onPublishComplete?.();
        }}
      />
    );
  }

  return (
    <div
      id="create-screen"
      className="flex flex-col h-full w-full max-w-md mx-auto select-none"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 border-b sticky top-0 z-10 backdrop-blur-md"
        style={{ borderColor: theme.border, backgroundColor: theme.background + 'F0' }}
      >
        <div className="flex items-center gap-2.5">
          {onClose && (
            <button
              id="close-create-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-500/10 active:scale-95 transition-transform"
              aria-label="Fermer"
            >
              <X size={22} style={{ color: theme.text }} />
            </button>
          )}
          <h1 className="text-base font-bold tracking-tight">Nouveau Reel NNECXY</h1>
        </div>

        <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles size={12} />
          <span>Éditeur V1</span>
        </span>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          id="selection-error-banner"
          className="mx-4 mt-3 p-3.5 rounded-2xl flex items-start gap-2.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs shadow-md animate-shake"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-200 p-0.5"
            aria-label="Masquer l'erreur"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Upload Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center justify-between space-y-4">
        {/* Drag & Drop Card */}
        <div
          id="video-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex-1 min-h-[260px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'hover:border-blue-500 hover:bg-neutral-500/5'
          }`}
          style={{
            borderColor: isDragging ? '#22d3ee' : theme.border,
            backgroundColor: isDragging ? undefined : theme.card,
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/5">
            <FileVideo size={32} className="stroke-[2.2]" />
          </div>

          <h2 className="text-base font-bold mb-1">
            Importer une vidéo de l'appareil
          </h2>
          <p className="text-xs max-w-xs mb-4" style={{ color: theme.textSecondary }}>
            Sélectionnez votre fichier vidéo ou glissez-déposez-le ici pour ouvrir directement l'Éditeur NNECXY.
          </p>

          <button
            type="button"
            id="browse-files-btn"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs rounded-full shadow-md active:scale-95 hover:opacity-95 transition-all"
          >
            <Upload size={15} />
            <span>Parcourir mes fichiers</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleDeviceFileUpload}
          />
        </div>

        {/* Requirements & Features Checklist */}
        <div
          className="w-full rounded-2xl p-4 border space-y-3"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-blue-500" />
            <span>Conditions de publication</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <VideoIcon size={14} className="text-blue-400" />
                <span>Format autorisé</span>
              </span>
              <span className="font-semibold text-neutral-200 bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                Vidéos uniquement (MP4, MOV, WebM)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Taille maximale</span>
              </span>
              <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                25 Mo max
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <Sparkles size={14} className="text-cyan-400" />
                <span>Édition instantanée</span>
              </span>
              <span className="font-semibold text-cyan-300 text-[11px] flex items-center gap-1">
                <Music size={11} />
                <Type size={11} />
                <Smile size={11} />
                <span>Son, Texte, Stickers</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick test sample video if testing without local video files */}
        <div className="w-full flex items-center justify-between pt-1">
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>
            Test rapide en un clic :
          </span>
          <button
            type="button"
            id="demo-test-video-btn"
            onClick={() =>
              handleLoadDemoVideo(
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'Sample_Reel_NNECXY.mp4',
                8.4 * 1024 * 1024
              )
            }
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1"
          >
            <Sparkles size={11} />
            <span>Charger un extrait de démo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
