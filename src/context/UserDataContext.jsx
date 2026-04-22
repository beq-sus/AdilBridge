import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';

const UserDataContext = createContext(null);

const EMPTY = {
  favorites: [],
  consultations: [],
  documents: [],
  profile: { phone: '', bio: '', city: '' },
};

function storageKey(userId) {
  return `adilbridge.userdata.${userId}`;
}

function load(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(EMPTY);

  useEffect(() => {
    if (user) setData(load(user.id));
    else setData(EMPTY);
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(storageKey(user.id), JSON.stringify(data));
  }, [data, user]);

  const toggleFavorite = useCallback((lawyerId) => {
    setData((d) => {
      const exists = d.favorites.includes(lawyerId);
      return {
        ...d,
        favorites: exists
          ? d.favorites.filter((id) => id !== lawyerId)
          : [...d.favorites, lawyerId],
      };
    });
  }, []);

  const addConsultation = useCallback((lawyer, note = '') => {
    setData((d) => ({
      ...d,
      consultations: [
        {
          id: Date.now(),
          lawyerId: lawyer.id,
          lawyerName: lawyer.name,
          lawyerInitials: lawyer.initials,
          lawyerGradient: lawyer.gradient,
          spec: lawyer.spec,
          price: lawyer.price,
          status: 'pending',
          note,
          createdAt: new Date().toISOString(),
        },
        ...d.consultations,
      ],
    }));
  }, []);

  const updateConsultationStatus = useCallback((id, status) => {
    setData((d) => ({
      ...d,
      consultations: d.consultations.map((c) =>
        c.id === id ? { ...c, status } : c,
      ),
    }));
  }, []);

  const removeConsultation = useCallback((id) => {
    setData((d) => ({
      ...d,
      consultations: d.consultations.filter((c) => c.id !== id),
    }));
  }, []);

  const addDocument = useCallback((doc) => {
    setData((d) => ({
      ...d,
      documents: [
        {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          ...doc,
        },
        ...d.documents,
      ],
    }));
  }, []);

  const removeDocument = useCallback((id) => {
    setData((d) => ({
      ...d,
      documents: d.documents.filter((x) => x.id !== id),
    }));
  }, []);

  const updateProfileExtra = useCallback((patch) => {
    setData((d) => ({
      ...d,
      profile: { ...d.profile, ...patch },
    }));
  }, []);

  const isFavorite = useCallback(
    (lawyerId) => data.favorites.includes(lawyerId),
    [data.favorites],
  );

  return (
    <UserDataContext.Provider
      value={{
        ...data,
        isFavorite,
        toggleFavorite,
        addConsultation,
        updateConsultationStatus,
        removeConsultation,
        addDocument,
        removeDocument,
        updateProfileExtra,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used inside UserDataProvider');
  return ctx;
}
