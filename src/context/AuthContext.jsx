import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'adilbridge.user';
const DB_KEY = 'adilbridge.users';

function readDB() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeDB(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = ({ email, password }) => {
    const users = readDB();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Қате электрондық пошта немесе құпиясөз');
    const { password: _pw, ...safe } = found;
    setUser(safe);
    return safe;
  };

  const register = ({ name, email, password, role = 'client' }) => {
    const users = readDB();
    if (users.some((u) => u.email === email)) {
      throw new Error('Бұл email тіркелген');
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeDB(users);
    const { password: _pw, ...safe } = newUser;
    setUser(safe);
    return safe;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    const users = readDB();
    const idx = users.findIndex((u) => u.id === user?.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      writeDB(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
