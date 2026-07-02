import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { QUESTIONS } from '../data/questions.js';
import { TopBar } from '../components/PhoneFrame.jsx';
import { Icon } from '../components/Icon.jsx';

export function Questionnaire() {
  const { navigate, goBack, resetTo, canGoBack, finishQuestionnaire } = useApp();
  const [idx, setIdx] = useState(0);
  const [local, setLocal] = useState({});
  const q = QUESTIONS[idx];

  const choose = (value) => {
    const nextAnswers = { ...local, [q.key]: value };
    setLocal(nextAnswers);
    // Small delay so the selected state is visible before advancing
    setTimeout(() => {
      if (idx < QUESTIONS.length - 1) {
        setIdx(idx + 1);
      } else {
        finishQuestionnaire(nextAnswers);
        navigate('generating');
      }
    }, 220);
  };

  const back = () => {
    if (idx > 0) setIdx(idx - 1);
    // When the questionnaire was started via a history reset (e.g. "Restart
    // questionnaire"), there is nothing to go back to — drive home instead.
    else if (canGoBack) goBack();
    else resetTo('welcome');
  };

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Let's get to know you" onBack={back} />

      {/* Progress dots */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                i < idx ? 'bg-brand-500' : i === idx ? 'bg-brand-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="mt-2 text-xs font-semibold text-slate-400">
          Question {idx + 1} of {QUESTIONS.length}
        </div>
      </div>

      {/* Question */}
      <div key={idx} className="flex-1 px-5 pt-6 pb-8 flex flex-col slide-in">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
          <Icon name={q.icon} className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">{q.question}</h2>
        <p className="mt-2 text-[15px] text-slate-500">{q.subtitle}</p>

        <div className="mt-6 space-y-3">
          {q.options.map((opt) => {
            const selected = local[q.key] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => choose(opt.value)}
                className={`w-full text-left rounded-2xl px-4 py-4 flex items-center gap-3.5 ring-1 transition active:scale-[0.99] ${
                  selected
                    ? 'bg-brand-600 text-white ring-brand-600 shadow-lg shadow-brand-600/25'
                    : 'bg-white text-slate-800 ring-slate-200 hover:ring-brand-300 hover:bg-brand-50/40'
                }`}
              >
                <span className="text-2xl leading-none">{opt.emoji}</span>
                <span className="font-semibold flex-1">{opt.label}</span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected ? 'border-white bg-white' : 'border-slate-300'
                  }`}
                >
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d8b78" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
