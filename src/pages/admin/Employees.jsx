import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  MoreVertical, 
  Filter,
  CheckCircle2,
  Download,
  LogIn,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';

export default function Employees() {
  const { employees, attendance, leaves, addEmployee, updateEmployee, deleteEmployee } = useData();
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all'); // 'all', 'online', 'onleave'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [inspectingEmp, setInspectingEmp] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
    salary: 75000,
    phone: '+1 (555) 123-4567',
    location: 'San Francisco HQ',
    role: 'employee'
  });

  // Calculate live shift status for an employee
  const getEmployeeLiveStatus = (empId) => {
    const todayAtt = attendance.find(a => a.employeeId === empId && a.date === todayStr);
    const activeLeave = leaves.find(l => l.employeeId === empId && l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr);

    if (activeLeave) {
      return { status: 'On Leave', text: `On ${activeLeave.leaveType}`, color: 'purple', isOnline: false };
    }
    if (todayAtt && todayAtt.checkIn && !todayAtt.checkOut) {
      return { status: 'Logged In', text: `Active since ${todayAtt.checkIn}`, color: 'emerald', isOnline: true };
    }
    if (todayAtt && todayAtt.checkOut) {
      return { status: 'Shift Finished', text: `Out at ${todayAtt.checkOut}`, color: 'slate', isOnline: false };
    }
    return { status: 'Offline', text: 'Not punched in yet', color: 'slate', isOnline: false };
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const live = getEmployeeLiveStatus(emp.id);
    const matchesSearch = 
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;

    let matchesTab = true;
    if (selectedStatusTab === 'online') {
      matchesTab = live.isOnline;
    } else if (selectedStatusTab === 'onleave') {
      matchesTab = live.status === 'On Leave';
    } else if (selectedStatusTab === 'employee_role') {
      matchesTab = emp.role === 'employee';
    }

    return matchesSearch && matchesDept && matchesTab;
  });

  const onlineCount = employees.filter(e => getEmployeeLiveStatus(e.id).isOnline).length;
  const onLeaveCount = employees.filter(e => getEmployeeLiveStatus(e.id).status === 'On Leave').length;
  const staffRoleCount = employees.filter(e => e.role === 'employee').length;

  const handleLoginAs = (emp) => {
    loginAsUser(emp);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    navigate('/employee');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.designation) {
      alert('Please fill all required fields');
      return;
    }
    addEmployee(form);
    setIsAddModalOpen(false);
    setForm({
      name: '',
      email: '',
      department: 'Engineering',
      designation: '',
      salary: 75000,
      phone: '+1 (555) 123-4567',
      location: 'San Francisco HQ',
      role: 'employee'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingEmp) return;
    updateEmployee(editingEmp.id, editingEmp);
    setEditingEmp(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the employee directory?`)) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl brand-gradient p-6 sm:p-8 text-white shadow-glow">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
              <Users size={14} className="text-amber-300" />
              <span>Full Organization Team & Active Logins</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
              All Employees & Staff Members
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              Directory of all registered employees, live shift statuses, department mapping, and 1-click employee portal login.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-indigo-700 shadow-md hover:bg-indigo-50 transition"
            >
              <Plus size={16} /> Add New Employee
            </button>
          </div>
        </div>
      </div>

      {/* Live Status Metric Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setSelectedStatusTab('all')}
          className={`flex flex-col rounded-2xl p-4 text-left border transition ${
            selectedStatusTab === 'all'
              ? 'bg-indigo-50/80 border-indigo-300 dark:bg-indigo-950/50 dark:border-indigo-700 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Workforce</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{employees.length}</span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">Show All Members</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('online')}
          className={`flex flex-col rounded-2xl p-4 text-left border transition ${
            selectedStatusTab === 'online'
              ? 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Logged In Today
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{onlineCount}</span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold mt-1">Active Shifts</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('employee_role')}
          className={`flex flex-col rounded-2xl p-4 text-left border transition ${
            selectedStatusTab === 'employee_role'
              ? 'bg-blue-50/80 border-blue-300 dark:bg-blue-950/50 dark:border-blue-700 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Employee Role</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{staffRoleCount}</span>
          <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold mt-1">Staff Accounts</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('onleave')}
          className={`flex flex-col rounded-2xl p-4 text-left border transition ${
            selectedStatusTab === 'onleave'
              ? 'bg-purple-50/80 border-purple-300 dark:bg-purple-950/50 dark:border-purple-700 shadow-sm'
              : 'bg-white border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">On Leave</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{onLeaveCount}</span>
          <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold mt-1">Approved Time-Off</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, title, email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-white shadow-sm dark:bg-slate-700 text-indigo-600 dark:text-white' : 'text-slate-400'}`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'table' ? 'bg-white shadow-sm dark:bg-slate-700 text-indigo-600 dark:text-white' : 'text-slate-400'}`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => {
            const live = getEmployeeLiveStatus(emp.id);

            return (
              <div
                key={emp.id}
                className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Avatar & Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                        />
                        {live.isOnline && (
                          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Active Shift" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          {emp.name}
                          {emp.role === 'admin' && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                              ADMIN
                            </span>
                          )}
                        </h3>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {emp.designation}
                        </p>
                        <span className="inline-block text-[10px] text-slate-400 font-mono mt-0.5">
                          {emp.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Live Shift Status Banner */}
                  <div className="mt-4 rounded-xl p-2.5 text-xs font-medium flex items-center justify-between border bg-slate-50/70 border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Today's Shift:</span>
                    <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] ${
                      live.color === 'emerald'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : live.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${live.color === 'emerald' ? 'bg-emerald-500' : live.color === 'purple' ? 'bg-purple-500' : 'bg-slate-400'}`} />
                      {live.text}
                    </span>
                  </div>

                  {/* Info Rows */}
                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-slate-400" />
                      <span>{emp.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{emp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      ${emp.salary.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/yr</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingEmp(emp)}
                        className="rounded-xl p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                        title="Edit Employee"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(emp.id, emp.name)}
                        className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Remove Employee"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Login As This Employee */}
                  <button
                    type="button"
                    onClick={() => handleLoginAs(emp)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition shadow-sm"
                  >
                    <LogIn size={14} />
                    <span>Login As {emp.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Employee</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Department</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Role</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Today's Shift</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider">Salary</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredEmployees.map((emp) => {
                  const live = getEmployeeLiveStatus(emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="h-9 w-9 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{emp.name}</p>
                            <p className="text-[10px] text-slate-400">{emp.email} • {emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {emp.department}
                      </td>
                      <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {emp.designation}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          live.color === 'emerald'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                            : live.color === 'purple'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${live.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {live.text}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        ${emp.salary.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleLoginAs(emp)}
                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950 dark:text-indigo-400 transition"
                          >
                            <LogIn size={13} /> Login As
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingEmp(emp)}
                            className="rounded-lg p-1 text-slate-400 hover:text-indigo-600"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(emp.id, emp.name)}
                            className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        subtitle="Register new team member profile"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Liam Smith"
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="liam.smith@dayflow.io"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Quality Assurance">Quality Assurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. UX Designer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Annual Salary ($)
              </label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl brand-gradient px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95"
            >
              Save Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      {editingEmp && (
        <Modal
          isOpen={Boolean(editingEmp)}
          onClose={() => setEditingEmp(null)}
          title="Edit Employee Information"
          subtitle={`Updating record for ${editingEmp.name}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingEmp.name}
                  onChange={(e) => setEditingEmp({ ...editingEmp, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={editingEmp.designation}
                  onChange={(e) => setEditingEmp({ ...editingEmp, designation: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={editingEmp.department}
                  onChange={(e) => setEditingEmp({ ...editingEmp, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Salary ($)
                </label>
                <input
                  type="number"
                  value={editingEmp.salary}
                  onChange={(e) => setEditingEmp({ ...editingEmp, salary: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingEmp(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl brand-gradient px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
