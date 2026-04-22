import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            Қазақстандағы алғашқы заңгер-іздеу платформасы. Сапалы заңи кеңесті
            бәріне қолжетімді етеміз.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Платформа</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className="hover:text-white">Заңгерлерді іздеу</Link></li>
            <li><Link to="/students" className="hover:text-white">Студент кеңесі</Link></li>
            <li><Link to="/docgen" className="hover:text-white">Құжат жасау</Link></li>
            <li><Link to="/search" className="hover:text-white">Баға тізімі</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Заңгерлерге</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-white">Тіркелу</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Профиль жасау</Link></li>
            <li><a href="#" className="hover:text-white">Серіктестік</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Байланыс</h4>
          <ul className="space-y-2 text-sm">
            <li>info@adilbridge.kz</li>
            <li>+7 (700) 255-85-47</li>
            <li>Алматы, Қазақстан</li>
            <li>Telegram: @adilbridge</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © 2026 AdilBridge. Барлық құқықтар қорғалған.
      </div>
    </footer>
  );
}
