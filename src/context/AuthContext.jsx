import React, { createContext, useContext, useState, useCallback } from 'react';
import { ROLE_LABELS } from '@/lib/constants';
import { storage } from '@/lib/dataStore';
import { STORAGE_KEYS } from '@/lib/constants';


const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.AUTH, { user: null });    return saved?.user || null;
  });

  const login = useCallback((role, name) => {
    const staffNames = {
      admin: 'Admin User',
      clerk: 'Amaka Okoro',
      doctor: 'Dr. James Osei',
      lab: 'Kofi Mensah',
      pharmacy: 'Nana Yaa',
      nurse: 'Grace Adebayo',
      finance: 'Robert Kojo',
      secretary: 'Patience Obi',
      patient: 'John Patient',
    };

    const newUser = {
      id: `${role.toUpperCase()}_${Date.now()}`,
      name: name || staffNames[role] || ROLE_LABELS[role],
      role,
      email: `${role}@hospitalise.com`,
      avatar: '',
    };

    setUser(newUser);
    storage.set(STORAGE_KEYS.AUTH, { user: newUser });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.remove(STORAGE_KEYS.AUTH);
    window.location.href = '/login';
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const canAccess = useCallback((path) => {
    if (!user) return path === '/login' || path === '/';
    if (user.role === 'admin') return true;
    const rolePrefix = `/${user.role}`;
    return path.startsWith(rolePrefix) || path === '/profile' || path === '/settings' || path === '/notifications';
  }, [user]);
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
      canAccess,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
