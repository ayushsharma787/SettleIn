import React, { useState } from 'react'
import { Header, ProgressBar, Modal, ChevronIcon } from './ui'
import { buildRoadmap, progressOf } from '../engine'

function employeeProgress(emp) {
  const steps = buildRoadmap(emp.answers)
  return progressOf(steps, emp.completed)
}

function EmployeeCard({ emp, onOpen, delay }) {
  const prog = employeeProgress(emp)
  const complete = prog.pct === 100
  const currentStepTitle = complete
    ? 'All steps complete'
    : buildRoadmap(emp.answers).find((s) => s.id === emp.currentId)?.title || '—'

  return (
    <button
      onClick={() => onOpen(emp)}
      className={`card-in w-full text-left rounded-2xl border p-4 transition active:scale-[0.99] ${
        emp.stuck
          ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
          : 'bg-white border-stone-200 hover:border-teal-300'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${
            emp.stuck
              ? 'bg-amber-200 text-amber-800'
              : complete
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-teal-100 text-teal-700'
          }`}
        >
          {emp.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 truncate">{emp.name}</span>
            {emp.stuck && (
              <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wide bg-red-500 text-white px-2 py-0.5 rounded-full">
                Stuck
              </span>
            )}
            {complete && (
              <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                Done
              </span>
            )}
          </div>
          <div className="text-xs text-stone-500 truncate">
            {emp.role} · {emp.visaLabel}
          </div>
        </div>
        <ChevronIcon className="w-4 h-4 text-stone-300 shrink-0" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar pct={prog.pct} className="flex-1" />
        <span className="text-xs font-extrabold text-stone-700 tabular-nums w-9 text-right">
          {prog.pct}%
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={emp.stuck ? 'font-bold text-amber-800' : 'text-stone-500'}>
          {emp.stuck ? '⚠️ ' : '📍 '}
          {currentStepTitle}
          {emp.stuck ? ` — ${emp.stuckNote}` : ''}
        </span>
        <span className="text-stone-400 font-medium shrink-0 ml-2">Day {emp.day}</span>
      </div>
    </button>
  )
}

export default function Employer({ employees, onAddEmployee, onOpenEmployee, onBack, showToast }) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', visa: 'Employer-sponsored', emirate: 'dubai' })

  const stuckCount = employees.filter((e) => e.stuck).length
  const avg = Math.round(
    employees.reduce((s, e) => s + employeeProgress(e).pct, 0) / employees.length,
  )

  const submit = () => {
    onAddEmployee({
      id: `e${Date.now()}`,
      name: form.name.trim(),
      role: 'New hire',
      visaLabel: form.visa,
      day: 0,
      invited: true,
      answers: {
        family: 'single',
        visa: 'employer',
        emirate: form.emirate,
        tenancy: 'no',
        drive: 'no',
        employerHandled: 'no',
      },
      completed: [],
      currentId: 'medical',
    })
    setInviteOpen(false)
    showToast(`✓ Invitation sent to ${form.email.trim()}`)
    setForm({ name: '', email: '', visa: 'Employer-sponsored', emirate: 'dubai' })
  }

  const canSubmit = form.name.trim() && form.email.trim().includes('@')

  return (
    <div className="screen-in min-h-full flex flex-col bg-stone-50">
      <Header
        title="Nexa Tech"
        subtitle={`${employees.length} employees currently onboarding`}
        onBack={onBack}
        right={
          <button
            onClick={() => setInviteOpen(true)}
            className="text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-full transition active:scale-95"
          >
            + Invite new hire
          </button>
        }
      />

      {/* summary chips */}
      <div className="flex gap-2.5 px-5 pt-4">
        {[
          { label: 'Onboarding', value: employees.length, cls: 'bg-white border-stone-200 text-stone-800' },
          { label: 'Avg progress', value: `${avg}%`, cls: 'bg-teal-50 border-teal-200 text-teal-800' },
          { label: 'Need attention', value: stuckCount, cls: 'bg-amber-50 border-amber-300 text-amber-800' },
        ].map((c) => (
          <div key={c.label} className={`flex-1 rounded-2xl border px-3 py-2.5 ${c.cls}`}>
            <div className="text-xl font-extrabold leading-none">{c.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide opacity-70 mt-1">
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* employee grid */}
      <div className="flex-1 px-5 py-4 space-y-3">
        {employees.map((e, i) => (
          <EmployeeCard key={e.id} emp={e} onOpen={onOpenEmployee} delay={Math.min(i * 0.05, 0.35)} />
        ))}

        {/* B2B banner */}
        <div className="mt-5 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-4 flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <div className="flex-1">
            <div className="font-bold text-sm">Ahlan for Business — from AED 249/hire</div>
            <div className="text-xs text-teal-100">
              Contact us for team and enterprise pricing.
            </div>
          </div>
          <button
            onClick={() => showToast('✓ Thanks — our team will reach out (demo)')}
            className="shrink-0 text-xs font-bold bg-white text-teal-700 px-3.5 py-2 rounded-full transition active:scale-95 hover:bg-teal-50"
          >
            Contact us
          </button>
        </div>
      </div>

      {/* invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-extrabold text-stone-900 mb-1">Invite a new hire</h3>
          <p className="text-xs text-stone-500 mb-5">
            They’ll get their personalized roadmap the moment they accept.
          </p>
          <div className="space-y-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="w-full p-3.5 rounded-xl border border-stone-200 font-medium focus:outline-none focus:border-teal-400"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Work email"
              type="email"
              className="w-full p-3.5 rounded-xl border border-stone-200 font-medium focus:outline-none focus:border-teal-400"
            />
            <select
              value={form.visa}
              onChange={(e) => setForm({ ...form, visa: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-stone-200 font-medium bg-white focus:outline-none focus:border-teal-400"
            >
              <option>Employer-sponsored</option>
              <option>Golden Visa</option>
              <option>Freelance</option>
              <option>Remote work</option>
            </select>
            <select
              value={form.emirate}
              onChange={(e) => setForm({ ...form, emirate: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-stone-200 font-medium bg-white focus:outline-none focus:border-teal-400"
            >
              <option value="dubai">Dubai</option>
              <option value="abudhabi">Abu Dhabi</option>
              <option value="sharjah">Sharjah</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setInviteOpen(false)}
              className="flex-1 py-3 rounded-xl border-2 border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold transition active:scale-[0.98] enabled:hover:bg-teal-700 disabled:opacity-40"
            >
              Send invite
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
