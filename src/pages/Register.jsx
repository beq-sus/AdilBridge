import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const u = register(form);
      toast(`Тіркелдіңіз, ${u.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      <div className="md:flex-1 flex items-center justify-center p-8 md:p-14 order-2 md:order-1">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">Жаңа аккаунт</h1>
            <p className="text-sm text-slate-500 mt-1">
              Аккаунт бар ма?{' '}
              <Link to="/login" className="text-brand-blue font-medium hover:underline">
                Кіру
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
              Мен
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {[
                { v: 'client', l: 'Қолданушы', i: '👤' },
                { v: 'lawyer', l: 'Заңгер', i: '⚖️' },
                { v: 'student', l: 'Студент', i: '🎓' },
              ].map((r) => (
                <button
                  key={r.v}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.v })}
                  className={`py-3 rounded-lg text-xs font-medium border transition ${
                    form.role === r.v
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-navy'
                  }`}
                >
                  <div className="text-lg mb-0.5">{r.i}</div>
                  {r.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Аты-жөніңіз
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Айгерім Нұрланова"
              className="input-base mt-1.5"
            />
          </div>
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
              placeholder="Кемінде 4 символ"
              className="input-base mt-1.5"
            />
          </div>

          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Тіркелуде...' : 'Тіркелу'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Тіркелу арқылы сіз{' '}
            <a href="#" className="underline">Пайдалану шарттарын</a> және{' '}
            <a href="#" className="underline">Құпиялылық саясатын</a> қабылдайсыз.
          </p>
        </form>
      </div>

      <div className="md:flex-1 bg-gradient-to-br from-navy via-navy-mid to-brand-blue p-8 md:p-14 flex flex-col justify-between text-white order-1 md:order-2">
        <Link to="/"><Logo light /></Link>
        <div className="max-w-md py-12 md:py-0">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Қоғамдастыққа қосылыңыз
          </h2>
          <p className="text-white/70 leading-relaxed">
            AdilBridge — Қазақстандағы заңгер табу платформасы. Тіркеліп
            дербестендірілген кеңес алыңыз немесе заңгер ретінде жұмыс
            бастаңыз.
          </p>
        </div>
        <div className="text-xs text-white/40">© 2026 AdilBridge</div>
      </div>
    </section>
  );
}

function Stat({ v, l }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-accent">{v}</div>
      <div className="text-xs text-white/50">{l}</div>
    </div>
  );
}
