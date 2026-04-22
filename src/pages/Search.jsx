import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LAWYERS, CATEGORIES, LOCATIONS } from '../data/lawyers.js';
import LawyerCard from '../components/LawyerCard.jsx';

const PRICE_OPTIONS = [
  { value: '', label: 'Кез-келген баға' },
  { value: 'low', label: '5000₸ дейін' },
  { value: 'mid', label: '5000–10000₸' },
  { value: 'high', label: '10000₸ жоғары' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Кез-келген рейтинг' },
  { value: '4.8', label: '4.8+' },
  { value: '4.5', label: '4.5+' },
  { value: '4.0', label: '4.0+' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Рейтинг бойынша' },
  { value: 'price_low', label: 'Баға: арзаннан' },
  { value: 'price_high', label: 'Баға: қымбатынан' },
  { value: 'experience', label: 'Тәжірибе бойынша' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    if (category) next.set('category', category);
    setParams(next, { replace: true });
  }, [query, category, setParams]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let result = LAWYERS.filter((l) => !l.student).filter((l) => {
      const matchQ =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.spec.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = !category || l.spec === category;
      const matchPrice =
        !price ||
        (price === 'low' && l.price <= 5000) ||
        (price === 'mid' && l.price > 5000 && l.price <= 10000) ||
        (price === 'high' && l.price > 10000);
      const matchRating = !rating || l.rating >= parseFloat(rating);
      const matchLoc = !location || l.location === location;
      return matchQ && matchCat && matchPrice && matchRating && matchLoc;
    });

    const sorters = {
      rating: (a, b) => b.rating - a.rating,
      price_low: (a, b) => a.price - b.price,
      price_high: (a, b) => b.price - a.price,
      experience: (a, b) => b.exp - a.exp,
    };
    return result.sort(sorters[sort] || sorters.rating);
  }, [query, category, price, rating, location, sort]);

  const chips = [];
  if (category) chips.push({ label: category, clear: () => setCategory('') });
  if (price) chips.push({ label: PRICE_OPTIONS.find((p) => p.value === price)?.label, clear: () => setPrice('') });
  if (rating) chips.push({ label: `${rating}+ ★`, clear: () => setRating('') });
  if (location) chips.push({ label: location, clear: () => setLocation('') });

  return (
    <section className="pt-28 pb-20 px-5 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="section-tag">Заңгерлер</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">
            Мамандарды іздеу
          </h1>
          <p className="text-slate-500 mt-2">
            Верификацияланған {LAWYERS.filter((l) => !l.student).length} заңгер.
            Фильтрлер арқылы өзіңізге жарамды маманды табыңыз.
          </p>
        </div>

        {/* Filter bar */}
        <div className="card p-4 mb-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Аты немесе мамандығы..."
                className="input-base pl-10"
              />
            </div>
            <Select value={category} onChange={setCategory}>
              <option value="">Барлық салалар</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.key}</option>
              ))}
            </Select>
            <Select value={price} onChange={setPrice}>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
            <Select value={rating} onChange={setRating}>
              {RATING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
            <Select value={location} onChange={setLocation}>
              <option value="">Барлық қалалар</option>
              {LOCATIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
              {chips.map((c, i) => (
                <button
                  key={i}
                  onClick={c.clear}
                  className="flex items-center gap-1.5 bg-navy/5 hover:bg-navy/10 text-navy text-xs font-medium px-3 py-1.5 rounded-full transition"
                >
                  {c.label}
                  <span className="text-slate-400">✕</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results row */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-slate-600">
            <strong className="text-navy">{filtered.length}</strong> заңгер табылды
          </span>
          <Select value={sort} onChange={setSort} className="max-w-[220px]">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-semibold text-navy">Нәтиже табылмады</h3>
            <p className="text-slate-500 text-sm mt-1">Сүзгілерді өзгертіп көріңіз</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((l) => (
              <LawyerCard key={l.id} lawyer={l} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Select({ value, onChange, children, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input-base appearance-none bg-white pr-9 cursor-pointer min-w-[160px] ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
      }}
    >
      {children}
    </select>
  );
}
