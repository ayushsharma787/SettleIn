export function Logo({ size = 'md', light = false }) {
  const dims = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  const mark = size === 'lg' ? 'w-12 h-12 text-2xl' : size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${mark} rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-arabic shadow-lg shadow-brand-600/25`}>
        أ
      </div>
      <div className="leading-none">
        <div className={`${dims} font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
          Ahlan
        </div>
        {size !== 'sm' && (
          <div className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${light ? 'text-brand-100' : 'text-brand-600'}`}>
            Welcome home
          </div>
        )}
      </div>
    </div>
  );
}
