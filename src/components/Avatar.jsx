export default function Avatar({ initials, gradient, size = 'md', online }) {
  const dim = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  }[size];
  return (
    <div className={`relative ${dim} rounded-full bg-gradient-to-br ${gradient || 'from-navy to-brand-blue'} flex items-center justify-center text-white font-semibold shrink-0`}>
      {initials}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </div>
  );
}
