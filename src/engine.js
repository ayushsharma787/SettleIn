import { STEP_LIBRARY, t } from './data'

// Build the personalized, ordered step list for a set of questionnaire answers.
export function buildRoadmap(answers) {
  const emirate = answers.emirate || 'dubai'
  return STEP_LIBRARY.filter((s) => {
    if (s.familyOnly && answers.family !== 'family') return false
    if (s.driveOnly && answers.drive === 'no') return false
    return true
  }).map((s) => {
    const learn = answers.drive === 'learn'
    return {
      ...s,
      title: t(learn && s.titleLearn ? s.titleLearn : s.title, emirate),
      subtitle: t(learn && s.subtitleLearn ? s.subtitleLearn : s.subtitle, emirate),
      docs: (learn && s.docsLearn ? s.docsLearn : s.docs).map((d) => t(d, emirate)),
      portal: t(s.portal, emirate),
      time: learn && s.timeLearn ? s.timeLearn : s.time,
    }
  })
}

// Steps auto-completed by questionnaire answers.
export function preCompleted(answers) {
  const done = []
  if (answers.employerHandled === 'yes')
    done.push('medical', 'eid-bio', 'eid-issue', 'visa-stamp')
  if (answers.employerHandled === 'progress') done.push('medical', 'eid-bio')
  if (answers.tenancy === 'yes') done.push('housing')
  return done
}

// Annotate each step with its state: done | open | locked (+ blockers).
export function computeStates(steps, completedIds) {
  const inRoadmap = new Set(steps.map((s) => s.id))
  const done = new Set(completedIds.filter((id) => inRoadmap.has(id)))
  const byId = Object.fromEntries(steps.map((s) => [s.id, s]))
  return steps.map((s) => {
    if (done.has(s.id)) return { ...s, state: 'done', blockers: [] }
    const blockers = s.deps
      .filter((d) => inRoadmap.has(d) && !done.has(d))
      .map((d) => byId[d])
    return { ...s, state: blockers.length ? 'locked' : 'open', blockers }
  })
}

export function progressOf(steps, completedIds) {
  const inRoadmap = new Set(steps.map((s) => s.id))
  const done = completedIds.filter((id) => inRoadmap.has(id)).length
  const total = steps.length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

// The step a user should focus on: first open, incomplete step.
export function currentStep(statedSteps) {
  return statedSteps.find((s) => s.state === 'open') || null
}

// Steps that become newly open after completing `stepId`.
export function unlockedBy(steps, completedIds, stepId) {
  const before = computeStates(steps, completedIds)
  const after = computeStates(steps, [...completedIds, stepId])
  return after.filter(
    (s, i) => s.state === 'open' && before[i].state === 'locked',
  )
}
