"""Task Board — filterable list, reassign owner, tick to complete."""
from __future__ import annotations
import streamlit as st

from .. import state
from ..steps import STEP_CATALOG
from ..ui import avatar, neutral_chip, section_header


PRIORITY_COLOR = {
    "high": ("#fee2e2", "#991b1b"),
    "medium": ("#fef3c7", "#78350f"),
    "low": ("#e0e7ff", "#3730a3"),
}


def render():
    state.ensure_state()
    tasks = state.get_tasks()
    employees = state.get_employees()
    team = state.get_team()

    section_header("Work Queue", "Task Board", "Open tasks across every employee and PRO. Reassign inline; ticking off updates the linked onboarding step.")
    st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)

    c1, c2, c3 = st.columns([1.2, 1.2, 5])
    with c1:
        owners = ["Any"] + [t["id"] for t in team]
        owner_filter = st.selectbox(
            "Owner",
            owners,
            format_func=lambda o: "Any owner" if o == "Any" else next((t["name"] for t in team if t["id"] == o), o),
            key="task_owner_filter",
        )
    with c2:
        status_filter = st.selectbox("Status", ["Any", "open", "blocked", "done"], key="task_status_filter")

    filtered = [
        t for t in tasks
        if (owner_filter == "Any" or t["owner_id"] == owner_filter)
        and (status_filter == "Any" or t["status"] == status_filter)
    ]
    open_count = sum(1 for t in tasks if t["status"] == "open")
    blocked_count = sum(1 for t in tasks if t["status"] == "blocked")
    done_count = sum(1 for t in tasks if t["status"] == "done")

    st.markdown(
        f'<div style="display:flex; gap:14px; margin:14px 0;">'
        f'<div class="chip chip-in_progress"><span class="chip-dot" style="background:#3b82f6"></span>{open_count} open</div>'
        f'<div class="chip chip-blocked"><span class="chip-dot" style="background:#f43f5e"></span>{blocked_count} blocked</div>'
        f'<div class="chip chip-done"><span class="chip-dot" style="background:#10b981"></span>{done_count} done</div>'
        f'</div>',
        unsafe_allow_html=True,
    )

    st.markdown('<div class="ahlan-card" style="padding:0;">', unsafe_allow_html=True)
    header = (
        '<div style="display:grid; grid-template-columns:3fr 2fr 1.5fr 1.2fr 1.2fr 1fr; padding:12px 18px; '
        'font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:#626d94; font-weight:700; '
        'background:#f4f5f9; border-radius:16px 16px 0 0;">'
        '<div>Task</div><div>Employee</div><div>Owner</div><div>Due</div><div>Priority</div><div></div>'
        '</div>'
    )
    st.markdown(header, unsafe_allow_html=True)

    for t in filtered:
        emp = next((e for e in employees if e["id"] == t["employee_id"]), None)
        if not emp:
            continue
        step_name = STEP_CATALOG[t["step_id"]].name if t["step_id"] in STEP_CATALOG else t["step_id"].title()
        pbg, pfg = PRIORITY_COLOR.get(t["priority"], ("#e6e9f2", "#3f4a70"))
        strike = "text-decoration: line-through; opacity: 0.55;" if t["status"] == "done" else ""
        blocked_ring = "border-left: 3px solid #f43f5e;" if t["status"] == "blocked" else ""
        row = (
            f'<div style="display:grid; grid-template-columns:3fr 2fr 1.5fr 1.2fr 1.2fr 1fr; padding:12px 18px; '
            f'align-items:center; border-bottom:1px solid #f4f5f9; font-size:13px; {blocked_ring}">'
            f'<div style="{strike}"><div style="font-weight:600;">{t["title"]}</div>'
            f'<div style="font-size:11px; color:#626d94;">{step_name}</div></div>'
            f'<div style="display:flex; align-items:center; gap:8px;">{avatar(emp["name"], emp["initials"], emp["avatar_bg"], "sm")}<span style="font-size:12px;">{emp["name"]}</span></div>'
            f'<div></div><div>{t["due_date"]}</div>'
            f'<div><span class="chip" style="background:{pbg}; color:{pfg}; border-color:{pbg};">{t["priority"].title()}</span></div>'
            f'<div></div>'
            f'</div>'
        )
        st.markdown(row, unsafe_allow_html=True)

        # Interactive controls
        ac = st.columns([3, 2, 1.5, 1.2, 1.2, 1])
        with ac[2]:
            current_owner = t["owner_id"]
            owner_ids = [x["id"] for x in team]
            new_owner = st.selectbox(
                "owner",
                owner_ids,
                format_func=lambda o: next((x["name"].split()[0] for x in team if x["id"] == o), o),
                index=owner_ids.index(current_owner) if current_owner in owner_ids else 0,
                key=f"tk_own_{t['id']}",
                label_visibility="collapsed",
            )
            if new_owner != current_owner:
                state.reassign_task(t["id"], new_owner)
                st.toast(f"Reassigned to {next(x['name'].split()[0] for x in team if x['id']==new_owner)}", icon="👤")
                st.rerun()
        with ac[5]:
            if t["status"] != "done":
                if st.button("✓ Done", key=f"tk_done_{t['id']}"):
                    state.complete_task(t["id"])
                    st.toast(f"Task completed", icon="✓")
                    st.rerun()

    if not filtered:
        st.markdown("<div style='padding:24px; text-align:center; color:#97a0c0;'>No tasks match your filters.</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
