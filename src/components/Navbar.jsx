import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

const links = [
  { to: '/search', label: 'Заңгерлер' },
  { to: '/students', label: 'Студенттер' },
  { to: '/docgen', label: 'Құжат жасау' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200 transition-shadow ${
        scrolled ? 'shadow-soft' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-100 text-navy'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy to-brand-blue text-white flex items-center justify-center text-xs font-semibold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-sm">
                Шығу
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                Кіру
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Тіркелу
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-0.5 bg-navy transition ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 bg-navy transition ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-navy transition ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 py-4 flex flex-col gap-1 animate-fadeIn">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-slate-100 text-navy' : 'text-slate-600'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="h-px bg-slate-200 my-2" />
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600"
              >
                Менің кабинетім
              </Link>
              <button onClick={handleLogout} className="text-left px-4 py-2.5 text-sm text-red-600">
                Шығу
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600"
              >
                Кіру
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="btn-primary text-sm"
              >
                Тіркелу
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
