import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';

export default function AdminAttendance() {
  const { attendance, employees, punchCheckIn } = useData();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const [manualForm, setManualForm] = useState({
    employeeId: employees[0]?.id || 'EMP-1002',
    status: 'Present',
    checkIn: '09:00 AM',
    notes: 'Admin manual entry'
  });

  const filteredAttendance = attendance.filter(rec => {
    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || rec.status === selectedStatus;
    const matchesDate = !selectedDate || rec.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleManualPunch = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === manualForm.employeeId);
    if (!emp) return;

    punchCheckIn(emp.id, emp.name, manualForm.notes);
    setIsManualModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Late':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Half Day':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'On Leave':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            Workforce Attendance Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor daily check-ins, biometric timestamps, overtime, and work duration logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl brand-gradient px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
          >
            <Plus size={16} /> Mark Manual Punch
          </button>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee name or ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="On Leave">On Leave</option>
          </select>

          <button
            type="button"
            onClick={() => alert('Exporting attendance report...')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Attendance Records ({filteredAttendance.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Date: {selectedDate}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Employee</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Check In</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Check Out</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Total Duration</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Punch Source</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{rec.employeeName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {rec.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                      {rec.checkIn || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                      {rec.checkOut || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {rec.workHours}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {rec.location}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No attendance records found for selected date/filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Punch Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Record Manual Attendance"
        subtitle="Manually punch attendance for a staff member"
      >
        <form onSubmit={handleManualPunch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Select Employee
            </label>
            <select
              value={manualForm.employeeId}
              onChange={(e) => setManualForm({ ...manualForm, employeeId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.id} - {e.department})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Attendance Status
              </label>
              <select
                value={manualForm.status}
                onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Check In Time
              </label>
              <input
                type="text"
                value={manualForm.checkIn}
                onChange={(e) => setManualForm({ ...manualForm, checkIn: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Admin Note / Reason
            </label>
            <input
              type="text"
              value={manualForm.notes}
              onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
              placeholder="e.g. Biometric reader bypass authorized"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl brand-gradient px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95"
            >
              Log Punch Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
