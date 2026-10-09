import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

const DEMO_USERS = {
  admin: {
    id: 'EMP-1001',
    name: 'Sarah Jenkins',
    email: 'admin@dayflow.io',
    role: 'admin',
    designation: 'HR Operations Director',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  employee: {
    id: 'EMP-1002',
    name: 'Alex Rivera',
    email: 'alex.rivera@dayflow.io',
    role: 'employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedRole = localStorage.getItem('dayflow_role');
    const savedId = localStorage.getItem('dayflow_user_id');
    const savedName = localStorage.getItem('dayflow_name');
    const savedEmail = localStorage.getItem('dayflow_email');
    const savedDesignation = localStorage.getItem('dayflow_designation');
    const savedDepartment = localStorage.getItem('dayflow_department');
    const savedAvatar = localStorage.getItem('dayflow_avatar');

    if (savedRole && savedEmail) {
      return {
        id: savedId || (savedRole === 'admin' ? 'EMP-1001' : 'EMP-1002'),
        name: savedName || (savedRole === 'admin' ? 'Sarah Jenkins' : 'Alex Rivera'),
        email: savedEmail,
        role: savedRole,
        designation: savedDesignation || (savedRole === 'admin' ? 'HR Operations Director' : 'Senior Frontend Engineer'),
        department: savedDepartment || (savedRole === 'admin' ? 'Human Resources' : 'Engineering'),
        avatar: savedAvatar || (savedRole === 'admin' ? DEMO_USERS.admin.avatar : DEMO_USERS.employee.avatar),
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const saveUserSession = (user) => {
    setCurrentUser(user);
    localStorage.setItem('dayflow_role', user.role);
    localStorage.setItem('dayflow_user_id', user.id);
    localStorage.setItem('dayflow_name', user.name);
    localStorage.setItem('dayflow_email', user.email);
    localStorage.setItem('dayflow_designation', user.designation || 'Staff Member');
    localStorage.setItem('dayflow_department', user.department || 'General');
    localStorage.setItem('dayflow_avatar', user.avatar || '');
  };

  const login = async (email, password, roleHint = 'employee') => {
    setLoading(true);
    try {
      let userObj;
      if (email.toLowerCase().includes('admin') || roleHint === 'admin') {
        userObj = { ...DEMO_USERS.admin, email };
      } else {
        userObj = { ...DEMO_USERS.employee, email };
      }
      
      saveUserSession(userObj);
      return { success: true, user: userObj };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (role = 'admin') => {
    const userObj = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.employee;
    saveUserSession(userObj);
    return userObj;
  };

  const loginAsUser = (userObj) => {
    saveUserSession(userObj);
    return userObj;
  };

  const signup = async ({ name, email, password, role = 'employee', department = 'Engineering', designation = 'Software Specialist' }) => {
    setLoading(true);
    try {
      const newUser = {
        id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        email,
        role,
        department,
        designation,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
      saveUserSession(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('dayflow_role');
    localStorage.removeItem('dayflow_user_id');
    localStorage.removeItem('dayflow_name');
    localStorage.removeItem('dayflow_email');
    localStorage.removeItem('dayflow_designation');
    localStorage.removeItem('dayflow_department');
    localStorage.removeItem('dayflow_avatar');
    setCurrentUser(null);
  };

  const updateUserProfile = (data) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    saveUserSession(updated);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: currentUser?.role || null,
      isAuthenticated: Boolean(currentUser),
      loading,
      login,
      quickDemoLogin,
      loginAsUser,
      signup,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
