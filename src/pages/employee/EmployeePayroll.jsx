import React, { useState } from 'react';
import { 
  Wallet, 
  Download, 
  Eye, 
  Building, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import PayslipModal from '../../components/common/PayslipModal';

export default function EmployeePayroll() {
  const { currentUser } = useAuth();
  const { payroll } = useData();
  const [selectedSlip, setSelectedSlip] = useState(null);

  const employeeId = currentUser?.id || 'EMP-1002';
  const userPayroll = payroll.filter(p => p.employeeId === employeeId);
  const latestPayroll = userPayroll[0] || {
    basicSalary: 4500,
    hra: 1500,
    allowance: 833,
    bonus: 250,
    pfDeduction: 350,
    taxDeduction: 480,
    netPay: 6253,
    month: 'August 2026',
    status: 'Scheduled'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
            My Compensation & Payslips
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access breakdown of monthly earnings, tax deductions, and download signed payslips
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedSlip(latestPayroll)}
          className="flex items-center justify-center gap-2 rounded-2xl brand-gradient px-5 py-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition"
        >
          <FileText size={16} /> View Current Month Slip
        </button>
      </div>

      {/* Salary Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Net Take-Home Pay"
          value={`$${latestPayroll.netPay.toLocaleString()}`}
          description={`${latestPayroll.month} disbursement`}
          badgeText={latestPayroll.status}
          icon={<Wallet size={22} />}
          color="emerald"
        />
        <StatCard
          title="Monthly Base Pay"
          value={`$${latestPayroll.basicSalary.toLocaleString()}`}
          description="Fixed base compensation"
          icon={<Building size={22} />}
          color="indigo"
        />
        <StatCard
          title="Total Allowances"
          value={`$${(latestPayroll.hra + latestPayroll.allowance).toLocaleString()}`}
          description="HRA & Special allowances"
          icon={<TrendingUp size={22} />}
          color="blue"
        />
        <StatCard
          title="Statutory Deductions"
          value={`$${(latestPayroll.pfDeduction + latestPayroll.taxDeduction).toLocaleString()}`}
          description="PF contribution & Income Tax"
          icon={<ShieldCheck size={22} />}
          color="rose"
        />
      </div>

      {/* Salary Structure Breakdown & Bank Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Earnings Structure
          </h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Basic Salary</span>
              <span className="font-bold text-slate-900 dark:text-white">${latestPayroll.basicSalary}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>House Rent Allowance</span>
              <span className="font-bold text-slate-900 dark:text-white">${latestPayroll.hra}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Special & Meal Allowance</span>
              <span className="font-bold text-slate-900 dark:text-white">${latestPayroll.allowance}</span>
            </div>
            {latestPayroll.bonus > 0 && (
              <div className="flex justify-between items-center text-emerald-600 font-semibold">
                <span>Performance Bonus</span>
                <span>+${latestPayroll.bonus}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 dark:border-slate-800 dark:text-white text-sm">
              <span>Gross Earnings</span>
              <span>${(latestPayroll.basicSalary + latestPayroll.hra + latestPayroll.allowance + (latestPayroll.bonus || 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Monthly Deductions
          </h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Provident Fund (Employee 12%)</span>
              <span className="font-bold text-rose-600">-${latestPayroll.pfDeduction}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>TDS / Income Tax Withholding</span>
              <span className="font-bold text-rose-600">-${latestPayroll.taxDeduction}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Medical Insurance Premium</span>
              <span className="font-bold text-slate-400">Covered 100%</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 dark:border-slate-800 dark:text-white text-sm">
              <span>Total Deductions</span>
              <span className="text-rose-600">-${(latestPayroll.pfDeduction + latestPayroll.taxDeduction).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Disbursal Account Info */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-600" />
              Direct Deposit Account
            </h3>
            <div className="mt-4 space-y-2 text-xs">
              <div>
                <p className="text-slate-400">Bank Name</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Chase Bank National</p>
              </div>
              <div>
                <p className="text-slate-400">Account Number</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">•••• •••• 9123</p>
              </div>
              <div>
                <p className="text-slate-400">Disbursal Date</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Last calendar day of every month</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> Verified & Active for Automated Payroll
          </div>
        </div>
      </div>

      {/* Payslips Archive Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Payslip Statements & History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review and print past official payroll statements
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Payroll Month</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Gross Pay</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Deductions</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Net Take-Home</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Disbursed Date</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {userPayroll.map((slip) => (
                <tr key={slip.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {slip.month}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    ${(slip.basicSalary + slip.hra + slip.allowance + (slip.bonus || 0)).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-rose-600 font-semibold">
                    -${(slip.pfDeduction + slip.taxDeduction).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ${slip.netPay.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {slip.paymentDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {slip.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSlip(slip)}
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

      {/* Payslip Print Modal */}
      <PayslipModal
        isOpen={Boolean(selectedSlip)}
        onClose={() => setSelectedSlip(null)}
        payrollItem={selectedSlip}
      />
    </div>
  );
}
