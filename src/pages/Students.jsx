import { LAWYERS } from '../data/lawyers.js';
import LawyerCard from '../components/LawyerCard.jsx';

export default function Students() {
  const students = LAWYERS.filter((l) => l.student);

  return (
    <section className="pt-28 pb-20 px-5 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-tag">Студенттер</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mt-2">
            Болашақ заңгерлер
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Заң факультеті студенттері арзан бағамен кеңес береді — бюджеттік
            шешім. Тәлімгер бақылауымен.
          </p>
        </div>

        <div className="bg-gradient-to-br from-accent to-accent-light rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-6 items-center mb-12">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
              Заң студенттерімен үнемдеңіз
            </h2>
            <p className="text-navy/70 mt-3 leading-relaxed">
              3–5 курс студенттері қарапайым еңбек, отбасы, тұтынушы
              мәселелерінде жоғары сапалы кеңес ұсынады. Барлық кеңес тәжірибелі
              заңгер қарап шығады.
            </p>
          </div>
          <div className="flex flex-col items-end md:items-end text-right">
            <div className="font-display text-5xl font-bold text-navy">
              1,500₸
            </div>
            <span className="text-navy/60 text-sm">консультациядан бастап</span>
            <ul className="text-sm text-navy/70 mt-4 space-y-1 text-right">
              <li>✓ Тәлімгер бақылауы</li>
              <li>✓ Онлайн формат</li>
              <li>✓ Жауап 2 сағатқа дейін</li>
            </ul>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-slate-500">Студенттер әзірге жоқ</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {students.map((s) => (
              <LawyerCard key={s.id} lawyer={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
