import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';

export default function EmployeeLeaves() {
  const { currentUser } = useAuth();
  const { leaves, applyLeave } = useData();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [form, setForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const employeeId = currentUser?.id || 'EMP-1002';
  const employeeName = currentUser?.name || 'Alex Rivera';

  const userLeaves = leaves.filter(l => l.employeeId === employeeId);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) {
      alert('Please fill out all leave fields.');
      return;
    }

    const daysCount = calculateDays(form.startDate, form.endDate);
    applyLeave({
      employeeId,
      employeeName,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      days: daysCount,
      reason: form.reason
    });

    setIsApplyModalOpen(false);
    setForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            My Leave Requests & Holidays
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review allocated annual leave balances and submit time-off requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl brand-gradient px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
        >
          <Plus size={16} /> Apply for Time Off
        </button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Casual Leave (CL)"
          value="8 / 12 Days"
          description="Available for personal reasons"
          icon={<CalendarDays size={22} />}
          color="indigo"
        />
        <StatCard
          title="Sick Leave (SL)"
          value="5 / 7 Days"
          description="Medical emergencies"
          icon={<AlertCircle size={22} />}
          color="emerald"
        />
        <StatCard
          title="Paid Vacation (PL)"
          value="14 / 15 Days"
          description="Annual accrued vacation"
          icon={<Sparkles size={22} />}
          color="blue"
        />
        <StatCard
          title="Public Holidays"
          value="11 Days"
          description="Scheduled this calendar year"
          icon={<Calendar size={22} />}
          color="violet"
        />
      </div>

      {/* Leave Application History Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Leave Request History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track status and feedback on your submitted leave applications
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Leave Type</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Duration / Dates</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Days</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Reason</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Applied On</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {userLeaves.length > 0 ? (
                userLeaves.map((lev) => (
                  <tr key={lev.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {lev.leaveType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {lev.startDate} → {lev.endDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {lev.days} {lev.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {lev.reason}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {lev.appliedOn}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(lev.status)}`}>
                        {lev.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No leave requests found. Click "Apply for Time Off" above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Time Off"
        subtitle="Submit a new leave application for management review"
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Leave Category
            </label>
            <select
              value={form.leaveType}
              onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Casual Leave">Casual Leave (Personal / Urgent)</option>
              <option value="Sick Leave">Sick Leave (Medical)</option>
              <option value="Paid Vacation">Paid Vacation</option>
              <option value="Maternity/Paternity">Maternity / Paternity</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Reason / Justification
            </label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Provide context for HR and manager approval..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl brand-gradient px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
