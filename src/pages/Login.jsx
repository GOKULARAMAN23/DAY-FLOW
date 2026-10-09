import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [error, setError] = useState('');
  const { login, quickDemoLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password, selectedRole);
    if (res.success) {
      navigate(res.user.role === 'admin' ? '/admin' : '/employee');
    } else {
      setError(res.error || 'Login failed. Please verify credentials.');
    }
  };

  const handleQuickDemo = (role) => {
    const user = quickDemoLogin(role);
    navigate(role === 'admin' ? '/admin' : '/employee');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 mesh-bg">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-glow mb-4">
            <CalendarCheck size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            Dayflow <span className="text-indigo-600 dark:text-indigo-400">HRMS</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Workforce intelligence, attendance tracking & payroll suite
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
          {/* Quick 1-Click Demo Login Banner */}
          <div className="mb-6 rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <Sparkles size={15} />
              <span>Instant 1-Click Demo Logins</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                <ShieldCheck size={16} /> HR Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('employee')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                <UserCheck size={16} /> Employee
              </button>
            </div>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white px-3 text-xs uppercase text-slate-400 dark:bg-slate-900 font-medium">
              Or sign in with email
            </span>
          </div>

          {/* Role selector tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setEmail('admin@dayflow.io');
                setPassword('password123');
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                selectedRole === 'admin'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              HR Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('employee');
                setEmail('alex.rivera@dayflow.io');
                setPassword('password123');
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                selectedRole === 'employee'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Employee
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin@dayflow.io' : 'employee@dayflow.io'}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to demo email.'); }} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl brand-gradient py-3.5 text-sm font-bold text-white shadow-glow hover:opacity-95 transition active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an organization account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Register New Employee
            </Link>
          </div>
        </div>

        {/* Feature badges footer */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-500" /> Live Check-In
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-500" /> Instant Payslips
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-500" /> Supabase Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
