import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import AdminAttendance from './pages/admin/AdminAttendance';
import LeaveRequests from './pages/admin/LeaveRequests';
import AdminPayroll from './pages/admin/AdminPayroll';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeLeaves from './pages/employee/EmployeeLeaves';
import EmployeePayroll from './pages/employee/EmployeePayroll';
import TeamDirectory from './pages/employee/TeamDirectory';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Route Guard
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin' : '/employee'} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="leaves" element={<LeaveRequests />} />
        <Route path="payroll" element={<AdminPayroll />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* EMPLOYEE ROUTES */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="leaves" element={<EmployeeLeaves />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="team" element={<TeamDirectory />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

      {/* Legacy or fallback catch-all */}
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
