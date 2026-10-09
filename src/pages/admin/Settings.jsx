import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Database, 
  Building, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  Key, 
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { updateSupabaseCredentials, getSupabaseStatus } from '../../services/supabase';

export default function Settings() {
  const { resetToDefaultData } = useData();
  const [supabaseStatus] = useState(getSupabaseStatus());
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('dayflow_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('dayflow_supabase_key') || ''
  );

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Dayflow Technologies Inc.',
    workEmailDomain: '@dayflow.io',
    shiftStart: '09:00 AM',
    shiftEnd: '05:30 PM',
    gracePeriod: '15 Minutes',
    locationName: 'San Francisco HQ',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    updateSupabaseCredentials(supabaseUrl, supabaseKey);
  };

  const handleResetDb = () => {
    if (window.confirm('Reset all demo employees, punches, leaves and payroll to default sample records?')) {
      resetToDefaultData();
      alert('Workspace data reset successfully.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
          System & Organization Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure work shifts, cloud database connectors, and application defaults
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 animate-slide-up flex items-center gap-2">
          <CheckCircle2 size={18} /> Company preferences saved successfully!
        </div>
      )}

      {/* Company Configuration Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
          <Building size={18} className="text-indigo-600" />
          Company & Work Shift Policy
        </h3>

        <form onSubmit={handleSaveCompany} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Default Email Domain
              </label>
              <input
                type="text"
                value={companySettings.workEmailDomain}
                onChange={(e) => setCompanySettings({ ...companySettings, workEmailDomain: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Daily Shift Start
              </label>
              <input
                type="text"
                value={companySettings.shiftStart}
                onChange={(e) => setCompanySettings({ ...companySettings, shiftStart: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Daily Shift End
              </label>
              <input
                type="text"
                value={companySettings.shiftEnd}
                onChange={(e) => setCompanySettings({ ...companySettings, shiftEnd: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Late Punch Grace Period
              </label>
              <input
                type="text"
                value={companySettings.gracePeriod}
                onChange={(e) => setCompanySettings({ ...companySettings, gracePeriod: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl brand-gradient px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
            >
              <Save size={15} /> Save Policy
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Cloud Connection Panel */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database size={18} className="text-indigo-600" />
            Supabase Cloud Backend Integration
          </h3>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            supabaseStatus.configured 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
          }`}>
            {supabaseStatus.configured ? 'Connected Custom DB' : 'Using Embedded Local DB'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Dayflow is operating with an embedded persistent database. You can optionally connect your live Supabase project by entering your credentials below.
        </p>

        <form onSubmit={handleSaveSupabase} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setSupabaseUrl('');
                setSupabaseKey('');
                updateSupabaseCredentials('', '');
              }}
              className="text-xs text-rose-600 hover:underline dark:text-rose-400 font-medium"
            >
              Clear Custom Credentials
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              <Key size={15} /> Save & Connect Backend
            </button>
          </div>
        </form>
      </div>

      {/* Reset & Maintenance */}
      <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6 shadow-card dark:border-rose-900/30 dark:bg-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">
            Reset Demo Dataset
          </h4>
          <p className="text-xs text-rose-700/80 dark:text-rose-400 mt-0.5">
            Restores all mock employees, attendance punches, leave requests and payroll back to factory defaults.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDb}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition whitespace-nowrap"
        >
          <RotateCcw size={15} /> Restore Default Data
        </button>
      </div>
    </div>
  );
}
