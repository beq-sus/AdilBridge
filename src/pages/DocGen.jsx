import { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUserData } from '../context/UserDataContext.jsx';

const DOC_TYPES = [
  { key: 'Шарт', icon: '📄', desc: 'Екі тарап арасындағы шарт' },
  { key: 'Өтініш', icon: '📝', desc: 'Мемлекеттік органдарға өтініш' },
  { key: 'Сенімхат', icon: '🔑', desc: 'Өкілеттік беру сенімхаты' },
  { key: 'Талап арыз', icon: '⚖️', desc: 'Сотқа талап арызы' },
  { key: 'Хаттама', icon: '📋', desc: 'Жиналыс хаттамасы' },
];

const CITIES = ['Алматы', 'Астана', 'Шымкент', 'Өскемен', 'Қарағанды', 'Ақтөбе'];

export default function DocGen() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addDocument } = useUserData();
  const [docType, setDocType] = useState('Шарт');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    party1: '',
    party2: '',
    city: '',
    amount: '',
    content: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [preview, setPreview] = useState(null);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const generate = (e) => {
    e.preventDefault();
    if (!form.party1 || !form.party2) {
      toast('Тараптарды толтырыңыз', 'error');
      return;
    }
    setLoading(true);
    toast(`"${docType}" құжаты дайындалуда...`, 'info');
    setTimeout(() => {
      setLoading(false);
      const doc = {
        type: docType,
        ...form,
        number: `AB-${Math.floor(Math.random() * 90000 + 10000)}`,
      };
      setPreview(doc);
      if (user) {
        addDocument(doc);
        toast('Құжат жасалды және кабинетке сақталды');
      } else {
        toast('Құжат жасалды. Сақтау үшін тіркеліңіз', 'info');
      }
    }, 1400);
  };

  const download = () => {
    if (!preview) return;
    const blob = new Blob(
      [
        `${preview.type} №${preview.number}\n\n`,
        `Орны: ${preview.city || '—'}\n`,
        `Күні: ${preview.date}\n\n`,
        `1-тарап: ${preview.party1}\n`,
        `2-тарап: ${preview.party2}\n`,
        preview.amount ? `Сомасы: ${preview.amount} ₸\n\n` : '\n',
        `Мазмұны:\n${preview.content}\n\n`,
        `— AdilBridge ботымен жасалды.`,
      ],
      { type: 'text/plain;charset=utf-8' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${preview.type}-${preview.number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Файл жүктелді');
  };

  return (
    <section className="pt-28 pb-20 px-5 min-h-screen bg-navy">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-accent/15 text-accent-light text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Авто-генерация
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Заңды құжат жасаңыз
          </h1>
          <p className="text-white/60 mt-3">
            Форма толтырыңыз, құжат PDF форматында дайын болады
          </p>
        </div>

        {/* Type selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {DOC_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setDocType(t.key)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                docType === t.key
                  ? 'bg-accent text-navy border-accent'
                  : 'bg-white/5 text-white/70 border-white/15 hover:border-accent/40'
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.key}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <form onSubmit={generate} className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Тараптар (1-тарап)">
                <input
                  className="input-base"
                  value={form.party1}
                  onChange={(e) => upd('party1', e.target.value)}
                  placeholder="ЖШС «Компания» немесе ТАА"
                />
              </Field>
              <Field label="Тараптар (2-тарап)">
                <input
                  className="input-base"
                  value={form.party2}
                  onChange={(e) => upd('party2', e.target.value)}
                  placeholder="Тегі Аты Әкесінің аты"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Қала">
                <select
                  className="input-base"
                  value={form.city}
                  onChange={(e) => upd('city', e.target.value)}
                >
                  <option value="">Таңдаңыз</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Сомасы (теңге)" hint="Нөлдік болса бос қалдырыңыз">
                <input
                  className="input-base"
                  value={form.amount}
                  onChange={(e) => upd('amount', e.target.value)}
                  placeholder="1 000 000"
                />
              </Field>
            </div>

            <Field label="Негізгі мазмұны / шарттар">
              <textarea
                className="input-base min-h-[120px]"
                value={form.content}
                onChange={(e) => upd('content', e.target.value)}
                placeholder="Шарт мазмұнын, негізгі шарттарды, мерзімдерді қысқаша сипаттаңыз..."
              />
            </Field>

            <Field label="Күні">
              <input
                type="date"
                className="input-base"
                value={form.date}
                onChange={(e) => upd('date', e.target.value)}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full text-base py-3 disabled:opacity-60"
            >
              {loading ? 'Жасалуда...' : '✨ Құжат жасау'}
            </button>
          </form>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/15 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Алдын-ала қарау</h3>
                {preview && (
                  <button onClick={download} className="text-accent hover:text-accent-light text-xs">
                    ⬇ Жүктеу
                  </button>
                )}
              </div>
              {preview ? (
                <div className="bg-white rounded-xl p-5 text-sm text-slate-700 leading-relaxed max-h-[500px] overflow-auto">
                  <div className="text-center border-b border-slate-200 pb-3 mb-3">
                    <div className="font-display font-bold text-navy text-lg uppercase">
                      {preview.type}
                    </div>
                    <div className="text-xs text-slate-500">№ {preview.number}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-slate-500">Орны:</span> {preview.city || '—'}</div>
                    <div><span className="text-slate-500">Күні:</span> {preview.date}</div>
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    <div><strong>1-тарап:</strong> {preview.party1}</div>
                    <div><strong>2-тарап:</strong> {preview.party2}</div>
                    {preview.amount && (
                      <div><strong>Сомасы:</strong> {preview.amount} ₸</div>
                    )}
                  </div>
                  {preview.content && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-slate-500 text-xs mb-1">Мазмұны:</div>
                      <p className="whitespace-pre-wrap text-xs">{preview.content}</p>
                    </div>
                  )}
                  <div className="mt-6 text-center text-[10px] text-slate-400">
                    — AdilBridge арқылы жасалды —
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/40 text-sm">
                  📄<br />
                  Форманы толтырып, "Құжат жасау" түймесін басыңыз
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <div className="text-[11px] text-slate-400 mt-1">{hint}</div>}
    </label>
  );
}
