import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { NnecxyLogo } from '../components/NnecxyLogo';
import { ArrowLeft, ShieldCheck, UserCheck, AlertTriangle, Video, Lock } from 'lucide-react';

interface RulesScreenProps {
  onBack: () => void;
}

export const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <div
      id="rules-screen"
      className="flex flex-col h-full w-full max-w-md mx-auto select-none overflow-y-auto scrollbar-none"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20 backdrop-blur-md"
        style={{ borderColor: theme.border, backgroundColor: theme.background + 'EE' }}
      >
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:opacity-80 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} style={{ color: theme.text }} />
        </button>
        <h2 className="text-base font-bold">{t.rules}</h2>
        <div className="w-8" />
      </div>

      <div className="p-5 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <NnecxyLogo size="md" />
          <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
            Charte d’Utilisation & Sécurité NNECXY V1
          </h3>
          <p className="text-[11px] text-neutral-400">
            Dernière mise à jour : Septembre 2026
          </p>
        </div>

        {/* Rule 1: Age minimum 18 ans */}
        <div
          className="p-4 rounded-2xl border space-y-1.5"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs">
            <UserCheck size={16} />
            <h4>1. Âge Légal Obligatoire (18+)</h4>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            NNECXY V1 est strictement réservée aux utilisateurs âgés de 18 ans révolus. La date de
            naissance fournie lors de l’inscription est vérifiée. Tout compte enfreignant cette règle
            est immédiatement suspendu.
          </p>
        </div>

        {/* Rule 2: Authenticité des vidéos et taille */}
        <div
          className="p-4 rounded-2xl border space-y-1.5"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Video size={16} />
            <h4>2. Authenticité des Contenus & Limites</h4>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Toute vidéo publiée sur NNECXY provient directement de vos médias. Les publications
            sont limitées à une taille maximale de 25 Mo par vidéo pour assurer fluidité et
            rapidité de diffusion. Les photos statiques ne sont pas éligibles à la publication.
          </p>
        </div>

        {/* Rule 3: Respect & Tolérance Zéro */}
        <div
          className="p-4 rounded-2xl border space-y-1.5"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
            <AlertTriangle size={16} />
            <h4>3. Respect & Bienveillance</h4>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Sont formellement proscrits : le harcèlement, les incitations à la haine, la
            pornographie, l'atteinte aux mineurs, la fraude et les fausses identités. Tout contenu
            peut être signalé en un clic et examiné par nos modérateurs.
          </p>
        </div>

        {/* Rule 4: Droit à l'oubli (14 jours de grâce) */}
        <div
          className="p-4 rounded-2xl border space-y-1.5"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <Lock size={16} />
            <h4>4. Protection des Données & Période de Grâce (14 Jours)</h4>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Lorsqu'une demande de suppression de compte est enregistrée, une période de grâce de
            14 jours est accordée. Durant ce délai, une simple reconnexion vous permet d'annuler la
            procédure. Passé ce délai, toutes les données associées sont purgées définitivement.
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};
