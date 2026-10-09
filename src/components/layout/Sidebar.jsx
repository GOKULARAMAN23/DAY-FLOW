import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  UserCircle,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { role, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = role === 'admin';

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Leave Requests', path: '/admin/leaves', icon: CalendarDays },
    { name: 'Payroll', path: '/admin/payroll', icon: Wallet },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const employeeNav = [
    { name: 'Dashboard', path: '/employee', icon: LayoutDashboard },
    { name: 'My Attendance', path: '/employee/attendance', icon: CalendarCheck },
    { name: 'My Leaves', path: '/employee/leaves', icon: CalendarDays },
    { name: 'My Payroll', path: '/employee/payroll', icon: Wallet },
    { name: 'Team Directory', path: '/employee/team', icon: Users },
    { name: 'My Profile', path: '/employee/profile', icon: UserCircle },
  ];

  const currentNav = isAdmin ? adminNav : employeeNav;

  const handleNavClick = (path) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-slate-800 bg-slate-950 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-glow">
                <CalendarCheck size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
                  Dayflow
                  <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/30">
                    HRMS
                  </span>
                </h1>
                <p className="text-[11px] font-medium text-slate-400">
                  {isAdmin ? 'HR Administration' : 'Employee Workspace'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="px-4 py-6">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isAdmin ? 'Administration Portal' : 'Employee Services'}
            </p>

            <div className="space-y-1.5">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`group relative flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-glow'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80">
          {/* Status Capsule */}
          {!isAdmin && (
            <div className="mb-3 rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Status
                </span>
                <span>Active Shift</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate">
                {currentUser?.name || 'Alex Rivera'}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
