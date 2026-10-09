import React, { useState } from 'react';
import { 
  CalendarDays, 
  Check, 
  X, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';

export default function LeaveRequests() {
  const { leaves, updateLeaveStatus } = useData();
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const reviewerName = currentUser?.name || 'Sarah Jenkins';

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  const filteredLeaves = leaves.filter(lev => {
    const matchesStatus = filterStatus === 'all' || lev.status === filterStatus;
    const matchesSearch = 
      lev.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      lev.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      lev.employeeId.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id) => {
    updateLeaveStatus(id, 'Approved', reviewerName);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleReject = (id) => {
    updateLeaveStatus(id, 'Rejected', reviewerName);
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
          Leave Management & Approvals
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review employee time-off applications, verify leave balances and issue approvals
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Pending Approval"
          value={pendingCount.toString()}
          description="Awaiting HR review"
          badgeText={pendingCount > 0 ? 'Requires Action' : 'All Cleared'}
          icon={<Clock size={22} />}
          color="amber"
        />
        <StatCard
          title="Approved Leaves"
          value={approvedCount.toString()}
          description="Processed this calendar year"
          icon={<CheckCircle2 size={22} />}
          color="emerald"
        />
        <StatCard
          title="Declined Requests"
          value={rejectedCount.toString()}
          description="Due to project constraints"
          icon={<XCircle size={22} />}
          color="rose"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, leave type, ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 w-full sm:w-auto"
          >
            <option value="all">All Request Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Leave Requests Queue ({filteredLeaves.length})
          </h3>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Employee</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Leave Category</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Duration</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Total Days</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Reason</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Decisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((lev) => (
                  <tr key={lev.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{lev.employeeName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{lev.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {lev.leaveType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {lev.startDate} → {lev.endDate}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {lev.days} {lev.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={lev.reason}>
                      {lev.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(lev.status)}`}>
                        {lev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {lev.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(lev.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(lev.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {lev.reviewedBy ? `Reviewed by ${lev.reviewedBy}` : 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No leave requests found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
