import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ProcessStep } from '../../types/database';
import { Plus, Trash2, Edit, MoveUp, MoveDown, X } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const ProcessEditor: React.FC = () => {
  const { processSteps, saveProcessSteps } = useCMS();
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;

    let updated: ProcessStep[];
    if (isCreating) {
      updated = [...processSteps, editingStep];
    } else {
      updated = processSteps.map((s) => (s.id === editingStep.id ? editingStep : s));
    }
    saveProcessSteps(updated);
    setEditingStep(null);
  };

  const handleDelete = (id: string) => {
    const updated = processSteps.filter((s) => s.id !== id);
    saveProcessSteps(updated);
    setDeleteConfirmId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= processSteps.length) return;

    const copy = [...processSteps];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;

    copy.forEach((s, idx) => {
      s.sort_order = idx + 1;
      s.step_number = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
    });

    saveProcessSteps(copy);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            CREATIVE PROCESS STEPS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Define the steps of your editing workflow (e.g. Discover, Structure, Edit, Polish, Deliver).
          </p>
        </div>

        <button
          onClick={() => {
            setEditingStep({
              id: 'proc-' + Math.random().toString(36).substring(2, 9),
              step_number: `0${processSteps.length + 1}`,
              title: 'NEW PHASE',
              description: 'Describe this phase of post-production.',
              enabled: true,
              sort_order: processSteps.length + 1,
            });
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-all cursor-pointer shadow-lg shadow-[#FF2027]/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD STEP</span>
        </button>
      </div>

      <div className="bg-[#151515] border border-[#262626] rounded-lg divide-y divide-[#262626]">
        {processSteps.map((step, idx) => (
          <div
            key={step.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono text-xl font-black text-[#FF2027]">
                {step.step_number}
              </span>
              <div>
                <h4 className="text-sm font-bold uppercase text-white">{step.title}</h4>
                <p className="text-xs text-[#8A8A8A] mt-1 max-w-xl">{step.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() =>
                  saveProcessSteps(
                    processSteps.map((s) => (s.id === step.id ? { ...s, enabled: !s.enabled } : s))
                  )
                }
                className={`px-3 py-1 rounded text-[11px] font-mono uppercase ${
                  step.enabled
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-[#262626] text-[#8A8A8A]'
                }`}
              >
                {step.enabled ? 'Enabled' : 'Disabled'}
              </button>

              <button
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-white disabled:opacity-30"
              >
                <MoveUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === processSteps.length - 1}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-white disabled:opacity-30"
              >
                <MoveDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setEditingStep({ ...step });
                  setIsCreating(false);
                }}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-[#FF2027]"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(step.id)}
                className="p-1.5 rounded text-[#8A8A8A] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4">
              {isCreating ? 'ADD WORKFLOW STEP' : 'EDIT WORKFLOW STEP'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  PHASE NUMBER (E.G. 01)
                </label>
                <input
                  type="text"
                  required
                  value={editingStep.step_number}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, step_number: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  PHASE TITLE
                </label>
                <input
                  type="text"
                  required
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingStep.description}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, description: e.target.value })
                  }
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingStep(null)}
                  className="px-4 py-2 rounded text-xs uppercase text-[#8A8A8A] border border-[#262626]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FF2027] text-white text-xs uppercase font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Step"
        message="Are you sure you want to delete this process step?"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
