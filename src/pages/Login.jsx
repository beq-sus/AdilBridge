import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const u = login(form);
      toast(`Қош келдіңіз, ${u.name}!`);
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      <div className="md:flex-1 bg-gradient-to-br from-navy via-navy-mid to-brand-blue p-8 md:p-14 flex flex-col justify-between text-white">
        <Link to="/"><Logo light /></Link>
        <div className="max-w-md py-12 md:py-0">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Қайта қош келдіңіз!
          </h2>
          <p className="text-white/70 leading-relaxed">
            Кіріп, сауалдарыңыздың тарихын, сұхбаттарыңызды және
            заңгерлермен хаттасуыңызды көріңіз.
          </p>
          <div className="mt-10 space-y-3 text-sm">
            <FeatureCheck>Барлық консультациялардың тарихы</FeatureCheck>
            <FeatureCheck>Жеке кабинет және құжаттар</FeatureCheck>
            <FeatureCheck>Анонимді режимді басқару</FeatureCheck>
          </div>
        </div>
        <div className="text-xs text-white/40">© 2026 AdilBridge</div>
      </div>

      <div className="md:flex-1 flex items-center justify-center p-8 md:p-14">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">Жүйеге кіру</h1>
            <p className="text-sm text-slate-500 mt-1">
              Аккаунтыңыз жоқ па?{' '}
              <Link to="/register" className="text-brand-blue font-medium hover:underline">
                Тіркелу
              </Link>
            </p>
          </div>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {err}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="input-base mt-1.5"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Құпиясөз
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="input-base mt-1.5"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Тексерілуде...' : 'Кіру'}
          </button>

          <div className="text-center text-xs text-slate-400 pt-2">
            Немесе жылдам тіркелу
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-outline py-2.5 text-sm">
              🔐 Google
            </button>
            <button type="button" className="btn-outline py-2.5 text-sm">
              📧 Apple
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FeatureCheck({ children }) {
  return (
    <div className="flex items-center gap-2.5 text-white/80">
      <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs flex items-center justify-center">
        ✓
      </div>
      {children}
    </div>
  );
}
