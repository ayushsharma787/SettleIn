"""Dependency engine — computes per-step state, blocks flags, unlocks."""
from __future__ import annotations
from dataclasses import dataclass
from datetime import date, datetime
from typing import Dict, List, Optional, Tuple

from .steps import STEP_CATALOG, template_for


class Status:
    DONE = "done"
    IN_PROGRESS = "in_progress"
    AVAILABLE = "available"
    LOCKED = "locked"
    BLOCKED = "blocked"
    AWAITING_EMPLOYEE = "awaiting_employee"


STATUS_LABEL = {
    Status.DONE: "Done",
    Status.IN_PROGRESS: "In Progress",
    Status.AVAILABLE: "Available",
    Status.LOCKED: "Locked",
    Status.BLOCKED: "Blocked",
    Status.AWAITING_EMPLOYEE: "Awaiting Employee",
}


@dataclass
class StepState:
    id: str
    name: str
    stage: str
    portal: str
    responsible: str
    processing_days: int
    required_docs: List[str]
    status: str
    due_date: Optional[str]
    completed_at: Optional[str]
    started_at: Optional[str]
    prereqs: List[str]


def _parse(d) -> Optional[date]:
    if not d:
        return None
    if isinstance(d, date):
        return d
    return datetime.fromisoformat(str(d)[:10]).date()


def compute_step_states(employee: dict) -> List[StepState]:
    """Derive live status for every step in the employee's template."""
    steps, deps = template_for(employee["visa_type"], employee["emirate"], employee["has_children"])
    statuses: Dict[str, str] = dict(employee.get("step_statuses", {}))

    result = []
    for sid in steps:
        raw = statuses.get(sid)
        prereqs = deps[sid]
        all_prereqs_done = all(statuses.get(p) == Status.DONE for p in prereqs)
        status = raw or Status.LOCKED
        if not all_prereqs_done and status != Status.DONE:
            status = Status.LOCKED
        if all_prereqs_done and (raw is None or raw == Status.LOCKED):
            status = Status.AVAILABLE

        step_def = STEP_CATALOG[sid]
        result.append(StepState(
            id=sid,
            name=step_def.name,
            stage=step_def.stage,
            portal=step_def.portal,
            responsible=step_def.responsible,
            processing_days=step_def.processing_days,
            required_docs=list(step_def.required_docs),
            status=status,
            due_date=employee.get("step_due_dates", {}).get(sid),
            completed_at=employee.get("step_completed_at", {}).get(sid),
            started_at=employee.get("step_started_at", {}).get(sid),
            prereqs=prereqs,
        ))
    return result


def current_step(employee: dict) -> Optional[StepState]:
    for s in compute_step_states(employee):
        if s.status != Status.DONE:
            return s
    return None


def current_stage(employee: dict) -> str:
    s = current_step(employee)
    return s.stage if s else "Completed"


def progress_percent(employee: dict) -> int:
    steps = compute_step_states(employee)
    if not steps:
        return 0
    done = sum(1 for s in steps if s.status == Status.DONE)
    return round(done / len(steps) * 100)


def is_blocked(employee: dict, today: date) -> bool:
    for s in compute_step_states(employee):
        if s.status == Status.BLOCKED:
            return True
        if s.status == Status.DONE or s.status == Status.LOCKED:
            continue
        d = _parse(s.due_date)
        if d and d < today:
            return True
    return False


def days_in_stage(employee: dict, today: date) -> int:
    s = current_step(employee)
    if not s or not s.started_at:
        return 0
    started = _parse(s.started_at)
    return max(0, (today - started).days)


def update_step_status(employee: dict, step_id: str, new_status: str, today: date) -> Tuple[dict, List[str]]:
    """Mutate a step's status; return (updated_employee, newly_unlocked_step_ids).

    The engine propagates: any dependent step whose prereqs are now all Done
    flips from LOCKED to AVAILABLE.
    """
    before_states = {s.id: s.status for s in compute_step_states(employee)}

    step_statuses = dict(employee.get("step_statuses", {}))
    step_statuses[step_id] = new_status

    step_completed_at = dict(employee.get("step_completed_at", {}))
    step_started_at = dict(employee.get("step_started_at", {}))

    iso_today = today.isoformat()
    if new_status == Status.DONE:
        step_completed_at[step_id] = iso_today
    elif new_status == Status.IN_PROGRESS and step_id not in step_started_at:
        step_started_at[step_id] = iso_today

    updated = {
        **employee,
        "step_statuses": step_statuses,
        "step_completed_at": step_completed_at,
        "step_started_at": step_started_at,
    }

    steps, deps = template_for(updated["visa_type"], updated["emirate"], updated["has_children"])
    final = dict(step_statuses)
    for sid in steps:
        prereqs = deps[sid]
        all_prereqs_done = all(final.get(p) == Status.DONE for p in prereqs)
        cur = final.get(sid)
        if all_prereqs_done and (cur is None or cur == Status.LOCKED):
            final[sid] = Status.AVAILABLE
        if not all_prereqs_done and cur not in (Status.DONE, Status.BLOCKED):
            final[sid] = Status.LOCKED

    updated["step_statuses"] = final
    after_states = {s.id: s.status for s in compute_step_states(updated)}
    unlocked = [
        sid for sid in after_states
        if before_states.get(sid) == Status.LOCKED and after_states[sid] == Status.AVAILABLE
    ]
    return updated, unlocked
