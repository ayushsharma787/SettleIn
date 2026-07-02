"""Session state management. Single source of truth for the running demo."""
from __future__ import annotations
import copy
from datetime import date, datetime
from typing import List

import streamlit as st

from . import seed
from .engine import Status, update_step_status, compute_step_states


def _init():
    if "initialized" in st.session_state:
        return
    st.session_state.initialized = True
    st.session_state.employees = copy.deepcopy(seed.EMPLOYEES)
    st.session_state.tasks = copy.deepcopy(seed.TASKS)
    st.session_state.activity = copy.deepcopy(seed.ACTIVITY)
    st.session_state.compliance = copy.deepcopy(seed.COMPLIANCE_ITEMS)
    st.session_state.today = seed.TODAY
    st.session_state.recent_unlocks = {}   # employee_id -> list[step_id]
    st.session_state.recent_unlock_time = None
    st.session_state.nav = "Overview"
    st.session_state.selected_employee_id = None
    st.session_state.filter_visa = "Any"
    st.session_state.filter_emirate = "Any"
    st.session_state.filter_status = "Any"
    st.session_state.filter_pro = "Any"
    st.session_state.pipeline_view = "Kanban"
    st.session_state.compliance_view = "Table"


def ensure_state():
    _init()


def get_employees() -> List[dict]:
    return st.session_state.employees


def get_employee(emp_id: str) -> dict:
    return next((e for e in st.session_state.employees if e["id"] == emp_id), None)


def get_team():
    return seed.TEAM


def get_company():
    return seed.COMPANY


def get_today() -> date:
    return st.session_state.today


def get_tasks():
    return st.session_state.tasks


def get_compliance():
    return st.session_state.compliance


def get_activity():
    return st.session_state.activity


def _log(employee_id: str, message: str, actor_id: str = "u2"):
    st.session_state.activity.insert(0, {
        "id": f"a_{datetime.now().timestamp()}",
        "ts": st.session_state.today.isoformat(),
        "actor_id": actor_id,
        "employee_id": employee_id,
        "message": message,
    })


def mark_step(employee_id: str, step_id: str, new_status: str, actor_id: str = "u2") -> List[str]:
    idx = next((i for i, e in enumerate(st.session_state.employees) if e["id"] == employee_id), None)
    if idx is None:
        return []
    before = st.session_state.employees[idx]
    after, unlocks = update_step_status(before, step_id, new_status, st.session_state.today)
    st.session_state.employees[idx] = after

    from .steps import STEP_CATALOG
    step_name = STEP_CATALOG[step_id].name if step_id in STEP_CATALOG else step_id
    status_label = {
        Status.DONE: "Done",
        Status.IN_PROGRESS: "In Progress",
        Status.BLOCKED: "Blocked",
        Status.AVAILABLE: "Available",
    }.get(new_status, new_status)
    _log(employee_id, f"marked {step_name} as {status_label} for {after['name']}", actor_id)

    st.session_state.recent_unlocks[employee_id] = unlocks
    st.session_state.recent_unlock_time = datetime.now().timestamp()
    return unlocks


def reassign_task(task_id: str, new_owner_id: str):
    for t in st.session_state.tasks:
        if t["id"] == task_id:
            t["owner_id"] = new_owner_id
            return


def set_task_status(task_id: str, new_status: str):
    for t in st.session_state.tasks:
        if t["id"] == task_id:
            t["status"] = new_status
            return


def complete_task(task_id: str):
    task = next((t for t in st.session_state.tasks if t["id"] == task_id), None)
    if not task:
        return
    task["status"] = "done"
    from .steps import STEP_CATALOG
    if task.get("step_id") and task["step_id"] in STEP_CATALOG:
        mark_step(task["employee_id"], task["step_id"], Status.DONE)


def start_renewal(compliance_id: str) -> str:
    item = next((c for c in st.session_state.compliance if c["id"] == compliance_id), None)
    if not item:
        return ""
    emp = get_employee(item["employee_id"])
    new_task = {
        "id": f"t_{datetime.now().timestamp()}",
        "employee_id": item["employee_id"],
        "step_id": "renewal",
        "title": f"Renew {emp['name']} {item['document']}",
        "owner_id": "u2",
        "due_date": item["expiry_date"],
        "status": "open",
        "priority": "high",
    }
    st.session_state.tasks.insert(0, new_task)
    _log(item["employee_id"], f"started {item['document']} renewal for {emp['name']}", "u1")
    return new_task["id"]


def reset_all():
    for k in list(st.session_state.keys()):
        del st.session_state[k]
    _init()
