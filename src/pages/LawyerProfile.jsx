import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { LAWYERS, BADGE_LABELS, REVIEWS } from '../data/lawyers.js';
import { useChat } from '../context/ChatContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUserData } from '../context/UserDataContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function LawyerProfile() {
  const { id } = useParams();
  const { openChat } = useChat();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, addConsultation } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();
  const lawyer = LAWYERS.find((l) => l.id === Number(id));
  const favored = user && lawyer ? isFavorite(lawyer.id) : false;

  const requireLogin = (action) => {
    toast(`${action} үшін жүйеге кіріңіз`, 'info');
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleChat = () => {
    if (!user) return requireLogin('Чат');
    openChat(lawyer);
  };

  const handleConsult = () => {
    if (!user) return requireLogin('Консультация');
    addConsultation(lawyer);
    toast(`${lawyer.name} — консультация сұратылды`);
  };

  const handleFavorite = () => {
    if (!user) return requireLogin('Сақтау');
    toggleFavorite(lawyer.id);
    toast(favored ? 'Таңдаулылардан алынды' : 'Таңдаулыларға қосылды');
  };

  if (!lawyer) {
    return (
      <div className="min-h-screen pt-32 px-5 text-center">
        <h1 className="text-2xl font-display font-bold text-navy">Табылмады</h1>
        <Link to="/search" className="btn-primary mt-4 inline-flex">← Іздеуге қайту</Link>
      </div>
    );
  }

  const stars = Math.round(lawyer.rating);
  const related = LAWYERS.filter((l) => l.spec === lawyer.spec && l.id !== lawyer.id).slice(0, 3);

  return (
    <section className="pt-28 pb-20 px-5 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <Link to="/search" className="text-sm text-slate-500 hover:text-navy inline-flex items-center gap-1 mb-5">
          ← Заңгерлерге оралу
        </Link>

        <div className="card p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar initials={lawyer.initials} gradient={lawyer.gradient} size="xl" online={lawyer.online} />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {lawyer.badges.map((b) => (
                  <span
                    key={b}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${BADGE_LABELS[b]?.cls}`}
                  >
                    {BADGE_LABELS[b]?.label}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">
                {lawyer.name}
              </h1>
              <div className="text-slate-500 mt-1">
                {lawyer.spec} · {lawyer.location}
              </div>
              {lawyer.university && (
                <div className="text-sm text-indigo-600 mt-1">🎓 {lawyer.university}</div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <div className="text-amber-500">
                  {'★'.repeat(stars)}<span className="text-slate-300">{'★'.repeat(5 - stars)}</span>
                </div>
                <span className="font-semibold text-navy">{lawyer.rating}</span>
                <span className="text-sm text-slate-500">({lawyer.reviews} пікір)</span>
              </div>

              <p className="text-slate-600 mt-5 leading-relaxed">{lawyer.about}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {lawyer.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>

            <div className="md:w-60 shrink-0 md:border-l md:border-slate-200 md:pl-6 flex flex-col gap-3">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Бағасы</div>
                <div className="font-display text-3xl font-bold text-navy">
                  {lawyer.price.toLocaleString('kk-KZ')}₸
                </div>
                <div className="text-xs text-slate-500">консультация</div>
              </div>
              <button onClick={handleChat} className="btn-primary">
                💬 Чат бастау
              </button>
              <button onClick={handleConsult} className="btn-gold">
                📅 Консультация
              </button>
              <button
                onClick={handleFavorite}
                className={`py-2 px-4 rounded-lg text-sm font-medium border transition ${
                  favored
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-red-300'
                }`}
              >
                {favored ? '❤️ Сақталған' : '🤍 Сақтау'}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
            <InfoStat value={`${lawyer.exp} жыл`} label="Тәжірибе" />
            <InfoStat value={lawyer.cases} label="Шешілген іс" />
            <InfoStat value={lawyer.reviews} label="Пікір саны" />
          </div>
        </div>

        {/* Reviews */}
        <div className="card p-6 md:p-8 mt-6">
          <h2 className="font-display text-xl font-bold text-navy mb-4">Пікірлер</h2>
          <div className="space-y-4">
            {REVIEWS.map((r) => (
              <div key={r.id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-navy text-white text-sm flex items-center justify-center font-semibold shrink-0">
                  {r.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy">{r.user}</span>
                    <span className="text-amber-500 text-xs">{'★'.repeat(Math.round(r.rating))}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-navy mb-4">Ұқсас заңгерлер</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((l) => (
                <Link
                  key={l.id}
                  to={`/lawyer/${l.id}`}
                  className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 duration-200"
                >
                  <Avatar initials={l.initials} gradient={l.gradient} size="sm" />
                  <div className="min-w-0">
                    <div className="font-medium text-navy truncate">{l.name}</div>
                    <div className="text-xs text-slate-500">{l.spec}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoStat({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl font-bold text-navy">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
