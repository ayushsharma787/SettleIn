"""Employee Detail — dependency roadmap with GSAP-animated unlock flash."""
from __future__ import annotations
import streamlit as st
import streamlit.components.v1 as components
import json

from .. import state
from ..engine import compute_step_states, progress_percent, current_stage, Status
from ..steps import VISA_LABEL, STEP_CATALOG
from ..ui import chip, avatar, neutral_chip
from ..derived import days_between


STATUS_ICONS = {
    Status.DONE: "✓",
    Status.IN_PROGRESS: "▶",
    Status.AVAILABLE: "○",
    Status.LOCKED: "🔒",
    Status.BLOCKED: "⚠",
}


def _employee_picker(employees):
    ids = [e["id"] for e in employees]
    names = {e["id"]: f'{e["name"]} · {e["role"]}' for e in employees}
    current = st.session_state.get("selected_employee_id") or ids[0]
    idx = ids.index(current) if current in ids else 0
    picked = st.selectbox(
        "Employee",
        ids,
        format_func=lambda i: names[i],
        index=idx,
        key="emp_detail_picker",
        label_visibility="collapsed",
    )
    if picked != current:
        st.session_state.selected_employee_id = picked
        st.rerun()
    return picked


def _profile_card(e, today):
    team = state.get_team()
    pro_name = next((t["name"] for t in team if t["id"] == e["assigned_pro"]), "—")
    pct = progress_percent(e)
    st.markdown(
        f'<div class="ahlan-card-dark">'
        f'<div style="display:flex; align-items:center; gap:18px;">'
        f'{avatar(e["name"], e["initials"], e["avatar_bg"], "xl")}'
        f'<div style="flex:1;">'
        f'<div style="font-size:11px; text-transform:uppercase; letter-spacing:0.16em; color:#f3dea3; font-weight:700;">{e["nationality"]} · {VISA_LABEL[e["visa_type"]]}</div>'
        f'<div style="font-family:Manrope,sans-serif; font-size:28px; font-weight:800; margin-top:4px;">{e["name"]}</div>'
        f'<div style="color:#c7cce0; font-size:14px;">{e["role"]} · {e["emirate"]}</div>'
        f'<div style="display:flex; gap:22px; margin-top:14px; font-size:12px;">'
        f'<div><div style="color:#97a0c0;">Arrival</div><div style="color:white; font-weight:600;">{e["arrival_date"]}</div></div>'
        f'<div><div style="color:#97a0c0;">Assigned PRO</div><div style="color:white; font-weight:600;">{pro_name}</div></div>'
        f'<div><div style="color:#97a0c0;">Family</div><div style="color:white; font-weight:600;">{"With children" if e["has_children"] else "Single"}</div></div>'
        f'<div><div style="color:#97a0c0;">Current stage</div><div style="color:white; font-weight:600;">{current_stage(e)}</div></div>'
        f'</div>'
        f'</div>'
        f'<div style="text-align:right;">'
        f'<div style="font-family:Manrope,sans-serif; font-size:44px; font-weight:800; color:#f3dea3; line-height:1;">{pct}%</div>'
        f'<div style="color:#97a0c0; font-size:11px; text-transform:uppercase; letter-spacing:0.14em; font-weight:600; margin-top:6px;">Complete</div>'
        f'</div>'
        f'</div>'
        f'<div style="height:6px; background:rgba(255,255,255,0.08); border-radius:999px; margin-top:18px; overflow:hidden;">'
        f'<div style="height:100%; width:{pct}%; background:linear-gradient(90deg,#dfae41,#f3dea3); border-radius:999px;"></div>'
        f'</div>'
        f'</div>',
        unsafe_allow_html=True,
    )


def _roadmap(e, today):
    steps = compute_step_states(e)
    team = state.get_team()
    unlock_ids = st.session_state.recent_unlocks.get(e["id"], [])

    st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
    st.markdown(
        '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">'
        '<div><div style="font-family:Manrope,sans-serif; font-size:18px; font-weight:700; color:#0b0f1e;">Dependency roadmap</div>'
        '<div style="font-size:12px; color:#626d94;">Steps unlock in strict order. Mark done and watch the chain react.</div></div>'
        '</div>',
        unsafe_allow_html=True,
    )

    for idx, s in enumerate(steps):
        # Render the row (informational HTML)
        flash_cls = " unlock-flash" if s.id in unlock_ids else ""
        docs_html = "".join([
            f'<span class="roadmap-doc">{d}</span>' for d in s.required_docs[:3]
        ])
        due_html = ""
        if s.due_date:
            d = days_between(s.due_date, today)
            if s.status == Status.DONE:
                due_html = f'<span class="small">completed {s.completed_at}</span>'
            elif d < 0:
                due_html = f'<span style="color:#be123c; font-weight:600; font-size:12px;">Overdue by {abs(d)}d</span>'
            else:
                due_html = f'<span class="small">due in {d}d ({s.due_date})</span>'
        elif s.completed_at:
            due_html = f'<span class="small">completed {s.completed_at}</span>'
        prereq_html = ""
        if s.prereqs and s.status == Status.LOCKED:
            prereq_names = ", ".join(STEP_CATALOG[p].name for p in s.prereqs)
            prereq_html = f'<div class="small" style="font-size:11px; margin-top:4px;">🔒 needs: {prereq_names}</div>'

        st.markdown(
            f'<div class="roadmap-item {s.status}{flash_cls}">'
            f'<div class="roadmap-dot">{STATUS_ICONS.get(s.status, "○")}</div>'
            f'<div class="roadmap-body">'
            f'<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">'
            f'<span class="roadmap-title">{idx+1}. {s.name}</span>'
            f'{chip(s.status)}'
            f'{neutral_chip(s.portal, "#3f4a70", "#e6e9f2")}'
            f'{neutral_chip("Responsible: "+s.responsible, "#7f581c", "#faf0d8")}'
            f'{neutral_chip(f"~{s.processing_days}d")}'
            f'</div>'
            f'<div class="roadmap-meta">{docs_html} {due_html}</div>'
            f'{prereq_html}'
            f'</div>'
            f'</div>',
            unsafe_allow_html=True,
        )

        # Action row: buttons for the actionable steps only
        if s.status not in (Status.DONE, Status.LOCKED):
            btn_cols = st.columns([1, 1, 1, 6])
            with btn_cols[0]:
                if st.button("Mark Done", key=f"done_{e['id']}_{s.id}", type="primary"):
                    unlocks = state.mark_step(e["id"], s.id, Status.DONE)
                    if unlocks:
                        names = ", ".join(STEP_CATALOG[u].name for u in unlocks)
                        st.toast(f"✓ {s.name} done — unlocked: {names}", icon="🔓")
                    else:
                        st.toast(f"✓ {s.name} marked Done", icon="✓")
                    st.rerun()
            with btn_cols[1]:
                if s.status == Status.AVAILABLE:
                    if st.button("Start", key=f"start_{e['id']}_{s.id}"):
                        state.mark_step(e["id"], s.id, Status.IN_PROGRESS)
                        st.toast(f"▶ Started {s.name}", icon="▶")
                        st.rerun()
                elif s.status == Status.IN_PROGRESS:
                    if st.button("Flag Blocked", key=f"blk_{e['id']}_{s.id}"):
                        state.mark_step(e["id"], s.id, Status.BLOCKED)
                        st.toast(f"⚠ {s.name} flagged as Blocked", icon="⚠")
                        st.rerun()
                elif s.status == Status.BLOCKED:
                    if st.button("Unblock", key=f"unb_{e['id']}_{s.id}"):
                        state.mark_step(e["id"], s.id, Status.IN_PROGRESS)
                        st.toast(f"Unblocked {s.name}", icon="✓")
                        st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)

    # If there were unlocks, emit a GSAP flourish
    if unlock_ids:
        unlocked_names = [STEP_CATALOG[u].name for u in unlock_ids]
        components.html(
            f"""
            <div id="unlock-banner" style="position:relative; padding:14px 18px; background:linear-gradient(90deg,rgba(46,196,182,0.10),rgba(16,185,129,0.10)); border:1px solid rgba(46,196,182,0.30); border-radius:12px; font-family:'Inter',sans-serif; color:#065f46; font-size:13px; font-weight:600;">
              🔓 Unlocked: {', '.join(unlocked_names)}
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
            <script>
              if (typeof gsap !== "undefined") {{
                gsap.fromTo("#unlock-banner", {{opacity:0, x:-12}}, {{opacity:1, x:0, duration:0.5, ease:"power2.out"}});
                gsap.to("#unlock-banner", {{opacity:0, duration:0.5, delay:2.6}});
              }}
            </script>
            """,
            height=64,
        )


def _timeline_tab(e):
    activity = [a for a in state.get_activity() if a["employee_id"] == e["id"]]
    team = state.get_team()
    if not activity:
        st.markdown("<div class='small' style='padding:20px; text-align:center;'>No activity yet for this employee.</div>", unsafe_allow_html=True)
        return
    for a in activity[:30]:
        actor = next((t for t in team if t["id"] == a["actor_id"]), None)
        actor_name = actor["name"] if actor else "system"
        st.markdown(
            f'<div style="display:flex; gap:14px; padding:12px 0; border-bottom:1px solid #f4f5f9;">'
            f'<div style="width:32px; text-align:center;">'
            f'<div style="width:10px; height:10px; background:#c99326; border-radius:999px; margin:6px auto;"></div>'
            f'</div>'
            f'<div style="flex:1;">'
            f'<div style="font-size:13px; color:#141a2e;"><b>{actor_name}</b> {a["message"]}</div>'
            f'<div style="font-size:11px; color:#97a0c0; margin-top:2px;">{a["ts"]}</div>'
            f'</div>'
            f'</div>',
            unsafe_allow_html=True,
        )


def _docs_tab(e):
    steps = compute_step_states(e)
    st.markdown(
        '<div class="small" style="margin-bottom:10px;">Documents required across this employee\'s onboarding chain.</div>',
        unsafe_allow_html=True,
    )
    all_docs = {}
    for s in steps:
        for d in s.required_docs:
            all_docs.setdefault(d, []).append(s.name)
    if not all_docs:
        st.markdown("<div class='small'>No documents specified.</div>", unsafe_allow_html=True)
        return
    for doc, uses in all_docs.items():
        received = "Received" if hash(doc + e["id"]) % 3 != 0 else "Missing"
        color = "#047857" if received == "Received" else "#be123c"
        bg = "#d1fae5" if received == "Received" else "#fee2e2"
        st.markdown(
            f'<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f4f5f9; border-radius:10px; margin-bottom:6px;">'
            f'<div>'
            f'<div style="font-size:13px; font-weight:600; color:#141a2e;">{doc}</div>'
            f'<div style="font-size:11px; color:#626d94;">Used by: {", ".join(uses[:3])}</div>'
            f'</div>'
            f'<div style="padding:4px 10px; background:{bg}; color:{color}; border-radius:999px; font-size:11px; font-weight:600;">{received}</div>'
            f'</div>',
            unsafe_allow_html=True,
        )


def render():
    state.ensure_state()
    employees = state.get_employees()
    today = state.get_today()

    st.markdown('<div class="eyebrow">Employee</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-title">Employee Detail</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-sub">Personalized dependency chain with real-time unlock logic.</div>', unsafe_allow_html=True)
    st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)

    picked_id = _employee_picker(employees)
    e = next((emp for emp in employees if emp["id"] == picked_id), None)
    if not e:
        st.warning("Select an employee.")
        return

    _profile_card(e, today)
    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    tab_road, tab_docs, tab_time = st.tabs(["Roadmap", "Documents", "Notes / Timeline"])
    with tab_road:
        _roadmap(e, today)
    with tab_docs:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        _docs_tab(e)
        st.markdown("</div>", unsafe_allow_html=True)
    with tab_time:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        _timeline_tab(e)
        st.markdown("</div>", unsafe_allow_html=True)
