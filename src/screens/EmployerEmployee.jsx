import { useApp } from '../context/AppContext.jsx';
import { employeeRoadmap } from '../data/employer.js';
import { STEP_MAP } from '../data/steps.js';
import { TopBar } from '../components/PhoneFrame.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { RoadmapTimeline } from '../components/RoadmapTimeline.jsx';
import { Eye } from 'lucide-react';

export function EmployerEmployee() {
  const { goBack, employees, activeEmployeeId } = useApp();
  const emp = employees.find((e) => e.id === activeEmployeeId) || employees[0];
  const rm = employeeRoadmap(emp);
  const currentName = rm.currentStepId ? STEP_MAP[rm.currentStepId].title : null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <TopBar
        title={emp.name}
        onBack={goBack}
        right={
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500 bg-slate-100 rounded-full px-2 py-1">
            <Eye className="w-3 h-3" /> Read-only
          </span>
        }
      />
      <div className="px-5 py-5 screen-in">
        <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center font-extrabold text-lg shrink-0" style={{ background: emp.color }}>
              {emp.initials}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 text-lg truncate">{emp.name}</div>
              <div className="text-xs text-slate-500 truncate">{emp.role} · {emp.nationality}</div>
              <div className="text-xs text-slate-500 truncate">{emp.visaType} · {emp.answers.emirate}</div>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar pct={rm.pct} done={rm.done} total={rm.total} />
          </div>
          <div className="mt-2.5 text-xs text-slate-500">
            {rm.pct === 100 ? '🎉 Fully settled in.' : `Currently on ${currentName}${emp.stuck ? ' · flagged as stuck' : ''}.`}
          </div>
        </div>

        <div className="mt-5 text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-3">
          Settling-in journey
        </div>
        {/* Read-only: no onStepClick handler */}
        <RoadmapTimeline stepIds={rm.stepIds} completed={rm.completed} readOnly />
      </div>
    </div>
  );
}
