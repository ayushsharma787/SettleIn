"""Read-only derived selectors over the roster."""
from __future__ import annotations
from datetime import date
from typing import Dict, List

from .engine import (
    Status, compute_step_states, current_step, current_stage,
    progress_percent, days_in_stage, is_blocked, _parse,
)
from .steps import PIPELINE_STAGES


def days_between(a, b) -> int:
    if isinstance(a, str):
        a = _parse(a)
    if isinstance(b, str):
        b = _parse(b)
    return (a - b).days


def stage_counts(employees: List[dict]) -> Dict[str, int]:
    counts = {s: 0 for s in PIPELINE_STAGES}
    for e in employees:
        stage = current_stage(e)
        counts[stage] = counts.get(stage, 0) + 1
    return counts


def active_onboardings(employees: List[dict]) -> int:
    return sum(1 for e in employees if current_stage(e) != "Completed")


def completed_onboardings(employees: List[dict]) -> int:
    return sum(1 for e in employees if current_stage(e) == "Completed")


def avg_time_to_complete(employees: List[dict]) -> int:
    completed = [e for e in employees if current_stage(e) == "Completed"]
    if not completed:
        return 0
    total = 0
    count = 0
    for e in completed:
        started_values = sorted(v for v in e.get("step_started_at", {}).values() if v)
        completed_values = sorted(v for v in e.get("step_completed_at", {}).values() if v)
        if started_values and completed_values:
            total += days_between(completed_values[-1], started_values[0])
            count += 1
    return round(total / count) if count > 0 else 0


def compliance_alerts(compliance: List[dict], today: date, within_days=90) -> List[dict]:
    return [c for c in compliance if days_between(c["expiry_date"], today) <= within_days]


def urgency_bucket(days: int) -> str:
    if days < 0:
        return "overdue"
    if days <= 30:
        return "d30"
    if days <= 90:
        return "d90"
    return "ok"


def urgency_counts(compliance: List[dict], today: date) -> Dict[str, int]:
    buckets = {"overdue": 0, "d30": 0, "d90": 0, "ok": 0}
    for c in compliance:
        d = days_between(c["expiry_date"], today)
        buckets[urgency_bucket(d)] += 1
    return buckets


def attention_list(employees: List[dict], compliance: List[dict], today: date) -> List[dict]:
    items = []
    for e in employees:
        steps = compute_step_states(e)
        for s in steps:
            if s.status == Status.BLOCKED:
                items.append({
                    "id": f"blk_{e['id']}_{s.id}",
                    "employee": e,
                    "kind": "blocked",
                    "label": f"{s.name} blocked",
                    "sort_key": 0,
                })
            elif s.due_date and s.status not in (Status.DONE, Status.LOCKED):
                d = days_between(s.due_date, today)
                if d < 0:
                    items.append({
                        "id": f"over_{e['id']}_{s.id}",
                        "employee": e,
                        "kind": "overdue",
                        "label": f"{s.name} overdue by {abs(d)}d",
                        "sort_key": d,
                    })
    for c in compliance:
        d = days_between(c["expiry_date"], today)
        if d <= 30:
            emp = next((x for x in employees if x["id"] == c["employee_id"]), None)
            if emp:
                items.append({
                    "id": f"cmp_{c['id']}",
                    "employee": emp,
                    "kind": "expired" if d < 0 else "expiring",
                    "label": f"{c['document']} " + (f"expired {abs(d)}d ago" if d < 0 else f"expires in {d}d"),
                    "sort_key": d,
                })
    items.sort(key=lambda x: x["sort_key"])
    return items


def alerts_count(employees, compliance, today) -> int:
    return len(attention_list(employees, compliance, today))


def avg_days_per_step(employees: List[dict]) -> Dict[str, int]:
    """For each step id, avg days between started_at and completed_at."""
    totals: Dict[str, Dict[str, int]] = {}
    for e in employees:
        for sid, done in e.get("step_completed_at", {}).items():
            started = e.get("step_started_at", {}).get(sid)
            if started and done:
                d = max(1, days_between(done, started))
                totals.setdefault(sid, {"total": 0, "count": 0})
                totals[sid]["total"] += d
                totals[sid]["count"] += 1
    return {k: round(v["total"] / v["count"]) for k, v in totals.items()}


def slowest_step(employees) -> tuple:
    avg = avg_days_per_step(employees)
    if not avg:
        return (None, 0)
    sid = max(avg, key=avg.get)
    return (sid, avg[sid])


def onboardings_per_month(employees: List[dict]) -> List[dict]:
    counts: Dict[str, int] = {}
    for e in employees:
        arr = e.get("arrival_date")
        if not arr:
            continue
        key = arr[:7]
        counts[key] = counts.get(key, 0) + 1
    return sorted([{"month": k, "count": v} for k, v in counts.items()], key=lambda x: x["month"])
