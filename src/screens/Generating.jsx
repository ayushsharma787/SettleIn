import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const LINES = [
  'Reading your answers…',
  'Mapping step dependencies…',
  'Routing you to the right portals…',
  'Building your personalized roadmap…',
];

export function Generating() {
  const { navigate } = useApp();
  const [line, setLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLine((l) => Math.min(l + 1, LINES.length - 1));
    }, 480);
    const done = setTimeout(() => navigate('roadmap'), 2100);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [navigate]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8 text-center bg-gradient-to-b from-white to-brand-50/40">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 spin" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-arabic text-brand-600">أ</div>
      </div>
      <h2 className="text-xl font-extrabold text-slate-900">Generating your roadmap</h2>
      <div className="mt-3 h-6 relative w-full max-w-xs">
        {LINES.map((l, i) => (
          <div
            key={i}
            className={`absolute inset-0 text-[15px] text-slate-500 transition-opacity duration-300 ${
              i === line ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
