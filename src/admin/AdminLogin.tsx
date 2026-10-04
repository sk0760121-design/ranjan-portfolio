import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Info, Database, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { signIn, signUp, loading, authError, isConfigured } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('sk0760121@gmail.com');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (isRegisterMode) {
      const res = await signUp(email, password);
      if (!res.success && res.error) {
        setLocalError(res.error);
      } else {
        setLocalSuccess('Admin account created! Entering dashboard...');
      }
    } else {
      const res = await signIn(email, password);
      if (!res.success && res.error) {
        setLocalError(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background grain */}
      <div className="absolute inset-0 film-grain pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
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

          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded bg-[#0A0A0A] border border-[#262626] text-[11px] font-mono text-emerald-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Cloud Connected</span>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex rounded bg-[#0A0A0A] p-1 border border-[#262626] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setLocalError(null);
            }}
            className={`flex-1 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              !isRegisterMode ? 'bg-[#FF2027] text-white' : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setLocalError(null);
            }}
            className={`flex-1 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              isRegisterMode ? 'bg-[#FF2027] text-white' : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Status / Error alerts */}
        {(authError || localError) && (
          <div className="mb-6 p-4 rounded-md bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF2027] mt-0.5" />
            <div>
              <span className="font-bold block uppercase mb-0.5">Authorization Notice</span>
              <span>{localError || authError}</span>
            </div>
          </div>
        )}

        {localSuccess && (
          <div className="mb-6 p-4 rounded-md bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
            <span>{localSuccess}</span>
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
            ) : isRegisterMode ? (
              <>
                <span>CREATE & ENTER DASHBOARD</span>
                <UserPlus className="w-4 h-4" />
              </>
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
            Your login token is preserved in the browser so you don't need to re-authenticate on every visit.
          </p>

          <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded text-[11px] text-[#8A8A8A] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Info className="w-3.5 h-3.5 text-[#FF2027]" />
              <span>Owner Account:</span>
            </div>
            <p className="text-white font-mono">sk0760121@gmail.com</p>
            <p>If you have not created your password in Supabase yet, click <strong>Register Admin</strong> above.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
