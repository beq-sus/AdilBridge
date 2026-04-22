export default function Logo({ light = false, size = 'md' }) {
  const sz = size === 'lg' ? 'text-2xl' : 'text-xl';
  const box = size === 'lg' ? 'w-10 h-10 text-lg' : 'w-9 h-9 text-base';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} rounded-xl bg-navy flex items-center justify-center text-accent shadow-soft`}>
        ⚖
      </div>
      <span className={`${sz} font-display font-bold ${light ? 'text-white' : 'text-navy'}`}>
        AdilBridge
      </span>
    </div>
  );
}
