import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { RevisionSnapshot } from '../../types/database';
import { CMSService } from '../../lib/supabase';
import { History, Plus, RotateCcw, Clock, ShieldCheck, Check } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const RevisionsEditor: React.FC = () => {
  const { revisions, restoreRevision } = useCMS();
  const [newTitle, setNewTitle] = useState('');
  const [restoreCandidate, setRestoreCandidate] = useState<RevisionSnapshot | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    CMSService.createRevision(newTitle.trim());
    setNewTitle('');
    setSuccessMsg('New backup revision snapshot saved.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleConfirmRestore = () => {
    if (restoreCandidate) {
      restoreRevision(restoreCandidate);
      setSuccessMsg(`Restored snapshot: "${restoreCandidate.title}"`);
      setRestoreCandidate(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            REVISION HISTORY & BACKUPS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Create state snapshots before major overhauls, or rollback to a previously saved version.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Manual Snapshot creator */}
      <div className="p-6 bg-[#151515] border border-[#262626] rounded-lg">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF2027] font-bold mb-4">
          CREATE MANUAL BACKUP SNAPSHOT
        </h3>
        <form onSubmit={handleCreateSnapshot} className="flex gap-4">
          <input
            type="text"
            required
            placeholder="e.g. Before changing hero copy and reordering wedding films"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-grow bg-[#0A0A0A] border border-[#262626] rounded px-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-[#FF2027]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>SAVE SNAPSHOT</span>
          </button>
        </form>
      </div>

      {/* Revisions timeline */}
      <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
        {revisions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8A8A8A]">
            No previous revisions recorded yet. Snapshots are created automatically before each publish, or manually above.
          </div>
        ) : (
          revisions.map((rev) => (
            <div
              key={rev.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1a1a1a] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold uppercase text-white">{rev.title}</span>
                  <span className="text-[10px] font-mono uppercase bg-[#262626] px-2 py-0.5 rounded text-[#8A8A8A]">
                    {rev.created_by}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(rev.created_at).toLocaleString()}</span>
                  <span>·</span>
                  <span>{rev.snapshot.projects?.length || 0} projects</span>
                </div>
              </div>

              <button
                onClick={() => setRestoreCandidate(rev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#0A0A0A] border border-[#262626] text-xs font-semibold uppercase tracking-wider text-white hover:border-[#FF2027] hover:text-[#FF2027] transition-colors cursor-pointer self-end sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTORE THIS VERSION</span>
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(restoreCandidate)}
        title="Restore Revision"
        message={`Are you sure you want to rollback to revision "${restoreCandidate?.title}"? Current working draft changes will be replaced.`}
        confirmLabel="Rollback to this version"
        confirmVariant="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setRestoreCandidate(null)}
      />
    </div>
  );
};
