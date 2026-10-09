import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  Wallet,
  BarChart3,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Activity as ActivityIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { employees, attendance, leaves, activities, addEmployee } = useData();
  const navigate = useNavigate();

  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: 'Engineering',
    designation: '',
    salary: 75000,
    phone: '+1 (555) 000-1111',
    location: 'San Francisco HQ'
  });

  const totalEmployees = employees.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === todayStr && a.status === 'Present').length;
  const lateToday = attendance.filter(a => a.date === todayStr && a.status === 'Late').length;
  const onLeaveToday = leaves.filter(l => l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr).length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email || !newEmp.designation) {
      alert('Please fill in required employee details.');
      return;
    }
    addEmployee(newEmp);
    setIsAddEmpModalOpen(false);
    setNewEmp({
      name: '',
      email: '',
      role: 'employee',
      department: 'Engineering',
      designation: '',
      salary: 75000,
      phone: '+1 (555) 000-1111',
      location: 'San Francisco HQ'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-3xl brand-gradient p-6 sm:p-8 text-white shadow-glow">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>HR Operations & People Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
              Welcome back, {currentUser?.name || 'Sarah'}! 👋
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              Real-time intelligence on workforce attendance, pending leaves, and active payroll.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/employees')}
              className="flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur-md px-4 py-3 text-xs font-bold text-white hover:bg-white/30 border border-white/20 transition"
            >
              <Users size={16} /> View All Employees
            </button>
            <button
              type="button"
              onClick={() => setIsAddEmpModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-indigo-700 shadow-md hover:bg-indigo-50 transition"
            >
              <UserPlus size={16} /> Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats - Clickable to drill down into pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div onClick={() => navigate('/admin/employees')} className="cursor-pointer group">
          <StatCard
            title="Total Workforce"
            value={totalEmployees.toString()}
            description="Click to view all employees →"
            trend="8.5%"
            trendPositive={true}
            icon={<Users size={24} />}
            color="indigo"
          />
        </div>

        <div onClick={() => navigate('/admin/attendance')} className="cursor-pointer group">
          <StatCard
            title="Present Today"
            value={`${presentToday + lateToday} / ${totalEmployees}`}
            description="Click to view daily log →"
            badgeText={lateToday > 0 ? `${lateToday} Late` : 'All on time'}
            icon={<CalendarCheck size={24} />}
            color="emerald"
          />
        </div>

        <div onClick={() => navigate('/admin/leaves')} className="cursor-pointer group">
          <StatCard
            title="On Leave / Absent"
            value={onLeaveToday > 0 ? `${onLeaveToday} Staff` : '1 Staff'}
            description="Click to review leave history →"
            icon={<CalendarDays size={24} />}
            color="amber"
          />
        </div>

        <div onClick={() => navigate('/admin/leaves')} className="cursor-pointer group">
          <StatCard
            title="Pending Leave Approvals"
            value={pendingLeaves.toString()}
            description="Click to review & approve →"
            badgeText={pendingLeaves > 0 ? 'Action Needed' : 'All clear'}
            icon={<Sparkles size={24} />}
            color="rose"
          />
        </div>
      </div>

      {/* Visual Charts & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Organization Attendance Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly attendance percentage across all active departments
              </p>
            </div>
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="mt-8 flex h-60 items-end justify-around gap-2 sm:gap-6 border-b border-slate-100 px-4 pb-4 dark:border-slate-800">
            {[
              { day: 'Mon', height: '88%', label: '88% Present' },
              { day: 'Tue', height: '94%', label: '94% Present' },
              { day: 'Wed', height: '90%', label: '90% Present' },
              { day: 'Thu', height: '96%', label: '96% Present' },
              { day: 'Fri', height: '85%', label: '85% Present' },
              { day: 'Sat', height: '50%', label: '50% Weekend' },
            ].map((bar, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                <div className="absolute -top-8 hidden rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block dark:bg-slate-100 dark:text-slate-900 shadow-md">
                  {bar.label}
                </div>
                <div
                  className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-300 group-hover:opacity-90"
                  style={{ height: bar.height }}
                />
                <span className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Administrative Actions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct shortcuts for HR operations
          </p>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => navigate('/admin/employees')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">View Employees Directory</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{totalEmployees} registered team members</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setIsAddEmpModalOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <UserPlus size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Add New Employee</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Create profile & credentials</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/attendance')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CalendarCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">View Daily Attendance</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Audit check-in times & shifts</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/leaves')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Review Leave Requests</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{pendingLeaves} pending approvals</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/payroll')}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:hover:border-indigo-900/50 dark:hover:bg-indigo-950/30"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Process Payroll</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Manage salaries & disbursement</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Workforce Activity Stream */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ActivityIcon size={18} className="text-indigo-600" />
              Live Workforce Activity Stream
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              System events, employee punch entries, and leave actions
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {act.title} <span className="font-normal text-slate-500">by {act.user}</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
              </div>
              <span className="text-[10px] font-medium text-slate-400">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddEmpModalOpen}
        onClose={() => setIsAddEmpModalOpen(false)}
        title="Add New Employee"
        subtitle="Register new team member into the organization database"
      >
        <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={newEmp.name}
                onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                placeholder="e.g. Rachel Adams"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={newEmp.email}
                onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                placeholder="rachel.adams@dayflow.io"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={newEmp.department}
                onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Quality Assurance">Quality Assurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={newEmp.designation}
                onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                placeholder="e.g. Backend Developer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Annual Salary ($)
              </label>
              <input
                type="number"
                value={newEmp.salary}
                onChange={(e) => setNewEmp({ ...newEmp, salary: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Role Access Level
              </label>
              <select
                value={newEmp.role}
                onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="employee">Standard Employee</option>
                <option value="admin">HR Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddEmpModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl brand-gradient px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95"
            >
              Save & Register
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
