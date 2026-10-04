import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { signIn, loading, authError, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    const res = await signIn(email, password);
    if (!res.success && res.error) {
      setLocalError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background grain */}
      <div className="absolute inset-0 film-grain pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#FF2027]/10 border border-[#FF2027]/20 flex items-center justify-center text-[#FF2027] mb-4 shadow-lg shadow-[#FF2027]/10">
            <Lock className="w-6 h-6" />
          </div>

          <h1
            className="text-2xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            RANJAN<span className="text-[#FF2027]">.</span> CMS
          </h1>
          <p className="mt-1 text-xs uppercase font-mono tracking-widest text-[#8A8A8A]">
            PORTFOLIO CONTROL PANEL
          </p>
        </div>

        {/* Status / Error alerts */}
        {(authError || localError) && (
          <div className="mb-6 p-4 rounded-md bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF2027] mt-0.5" />
            <div>
              <span className="font-bold block uppercase mb-0.5">Authorization Error</span>
              <span>{localError || authError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sk0760121@gmail.com"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded pl-10 pr-4 py-3 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#FF2027] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#8A8A8A] mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded pl-10 pr-4 py-3 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#FF2027] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded text-xs font-bold uppercase tracking-wider bg-[#FF2027] text-white hover:bg-[#E0181F] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF2027]/25"
          >
            {loading ? (
              <span>VERIFYING SESSION...</span>
            ) : (
              <>
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Setup Guide */}
        <div className="mt-8 pt-6 border-t border-[#262626] text-xs text-[#8A8A8A] space-y-3">
          <div className="flex items-center gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Session Persistence Active</span>
          </div>

          <p className="leading-relaxed">
            Your login token is preserved across browser sessions. You will not need to sign in again on this device until you explicitly log out.
          </p>

          {!isConfigured && (
            <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded text-[11px] text-[#8A8A8A] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Info className="w-3.5 h-3.5 text-[#FF2027]" />
                <span>Default Authorized Account:</span>
              </div>
              <p>Email: <strong className="text-white">sk0760121@gmail.com</strong> or <strong className="text-white">ranjan.cinematicx@gmail.com</strong></p>
              <p>Password: <strong className="text-white">editor2026</strong> (minimum 6 characters)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
