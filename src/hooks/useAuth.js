'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const USERS = {
  'فواز':        { password: '123',    color: '#2563eb' },
  'خالد':        { password: '1234',   color: '#7c3aed' },
  'محمد العنزي': { password: '12345',  color: '#059669' },
  'احمد':        { password: '123456', color: '#d97706' },
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // AUTO-LOGIN FOR PUBLIC ACCESS
    const publicUser = { name: 'زائر', mode: 'edit', color: '#2563eb' };
    setUser(publicUser);
    setIsLoaded(true);
  }, []);

  const login = (name, password, mode) => {
    const userConf = USERS[name];
    if (!userConf) return { ok: false, error: 'المستخدم غير موجود' };
    if (userConf.password !== password) return { ok: false, error: 'كلمة السر غير صحيحة' };
    const userData = { name, mode, color: userConf.color };
    localStorage.setItem('frame_user_v2', JSON.stringify(userData));
    setUser(userData);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem('frame_user_v2');
    setUser(null);
  };

  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      canEdit: user?.mode === 'edit',
      userNames: Object.keys(USERS),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
