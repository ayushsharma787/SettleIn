import { buildRoadmap } from '../lib/roadmap.js';

export const COMPANY = {
  name: 'Nexa Tech',
  logo: 'NX',
  seats: 6,
};

// Each employee carries the answers that shape which steps exist, plus a
// `completedCount` (leading steps already done) so we hit a target progress.
export const EMPLOYEES = [
  {
    id: 'ahmed',
    name: 'Ahmed Al-Rashid',
    role: 'Sales Manager',
    nationality: 'Egyptian',
    initials: 'AA',
    color: '#0d8b78',
    visaType: 'Employer-sponsored',
    answers: { family: 'Couple', visaType: 'Employer-sponsored', emirate: 'Dubai', tenancy: 'No', driving: 'Have foreign license', visaHandled: 'Yes' },
    completedCount: 5,
    daysSince: 12,
    stuck: true,
  },
  {
    id: 'fatima',
    name: 'Fatima Noor',
    role: 'Product Lead',
    nationality: 'Pakistani',
    initials: 'FN',
    color: '#0e6f62',
    visaType: 'Employer-sponsored',
    answers: { family: 'Family with children', visaType: 'Employer-sponsored', emirate: 'Abu Dhabi', tenancy: 'No', driving: 'Have foreign license', visaHandled: 'Yes' },
    completedCount: 11,
    daysSince: 15,
    stuck: false,
  },
  {
    id: 'chen',
    name: 'Chen Wei',
    role: 'Backend Engineer',
    nationality: 'Chinese',
    initials: 'CW',
    color: '#17a892',
    visaType: 'Employer-sponsored',
    answers: { family: 'Single', visaType: 'Employer-sponsored', emirate: 'Dubai', tenancy: 'No', driving: 'No', visaHandled: 'In progress' },
    completedCount: 1,
    daysSince: 3,
    stuck: false,
  },
  {
    id: 'sarah',
    name: 'Sarah Okonkwo',
    role: 'UX Designer',
    nationality: 'Nigerian',
    initials: 'SO',
    color: '#0d8b78',
    visaType: 'Remote work',
    answers: { family: 'Single', visaType: 'Remote work', emirate: 'Dubai', tenancy: 'No', driving: 'Have foreign license', visaHandled: 'Yes' },
    completedCount: 7,
    daysSince: 9,
    stuck: false,
  },
  {
    id: 'james',
    name: 'James Miller',
    role: 'Finance Analyst',
    nationality: 'British',
    initials: 'JM',
    color: '#0e6f62',
    visaType: 'Employer-sponsored',
    answers: { family: 'Family with children', visaType: 'Employer-sponsored', emirate: 'Dubai', tenancy: 'No', driving: 'Have foreign license', visaHandled: 'Yes' },
    completedCount: 6,
    daysSince: 7,
    stuck: false,
  },
  {
    id: 'maria',
    name: 'Maria Santos',
    role: 'HR Coordinator',
    nationality: 'Filipino',
    initials: 'MS',
    color: '#17a892',
    visaType: 'Employer-sponsored',
    answers: { family: 'Single', visaType: 'Employer-sponsored', emirate: 'Dubai', tenancy: 'No', driving: 'Have foreign license', visaHandled: 'Yes' },
    completedCount: 12,
    daysSince: 20,
    stuck: false,
  },
];

// Resolve an employee into a full roadmap snapshot.
export function employeeRoadmap(emp) {
  const { stepIds } = buildRoadmap(emp.answers);
  const count = Math.min(emp.completedCount, stepIds.length);
  const completed = new Set(stepIds.slice(0, count));
  const pct = stepIds.length === 0 ? 0 : Math.round((count / stepIds.length) * 100);
  const currentStepId = stepIds.find((id) => !completed.has(id)) || null;
  return { stepIds, completed, pct, currentStepId, done: count, total: stepIds.length };
}
