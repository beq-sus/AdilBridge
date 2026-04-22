import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, LAWYERS, REVIEWS } from '../data/lawyers.js';
import Avatar from '../components/Avatar.jsx';
import Toggle from '../components/Toggle.jsx';

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [anon, setAnon] = useState(false);
  const previewLawyers = LAWYERS.slice(0, 3);

  const goToSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (anon) params.set('anon', '1');
    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-brand-blue/90 pt-28 pb-20 px-5">
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-brand-blueLight/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent-light rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider animate-fadeUp">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulseDot" />
              #1 заңгер платформасы
            </div>

            <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fadeUp">
              Заңгерді <span className="text-accent">оңай</span> табыңыз
            </h1>

            <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl leading-relaxed animate-fadeUp">
              Мәселеңізді қысқа жазыңыз — біз сізге жарамды заңгерді табамыз.
              Верификацияланған мамандар, ашық бағалар, анонимді режим.
            </p>

            {/* Search box */}
            <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-5 animate-fadeUp">
              <label className="block text-white/60 text-[11px] uppercase tracking-wider font-medium mb-2">
                Сіздің мәселеңіз
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Мысалы: Жұмыстан заңсыз шығарылдым, компенсация талап еткім келеді..."
                rows={3}
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 resize-none text-base"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10">
                <Toggle on={anon} onChange={setAnon} label="Анонимді режим" tone="light" />
                <button onClick={goToSearch} className="btn-gold w-full sm:w-auto">
                  Заңгер табу →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <StatHero value="250+" label="Заңгер" />
              <StatHero value="12k+" label="Шешілген іс" />
              <StatHero value="4.8" label="Орташа рейтинг" />
            </div>
          </div>

          {/* Preview card */}
          <div className="animate-fadeUp">
            <div className="bg-white/6 backdrop-blur-xl border border-white/12 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs uppercase tracking-wider">
                  Сәйкес заңгерлер
                </span>
                <span className="bg-accent/20 text-accent-light text-xs rounded-full px-3 py-0.5">
                  {LAWYERS.length} нәтиже
                </span>
              </div>
              {previewLawyers.map((l) => (
                <div
                  key={l.id}
                  onClick={() => navigate(`/lawyer/${l.id}`)}
                  className="flex items-center gap-3 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-accent/40 rounded-xl p-3.5 cursor-pointer transition"
                >
                  <Avatar initials={l.initials} gradient={l.gradient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{l.name}</div>
                    <div className="text-white/50 text-xs">
                      {l.spec} · {l.exp} жыл
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-accent text-xs">★ {l.rating}</div>
                    <div className="text-accent-light text-sm font-semibold">
                      {l.price.toLocaleString('kk-KZ')}₸
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <span className="section-tag">Жұмыс принципі</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">
            4 қадаммен кеңес алыңыз
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '1', t: 'Мәселені сипаттаңыз', d: 'Жағдайыңызды қысқаша жазыңыз. Анонимді режим де бар.' },
              { n: '2', t: 'Заңгерлерді таңдаңыз', d: 'Тәжірибе, рейтинг, баға бойынша сүзіңіз.' },
              { n: '3', t: 'Байланысқа шығыңыз', d: 'Чат немесе видео арқылы проблема шешіңіз.' },
              { n: '4', t: 'Нәтиже алыңыз', d: 'Дайын құжат, сот стратегиясы немесе жоспар.' },
            ].map((s) => (
              <div key={s.n} className="card p-6 text-left hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 rounded-lg bg-navy text-accent font-display font-bold flex items-center justify-center mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-navy mb-1.5">{s.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <span className="section-tag">Мамандықтар</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">
            Заң саласын таңдаңыз
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Мәселеңізге сәйкес сала бойынша мамандарды табыңыз
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={`/search?category=${encodeURIComponent(c.key)}`}
                className="card p-5 flex flex-col items-center gap-3 hover:-translate-y-1 duration-200"
              >
                <div className={`w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center text-2xl`}>
                  {c.icon}
                </div>
                <div className="text-sm font-medium text-navy text-center">{c.key}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENTS */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-accent to-accent-light rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-navy/10 text-navy text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Студенттер бөлімі
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">
                Заң студенттерімен үнемдеңіз
              </h2>
              <p className="text-navy/70 mt-3 leading-relaxed">
                3–5 курс студенттері тәжірибелі заңгер жетекшілігімен қарапайым
                мәселелер бойынша сапалы кеңес береді. Академиялық білім +
                практикалық тәжірибе.
              </p>
              <Link to="/students" className="btn-primary mt-6">
                Студенттерді көру →
              </Link>
            </div>
            <div className="text-center md:text-right">
              <div className="font-display text-5xl md:text-6xl font-bold text-navy">
                1,500₸
              </div>
              <span className="text-navy/60 text-sm">консультациядан бастап</span>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <span className="section-tag">Пікірлер</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">
            Қолданушылар не айтады
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.id} className="card p-6 text-left">
                <div className="text-amber-500 mb-2">{'★'.repeat(Math.round(r.rating))}</div>
                <p className="text-slate-700 leading-relaxed text-sm">"{r.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-navy text-white text-xs flex items-center justify-center font-semibold">
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-navy">{r.user}</div>
                    <div className="text-xs text-slate-500">Туралы: {r.lawyer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOC GEN CTA */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto bg-navy rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-3xl rounded-full" />
          <div className="relative">
            <span className="inline-block bg-accent/15 text-accent-light text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Авто-генерация
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Заңды құжат жасаңыз
            </h2>
            <p className="text-white/60 mt-3 max-w-xl mx-auto">
              Форма толтырыңыз — дайын заңды құжатты PDF форматында алыңыз.
              Шарт, өтініш, сенімхат, талап арыз, хаттама.
            </p>
            <Link to="/docgen" className="btn-gold mt-8 inline-flex">
              Құжат жасау →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatHero({ value, label }) {
  return (
    <div>
      <div className="font-display text-2xl md:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/50 mt-0.5">{label}</div>
    </div>
  );
}
