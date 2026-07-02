import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { COMPANY, employeeRoadmap } from '../data/employer.js';
import { STEP_MAP } from '../data/steps.js';
import { TopBar } from '../components/PhoneFrame.jsx';
import { MiniBar } from '../components/ProgressBar.jsx';
import { AlertTriangle, ChevronRight, Plus, UserPlus, X, Check } from 'lucide-react';

export function Employer() {
  const { goBack, employees, openEmployee, addEmployee } = useApp();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', visaType: 'Employer-sponsored', emirate: 'Dubai' });
  const [justAdded, setJustAdded] = useState(false);

  const onboarding = employees.filter((e) => employeeRoadmap(e).pct < 100).length;

  const submit = () => {
    if (!form.name.trim()) return;
    addEmployee(form);
    setJustAdded(true);
    setTimeout(() => {
      setInviteOpen(false);
      setJustAdded(false);
      setForm({ name: '', email: '', visaType: 'Employer-sponsored', emirate: 'Dubai' });
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <TopBar
        title="Ahlan for Business"
        onBack={goBack}
        right={
          <button onClick={() => setInviteOpen(true)} className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center active:scale-95 transition">
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-5 py-5 screen-in">
        {/* Company header */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center font-extrabold">{COMPANY.logo}</div>
            <div>
              <div className="text-lg font-extrabold">{COMPANY.name}</div>
              <div className="text-sm text-slate-300">{onboarding} employees currently onboarding</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Onboarding" value={onboarding} />
            <Stat label="Stuck" value={employees.filter((e) => e.stuck).length} amber />
            <Stat label="Settled" value={employees.filter((e) => employeeRoadmap(e).pct === 100).length} />
          </div>
        </div>

        <div className="mt-5 text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-3">Team progress</div>

        <div className="space-y-3">
          {employees.map((emp) => {
            const rm = employeeRoadmap(emp);
            const currentName = rm.currentStepId ? STEP_MAP[rm.currentStepId].title : 'Fully settled';
            return (
              <button
                key={emp.id}
                onClick={() => openEmployee(emp.id)}
                className={`w-full text-left rounded-2xl p-4 bg-white ring-1 transition active:scale-[0.99] ${
                  emp.stuck ? 'ring-amber-300' : 'ring-slate-200 hover:ring-brand-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-extrabold shrink-0" style={{ background: emp.color }}>
                    {emp.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-900 truncate">{emp.name}</div>
                      {emp.stuck && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                          <AlertTriangle className="w-3 h-3" /> Stuck
                        </span>
                      )}
                      {emp.isNew && (
                        <span className="shrink-0 text-[10px] font-extrabold uppercase text-brand-700 bg-brand-100 rounded-full px-2 py-0.5">New</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{emp.role} · {emp.visaType}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-semibold ${emp.stuck ? 'text-amber-700' : 'text-slate-500'}`}>
                      {currentName}{emp.daysSince > 0 ? ` · day ${emp.daysSince}` : ''}
                      {emp.stuck ? ' · no progress' : ''}
                    </span>
                    <span className="text-xs font-extrabold text-slate-700">{rm.pct}%</span>
                  </div>
                  <MiniBar pct={rm.pct} color={emp.stuck ? 'from-amber-400 to-amber-500' : rm.pct === 100 ? 'from-brand-500 to-brand-600' : 'from-brand-400 to-brand-600'} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl bg-brand-50 ring-1 ring-brand-100 p-4 text-center">
          <div className="text-sm font-bold text-brand-800">Ahlan for Business — from AED 249/hire</div>
          <div className="text-xs text-brand-600 mt-0.5">Contact us for team & enterprise pricing.</div>
        </div>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setInviteOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="relative w-full bg-white rounded-t-3xl p-5 pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Invite a new hire</h3>
              </div>
              <button onClick={() => setInviteOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {justAdded ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center mx-auto check-pop">
                  <Check className="w-7 h-7" strokeWidth={3} />
                </div>
                <div className="mt-3 font-bold text-slate-900">{form.name} added</div>
                <div className="text-sm text-slate-500">Invitation sent · roadmap created</div>
              </div>
            ) : (
              <div className="space-y-3">
                <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Omar Haddad" />
                <Field label="Work email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="omar@nexatech.ae" />
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Visa type</label>
                  <select value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })} className="mt-1.5 w-full rounded-xl bg-slate-100 border-0 py-2.5 px-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-brand-400">
                    {['Employer-sponsored', 'Freelance', 'Golden Visa', 'Remote work'].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Emirate</label>
                  <select value={form.emirate} onChange={(e) => setForm({ ...form, emirate: e.target.value })} className="mt-1.5 w-full rounded-xl bg-slate-100 border-0 py-2.5 px-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-brand-400">
                    {['Dubai', 'Abu Dhabi', 'Sharjah'].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <button onClick={submit} className="w-full rounded-2xl bg-brand-600 text-white font-extrabold py-3.5 mt-1 active:scale-[0.99] transition">
                  Send invitation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, amber }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${amber ? 'bg-amber-400/15' : 'bg-white/10'}`}>
      <div className={`text-2xl font-extrabold ${amber ? 'text-amber-300' : 'text-white'}`}>{value}</div>
      <div className="text-[11px] text-slate-300 font-semibold">{label}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl bg-slate-100 border-0 py-2.5 px-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}
