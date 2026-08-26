import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, Shield, Flame, Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [autoFilledName, setAutoFilledName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ email: emailOrUsername.trim(), password: password.trim() });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.parsedMessage || 'Invalid username/email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (loginId, plainPassword, displayName) => {
    setEmailOrUsername(loginId);
    setPassword(plainPassword);
    setAutoFilledName(displayName);
    setError('');
    setSubmitting(true);
    try {
      await login({ email: loginId, password: plainPassword });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.parsedMessage || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 text-white">
      <div className="w-full max-w-4xl bg-midnight-800/90 backdrop-blur-2xl rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Brand & Quick Admin Switcher */}
        <div className="md:col-span-5 bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-850 text-white p-6 sm:p-8 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-amber-500/20">
          <div className="space-y-3 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center p-1 shadow-glow-amber">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-[0.2em] text-white uppercase">
                BOOK<span className="text-amber-400 font-light">CYCLE</span> <span className="text-amber-300/80 font-normal">/ GL BAJAJ</span>
              </span>
            </Link>
            
            <h2 className="text-xl font-extrabold leading-tight pt-2 text-white">
              GL Bajaj Admin & Student Portal
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Login to access the free textbook sharing platform at GL Bajaj Institute of Technology.
            </p>
          </div>

          {/* 1-Click Platform Admin Quick Logins */}
          <div className="pt-6 space-y-3 relative z-10">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-300 flex items-center gap-1 mb-2">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                GL Bajaj Admins (1-Click Login)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Priyanshi Chaudhary */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('priyanshi@bookcycle.edu', 'priyanshi@123', 'Priyanshi Chaudhary')}
                  className="text-left p-2.5 rounded-xl bg-midnight-900/90 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-slate-100 transition-all hover:border-amber-400 flex items-center gap-2.5"
                  title="Username: priyanshi | Password: priyanshi@123"
                >
                  <img src="/avatars/priyanshi.jpg" alt="Priyanshi Chaudhary" className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400/60 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-white block truncate">Priyanshi Chaudhary</span>
                    <span className="text-[9px] text-amber-300 font-mono block truncate">priyanshi@123</span>
                  </div>
                </button>

                {/* 2. Purvi Chaurasia */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('purvi@bookcycle.edu', 'purvi@123', 'Purvi Chaurasia')}
                  className="text-left p-2.5 rounded-xl bg-midnight-900/90 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-slate-100 transition-all hover:border-amber-400 flex items-center gap-2.5"
                  title="Username: purvi | Password: purvi@123"
                >
                  <img src="/avatars/makima.jpg" alt="Purvi Chaurasia" className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400/60 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-white block truncate">Purvi Chaurasia</span>
                    <span className="text-[9px] text-amber-300 font-mono block truncate">purvi@123</span>
                  </div>
                </button>

                {/* 3. Riya Singh */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('riyasingh@bookcycle.edu', 'riyasingh@123', 'Riya Singh')}
                  className="text-left p-2.5 rounded-xl bg-midnight-900/90 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-slate-100 transition-all hover:border-amber-400 flex items-center gap-2.5"
                  title="Username: riyasingh | Password: riyasingh@123"
                >
                  <img src="/avatars/reze.jpg" alt="Riya Singh" className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400/60 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-white block truncate">Riya Singh</span>
                    <span className="text-[9px] text-amber-300 font-mono block truncate">riyasingh@123</span>
                  </div>
                </button>

                {/* 4. Saksham Singh */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('sakshamsingh@bookcycle.edu', 'sakshamsingh@123', 'Saksham Singh')}
                  className="text-left p-2.5 rounded-xl bg-midnight-900/90 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-slate-100 transition-all hover:border-amber-400 flex items-center gap-2.5"
                  title="Username: sakshamsingh | Password: sakshamsingh@123"
                >
                  <img src="/avatars/denji.jpg" alt="Saksham Singh" className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-white block truncate">Saksham Singh</span>
                    <span className="text-[9px] text-amber-300 font-mono block truncate">sakshamsingh@123</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-midnight-850/80">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white">Sign In to BookCycle</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your username (e.g. <strong className="text-amber-300">sakshamsingh</strong>) or email address and password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Username / Email field */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Username or Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="e.g. sakshamsingh or purvi@bookcycle.edu"
                  className="w-full bg-midnight-950 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Password field with Show/Hide Password Eye Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Password</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. sakshamsingh@123"
                  className="w-full bg-midnight-950 border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-glow-amber transition-all disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Account'}
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              New student?{' '}
              <Link to="/register" className="font-bold text-amber-400 hover:underline">
                Create a student account
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
