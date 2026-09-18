import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { dataService } from '../services/dataService';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ReportModalProps {
  targetId: string;
  targetType: 'video' | 'user' | 'comment';
  isOpen: boolean;
  onClose: () => void;
  reporterId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetId,
  targetType,
  isOpen,
  onClose,
  reporterId,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [selectedReason, setSelectedReason] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'duplicate'>('idle');

  if (!isOpen) return null;

  const reasons = [
    { id: 'inappropriate', label: t.reasonInappropriate },
    { id: 'harassment', label: t.reasonHarassment },
    { id: 'pornography', label: t.reasonPornography },
    { id: 'minors', label: t.reasonMinors },
    { id: 'insults', label: t.reasonInsults },
    { id: 'spam', label: t.reasonSpam },
    { id: 'fraud', label: t.reasonFraud },
    { id: 'impersonation', label: t.reasonImpersonation },
    { id: 'dangerous', label: t.reasonDangerous },
    { id: 'other', label: t.reasonOther },
  ];

  const handleSubmit = () => {
    if (!selectedReason) return;

    const res = dataService.reportContent(targetType, targetId, selectedReason, reporterId);
    if (!res.success && res.error === 'alreadyReported') {
      setStatus('duplicate');
    } else {
      setStatus('success');
    }

    setTimeout(() => {
      setStatus('idle');
      setSelectedReason('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-sm rounded-2xl border p-5 shadow-2xl flex flex-col gap-4 animate-scale-up"
        style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle size={20} />
            <h3 className="text-sm font-bold">{t.reportContentTitle}</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle size={36} className="text-emerald-500" />
            <p className="text-xs font-semibold text-emerald-400">{t.reportSentSuccess}</p>
          </div>
        ) : status === 'duplicate' ? (
          <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
            <AlertTriangle size={36} className="text-amber-500" />
            <p className="text-xs font-semibold text-amber-400">{t.alreadyReported}</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-neutral-400">{t.selectReportReason}</p>
            <div className="max-h-56 overflow-y-auto space-y-1.5 scrollbar-none">
              {reasons.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReason(r.id)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                    selectedReason === r.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-neutral-800/60 hover:bg-neutral-800 text-neutral-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-neutral-700 hover:bg-neutral-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white"
              >
                {t.report}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
