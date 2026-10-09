import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Filter,
  CheckCircle2,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function TeamDirectory() {
  const { employees, attendance, leaves } = useData();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const getEmployeeLiveStatus = (empId) => {
    const todayAtt = attendance.find(a => a.employeeId === empId && a.date === todayStr);
    const activeLeave = leaves.find(l => l.employeeId === empId && l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr);

    if (activeLeave) {
      return { status: 'On Leave', text: `On ${activeLeave.leaveType}`, color: 'purple', isOnline: false };
    }
    if (todayAtt && todayAtt.checkIn && !todayAtt.checkOut) {
      return { status: 'Active Today', text: `Logged in at ${todayAtt.checkIn}`, color: 'emerald', isOnline: true };
    }
    return { status: 'Offline', text: 'Offline', color: 'slate', isOnline: false };
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl brand-gradient p-6 sm:p-8 text-white shadow-glow">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
            <Users size={14} className="text-amber-300" />
            <span>Colleague Directory & Shift Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
            Team & Colleagues Directory
          </h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-xl">
            Connect with your colleagues, view departments, and see who is active on shift today.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colleagues by name, role..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => {
          const live = getEmployeeLiveStatus(emp.id);

          return (
            <div
              key={emp.id}
              className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                      />
                      {live.isOnline && (
                        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Active on Shift" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        {emp.name}
                      </h3>
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {emp.designation}
                      </p>
                      <span className="inline-block text-[10px] text-slate-400 font-mono mt-0.5">
                        {emp.id}
                      </span>
                    </div>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    live.color === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                      : live.color === 'purple'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {live.text}
                  </span>
                </div>

                {/* Info Rows */}
                <div className="mt-5 space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-slate-400" />
                    <span>{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{emp.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex justify-end">
                <a
                  href={`mailto:${emp.email}`}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 transition"
                >
                  <Mail size={13} /> Send Email
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
