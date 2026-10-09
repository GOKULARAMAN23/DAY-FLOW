import React, { useState, useEffect } from 'react';
import { Search, X, Users, CalendarCheck, CalendarDays, Wallet, UserCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { employees } = useData();
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle or trigger
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const quickNav = role === 'admin' ? [
    { title: 'Employee Directory', path: '/admin/employees', icon: <Users size={16} />, desc: 'View and manage team' },
    { title: 'Attendance Log', path: '/admin/attendance', icon: <CalendarCheck size={16} />, desc: 'Check-in and daily logs' },
    { title: 'Leave Requests', path: '/admin/leaves', icon: <CalendarDays size={16} />, desc: 'Pending approvals' },
    { title: 'Payroll Manager', path: '/admin/payroll', icon: <Wallet size={16} />, desc: 'Salaries and slips' },
  ] : [
    { title: 'My Attendance', path: '/employee/attendance', icon: <CalendarCheck size={16} />, desc: 'Punch in/out and history' },
    { title: 'Apply for Leave', path: '/employee/leaves', icon: <CalendarDays size={16} />, desc: 'Submit and view leaves' },
    { title: 'My Payslips', path: '/employee/payroll', icon: <Wallet size={16} />, desc: 'View monthly earnings' },
    { title: 'My Profile', path: '/employee/profile', icon: <UserCircle size={16} />, desc: 'Personal details' },
  ];

  const filteredEmployees = query.trim()
    ? employees.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.department.toLowerCase().includes(query.toLowerCase()) ||
        e.designation.toLowerCase().includes(query.toLowerCase()) ||
        e.id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-slide-up z-10">
        <div className="flex items-center border-b border-slate-100 px-4 dark:border-slate-800">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search employees, pages..."
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            autoFocus
          />
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Quick Pages */}
          <div>
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
            <div className="mt-2 space-y-1">
              {quickNav.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Employees match */}
          {query.trim() && (
            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Employees Matching "{query}"</p>
              <div className="mt-2 space-y-1">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleSelect(role === 'admin' ? '/admin/employees' : '/employee/profile')}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{emp.name} <span className="text-xs text-slate-400 font-normal">({emp.id})</span></p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{emp.designation} • {emp.department}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {emp.status}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-slate-400">No employees found matching "{query}"</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
