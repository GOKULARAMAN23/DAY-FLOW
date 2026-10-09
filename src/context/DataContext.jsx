import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-1001',
    name: 'Sarah Jenkins',
    email: 'admin@dayflow.io',
    role: 'admin',
    designation: 'HR Operations Director',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    joinDate: '2022-01-15',
    status: 'Active',
    salary: 95000,
    location: 'San Francisco HQ',
    bankDetails: { account: '**** 8842', bank: 'Silicon Valley Bank', ifsc: 'SVB000142' }
  },
  {
    id: 'EMP-1002',
    name: 'Alex Rivera',
    email: 'alex.rivera@dayflow.io',
    role: 'employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    joinDate: '2023-03-10',
    status: 'Active',
    salary: 82000,
    location: 'San Francisco HQ',
    bankDetails: { account: '**** 9123', bank: 'Chase Bank', ifsc: 'CHAS000452' }
  },
  {
    id: 'EMP-1003',
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.io',
    role: 'employee',
    designation: 'Product Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    joinDate: '2023-06-01',
    status: 'Active',
    salary: 76000,
    location: 'Remote (New York)',
    bankDetails: { account: '**** 3381', bank: 'Citibank', ifsc: 'CITI000889' }
  },
  {
    id: 'EMP-1004',
    name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.io',
    role: 'employee',
    designation: 'DevOps & Cloud Architect',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901',
    joinDate: '2022-08-20',
    status: 'Active',
    salary: 88000,
    location: 'San Francisco HQ',
    bankDetails: { account: '**** 4429', bank: 'Wells Fargo', ifsc: 'WF000318' }
  },
  {
    id: 'EMP-1005',
    name: 'Elena Rostova',
    email: 'elena.rostova@dayflow.io',
    role: 'employee',
    designation: 'Marketing Lead',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-9012',
    joinDate: '2024-01-08',
    status: 'Active',
    salary: 72000,
    location: 'Austin Office',
    bankDetails: { account: '**** 7712', bank: 'Bank of America', ifsc: 'BOA000912' }
  },
  {
    id: 'EMP-1006',
    name: 'David Kim',
    email: 'david.kim@dayflow.io',
    role: 'employee',
    designation: 'QA Automation Engineer',
    department: 'Quality Assurance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-0123',
    joinDate: '2023-11-15',
    status: 'On Leave',
    salary: 68000,
    location: 'Remote (Seattle)',
    bankDetails: { account: '**** 6051', bank: 'US Bank', ifsc: 'USB000551' }
  }
];

const INITIAL_ATTENDANCE = [
  {
    id: 'ATT-201',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:05 AM',
    checkOut: null,
    status: 'Present',
    workHours: 'In Progress',
    location: 'Office (Biometric)',
    timeline: [
      { type: 'Check In', time: '09:05 AM', note: 'Regular punch-in' },
      { type: 'Break Start', time: '01:00 PM', note: 'Lunch break' },
      { type: 'Break End', time: '01:45 PM', note: 'Back at desk' }
    ]
  },
  {
    id: 'ATT-202',
    employeeId: 'EMP-1003',
    employeeName: 'Priya Sharma',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:55 AM',
    checkOut: null,
    status: 'Present',
    workHours: 'In Progress',
    location: 'Remote IP: 192.168.1.42',
    timeline: [
      { type: 'Check In', time: '08:55 AM', note: 'Remote web check-in' }
    ]
  },
  {
    id: 'ATT-203',
    employeeId: 'EMP-1004',
    employeeName: 'Marcus Vance',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:45 AM',
    checkOut: null,
    status: 'Late',
    workHours: 'In Progress',
    location: 'Office (Biometric)',
    timeline: [
      { type: 'Check In', time: '09:45 AM', note: 'Delayed transit' }
    ]
  },
  {
    id: 'ATT-204',
    employeeId: 'EMP-1005',
    employeeName: 'Elena Rostova',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00 AM',
    checkOut: null,
    status: 'Present',
    workHours: 'In Progress',
    location: 'Austin Hub',
    timeline: [
      { type: 'Check In', time: '09:00 AM', note: 'On time' }
    ]
  },
  {
    id: 'ATT-205',
    employeeId: 'EMP-1006',
    employeeName: 'David Kim',
    date: new Date().toISOString().split('T')[0],
    checkIn: null,
    checkOut: null,
    status: 'On Leave',
    workHours: '0h 0m',
    location: 'Approved Sick Leave',
    timeline: []
  },
  // Historical records for Alex Rivera (EMP-1002)
  {
    id: 'ATT-101',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    date: '2026-08-22',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    status: 'Present',
    workHours: '8h 30m',
    location: 'Office (Biometric)',
    timeline: [
      { type: 'Check In', time: '09:00 AM', note: 'Regular' },
      { type: 'Check Out', time: '05:30 PM', note: 'Day completed' }
    ]
  },
  {
    id: 'ATT-102',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    date: '2026-08-21',
    checkIn: '08:58 AM',
    checkOut: '05:15 PM',
    status: 'Present',
    workHours: '8h 17m',
    location: 'Office (Biometric)',
    timeline: [
      { type: 'Check In', time: '08:58 AM', note: 'Regular' },
      { type: 'Check Out', time: '05:15 PM', note: 'Regular' }
    ]
  },
  {
    id: 'ATT-103',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    date: '2026-08-20',
    checkIn: '09:35 AM',
    checkOut: '06:10 PM',
    status: 'Late',
    workHours: '8h 35m',
    location: 'Office (Biometric)',
    timeline: [
      { type: 'Check In', time: '09:35 AM', note: 'Traffic' },
      { type: 'Check Out', time: '06:10 PM', note: 'Extended' }
    ]
  },
  {
    id: 'ATT-104',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    date: '2026-08-19',
    checkIn: '09:02 AM',
    checkOut: '01:30 PM',
    status: 'Half Day',
    workHours: '4h 28m',
    location: 'Office (Biometric)',
    timeline: [
      { type: 'Check In', time: '09:02 AM', note: 'Morning shift' },
      { type: 'Check Out', time: '01:30 PM', note: 'Personal half-day' }
    ]
  },
  {
    id: 'ATT-105',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    date: '2026-08-18',
    checkIn: '08:50 AM',
    checkOut: '05:00 PM',
    status: 'Present',
    workHours: '8h 10m',
    location: 'Remote IP: 192.168.1.42',
    timeline: [
      { type: 'Check In', time: '08:50 AM', note: 'Remote' },
      { type: 'Check Out', time: '05:00 PM', note: 'Regular' }
    ]
  }
];

const INITIAL_LEAVES = [
  {
    id: 'LEV-301',
    employeeId: 'EMP-1006',
    employeeName: 'David Kim',
    leaveType: 'Sick Leave',
    startDate: '2026-08-23',
    endDate: '2026-08-24',
    days: 2,
    reason: 'Severe seasonal flu and high fever. Doctor recommended 2 days rest.',
    status: 'Approved',
    appliedOn: '2026-08-22',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-08-22'
  },
  {
    id: 'LEV-302',
    employeeId: 'EMP-1003',
    employeeName: 'Priya Sharma',
    leaveType: 'Casual Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    days: 2,
    reason: 'Family anniversary gathering out of state.',
    status: 'Pending',
    appliedOn: '2026-08-23',
    reviewedBy: null,
    reviewedOn: null
  },
  {
    id: 'LEV-303',
    employeeId: 'EMP-1004',
    employeeName: 'Marcus Vance',
    leaveType: 'Paid Vacation',
    startDate: '2026-09-05',
    endDate: '2026-09-12',
    days: 6,
    reason: 'Annual family summer vacation.',
    status: 'Pending',
    appliedOn: '2026-08-23',
    reviewedBy: null,
    reviewedOn: null
  },
  {
    id: 'LEV-304',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    leaveType: 'Casual Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    days: 2,
    reason: 'Home relocation and setup.',
    status: 'Approved',
    appliedOn: '2026-07-10',
    reviewedBy: 'Sarah Jenkins',
    reviewedOn: '2026-07-11'
  }
];

const INITIAL_PAYROLL = [
  {
    id: 'PAY-401',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    designation: 'Senior Frontend Engineer',
    month: 'August 2026',
    basicSalary: 4500,
    hra: 1500,
    allowance: 833,
    bonus: 250,
    pfDeduction: 350,
    taxDeduction: 480,
    netPay: 6253,
    paymentDate: '2026-08-31',
    status: 'Scheduled',
    payMethod: 'Direct Deposit'
  },
  {
    id: 'PAY-402',
    employeeId: 'EMP-1002',
    employeeName: 'Alex Rivera',
    designation: 'Senior Frontend Engineer',
    month: 'July 2026',
    basicSalary: 4500,
    hra: 1500,
    allowance: 833,
    bonus: 0,
    pfDeduction: 350,
    taxDeduction: 450,
    netPay: 6033,
    paymentDate: '2026-07-31',
    status: 'Paid',
    payMethod: 'Direct Deposit'
  },
  {
    id: 'PAY-403',
    employeeId: 'EMP-1003',
    employeeName: 'Priya Sharma',
    designation: 'Product Designer',
    month: 'August 2026',
    basicSalary: 4200,
    hra: 1400,
    allowance: 733,
    bonus: 0,
    pfDeduction: 320,
    taxDeduction: 410,
    netPay: 5603,
    paymentDate: '2026-08-31',
    status: 'Scheduled',
    payMethod: 'Direct Deposit'
  },
  {
    id: 'PAY-404',
    employeeId: 'EMP-1004',
    employeeName: 'Marcus Vance',
    designation: 'DevOps & Cloud Architect',
    month: 'August 2026',
    basicSalary: 4800,
    hra: 1600,
    allowance: 933,
    bonus: 500,
    pfDeduction: 380,
    taxDeduction: 520,
    netPay: 6933,
    paymentDate: '2026-08-31',
    status: 'Scheduled',
    payMethod: 'Direct Deposit'
  }
];

const INITIAL_ACTIVITIES = [
  { id: 'ACT-1', title: 'Leave Request Approved', user: 'Sarah Jenkins (Admin)', desc: 'Approved David Kim\'s sick leave', time: '15 minutes ago', type: 'leave' },
  { id: 'ACT-2', title: 'New Punch Recorded', user: 'Alex Rivera', desc: 'Checked in at 09:05 AM via Biometrics', time: '1 hour ago', type: 'attendance' },
  { id: 'ACT-3', title: 'Leave Application Filed', user: 'Priya Sharma', desc: 'Applied for 2 days Casual Leave', time: '2 hours ago', type: 'leave' },
  { id: 'ACT-4', title: 'Monthly Payroll Generated', user: 'System Automated', desc: 'August 2026 payslips drafted for 6 employees', time: '1 day ago', type: 'payroll' },
  { id: 'ACT-5', title: 'Employee Profile Updated', user: 'Marcus Vance', desc: 'Updated emergency contact information', time: '2 days ago', type: 'profile' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'NOTIF-1', title: 'Leave Approved', message: 'Your casual leave for Jul 15-16 was approved by HR.', time: '1 day ago', read: false, type: 'success' },
  { id: 'NOTIF-2', title: 'Payroll Slips Ready', message: 'July 2026 payslip is available to download.', time: '2 days ago', read: false, type: 'info' },
  { id: 'NOTIF-3', title: 'Holiday Notice', message: 'Office will remain closed on Labor Day, Sep 1.', time: '3 days ago', read: true, type: 'announcement' }
];

export function DataProvider({ children }) {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [payroll, setPayroll] = useState(() => {
    const saved = localStorage.getItem('dayflow_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('dayflow_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('dayflow_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('dayflow_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('dayflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Attendance punch helper
  const punchCheckIn = (employeeId, employeeName, notes = 'Standard Web Punch') => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if record already exists for today
    const existingIndex = attendance.findIndex(a => a.employeeId === employeeId && a.date === today);
    let updated;

    if (existingIndex >= 0) {
      updated = [...attendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        checkIn: nowTime,
        status: 'Present',
        workHours: 'In Progress',
        timeline: [
          ...(updated[existingIndex].timeline || []),
          { type: 'Check In', time: nowTime, note: notes }
        ]
      };
    } else {
      const newRecord = {
        id: `ATT-${Date.now()}`,
        employeeId,
        employeeName,
        date: today,
        checkIn: nowTime,
        checkOut: null,
        status: 'Present',
        workHours: 'In Progress',
        location: 'Web Portal',
        timeline: [{ type: 'Check In', time: nowTime, note: notes }]
      };
      updated = [newRecord, ...attendance];
    }

    setAttendance(updated);

    // Add activity
    addActivity({
      title: 'Clock In Recorded',
      user: employeeName,
      desc: `Punched in at ${nowTime}`,
      type: 'attendance'
    });

    return updated;
  };

  const punchCheckOut = (employeeId, employeeName) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = attendance.map(rec => {
      if (rec.employeeId === employeeId && rec.date === today) {
        return {
          ...rec,
          checkOut: nowTime,
          workHours: '8h 15m',
          timeline: [
            ...(rec.timeline || []),
            { type: 'Check Out', time: nowTime, note: 'End of work day' }
          ]
        };
      }
      return rec;
    });

    setAttendance(updated);

    addActivity({
      title: 'Clock Out Recorded',
      user: employeeName,
      desc: `Punched out at ${nowTime}`,
      type: 'attendance'
    });
  };

  const punchBreak = (employeeId, breakType = 'Break Start') => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = attendance.map(rec => {
      if (rec.employeeId === employeeId && rec.date === today) {
        return {
          ...rec,
          timeline: [
            ...(rec.timeline || []),
            { type: breakType, time: nowTime, note: breakType === 'Break Start' ? 'Coffee / Lunch' : 'Resumed work' }
          ]
        };
      }
      return rec;
    });

    setAttendance(updated);
  };

  // Leave Management
  const applyLeave = (leaveData) => {
    const newLeave = {
      id: `LEV-${Date.now()}`,
      ...leaveData,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      reviewedBy: null,
      reviewedOn: null
    };

    setLeaves([newLeave, ...leaves]);

    addActivity({
      title: 'New Leave Request',
      user: leaveData.employeeName,
      desc: `Applied for ${leaveData.days} days ${leaveData.leaveType}`,
      type: 'leave'
    });

    addNotification({
      title: 'Leave Submitted',
      message: `Your request for ${leaveData.leaveType} (${leaveData.days} days) has been submitted for HR approval.`,
      type: 'info'
    });

    return newLeave;
  };

  const updateLeaveStatus = (leaveId, status, reviewerName = 'Sarah Jenkins') => {
    const updated = leaves.map(l => {
      if (l.id === leaveId) {
        return {
          ...l,
          status,
          reviewedBy: reviewerName,
          reviewedOn: new Date().toISOString().split('T')[0]
        };
      }
      return l;
    });

    setLeaves(updated);

    const targetLeave = leaves.find(l => l.id === leaveId);
    if (targetLeave) {
      addActivity({
        title: `Leave ${status}`,
        user: reviewerName,
        desc: `${status} ${targetLeave.leaveType} for ${targetLeave.employeeName}`,
        type: 'leave'
      });

      addNotification({
        title: `Leave ${status}`,
        message: `Your ${targetLeave.leaveType} request was ${status.toLowerCase()} by HR.`,
        type: status === 'Approved' ? 'success' : 'alert'
      });
    }
  };

  // Employee CRUD
  const addEmployee = (employeeData) => {
    const newEmp = {
      id: `EMP-${1000 + employees.length + 1}`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + employees.length}?w=150&auto=format&fit=crop&q=80`,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      bankDetails: { account: '**** 1100', bank: 'Standard Chartered', ifsc: 'SCBL00021' },
      ...employeeData
    };

    setEmployees([...employees, newEmp]);

    addActivity({
      title: 'New Employee Added',
      user: 'HR Admin',
      desc: `Registered ${newEmp.name} as ${newEmp.designation}`,
      type: 'employee'
    });

    return newEmp;
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
  };

  const deleteEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(employees.filter(e => e.id !== id));
    if (emp) {
      addActivity({
        title: 'Employee Removed',
        user: 'HR Admin',
        desc: `Archived record for ${emp.name}`,
        type: 'employee'
      });
    }
  };

  // Activity logger
  const addActivity = (act) => {
    const newAct = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      ...act
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  // Notification
  const addNotification = (notif) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    localStorage.removeItem('dayflow_employees');
    localStorage.removeItem('dayflow_attendance');
    localStorage.removeItem('dayflow_leaves');
    localStorage.removeItem('dayflow_payroll');
    localStorage.removeItem('dayflow_activities');
    localStorage.removeItem('dayflow_notifications');
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setPayroll(INITIAL_PAYROLL);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <DataContext.Provider value={{
      employees,
      attendance,
      leaves,
      payroll,
      activities,
      notifications,
      punchCheckIn,
      punchCheckOut,
      punchBreak,
      applyLeave,
      updateLeaveStatus,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addActivity,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      resetToDefaultData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
