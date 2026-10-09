import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  LogOut, 
  UserCircle, 
  Check, 
  Layers, 
  Menu,
  Sparkles,
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export default function Navbar({ onOpenMobileSidebar, onOpenSearch }) {
  const { currentUser, role, quickDemoLogin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/admin') return { title: 'Admin Overview', subtitle: 'Workforce analytics & operations control' };
    if (p === '/admin/employees') return { title: 'Employee Directory', subtitle: 'Manage organization team members and roles' };
    if (p === '/admin/attendance') return { title: 'Attendance Management', subtitle: 'Organization-wide daily time logs and shifts' };
    if (p === '/admin/leaves') return { title: 'Leave Approvals', subtitle: 'Review and approve team leave applications' };
    if (p === '/admin/payroll') return { title: 'Payroll Processing', subtitle: 'Monthly compensation, bonuses and payslips' };
    if (p === '/admin/reports') return { title: 'HR Analytics & Reports', subtitle: 'Performance, attendance and retention metrics' };
    if (p === '/admin/settings') return { title: 'System & Policy Settings', subtitle: 'Configure company policies & backend services' };

    if (p === '/employee') return { title: 'Employee Dashboard', subtitle: 'Welcome to your personal workspace' };
    if (p === '/employee/attendance') return { title: 'My Attendance & Punch', subtitle: 'Live time tracking, daily punches and history' };
    if (p === '/employee/leaves') return { title: 'My Leaves & Holidays', subtitle: 'Apply for time off and check leave balances' };
    if (p === '/employee/payroll') return { title: 'My Compensation', subtitle: 'View payslips and monthly earnings breakdown' };
    if (p === '/employee/profile') return { title: 'My Profile', subtitle: 'Personal credentials, job role and bank info' };

    return { title: 'Dayflow HRMS', subtitle: 'Workforce Platform' };
  };

  const { title, subtitle } = getPageTitle();

  const handleSwitchRole = (targetRole) => {
    quickDemoLogin(targetRole);
    navigate(targetRole === 'admin' ? '/admin' : '/employee');
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      {/* Left title & mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right side tools */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/80 transition"
        >
          <Search size={16} />
          <span className="hidden md:inline">Quick Search</span>
          <kbd className="hidden md:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Quick Role Switcher Pill */}
        <div className="hidden lg:flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => handleSwitchRole('admin')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              role === 'admin' 
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Admin View
          </button>
          <button
            type="button"
            onClick={() => handleSwitchRole('employee')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              role === 'employee' 
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400' 
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Employee View
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
        >
          {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-slide-up z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`cursor-pointer rounded-xl p-3 text-xs transition ${
                        n.read 
                          ? 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50' 
                          : 'bg-indigo-50/70 font-medium text-slate-800 dark:bg-indigo-950/40 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-400">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-1.5 pr-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                {currentUser?.role === 'admin' ? 'Admin (HR)' : currentUser?.designation || 'Employee'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-slide-up z-50">
              <div className="border-b border-slate-100 p-3 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 uppercase tracking-wider">
                  Role: {currentUser?.role}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate(role === 'admin' ? '/admin/settings' : '/employee/profile');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  <UserCircle size={16} /> My Account
                </button>

                {role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => handleSwitchRole('employee')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition"
                  >
                    <Layers size={16} /> Switch to Employee View
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSwitchRole('admin')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition"
                  >
                    <ShieldAlert size={16} /> Switch to Admin View
                  </button>
                )}

                <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
