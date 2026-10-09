import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Briefcase, 
  CreditCard, 
  Save, 
  Sparkles,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function EmployeeProfile() {
  const { currentUser, updateUserProfile } = useAuth();
  const { updateEmployee } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alex Rivera',
    email: currentUser?.email || 'alex.rivera@dayflow.io',
    phone: '+1 (555) 345-6789',
    designation: currentUser?.designation || 'Senior Frontend Engineer',
    department: currentUser?.department || 'Engineering',
    location: 'San Francisco HQ (hybrid)',
    emergencyContact: 'Maria Rivera (+1 555-987-6543)',
    bankName: 'Chase Bank',
    accountNumber: '•••• •••• 9123',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
    });
    if (currentUser?.id) {
      updateEmployee(currentUser.id, {
        name: formData.name,
        phone: formData.phone,
        designation: formData.designation,
        department: formData.department,
      });
    }

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={formData.name}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-lg"
            />
            <button
              type="button"
              onClick={() => alert('Profile photo upload dialog.')}
              className="absolute -bottom-2 -right-2 rounded-xl brand-gradient p-2 text-white shadow-md hover:opacity-90 transition"
              title="Update photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {formData.name}
                </h1>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {formData.designation} • {formData.department}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active Employee
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  ID: {currentUser?.id || 'EMP-1002'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-indigo-500" /> {formData.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-indigo-500" /> {formData.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-indigo-500" /> {formData.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 animate-slide-up flex items-center gap-2">
          <ShieldCheck size={18} /> Profile details updated and saved successfully!
        </div>
      )}

      {/* Details Form Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official Profile & Contact Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update personal contact details and emergency contact contacts
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl border border-slate-200 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400 transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Work Email Address (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Primary Work Location
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Disbursal Bank & Account
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={`${formData.bankName} (${formData.accountNumber})`}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 outline-none disabled:opacity-75 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl brand-gradient px-6 py-2.5 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
              >
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
