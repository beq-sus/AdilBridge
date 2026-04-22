export default function Toggle({ on, onChange, label, tone = 'dark' }) {
  const bgOn = tone === 'light' ? 'bg-accent' : 'bg-navy';
  const bgOff = tone === 'light' ? 'bg-white/20' : 'bg-slate-300';
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex items-center gap-2.5 text-sm group"
    >
      <span
        className={`relative w-10 h-6 rounded-full transition ${on ? bgOn : bgOff}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
      {label && <span className={tone === 'light' ? 'text-white/70' : 'text-slate-600'}>{label}</span>}
    </button>
  );
}
