import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarCheck, User, Mail, Lock, Building, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Specialist',
  });
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const { addEmployee } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = await signup(formData);
    if (res.success) {
      // Also register in employee directory
      addEmployee({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        designation: formData.designation,
        salary: 75000,
        location: 'San Francisco HQ'
      });

      navigate(formData.role === 'admin' ? '/admin' : '/employee');
    } else {
      setError(res.error || 'Signup failed.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 mesh-bg">
      <div className="relative w-full max-w-lg">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white shadow-glow mb-3">
            <CalendarCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            Join Dayflow Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create an organization staff or administrator account
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Miller"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan.miller@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Role Type
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">HR Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create strong password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl brand-gradient py-3 text-sm font-bold text-white shadow-glow hover:opacity-95 transition active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
