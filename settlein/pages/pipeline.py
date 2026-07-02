"""Onboarding Pipeline — kanban + table view."""
from __future__ import annotations
import streamlit as st

from .. import state
from ..engine import current_step, current_stage, days_in_stage, is_blocked, Status
from ..steps import PIPELINE_STAGES, VISA_LABEL
from ..ui import render_employee_card, section_header, chip, avatar


def _filters(employees):
    st.markdown("<div style='height:6px'></div>", unsafe_allow_html=True)
    fc1, fc2, fc3, fc4, fc5 = st.columns([1.4, 1.2, 1.2, 1.4, 1.2])
    with fc1:
        st.session_state.filter_visa = st.selectbox(
            "Visa", ["Any", "employer", "freelance", "golden"],
            format_func=lambda v: "Any visa" if v == "Any" else VISA_LABEL[v],
            index=["Any", "employer", "freelance", "golden"].index(st.session_state.filter_visa),
            key="pipeline_filter_visa",
        )
    with fc2:
        emirates = ["Any"] + sorted({e["emirate"] for e in employees})
        st.session_state.filter_emirate = st.selectbox("Emirate", emirates,
            index=emirates.index(st.session_state.filter_emirate) if st.session_state.filter_emirate in emirates else 0,
            key="pipeline_filter_em")
    with fc3:
        st.session_state.filter_status = st.selectbox("Status", ["Any", "active", "blocked", "completed"],
            index=["Any", "active", "blocked", "completed"].index(st.session_state.filter_status),
            key="pipeline_filter_st")
    with fc4:
        team = state.get_team()
        pro_ids = ["Any"] + [t["id"] for t in team if t["role"] == "PRO"]
        st.session_state.filter_pro = st.selectbox("Assigned PRO", pro_ids,
            format_func=lambda pid: "Any PRO" if pid == "Any" else next((t["name"] for t in team if t["id"] == pid), pid),
            index=pro_ids.index(st.session_state.filter_pro) if st.session_state.filter_pro in pro_ids else 0,
            key="pipeline_filter_pro")
    with fc5:
        st.markdown("<div style='margin-top:26px; font-size:12px; color:#626d94;'>View</div>", unsafe_allow_html=True)
        view = st.radio("view", ["Kanban", "Table"], horizontal=True, label_visibility="collapsed",
                        index=["Kanban", "Table"].index(st.session_state.pipeline_view), key="pipeline_view_radio")
        st.session_state.pipeline_view = view


def _apply_filters(employees, today):
    fv = st.session_state.filter_visa
    fe = st.session_state.filter_emirate
    fs = st.session_state.filter_status
    fp = st.session_state.filter_pro
    out = []
    for e in employees:
        if fv != "Any" and e["visa_type"] != fv:
            continue
        if fe != "Any" and e["emirate"] != fe:
            continue
        if fp != "Any" and e["assigned_pro"] != fp:
            continue
        if fs == "blocked" and not is_blocked(e, today):
            continue
        if fs == "completed" and current_stage(e) != "Completed":
            continue
        if fs == "active" and current_stage(e) == "Completed":
            continue
        out.append(e)
    return out


def _kanban(employees, today):
    grouped = {s: [] for s in PIPELINE_STAGES}
    for e in employees:
        grouped[current_stage(e)].append(e)
    cols = st.columns(len(PIPELINE_STAGES))
    for idx, stage in enumerate(PIPELINE_STAGES):
        with cols[idx]:
            st.markdown(
                f'<div class="kanban-column">'
                f'<div class="kanban-header"><div class="title">{stage}</div>'
                f'<div class="count">{len(grouped[stage])}</div></div>',
                unsafe_allow_html=True,
            )
            for e in grouped[stage]:
                st.markdown(render_employee_card(e, today), unsafe_allow_html=True)
                if st.button(f"Open →", key=f"kb_{e['id']}", use_container_width=True):
                    st.session_state.selected_employee_id = e["id"]
                    st.session_state.nav = "Employee Detail"
                    st.rerun()
            if not grouped[stage]:
                st.markdown(
                    '<div style="text-align:center; padding:24px 8px; border:1px dashed #c7cce0; border-radius:10px; color:#97a0c0; font-size:12px;">No employees</div>',
                    unsafe_allow_html=True,
                )
            st.markdown("</div>", unsafe_allow_html=True)


def _table(employees, today):
    team = state.get_team()
    st.markdown('<div class="ahlan-card" style="padding:0;">', unsafe_allow_html=True)
    header_html = (
        '<div style="display:grid; grid-template-columns:2fr 1.4fr 1.2fr 1fr 1.6fr 1.6fr 0.6fr 1.2fr; '
        'padding:10px 16px; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; '
        'color:#626d94; font-weight:700; background:#f4f5f9; border-radius:16px 16px 0 0;">'
        '<div>Employee</div><div>Role</div><div>Visa</div><div>Emirate</div><div>Stage</div><div>Step</div><div>Days</div><div>PRO</div>'
        '</div>'
    )
    st.markdown(header_html, unsafe_allow_html=True)
    for e in employees:
        s = current_step(e)
        pro_name = next((t["name"] for t in team if t["id"] == e["assigned_pro"]), "—")
        blocked = is_blocked(e, today)
        blk = ' <span style="color:#f43f5e;">⚠︎</span>' if blocked else ''
        step_cell = f'{s.name} {chip(s.status)}' if s else '—'
        days = days_in_stage(e, today) or "—"
        row = (
            f'<div style="display:grid; grid-template-columns:2fr 1.4fr 1.2fr 1fr 1.6fr 1.6fr 0.6fr 1.2fr; '
            f'padding:12px 16px; align-items:center; border-bottom:1px solid #f4f5f9; font-size:13px;">'
            f'<div style="display:flex; align-items:center; gap:10px;">{avatar(e["name"], e["initials"], e["avatar_bg"], "sm")}'
            f'<div><div style="font-weight:600;">{e["name"]}{blk}</div>'
            f'<div style="font-size:11px; color:#626d94;">{e["nationality"]}</div></div></div>'
            f'<div>{e["role"]}</div>'
            f'<div>{VISA_LABEL[e["visa_type"]]}</div>'
            f'<div>{e["emirate"]}</div>'
            f'<div>{current_stage(e)}</div>'
            f'<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">{step_cell}</div>'
            f'<div>{days}</div>'
            f'<div>{pro_name}</div>'
            f'</div>'
        )
        st.markdown(row, unsafe_allow_html=True)
        if st.button(f"Open {e['first_name']} {e['last_name']}", key=f"tbl_{e['id']}"):
            st.session_state.selected_employee_id = e["id"]
            st.session_state.nav = "Employee Detail"
            st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)


def render():
    state.ensure_state()
    employees = state.get_employees()
    today = state.get_today()

    section_header(
        "Pipeline",
        "Onboarding Pipeline",
        f"{len(employees)} employees · click any card for the personalized dependency roadmap."
    )

    _filters(employees)
    filtered = _apply_filters(employees, today)

    st.markdown(f"<div class='small' style='margin:14px 0 10px;'>Showing <b>{len(filtered)}</b> of {len(employees)} employees.</div>", unsafe_allow_html=True)

    if st.session_state.pipeline_view == "Kanban":
        _kanban(filtered, today)
    else:
        _table(filtered, today)
