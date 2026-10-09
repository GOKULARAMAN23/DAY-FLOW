import React from 'react';
import { Printer, Download, Building2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

export default function PayslipModal({ isOpen, onClose, payrollItem }) {
  if (!payrollItem) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Salary Payslip" subtitle={payrollItem.month} maxWidth="max-w-2xl">
      <div className="space-y-6 print:p-0">
        {/* Company Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white shadow-md">
              <Building2 size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Dayflow Technologies Inc.</h4>
              <p className="text-xs text-slate-500">500 Howard St, San Francisco, CA • HR Payroll Dept</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 size={13} /> {payrollItem.status}
          </span>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800/50">
          <div>
            <p className="text-slate-400">Employee Name</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{payrollItem.employeeName}</p>
          </div>
          <div>
            <p className="text-slate-400">Employee ID</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{payrollItem.employeeId}</p>
          </div>
          <div>
            <p className="text-slate-400">Designation</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{payrollItem.designation}</p>
          </div>
          <div>
            <p className="text-slate-400">Payment Date</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{payrollItem.paymentDate}</p>
          </div>
        </div>

        {/* Earnings & Deductions Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            <h5 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 border-b border-slate-100 pb-2 dark:border-slate-800">
              Earnings
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Basic Salary</span>
                <span className="font-medium text-slate-900 dark:text-white">${payrollItem.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-medium text-slate-900 dark:text-white">${payrollItem.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Special Allowance</span>
                <span className="font-medium text-slate-900 dark:text-white">${payrollItem.allowance.toLocaleString()}</span>
              </div>
              {payrollItem.bonus > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Performance Bonus</span>
                  <span className="font-medium text-emerald-600">+${payrollItem.bonus.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                <span>Total Earnings</span>
                <span>${(payrollItem.basicSalary + payrollItem.hra + payrollItem.allowance + (payrollItem.bonus || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            <h5 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 border-b border-slate-100 pb-2 dark:border-slate-800">
              Deductions
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Provident Fund (PF)</span>
                <span className="font-medium text-rose-600">-${payrollItem.pfDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Professional Tax & TDS</span>
                <span className="font-medium text-rose-600">-${payrollItem.taxDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                <span>Total Deductions</span>
                <span className="text-rose-600">-${(payrollItem.pfDeduction + payrollItem.taxDeduction).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight */}
        <div className="flex items-center justify-between rounded-xl brand-gradient p-4 text-white shadow-lg">
          <div>
            <p className="text-xs text-indigo-100 font-medium">Net Take-Home Pay</p>
            <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">
              ${payrollItem.netPay.toLocaleString()}
            </h3>
          </div>
          <div className="text-right text-xs text-indigo-100">
            <p>Disbursed via {payrollItem.payMethod}</p>
            <p className="text-[10px] opacity-80">Reference: TXN-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
