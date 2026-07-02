import React, { useCallback, useRef, useState } from 'react'
import Welcome from './components/Welcome'
import Questionnaire, { GeneratingScreen } from './components/Questionnaire'
import Roadmap from './components/Roadmap'
import StepDetail from './components/StepDetail'
import Pricing from './components/Pricing'
import Calculator from './components/Calculator'
import Employer from './components/Employer'
import { Toast } from './components/ui'
import { PRIYA, NEXA_EMPLOYEES, EMIRATES } from './data'
import { buildRoadmap, computeStates, preCompleted, unlockedBy } from './engine'

export default function App() {
  // ---- navigation stack ----
  const [stack, setStack] = useState([{ name: 'welcome' }])
  const screen = stack[stack.length - 1]
  const push = (name, params = {}) => setStack((s) => [...s, { name, params }])
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))

  // ---- B2C state (pre-loaded with the Priya persona) ----
  const [user, setUser] = useState(() => ({
    name: PRIYA.name,
    meta: PRIYA.meta,
    answers: PRIYA.answers,
    completed: preCompleted(PRIYA.answers),
    docChecks: {},
  }))

  // ---- B2B state ----
  const [employees, setEmployees] = useState(NEXA_EMPLOYEES)

  // ---- toast ----
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  // ---- derived B2C roadmap ----
  const steps = buildRoadmap(user.answers)
  const stated = computeStates(steps, user.completed)

  const completeStep = (stepId) => {
    const unlocked = unlockedBy(steps, user.completed, stepId)
    setUser((u) => ({ ...u, completed: [...u.completed, stepId] }))
    pop()
    const doneCount = user.completed.length + 1
    if (doneCount === steps.length) showToast('🎉 That was your last step — you’re settled in!')
    else if (unlocked.length)
      showToast(`✓ Step complete! ${unlocked.map((s) => s.title).join(' & ')} unlocked 🔓`)
    else showToast('✓ Step complete!')
  }

  const toggleDoc = (stepId, i) =>
    setUser((u) => ({
      ...u,
      docChecks: {
        ...u.docChecks,
        [stepId]: { ...(u.docChecks[stepId] || {}), [i]: !(u.docChecks[stepId] || {})[i] },
      },
    }))

  const startQuestionnaire = () => push('questionnaire')

  const finishQuestionnaire = (answers) => {
    setUser({
      name: null,
      meta: null,
      answers,
      completed: preCompleted(answers),
      docChecks: {},
    })
    push('generating')
  }

  const b2cMenu = [
    { icon: '💠', label: 'Plans & pricing', onClick: () => push('pricing') },
    { icon: '🧮', label: 'Cost calculator', onClick: () => push('calculator') },
    { icon: '🔄', label: 'Retake questionnaire', onClick: startQuestionnaire },
    { icon: '🏠', label: 'Back to welcome', onClick: () => setStack([{ name: 'welcome' }]) },
  ]

  const plusBanner = (
    <button
      onClick={() => push('pricing')}
      className="card-in mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-4 flex items-center gap-3 text-left transition active:scale-[0.98]"
    >
      <span className="text-2xl">✨</span>
      <div className="flex-1">
        <div className="font-bold text-sm">Ahlan Plus — the app does your paperwork</div>
        <div className="text-xs text-teal-100">
          Auto-filled forms, document vault & cost calculator · AED 99
        </div>
      </div>
      <span className="shrink-0 text-xs font-bold bg-white text-teal-700 px-3 py-1.5 rounded-full">
        See plans
      </span>
    </button>
  )

  // ---- render current screen ----
  let content = null

  if (screen.name === 'welcome') {
    content = (
      <Welcome
        onIndividual={startQuestionnaire}
        onEmployer={() => push('employer')}
        onResumePriya={() => push('roadmap')}
      />
    )
  } else if (screen.name === 'questionnaire') {
    content = <Questionnaire onBack={pop} onDone={finishQuestionnaire} />
  } else if (screen.name === 'generating') {
    content = (
      <GeneratingScreen
        onDone={() => setStack([{ name: 'welcome' }, { name: 'roadmap' }])}
      />
    )
  } else if (screen.name === 'roadmap') {
    const emirateLabel = EMIRATES[user.answers.emirate].label
    content = (
      <Roadmap
        title={user.name ? `${user.name}’s roadmap` : 'Your roadmap'}
        subtitle={user.meta || `${emirateLabel} · personalized for you`}
        steps={steps}
        completedIds={user.completed}
        onBack={pop}
        onOpenStep={(s) => s.state !== 'locked' && push('step', { stepId: s.id })}
        menuItems={b2cMenu}
        banner={plusBanner}
      />
    )
  } else if (screen.name === 'step') {
    const step = stated.find((s) => s.id === screen.params.stepId)
    const depTitles = step
      ? step.deps.map((d) => steps.find((x) => x.id === d)?.title).filter(Boolean)
      : []
    content = step ? (
      <StepDetail
        step={{ ...step, depTitles }}
        docChecks={user.docChecks[step.id]}
        onToggleDoc={(i) => toggleDoc(step.id, i)}
        onBack={pop}
        onComplete={() => completeStep(step.id)}
        showToast={showToast}
      />
    ) : null
  } else if (screen.name === 'pricing') {
    content = (
      <Pricing
        onBack={pop}
        onPreviewCalculator={() => push('calculator')}
        showToast={showToast}
      />
    )
  } else if (screen.name === 'calculator') {
    content = <Calculator onBack={pop} />
  } else if (screen.name === 'employer') {
    content = (
      <Employer
        employees={employees}
        onAddEmployee={(e) => setEmployees((list) => [e, ...list])}
        onOpenEmployee={(e) => push('empRoadmap', { empId: e.id })}
        onBack={pop}
        showToast={showToast}
      />
    )
  } else if (screen.name === 'empRoadmap' || screen.name === 'empStep') {
    const emp = employees.find((e) => e.id === screen.params.empId)
    if (!emp) {
      content = null
    } else {
      const empSteps = buildRoadmap(emp.answers)
      const empStated = computeStates(empSteps, emp.completed)
      if (screen.name === 'empRoadmap') {
        content = (
          <Roadmap
            title={emp.name}
            subtitle={`${emp.role} · Day ${emp.day} of onboarding`}
            steps={empSteps}
            completedIds={emp.completed}
            readOnly
            highlightId={emp.currentId}
            onBack={pop}
            onOpenStep={(s) =>
              s.state !== 'locked' &&
              push('empStep', { empId: emp.id, stepId: s.id })
            }
          />
        )
      } else {
        const step = empStated.find((s) => s.id === screen.params.stepId)
        const depTitles = step
          ? step.deps.map((d) => empSteps.find((x) => x.id === d)?.title).filter(Boolean)
          : []
        content = step ? (
          <StepDetail
            step={{ ...step, depTitles }}
            readOnly
            docChecks={{}}
            onToggleDoc={() => {}}
            onBack={pop}
            onComplete={() => {}}
            showToast={showToast}
          />
        ) : null
      }
    }
  }

  return (
    <div className="min-h-screen sm:py-6 flex justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-teal-100/60">
      <div className="relative w-full sm:max-w-[420px] bg-white sm:rounded-[2.2rem] shadow-2xl shadow-stone-400/30 overflow-hidden flex flex-col min-h-screen sm:min-h-0">
        <div className="flex-1 overflow-y-auto" key={`${screen.name}-${JSON.stringify(screen.params || {})}`}>
          {content}
        </div>
        <Toast toast={toast} />
      </div>
    </div>
  )
}
