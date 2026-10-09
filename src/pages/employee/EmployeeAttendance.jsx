import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CalendarCheck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Coffee, 
  LogOut, 
  LogIn, 
  MapPin, 
  ShieldCheck, 
  Timer, 
  History,
  Sparkles,
  Filter,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';

export default function EmployeeAttendance() {
  const { currentUser } = useAuth();
  const { 
    attendance, 
    punchCheckIn, 
    punchCheckOut, 
    punchBreak 
  } = useData();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchNote, setPunchNote] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const employeeId = currentUser?.id || 'EMP-1002';
  const employeeName = currentUser?.name || 'Alex Rivera';
  const todayStr = new Date().toISOString().split('T')[0];

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's attendance record for current user
  const todayRecord = attendance.find(
    a => a.employeeId === employeeId && a.date === todayStr
  );

  const isCheckedIn = Boolean(todayRecord && todayRecord.checkIn && !todayRecord.checkOut);
  const isCheckedOut = Boolean(todayRecord && todayRecord.checkOut);

  // Check if currently on break
  const lastTimelineEvent = todayRecord?.timeline?.[todayRecord.timeline.length - 1];
  const isOnBreak = lastTimelineEvent?.type === 'Break Start';

  const handleCheckIn = () => {
    punchCheckIn(employeeId, employeeName, punchNote || 'Web Check-In');
    setPunchNote('');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCheckOut = () => {
    punchCheckOut(employeeId, employeeName);
  };

  const handleBreakToggle = () => {
    if (isOnBreak) {
      punchBreak(employeeId, 'Break End');
    } else {
      punchBreak(employeeId, 'Break Start');
    }
  };

  // User attendance history
  const userHistory = attendance.filter(a => a.employeeId === employeeId);

  const filteredHistory = userHistory.filter(rec => {
    if (filterStatus !== 'all' && rec.status !== filterStatus) return false;
    if (filterMonth !== 'all') {
      const recMonth = rec.date.slice(0, 7);
      if (recMonth !== filterMonth) return false;
    }
    return true;
  });

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
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl brand-gradient p-6 sm:p-8 text-white shadow-glow">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles size={14} className="text-amber-300" />
              <span>Real-Time Biometric & Web Timekeeper</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
              My Attendance & Punch Desk
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              Track daily work shifts, record breaks, log punch-in/out timestamps, and view your monthly timesheets.
            </p>
          </div>

          {/* Live Digital Clock */}
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/20 text-center sm:text-right min-w-[220px]">
            <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <h2 className="text-3xl font-extrabold tracking-wider mt-1 font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <div className="mt-2 flex items-center justify-center sm:justify-end gap-1.5 text-xs text-indigo-200">
              <MapPin size={13} />
              <span>San Francisco HQ (PST)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Punch & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Punch Action Card */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Timer className="text-indigo-600 dark:text-indigo-400" size={22} />
                Today's Punch Station
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shift: Regular 09:00 AM - 05:30 PM (8.5 hrs)
              </p>
            </div>

            {/* Current status pill */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                isCheckedOut 
                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
                  : isCheckedIn 
                    ? isOnBreak 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  isCheckedOut 
                    ? 'bg-slate-400' 
                    : isCheckedIn 
                      ? isOnBreak ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse' 
                      : 'bg-rose-400'
                }`} />
                {isCheckedOut 
                  ? 'Shift Completed' 
                  : isCheckedIn 
                    ? isOnBreak ? 'On Break' : 'Checked In (Active)' 
                    : 'Not Checked In'}
              </span>
            </div>
          </div>

          {/* Punch Metrics Display */}
          <div className="grid grid-cols-3 gap-4 my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <div className="p-2">
              <p className="text-xs text-slate-400 font-medium">Check-In</p>
              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                {todayRecord?.checkIn || '--:--'}
              </p>
            </div>
            <div className="p-2 border-x border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Check-Out</p>
              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                {todayRecord?.checkOut || '--:--'}
              </p>
            </div>
            <div className="p-2">
              <p className="text-xs text-slate-400 font-medium">Total Duration</p>
              <p className="text-base sm:text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {todayRecord?.workHours || '0h 0m'}
              </p>
            </div>
          </div>

          {/* Action Form */}
          <div className="space-y-4">
            {!isCheckedIn && !isCheckedOut && (
              <div>
                <input
                  type="text"
                  value={punchNote}
                  onChange={(e) => setPunchNote(e.target.value)}
                  placeholder="Optional punch note (e.g. Working from Office desk #12)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white mb-3"
                />
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl brand-gradient py-4 text-base font-bold text-white shadow-glow hover:opacity-95 transition active:scale-[0.99]"
                >
                  <LogIn size={22} />
                  <span>CHECK IN NOW</span>
                </button>
              </div>
            )}

            {isCheckedIn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleBreakToggle}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold border transition ${
                    isOnBreak
                      ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      : 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600 shadow-sm'
                  }`}
                >
                  <Coffee size={18} />
                  <span>{isOnBreak ? 'END BREAK & RESUME' : 'TAKE A BREAK (LUNCH/TEA)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-rose-700 transition"
                >
                  <LogOut size={18} />
                  <span>CHECK OUT (END DAY)</span>
                </button>
              </div>
            )}

            {isCheckedOut && (
              <div className="rounded-2xl bg-slate-100 p-4 text-center dark:bg-slate-800/80">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  🎉 Great job! You have completed your shift today at {todayRecord.checkOut}.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Total logged working time: <span className="font-bold text-indigo-600 dark:text-indigo-400">{todayRecord.workHours}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Punch Timeline */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <History size={18} className="text-indigo-600" />
            Today's Punch Activity Log
          </h3>

          <div className="mt-4 flex-1 overflow-y-auto space-y-4">
            {todayRecord?.timeline && todayRecord.timeline.length > 0 ? (
              todayRecord.timeline.map((evt, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-2">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                    {evt.type.includes('Check') ? <Clock size={14} /> : <Coffee size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{evt.type}</p>
                      <span className="text-[11px] font-mono font-medium text-indigo-600 dark:text-indigo-400">{evt.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{evt.note}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
                <Clock size={32} className="mb-2 opacity-30" />
                <p className="text-xs">No punch records recorded yet today.</p>
                <p className="text-[10px] mt-1">Click Check In above to begin.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" /> IP Verified
            </span>
            <span>IP: 192.168.1.42</span>
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Attendance Rate"
          value="95.2%"
          description="August 2026 average"
          trend="2.4%"
          trendPositive={true}
          icon={<CalendarCheck size={22} />}
          color="emerald"
        />
        <StatCard
          title="Days Present"
          value="20 / 22"
          description="Working days completed"
          icon={<CheckCircle2 size={22} />}
          color="indigo"
        />
        <StatCard
          title="Average Logged Hours"
          value="8h 22m"
          description="Per workday"
          icon={<Timer size={22} />}
          color="blue"
        />
        <StatCard
          title="Overtime Logged"
          value="4h 45m"
          description="Approved OT this month"
          icon={<Sparkles size={22} />}
          color="violet"
        />
      </div>

      {/* Monthly Attendance Records Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Attendance History & Time Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed punch entries, duration, and status per working day
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
              onClick={() => alert('Exporting attendance records to CSV...')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-sm"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Check In</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Check Out</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Total Hours</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Location / Method</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {rec.date}
                      {rec.date === todayStr && (
                        <span className="ml-2 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {rec.checkIn || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {rec.checkOut || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
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
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No attendance records found matching filters.
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
