import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUserData } from '../context/UserDataContext.jsx';
import { useChat } from '../context/ChatContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { LAWYERS } from '../data/lawyers.js';
import Avatar from '../components/Avatar.jsx';

const ROLE_LABEL = {
  client: 'Қолданушы',
  lawyer: 'Заңгер',
  student: 'Студент заңгер',
};

const STATUS_LABEL = {
  pending: { text: 'Күтуде', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { text: 'Расталды', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { text: 'Аяқталды', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  cancelled: { text: 'Бас тартылды', cls: 'bg-red-50 text-red-700 border-red-200' },
};

const TABS = [
  { key: 'overview', label: 'Шолу', icon: '📊' },
  { key: 'favorites', label: 'Таңдаулылар', icon: '❤️' },
  { key: 'consultations', label: 'Консультациялар', icon: '📅' },
  { key: 'documents', label: 'Құжаттар', icon: '📄' },
  { key: 'profile', label: 'Профиль', icon: '👤' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const {
    favorites,
    consultations,
    documents,
  } = useUserData();

  const [tab, setTab] = useState('overview');

  return (
    <section className="pt-28 pb-20 px-5 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="card p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-brand-blue text-white text-2xl font-bold flex items-center justify-center">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">
                Сәлем, {user.name}!
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-slate-500">{user.email}</span>
                <span className="chip !bg-navy/5 !text-navy">
                  {ROLE_LABEL[user.role] || 'Қолданушы'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={logout} className="btn-outline text-sm">
            Шығу
          </button>
        </div>

        {/* Tab nav */}
        <div className="card p-2 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  tab === t.key
                    ? 'bg-navy text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1.5">{t.icon}</span>
                {t.label}
                {t.key === 'favorites' && favorites.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-white/20 rounded-full px-1.5 py-0.5">
                    {favorites.length}
                  </span>
                )}
                {t.key === 'consultations' && consultations.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-white/20 rounded-full px-1.5 py-0.5">
                    {consultations.length}
                  </span>
                )}
                {t.key === 'documents' && documents.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-white/20 rounded-full px-1.5 py-0.5">
                    {documents.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'overview' && <OverviewTab setTab={setTab} />}
        {tab === 'favorites' && <FavoritesTab />}
        {tab === 'consultations' && <ConsultationsTab />}
        {tab === 'documents' && <DocumentsTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
    </section>
  );
}

function OverviewTab({ setTab }) {
  const { favorites, consultations, documents } = useUserData();
  const activeConsults = consultations.filter((c) => c.status !== 'cancelled').length;

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon="❤️"
          label="Таңдаулылар"
          value={favorites.length}
          onClick={() => setTab('favorites')}
        />
        <StatCard
          icon="📅"
          label="Консультациялар"
          value={activeConsults}
          onClick={() => setTab('consultations')}
        />
        <StatCard
          icon="📄"
          label="Құжаттар"
          value={documents.length}
          onClick={() => setTab('documents')}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-navy">
              Соңғы белсенділік
            </h2>
          </div>
          {consultations.length === 0 && documents.length === 0 ? (
            <EmptyState
              emoji="🕒"
              title="Белсенділік жоқ"
              description="Заңгер тауып, консультация сұраңыз немесе құжат жасаңыз"
              cta={<Link to="/search" className="btn-primary mt-4 inline-flex">Заңгер табу</Link>}
            />
          ) : (
            <div className="space-y-3">
              {consultations.slice(0, 3).map((c) => (
                <ConsultationRow key={c.id} c={c} compact />
              ))}
              {documents.slice(0, 2).map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-navy text-sm">
                      {d.type} №{d.number}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(d.createdAt).toLocaleDateString('kk-KZ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-semibold text-navy mb-3">Жылдам әрекеттер</h3>
            <div className="space-y-2">
              <Link to="/search" className="btn-outline w-full text-sm justify-start">
                🔍 Заңгер табу
              </Link>
              <Link to="/docgen" className="btn-outline w-full text-sm justify-start">
                📄 Құжат жасау
              </Link>
              <Link to="/students" className="btn-outline w-full text-sm justify-start">
                🎓 Студенттерден кеңес
              </Link>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-accent to-accent-light text-navy">
            <h3 className="font-display font-bold text-lg">PRO аккаунт</h3>
            <p className="text-sm mt-1 text-navy/80">
              Шексіз хабарлама, артықшылықты қолдау және арнайы фильтрлер.
            </p>
            <button className="mt-4 bg-navy text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy-mid transition">
              Жаңарту →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FavoritesTab() {
  const { favorites, toggleFavorite } = useUserData();
  const { openChat } = useChat();
  const { toast } = useToast();

  const favLawyers = useMemo(
    () => favorites.map((id) => LAWYERS.find((l) => l.id === id)).filter(Boolean),
    [favorites],
  );

  if (favLawyers.length === 0) {
    return (
      <div className="card p-12">
        <EmptyState
          emoji="❤️"
          title="Таңдаулылар бос"
          description="Заңгерлерді қарап, ұнағандарын 🤍 арқылы сақтаңыз"
          cta={<Link to="/search" className="btn-primary mt-4 inline-flex">Заңгерлерге</Link>}
        />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favLawyers.map((l) => (
        <div key={l.id} className="card p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar initials={l.initials} gradient={l.gradient} size="sm" online={l.online} />
            <div className="flex-1 min-w-0">
              <Link to={`/lawyer/${l.id}`} className="font-semibold text-navy hover:text-brand-blue truncate block">
                {l.name}
              </Link>
              <div className="text-xs text-slate-500">{l.spec}</div>
            </div>
            <button
              onClick={() => {
                toggleFavorite(l.id);
                toast('Таңдаулылардан алынды');
              }}
              className="w-8 h-8 rounded-full bg-red-50 text-red-500 text-sm"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-amber-500 text-sm">
              ★ {l.rating} <span className="text-slate-400">· {l.price.toLocaleString('kk-KZ')}₸</span>
            </div>
            <button onClick={() => openChat(l)} className="btn-primary text-xs px-3 py-1.5">
              💬 Чат
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConsultationsTab() {
  const { consultations } = useUserData();

  if (consultations.length === 0) {
    return (
      <div className="card p-12">
        <EmptyState
          emoji="📅"
          title="Консультациялар жоқ"
          description="Заңгер бетіндегі 📅 түймесі арқылы консультация сұраңыз"
          cta={<Link to="/search" className="btn-primary mt-4 inline-flex">Заңгерлерге</Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {consultations.map((c) => (
        <ConsultationRow key={c.id} c={c} />
      ))}
    </div>
  );
}

function ConsultationRow({ c, compact = false }) {
  const { updateConsultationStatus, removeConsultation } = useUserData();
  const { toast } = useToast();
  const status = STATUS_LABEL[c.status] || STATUS_LABEL.pending;

  return (
    <div className={`card flex flex-col sm:flex-row items-start sm:items-center gap-4 ${compact ? 'p-4' : 'p-5'}`}>
      <Avatar initials={c.lawyerInitials} gradient={c.lawyerGradient} size={compact ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <Link to={`/lawyer/${c.lawyerId}`} className="font-semibold text-navy hover:text-brand-blue truncate block">
          {c.lawyerName}
        </Link>
        <div className="text-xs text-slate-500 mt-0.5">
          {c.spec} · {c.price.toLocaleString('kk-KZ')}₸
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Сұрау берілді: {new Date(c.createdAt).toLocaleString('kk-KZ', { dateStyle: 'short', timeStyle: 'short' })}
        </div>
      </div>
      <span className={`text-xs font-medium px-3 py-1 rounded-full border ${status.cls}`}>
        {status.text}
      </span>
      {!compact && (
        <div className="flex gap-2">
          {c.status === 'pending' && (
            <button
              onClick={() => {
                updateConsultationStatus(c.id, 'confirmed');
                toast('Растау белгіленді');
              }}
              className="btn-outline text-xs px-3 py-1.5"
            >
              ✓ Растау
            </button>
          )}
          {c.status === 'confirmed' && (
            <button
              onClick={() => {
                updateConsultationStatus(c.id, 'completed');
                toast('Аяқталды');
              }}
              className="btn-outline text-xs px-3 py-1.5"
            >
              ✓ Аяқтау
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Жоюды растайсыз ба?')) {
                removeConsultation(c.id);
                toast('Жойылды');
              }
            }}
            className="text-red-500 hover:bg-red-50 rounded-lg px-2 py-1.5 text-sm"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

function DocumentsTab() {
  const { documents, removeDocument } = useUserData();
  const { toast } = useToast();

  if (documents.length === 0) {
    return (
      <div className="card p-12">
        <EmptyState
          emoji="📄"
          title="Құжаттар жоқ"
          description="Құжат жасау бетінен шарт, өтініш немесе сенімхат жасаңыз"
          cta={<Link to="/docgen" className="btn-primary mt-4 inline-flex">Құжат жасау</Link>}
        />
      </div>
    );
  }

  const download = (d) => {
    const blob = new Blob(
      [
        `${d.type} №${d.number}\n\n`,
        `Орны: ${d.city || '—'}\n`,
        `Күні: ${d.date}\n\n`,
        `1-тарап: ${d.party1}\n`,
        `2-тарап: ${d.party2}\n`,
        d.amount ? `Сомасы: ${d.amount} ₸\n\n` : '\n',
        `Мазмұны:\n${d.content || ''}\n\n`,
        `— AdilBridge.`,
      ],
      { type: 'text/plain;charset=utf-8' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${d.type}-${d.number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Файл жүктелді');
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {documents.map((d) => (
        <div key={d.id} className="card p-5">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
              📄
            </div>
            <div className="flex gap-1">
              <button onClick={() => download(d)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500">
                ⬇
              </button>
              <button
                onClick={() => {
                  if (confirm('Жоюды растайсыз ба?')) {
                    removeDocument(d.id);
                    toast('Жойылды');
                  }
                }}
                className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500"
              >
                🗑
              </button>
            </div>
          </div>
          <div className="font-display font-bold text-navy mt-3">
            {d.type}
          </div>
          <div className="text-xs text-slate-500">№ {d.number}</div>
          <div className="mt-3 text-sm text-slate-600 space-y-0.5">
            <div className="truncate"><span className="text-slate-400">Тараптар:</span> {d.party1} / {d.party2}</div>
            {d.amount && <div><span className="text-slate-400">Сомасы:</span> {d.amount} ₸</div>}
          </div>
          <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
            Жасалды: {new Date(d.createdAt).toLocaleDateString('kk-KZ')}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const { profile, updateProfileExtra } = useUserData();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: profile.phone || '',
    city: profile.city || '',
    bio: profile.bio || '',
  });

  const save = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name });
    updateProfileExtra({ phone: form.phone, city: form.city, bio: form.bio });
    toast('Профиль жаңартылды');
  };

  return (
    <form onSubmit={save} className="card p-6 md:p-8 max-w-2xl space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-navy">Профиль</h2>
        <p className="text-sm text-slate-500 mt-1">Жеке ақпаратыңызды жаңартыңыз</p>
      </div>

      <Field label="Аты-жөні">
        <input
          className="input-base"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </Field>

      <Field label="Email (өзгерту мүмкін емес)">
        <input className="input-base bg-slate-50" value={user.email} disabled />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Телефон">
          <input
            className="input-base"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+7 (700) 000-00-00"
          />
        </Field>
        <Field label="Қала">
          <input
            className="input-base"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Алматы"
          />
        </Field>
      </div>

      <Field label="Өзім туралы">
        <textarea
          className="input-base min-h-[100px]"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Қысқаша өзіңіз туралы..."
        />
      </Field>

      <button type="submit" className="btn-primary">
        Сақтау
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function StatCard({ icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 flex items-center gap-4 text-left hover:-translate-y-0.5 duration-200"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-navy">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </button>
  );
}

function EmptyState({ emoji, title, description, cta }) {
  return (
    <div className="text-center py-6">
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-navy">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
      {cta}
    </div>
  );
}
