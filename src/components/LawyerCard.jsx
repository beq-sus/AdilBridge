import { Link, useNavigate, useLocation } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { BADGE_LABELS } from '../data/lawyers.js';
import { useChat } from '../context/ChatContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUserData } from '../context/UserDataContext.jsx';

export default function LawyerCard({ lawyer }) {
  const { openChat } = useChat();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, addConsultation } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();

  const stars = Math.round(lawyer.rating);
  const favored = user ? isFavorite(lawyer.id) : false;

  const requireLogin = (action) => {
    toast(`${action} үшін жүйеге кіріңіз`, 'info');
    navigate('/login', { state: { from: location.pathname + location.search } });
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

  return (
    <div className="card p-5 flex flex-col gap-4 hover:-translate-y-0.5 duration-200 relative">
      <button
        onClick={handleFavorite}
        aria-label="Сақтау"
        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition text-lg ${
          favored
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-slate-50 text-slate-300 hover:text-red-400 hover:bg-red-50'
        }`}
      >
        {favored ? '❤️' : '🤍'}
      </button>

      <div className="flex items-start gap-3 pr-10">
        <Avatar initials={lawyer.initials} gradient={lawyer.gradient} online={lawyer.online} size="md" />
        <div className="flex-1 min-w-0">
          <Link
            to={`/lawyer/${lawyer.id}`}
            className="block font-semibold text-navy hover:text-brand-blue truncate"
          >
            {lawyer.name}
          </Link>
          <div className="text-xs text-slate-500 mt-0.5">
            {lawyer.spec} · {lawyer.location}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {lawyer.badges.map((b) => (
              <span
                key={b}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${BADGE_LABELS[b]?.cls || 'bg-slate-100 text-slate-700'}`}
              >
                {BADGE_LABELS[b]?.label || b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 text-center">
        <Stat value={lawyer.exp} label="жыл" />
        <Stat value={lawyer.cases} label="іс" />
        <Stat value={lawyer.reviews} label="пікір" />
      </div>

      <div className="flex items-center gap-2">
        <div className="text-amber-500 text-sm">
          {'★'.repeat(stars)}
          <span className="text-slate-300">{'★'.repeat(5 - stars)}</span>
        </div>
        <span className="text-sm font-semibold text-navy">{lawyer.rating}</span>
        <span className="text-xs text-slate-400">({lawyer.reviews} пікір)</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {lawyer.tags.slice(0, 3).map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <div className="font-display text-lg font-bold text-navy">
            {lawyer.price.toLocaleString('kk-KZ')}₸
          </div>
          <div className="text-[11px] text-slate-500">консультация</div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleChat} className="btn-primary text-xs px-3.5 py-2">
            💬 Чат
          </button>
          <button
            onClick={handleConsult}
            className="btn-outline text-xs px-3 py-2"
            title="Консультация сұрау"
          >
            📅
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="font-display font-bold text-navy">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
