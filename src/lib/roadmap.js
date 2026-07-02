import { STEP_LIBRARY, STEP_MAP } from '../data/steps.js';

// Build a personalized, ordered roadmap from questionnaire answers.
// Returns { stepIds: [...], completed: Set<string> }.
//
// The roadmap is strictly sequential: a step is "current" when it's the first
// incomplete step, everything after is "locked", everything before is "done".
export function buildRoadmap(answers) {
  const hasKids = answers.family === 'Family with children';
  const drives = answers.driving !== 'No';
  const hasTenancy = answers.tenancy === 'Yes';

  const stepIds = STEP_LIBRARY.filter((step) => {
    if (step.familyOnly && !hasKids) return false;
    if (step.drivingOnly && !drives) return false;
    // Already has a permanent home → skip the search, keep registration
    if (step.id === 'housing_search' && hasTenancy) return false;
    return true;
  }).map((s) => s.id);

  // Pre-complete the leading visa / Emirates ID prefix based on employer answer.
  const visaPrefix = ['medical_test', 'eid_biometrics', 'eid_issuance', 'visa_stamping'];
  let completedIds = [];
  if (answers.visaHandled === 'Yes') {
    completedIds = visaPrefix;
  } else if (answers.visaHandled === 'In progress') {
    completedIds = ['medical_test', 'eid_biometrics'];
  }

  const completed = new Set(completedIds.filter((id) => stepIds.includes(id)));
  return { stepIds, completed };
}

// Derive per-step status for rendering.
// status: 'done' | 'current' | 'locked'
export function deriveStatuses(stepIds, completed) {
  let firstIncompleteFound = false;
  return stepIds.map((id) => {
    if (completed.has(id)) {
      return { id, status: 'done' };
    }
    if (!firstIncompleteFound) {
      firstIncompleteFound = true;
      return { id, status: 'current' };
    }
    return { id, status: 'locked' };
  });
}

export function progressFor(stepIds, completed) {
  const total = stepIds.length;
  const done = stepIds.filter((id) => completed.has(id)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}

export function currentStepId(stepIds, completed) {
  return stepIds.find((id) => !completed.has(id)) || null;
}

// The step immediately before `id` in the list (for the "complete X first" note).
export function prerequisiteTitle(stepIds, id) {
  const idx = stepIds.indexOf(id);
  if (idx <= 0) return null;
  const prevId = stepIds[idx - 1];
  return STEP_MAP[prevId]?.title || null;
}
