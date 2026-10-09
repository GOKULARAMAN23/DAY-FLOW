import React, { useState } from 'react';
import { 
  Wallet, 
  Download, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import PayslipModal from '../../components/common/PayslipModal';

export default function AdminPayroll() {
  const { payroll } = useData();
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [search, setSearch] = useState('');
  const [payrollStatus, setPayrollStatus] = useState('all');

  const totalMonthlyPayroll = payroll.reduce((acc, p) => acc + p.netPay, 0);
  const totalEmployeesPaid = payroll.length;

  const filteredPayroll = payroll.filter(p => {
    const matchesSearch = 
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      p.designation.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = payrollStatus === 'all' || p.status === payrollStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRunPayroll = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert('August 2026 payroll batch disbursement executed successfully!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            Payroll Management & Disbursement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate statutory taxes, manage salary components, and disburse monthly compensation
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunPayroll}
          className="flex items-center justify-center gap-2 rounded-2xl brand-gradient px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
        >
          <Play size={16} fill="white" /> Run Monthly Payroll Cycle
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Monthly Payroll Total"
          value={`$${totalMonthlyPayroll.toLocaleString()}`}
          description="Net disbursement for August"
          badgeText="Active Cycle"
          icon={<DollarSign size={24} />}
          color="emerald"
        />
        <StatCard
          title="Salaried Employees"
          value={totalEmployeesPaid.toString()}
          description="Active payroll profiles"
          icon={<Wallet size={24} />}
          color="indigo"
        />
        <StatCard
          title="TDS & Tax Withheld"
          value="$1,410"
          description="Ready for statutory filing"
          icon={<ShieldCheck size={24} />}
          color="rose"
        />
        <StatCard
          title="Disbursement Date"
          value="Aug 31, 2026"
          description="Direct Deposit ACH"
          icon={<Sparkles size={24} />}
          color="blue"
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
            placeholder="Search employee, ID or title..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={payrollStatus}
            onChange={(e) => setPayrollStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 w-full sm:w-auto"
          >
            <option value="all">All Pay Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Scheduled">Scheduled</option>
          </select>

          <button
            type="button"
            onClick={() => alert('Exporting payroll spreadsheet...')}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 shadow-sm"
          >
            <Download size={14} /> Export Summary
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Employee Payroll Statements
          </h3>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Employee</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Base Salary</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Allowances & Bonus</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Tax & Deductions</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Net Take-Home</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredPayroll.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{pay.employeeName}</p>
                      <p className="text-[10px] text-slate-400">{pay.designation} • {pay.employeeId}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                    ${pay.basicSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold">
                    +${(pay.hra + pay.allowance + (pay.bonus || 0)).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-rose-600 font-semibold">
                    -${(pay.pfDeduction + pay.taxDeduction).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-mono text-sm">
                    ${pay.netPay.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSlip(pay)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700 transition shadow-sm"
                    >
                      <Eye size={13} /> View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={Boolean(selectedSlip)}
        onClose={() => setSelectedSlip(null)}
        payrollItem={selectedSlip}
      />
    </div>
  );
}
