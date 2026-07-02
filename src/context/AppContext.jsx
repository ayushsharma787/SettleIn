import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { buildRoadmap } from '../lib/roadmap.js';
import { PRIYA_ANSWERS, PRIYA_PROFILE } from '../data/persona.js';
import { COMPANY, EMPLOYEES, employeeRoadmap } from '../data/employer.js';

const AppContext = createContext(null);

// Screen ids: welcome, questionnaire, generating, roadmap, stepDetail,
// tiers, calculator, employer, employerEmployee
export function AppProvider({ children, initialScreen = 'welcome', previewMode = false }) {
  const [history, setHistory] = useState([initialScreen]);
  const screen = history[history.length - 1];

  const [profile, setProfile] = useState(PRIYA_PROFILE);
  const [answers, setAnswers] = useState(PRIYA_ANSWERS);
  const [roadmap, setRoadmap] = useState(() => buildRoadmap(PRIYA_ANSWERS));
  const [activeStepId, setActiveStepId] = useState('bank_account');
  const [justUnlockedId, setJustUnlockedId] = useState(null);

  const [employees, setEmployees] = useState(EMPLOYEES);
  const [activeEmployeeId, setActiveEmployeeId] = useState('ahmed');

  const scrollTop = useCallback(() => {
    if (!previewMode && typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, [previewMode]);

  const navigate = useCallback((next) => {
    setHistory((h) => (h[h.length - 1] === next ? h : [...h, next]));
    scrollTop();
  }, [scrollTop]);

  const goBack = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
    scrollTop();
  }, [scrollTop]);

  const resetTo = useCallback((base) => {
    setHistory([base]);
    scrollTop();
  }, [scrollTop]);

  // Preview helper — replace the top screen without touching page scroll.
  const gotoScreen = useCallback((next) => {
    setHistory((h) => [...h.slice(0, -1), next]);
  }, []);

  const startQuestionnaire = useCallback(() => {
    setProfile({ name: 'You', initials: 'YOU' });
    setAnswers({});
    setHistory(['questionnaire']);
    scrollTop();
  }, [scrollTop]);

  const finishQuestionnaire = useCallback((finalAnswers) => {
    setAnswers(finalAnswers);
    setRoadmap(buildRoadmap(finalAnswers));
  }, []);

  const loadPersona = useCallback(() => {
    setProfile(PRIYA_PROFILE);
    setAnswers(PRIYA_ANSWERS);
    setRoadmap(buildRoadmap(PRIYA_ANSWERS));
    setHistory(['roadmap']);
    scrollTop();
  }, [scrollTop]);

  // Employee mode: the roadmap of a team member whose company runs Ahlan for
  // Business (James Miller at Nexa Tech) — same screens, employee's data.
  const loadEmployeePersona = useCallback(() => {
    const emp = EMPLOYEES.find((e) => e.id === 'james') || EMPLOYEES[0];
    setProfile({ name: emp.name, initials: emp.initials, company: COMPANY.name });
    setAnswers(emp.answers);
    const { stepIds, completed } = employeeRoadmap(emp);
    setRoadmap({ stepIds, completed });
    setHistory(['roadmap']);
    scrollTop();
  }, [scrollTop]);

  const openStep = useCallback((stepId) => {
    setActiveStepId(stepId);
    navigate('stepDetail');
  }, [navigate]);

  const previewStep = useCallback((stepId) => {
    setActiveStepId(stepId);
    gotoScreen('stepDetail');
  }, [gotoScreen]);

  const completeStep = useCallback((stepId) => {
    setRoadmap((rm) => {
      const completed = new Set(rm.completed);
      completed.add(stepId);
      const idx = rm.stepIds.indexOf(stepId);
      const nextId = rm.stepIds[idx + 1] || null;
      if (nextId) {
        setJustUnlockedId(nextId);
        setTimeout(() => setJustUnlockedId(null), 1600);
      }
      return { ...rm, completed };
    });
  }, []);

  const openEmployee = useCallback((employeeId) => {
    setActiveEmployeeId(employeeId);
    navigate('employerEmployee');
  }, [navigate]);

  const addEmployee = useCallback((emp) => {
    setEmployees((list) => [
      ...list,
      {
        id: `new_${Date.now()}`,
        name: emp.name,
        role: emp.role || 'New hire',
        nationality: emp.nationality || '—',
        initials: emp.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
        color: '#3dbda8',
        visaType: emp.visaType,
        answers: { family: 'Single', visaType: emp.visaType, emirate: emp.emirate, tenancy: 'No', driving: 'Have foreign license', visaHandled: 'In progress' },
        completedCount: 0,
        daysSince: 0,
        stuck: false,
        isNew: true,
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({
      screen, navigate, goBack, resetTo, gotoScreen, previewMode,
      profile, answers, roadmap,
      startQuestionnaire, finishQuestionnaire, loadPersona, loadEmployeePersona,
      activeStepId, openStep, previewStep, completeStep, justUnlockedId,
      employees, activeEmployeeId, openEmployee, addEmployee,
      canGoBack: history.length > 1,
    }),
    [screen, navigate, goBack, resetTo, gotoScreen, previewMode, profile, answers, roadmap,
     startQuestionnaire, finishQuestionnaire, loadPersona, loadEmployeePersona, activeStepId, openStep, previewStep,
     completeStep, justUnlockedId, employees, activeEmployeeId, openEmployee, addEmployee, history.length],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
