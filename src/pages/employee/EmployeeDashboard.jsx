import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarDays,
  Wallet,
  UserCircle,
  BarChart3,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity as ActivityIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';

export default function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const { attendance, leaves, activities } = useData();
  const navigate = useNavigate();

  const employeeId = currentUser?.id || 'EMP-1002';
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.employeeId === employeeId && a.date === todayStr);

  const pendingLeaves = leaves.filter(l => l.employeeId === employeeId && l.status === 'Pending').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl brand-gradient p-6 sm:p-8 text-white shadow-glow">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
                  Good morning, {currentUser?.name?.split(' ')[0] || 'Alex'}! 👋
                </h1>
              </div>
              <p className="mt-1 text-sm text-indigo-100">
                {currentUser?.designation || 'Senior Frontend Engineer'} • {currentUser?.department || 'Engineering'}
              </p>
            </div>
          </div>

          {/* Quick Punch Status */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/20">
            <div className="text-right">
              <p className="text-xs text-indigo-200">Today's Punch Status</p>
              <p className="text-sm font-bold">
                {todayRecord?.checkIn ? `Checked in: ${todayRecord.checkIn}` : 'Not Checked In Yet'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/employee/attendance')}
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-md hover:bg-indigo-50 transition"
            >
              {todayRecord?.checkIn ? 'View Punch' : 'Check In'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Attendance Score"
          value="95%"
          description="August 2026 record"
          trend="3%"
          trendPositive={true}
          icon={<CalendarCheck size={24} />}
          color="emerald"
        />
        <StatCard
          title="Leave Balance"
          value="14 Days"
          description={`${pendingLeaves} pending approval`}
          badgeText="Casual & Sick"
          icon={<CalendarDays size={24} />}
          color="indigo"
        />
        <StatCard
          title="Working Days"
          value="22 Days"
          description="20 Days completed"
          icon={<BarChart3 size={24} />}
          color="blue"
        />
        <StatCard
          title="Payroll Status"
          value="Paid"
          description="July 2026 credited"
          badgeText="Aug Scheduled"
          icon={<Wallet size={24} />}
          color="violet"
        />
      </div>

      {/* Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Weekly Attendance & Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged working hours breakdown for the current week
              </p>
            </div>
            <span className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              Avg 8.3 hrs/day
            </span>
          </div>

          {/* Bar chart visualization */}
          <div className="mt-8 flex h-60 items-end justify-around gap-2 sm:gap-6 border-b border-slate-100 px-4 pb-4 dark:border-slate-800">
            {[
              { day: 'Mon', height: '85%', hours: '8.5h', full: true },
              { day: 'Tue', height: '90%', hours: '9.0h', full: true },
              { day: 'Wed', height: '80%', hours: '8.0h', full: true },
              { day: 'Thu', height: '95%', hours: '9.5h', full: true },
              { day: 'Fri', height: '88%', hours: '8.8h', full: true },
              { day: 'Sat', height: '35%', hours: 'Half Day', full: false },
            ].map((bar, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                {/* Tooltip */}
                <div className="absolute -top-8 hidden rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block dark:bg-slate-100 dark:text-slate-900 shadow-md">
                  {bar.hours}
                </div>
                <div
                  className={`w-full max-w-12 rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                    bar.full 
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' 
                      : 'bg-gradient-to-t from-amber-500 to-amber-400'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Services
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Frequently accessed employee workflows
          </p>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => navigate('/employee/attendance')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <CalendarCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Punch & Timesheet</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Check in/out and view records</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/employee/leaves')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Apply for Leave</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Submit time-off requests</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/employee/payroll')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Download Payslips</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">View salary & tax statement</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/employee/profile')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <UserCircle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">My Employee Profile</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Manage credentials & bank details</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ActivityIcon size={18} className="text-indigo-600" />
              Recent Activity Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your latest attendance logs, approvals and notifications
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {activities.slice(0, 4).map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
              </div>
              <span className="text-[10px] font-medium text-slate-400">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
