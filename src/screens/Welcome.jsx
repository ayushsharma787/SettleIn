import { useApp } from '../context/AppContext.jsx';
import { Logo } from '../components/Logo.jsx';
import { User, Building2, ArrowRight, Sparkles } from 'lucide-react';

export function Welcome() {
  const { navigate, loadPersona } = useApp();

  return (
    <div className="flex flex-col min-h-full screen-in">
      {/* Hero */}
      <div className="relative px-6 pt-16 pb-10 bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 text-white overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-400/20 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 w-56 h-56 rounded-full bg-brand-300/10 blur-2xl" />
        <div className="relative">
          <div className="text-[64px] leading-none font-arabic mb-2 text-brand-100/90">أهلاً</div>
          <h1 className="text-4xl font-extrabold tracking-tight">Ahlan</h1>
          <p className="mt-3 text-brand-50/90 text-[15px] leading-relaxed max-w-[19rem]">
            Your welcome companion for settling into the UAE. We tell you what to do
            next, in what order, with which documents — and link you to the right
            official portal.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3.5 py-1.5 text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-brand-100" />
            From six weeks of chaos to six hours of clarity
          </div>
        </div>
      </div>

      {/* Choose mode */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className="text-xs font-bold tracking-[0.18em] uppercase text-slate-400 mb-4">
          Choose how you'll explore
        </div>

        <button
          onClick={loadPersona}
          className="group text-left rounded-3xl p-5 bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-lg hover:ring-brand-300 active:scale-[0.99] transition mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-slate-900 text-lg">I'm an individual</div>
              <div className="text-sm text-slate-500 mt-0.5">
                Get your personalized settling-in roadmap
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => navigate('employer')}
          className="group text-left rounded-3xl p-5 bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-lg hover:ring-brand-300 active:scale-[0.99] transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-slate-900 text-lg">I'm an employer</div>
              <div className="text-sm text-slate-500 mt-0.5">
                Track your team's onboarding at a glance
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition" />
          </div>
        </button>

        <button
          onClick={() => navigate('questionnaire')}
          className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 py-3"
        >
          Or take the questionnaire from scratch →
        </button>

        <div className="mt-auto pt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span>Demo mode · sample data · no login</span>
        </div>
      </div>
    </div>
  );
}
