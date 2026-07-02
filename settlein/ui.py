"""Shared inline UI helpers."""
from __future__ import annotations
from datetime import date

import streamlit as st

from .styles import STATUS_COLORS, STAGE_COLORS
from .engine import compute_step_states, current_step, current_stage, days_in_stage, is_blocked, Status
from .steps import VISA_LABEL


def chip(status: str) -> str:
    cfg = STATUS_COLORS.get(status, STATUS_COLORS["locked"])
    return (
        f'<span class="chip chip-{status}">'
        f'<span class="chip-dot" style="background:{cfg["dot"]}"></span>{cfg["label"]}</span>'
    )


def neutral_chip(text: str, color: str = "#3f4a70", bg: str = "#e6e9f2") -> str:
    return f'<span class="chip" style="background:{bg}; color:{color}; border-color:{bg}">{text}</span>'


def urgency_chip(days_remaining: int) -> str:
    if days_remaining < 0:
        return f'<span class="chip chip-blocked"><span class="chip-dot" style="background:#f43f5e"></span>Overdue {abs(days_remaining)}d</span>'
    if days_remaining <= 30:
        return f'<span class="chip chip-awaiting_employee"><span class="chip-dot" style="background:#f59e0b"></span>Due {days_remaining}d</span>'
    if days_remaining <= 90:
        return f'<span class="chip chip-available"><span class="chip-dot" style="background:#c99326"></span>Due {days_remaining}d</span>'
    return f'<span class="chip chip-done"><span class="chip-dot" style="background:#10b981"></span>OK</span>'


def avatar(name: str, initials: str = None, bg: str = "#3f4a70", size: str = "md") -> str:
    if not initials and name:
        parts = name.split()
        initials = (parts[0][0] + (parts[1][0] if len(parts) > 1 else "")).upper()
    return f'<span class="avatar avatar-{size}" style="background:{bg}">{initials or "?"}</span>'


def section_header(eyebrow: str, title: str, sub: str = None):
    html = f'<div class="eyebrow">{eyebrow}</div><div class="section-title">{title}</div>'
    if sub:
        html += f'<div class="section-sub">{sub}</div>'
    st.markdown(html, unsafe_allow_html=True)


def kpi_card(icon: str, label: str, value: str, sub: str = "", tint: str = "ink"):
    st.markdown(
        f'<div class="kpi kpi-{tint}">'
        f'<div class="kpi-icon">{icon}</div>'
        f'<div class="kpi-value">{value}</div>'
        f'<div class="kpi-label">{label}</div>'
        f'<div class="kpi-sub">{sub}</div>'
        f'</div>',
        unsafe_allow_html=True,
    )


def render_employee_card(e: dict, today: date):
    step = current_step(e)
    days = days_in_stage(e, today)
    blocked = is_blocked(e, today)
    step_line = ""
    if step:
        step_line = (
            f'<div class="footer">'
            f'<div class="step-name">{step.name}</div>'
            f'<div class="foot-row"><div class="days">day {max(1, days)} in stage</div>{chip(step.status)}</div>'
            f'</div>'
        )
    else:
        step_line = (
            f'<div class="footer">'
            f'<div class="step-name">Onboarding complete</div>'
            f'<div class="foot-row"><div class="days">All steps done</div>{chip(Status.DONE)}</div>'
            f'</div>'
        )
    blocked_ico = ' <span style="color:#f43f5e;">⚠︎</span>' if blocked else ''
    html = (
        f'<div class="emp-card {"blocked" if blocked else ""}">'
        f'<div class="row1">{avatar(e["name"], e["initials"], e["avatar_bg"], "md")}'
        f'<div><div class="name">{e["name"]}{blocked_ico}</div>'
        f'<div class="role">{e["role"]}</div></div></div>'
        f'<div class="tags">{neutral_chip(VISA_LABEL[e["visa_type"]])}{neutral_chip(e["emirate"], "#7f581c", "#faf0d8")}</div>'
        f'{step_line}</div>'
    )
    return html


def render_alert_row(item: dict) -> str:
    e = item["employee"]
    color = "#f43f5e" if item["kind"] in ("blocked", "overdue", "expired") else "#f59e0b"
    return (
        f'<div class="alert-row">'
        f'<span class="dot" style="background:{color}"></span>'
        f'{avatar(e["name"], e["initials"], e["avatar_bg"], "sm")}'
        f'<div style="min-width:0; flex:1;">'
        f'<div style="font-size:13px; font-weight:500; color:#141a2e;">{e["name"]}</div>'
        f'<div class="small" style="font-size:11px;">{item["label"]}</div>'
        f'</div>'
        f'<div style="font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:#97a0c0; font-weight:600;">{item["kind"]}</div>'
        f'</div>'
    )


def sidebar_nav_link(label: str, icon: str, key: str, active: bool):
    """Renders a sidebar nav button. Returns True if clicked."""
    return st.button(
        f"{icon}  {label}",
        key=f"nav_{key}",
        use_container_width=True,
        type="primary" if active else "secondary",
    )
