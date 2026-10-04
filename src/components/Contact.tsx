import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Instagram } from 'lucide-react';

export const Contact: React.FC = () => {
  const { sections, settings, submitContactForm, socialLinks } = useCMS();
  const contactSection = sections.contact;
  const content = contactSection?.content || {};
  const theme = settings.theme;

  const [form, setForm] = useState({
    name: '',
    email: '',
    project_type: 'Reels / Shorts',
    budget: '$1,000 - $3,000',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await submitContactForm(form);
      if (res.success) {
        setSuccess(true);
        setForm({
          name: '',
          email: '',
          project_type: 'Reels / Shorts',
          budget: '$1,000 - $3,000',
          message: '',
        });
      } else {
        setError(res.error || 'Failed to submit message. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contactSection && !contactSection.enabled) return null;

  return (
    <section
      id="contact"
      className="relative w-full bg-[#0A0A0A] border-t border-[#262626]/40"
      style={{
        paddingTop: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
        paddingBottom: `clamp(60px, 8vw, ${theme.design.sectionSpacingDesktop})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Info & Context */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[2px] bg-[#FF2027]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] font-semibold">
                  CONTACT
                </span>
              </div>

              <h2
                className="font-black text-white leading-none tracking-tighter uppercase mb-6"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: `clamp(${theme.typography.h2.fontSizeMobile}, 5vw, ${theme.typography.h2.fontSizeDesktop})`,
                }}
              >
                {content.heading || "LET'S TALK."}
              </h2>

              <p className="text-[#8A8A8A] text-base leading-relaxed mb-8">
                {content.description ||
                  "Tell me what you're working on, what you need edited, and where you want your content to go."}
              </p>

              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <div className="flex items-center gap-3 text-sm text-white">
                  <Mail className="w-4 h-4 text-[#FF2027]" />
                  <span>{content.email || 'ranjan.cinematicx@gmail.com'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#8A8A8A]">
                  <MapPin className="w-4 h-4 text-[#FF2027]" />
                  <span>India · Available Worldwide</span>
                </div>
              </div>
            </div>

            {/* Direct Social Links */}
            <div className="mt-12 pt-8 border-t border-[#262626]/60">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A8A] block mb-4">
                DIRECT SOCIALS
              </span>
              <div className="flex flex-wrap gap-3">
                {socialLinks
                  .filter((s) => s.enabled)
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded bg-[#151515] border border-[#262626] text-xs font-medium text-white hover:border-[#FF2027] hover:text-[#FF2027] transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-[#151515] border border-[#262626] p-8 md:p-10 rounded-md">
            {success ? (
              <div className="py-16 text-center flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                  MESSAGE RECEIVED
                </h3>
                <p className="text-[#8A8A8A] text-sm max-w-md mb-8">
                  Thank you for reaching out. I review all project proposals personally and will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#262626] text-white hover:bg-[#333] transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF2027]" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Smith"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-3 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#FF2027] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. liam@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-3 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#FF2027] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                      PROJECT TYPE
                    </label>
                    <select
                      value={form.project_type}
                      onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2027] transition-colors cursor-pointer"
                    >
                      <option value="Reels / Shorts">Reels / Shorts</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Wedding Film">Wedding Film</option>
                      <option value="Brand Video">Brand Video</option>
                      <option value="Cinematic Film">Cinematic Film</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                      ESTIMATED BUDGET
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2027] transition-colors cursor-pointer"
                    >
                      <option value="Under $1,000">Under $1,000</option>
                      <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                      <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                      <option value="$5,000+">$5,000+</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
                    PROJECT DETAILS & VISION *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your footage, pacing expectations, timeline and delivery goals..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded px-4 py-3 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#FF2027] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded text-xs font-bold uppercase tracking-wider bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF2027]/25"
                >
                  {isSubmitting ? (
                    <span>SENDING PROPOSAL...</span>
                  ) : (
                    <>
                      <span>SUBMIT INQUIRY</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
