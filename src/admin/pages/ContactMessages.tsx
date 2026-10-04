import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ContactMessage } from '../../types/database';
import {
  Mail,
  Trash2,
  Check,
  Search,
  ExternalLink,
  Clock,
  DollarSign,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const ContactMessages: React.FC = () => {
  const { contactMessages, markMessageRead, deleteMessage } = useCMS();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = contactMessages.filter((msg) => {
    const matchFilter = filter === 'all' || msg.status === filter;
    const matchSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.project_type.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h2
            className="text-2xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            CLIENT INQUIRIES & PROPOSALS
          </h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Direct inquiries sent via the public portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-[#FF2027] text-white font-bold'
                  : 'bg-[#151515] text-[#8A8A8A] border border-[#262626]'
              }`}
            >
              {f} ({contactMessages.filter((m) => f === 'all' || m.status === f).length})
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
        <input
          type="text"
          placeholder="Search by client name, email, project type, or message keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151515] border border-[#262626] rounded pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-[#FF2027]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message list */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A8A8A] bg-[#151515] border border-[#262626] rounded-lg">
              No inquiries found in this view.
            </div>
          ) : (
            filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'unread') markMessageRead(msg.id);
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedMessage?.id === msg.id
                    ? 'bg-[#1f1f1f] border-[#FF2027]'
                    : 'bg-[#151515] border-[#262626] hover:border-[#383838]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white uppercase">{msg.name}</span>
                  {msg.status === 'unread' && (
                    <span className="w-2 h-2 rounded-full bg-[#FF2027]" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A8A8A] mb-2">
                  <span>{msg.project_type}</span>
                  <span>·</span>
                  <span>{msg.budget}</span>
                </div>

                <p className="text-xs text-[#8A8A8A] line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-[#555] font-mono">
                  <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected message detail */}
        <div className="lg:col-span-7 bg-[#151515] border border-[#262626] rounded-lg p-6 sm:p-8 flex flex-col justify-between min-h-[400px]">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-[#262626]">
                <div>
                  <h3 className="text-xl font-bold uppercase text-white">
                    {selectedMessage.name}
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=RE: Video Editing Inquiry (${selectedMessage.project_type})`}
                    className="text-xs text-[#FF2027] hover:underline flex items-center gap-1.5 mt-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>

                <button
                  onClick={() => setDeleteId(selectedMessage.id)}
                  className="p-2 rounded text-[#8A8A8A] hover:text-red-400 hover:bg-[#262626] transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#0A0A0A] rounded border border-[#262626]">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A] block mb-1">
                    PROJECT CATEGORY
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedMessage.project_type}
                  </span>
                </div>

                <div className="p-3 bg-[#0A0A0A] rounded border border-[#262626]">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A] block mb-1">
                    ESTIMATED BUDGET
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedMessage.budget || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A] block mb-2">
                  CLIENT MESSAGE
                </span>
                <div className="p-4 bg-[#0A0A0A] rounded border border-[#262626] text-sm text-white leading-relaxed whitespace-pre-line font-normal">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#8A8A8A] border-t border-[#262626]">
                <span>Received: {new Date(selectedMessage.created_at).toLocaleString()}</span>

                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: Video Editing Inquiry (${selectedMessage.project_type})`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded bg-[#FF2027] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E0181F] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>REPLY VIA EMAIL</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center text-xs text-[#8A8A8A] py-12">
              <Mail className="w-8 h-8 text-[#333] mx-auto mb-3" />
              <span>Select an inquiry from the list on the left to read its full briefing.</span>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Inquiry"
        message="Are you sure you want to delete this contact message? This cannot be undone."
        onConfirm={() => {
          if (deleteId) {
            deleteMessage(deleteId);
            if (selectedMessage?.id === deleteId) setSelectedMessage(null);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
