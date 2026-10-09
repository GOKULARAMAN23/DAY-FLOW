import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Wallet, 
  Download, 
  Sparkles,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';

export default function Reports() {
  const { employees, attendance, leaves, payroll } = useData();

  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const totalEmployees = employees.length || 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            HR Intelligence & Analytics Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Workforce demographic breakdowns, attendance trends, and retention health metrics
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Generating full HR executive PDF report...')}
          className="flex items-center justify-center gap-2 rounded-2xl brand-gradient px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
        >
          <Download size={16} /> Download Executive Report (PDF)
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Average Attendance Rate"
          value="94.6%"
          description="Across all divisions"
          trend="1.8%"
          trendPositive={true}
          icon={<CalendarCheck size={22} />}
          color="emerald"
        />
        <StatCard
          title="Retention Rate"
          value="98.2%"
          description="Past 12 months"
          trend="0.5%"
          trendPositive={true}
          icon={<Users size={22} />}
          color="indigo"
        />
        <StatCard
          title="Avg. Time to Hire"
          value="18 Days"
          description="Target benchmark: 21 days"
          icon={<TrendingUp size={22} />}
          color="blue"
        />
        <StatCard
          title="Annualized Payroll"
          value="$512,000"
          description="Workforce compensation"
          icon={<Wallet size={22} />}
          color="violet"
        />
      </div>

      {/* Department Breakdown and Attendance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Workforce Distribution by Department
          </h3>
          <div className="mt-5 space-y-4">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>{dept}</span>
                    <span>{count} staff ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full brand-gradient transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Attendance Health Metrics */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Punctuality & Shift Compliance
          </h3>
          <div className="mt-5 space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50">
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-300">On-Time Punch Ratio</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Checked in prior to 09:15 AM</p>
              </div>
              <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">92.4%</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/50">
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-300">Late Punch-In Occurrences</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Grace period extensions</p>
              </div>
              <span className="text-lg font-extrabold text-amber-700 dark:text-amber-300">5.2%</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50">
              <div>
                <p className="font-bold text-indigo-900 dark:text-indigo-300">Overtime Utilization</p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">Cumulative approved extra hours</p>
              </div>
              <span className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300">38.5 hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
