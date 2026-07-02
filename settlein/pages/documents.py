"""Documents — per-employee checklist grid."""
from __future__ import annotations
import streamlit as st

from .. import state
from ..engine import compute_step_states
from ..ui import section_header, avatar


def _mock_doc_status(emp_id: str, doc: str) -> str:
    """Deterministic mock — hash of employee+doc."""
    h = hash(f"{emp_id}::{doc}") % 5
    if h == 0:
        return "Missing"
    if h == 1:
        return "Expiring"
    return "Received"


def _doc_pill(status: str) -> str:
    if status == "Received":
        return '<span class="chip chip-done"><span class="chip-dot" style="background:#10b981"></span>Received</span>'
    if status == "Expiring":
        return '<span class="chip chip-awaiting_employee"><span class="chip-dot" style="background:#f59e0b"></span>Expiring</span>'
    return '<span class="chip chip-blocked"><span class="chip-dot" style="background:#f43f5e"></span>Missing</span>'


def render():
    state.ensure_state()
    employees = state.get_employees()

    section_header("Files", "Documents", "Per-employee document checklist grid across the full onboarding chain.")
    st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)

    ids = [e["id"] for e in employees]
    picked = st.selectbox(
        "Employee",
        ids,
        format_func=lambda i: next((f'{e["name"]} · {e["role"]}' for e in employees if e["id"] == i), i),
        key="docs_picker",
    )
    e = next((x for x in employees if x["id"] == picked), None)
    if not e:
        return

    steps = compute_step_states(e)
    # Collect docs across the chain (dedup)
    seen = set()
    rows = []
    for s in steps:
        for d in s.required_docs:
            key = d
            if key in seen:
                continue
            seen.add(key)
            status = _mock_doc_status(e["id"], d)
            rows.append({"doc": d, "used_by": s.name, "status": status})

    st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
    st.markdown(
        f'<div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">'
        f'{avatar(e["name"], e["initials"], e["avatar_bg"], "lg")}'
        f'<div><div style="font-family:Manrope,sans-serif; font-size:18px; font-weight:700; color:#0b0f1e;">{e["name"]}</div>'
        f'<div style="font-size:12px; color:#626d94;">{e["role"]} · {e["emirate"]}</div></div>'
        f'</div>',
        unsafe_allow_html=True,
    )

    if not rows:
        st.markdown("<div class='small'>No documents required.</div>", unsafe_allow_html=True)
    else:
        # 3-column grid
        cols = st.columns(3)
        for idx, r in enumerate(rows):
            with cols[idx % 3]:
                st.markdown(
                    f'<div style="padding:14px; background:#f4f5f9; border-radius:12px; margin-bottom:10px;">'
                    f'<div style="font-size:13px; font-weight:600; color:#141a2e;">{r["doc"]}</div>'
                    f'<div style="font-size:11px; color:#626d94; margin:4px 0 8px;">Required for {r["used_by"]}</div>'
                    f'{_doc_pill(r["status"])}'
                    f'</div>',
                    unsafe_allow_html=True,
                )
                if st.button(f"⬆ Upload {r['doc'][:20]}", key=f"upl_{picked}_{r['doc']}", use_container_width=True):
                    st.toast(f"Mock upload — {r['doc']} attached to {e['name']}", icon="📎")
    st.markdown("</div>", unsafe_allow_html=True)
