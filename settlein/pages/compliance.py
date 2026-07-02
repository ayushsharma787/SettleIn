"""Compliance & Renewals — expiry table + calendar grid + start renewal."""
from __future__ import annotations
import calendar
from datetime import date, timedelta
import streamlit as st

from .. import state
from ..derived import urgency_counts, days_between, urgency_bucket
from ..ui import urgency_chip, avatar, section_header


def _summary_strip(compliance, today):
    buckets = urgency_counts(compliance, today)
    tiles = [
        ("Overdue", buckets["overdue"], "urgency-overdue"),
        ("Due < 30 days", buckets["d30"], "urgency-30"),
        ("Due < 90 days", buckets["d90"], "urgency-90"),
        ("OK", buckets["ok"], "urgency-ok"),
    ]
    cols = st.columns(len(tiles))
    for i, (label, count, cls) in enumerate(tiles):
        with cols[i]:
            st.markdown(
                f'<div class="urgency-tile {cls}"><div class="label">{label}</div>'
                f'<div class="count">{count}</div></div>',
                unsafe_allow_html=True,
            )


def _table_view(compliance, employees, today):
    rows = []
    for c in compliance:
        emp = next((e for e in employees if e["id"] == c["employee_id"]), None)
        if not emp:
            continue
        d = days_between(c["expiry_date"], today)
        rows.append({"c": c, "emp": emp, "days": d, "bucket": urgency_bucket(d)})
    # Sort: overdue first, then by days ascending
    rows.sort(key=lambda r: (0 if r["days"] < 0 else 1, r["days"]))

    filter_bucket = st.selectbox(
        "Filter by urgency",
        ["All", "Overdue", "Due < 30 days", "Due < 90 days", "OK"],
        key="comp_filter",
    )
    bucket_map = {"Overdue": "overdue", "Due < 30 days": "d30", "Due < 90 days": "d90", "OK": "ok"}
    if filter_bucket != "All":
        rows = [r for r in rows if r["bucket"] == bucket_map[filter_bucket]]

    st.markdown('<div class="ahlan-card" style="padding:0;">', unsafe_allow_html=True)
    header = (
        '<div style="display:grid; grid-template-columns:2fr 1.6fr 1.4fr 1fr 1.4fr 1fr; '
        'padding:12px 18px; font-size:10px; text-transform:uppercase; letter-spacing:0.12em; '
        'color:#626d94; font-weight:700; background:#f4f5f9; border-radius:16px 16px 0 0;">'
        '<div>Employee</div><div>Document</div><div>Expiry date</div><div>Days left</div><div>Status</div><div>Action</div>'
        '</div>'
    )
    st.markdown(header, unsafe_allow_html=True)

    for r in rows:
        emp = r["emp"]; c = r["c"]; d = r["days"]
        row_html = (
            f'<div style="display:grid; grid-template-columns:2fr 1.6fr 1.4fr 1fr 1.4fr 1fr; '
            f'padding:12px 18px; align-items:center; border-bottom:1px solid #f4f5f9; font-size:13px;">'
            f'<div style="display:flex; align-items:center; gap:10px;">{avatar(emp["name"], emp["initials"], emp["avatar_bg"], "sm")}'
            f'<div><div style="font-weight:600;">{emp["name"]}</div>'
            f'<div style="font-size:11px; color:#626d94;">{emp["role"]}</div></div></div>'
            f'<div style="font-weight:500;">{c["document"]}</div>'
            f'<div>{c["expiry_date"]}</div>'
            f'<div style="font-family:tabular; font-weight:600;">{d}d</div>'
            f'<div>{urgency_chip(d)}</div>'
            f'<div></div>'
            f'</div>'
        )
        st.markdown(row_html, unsafe_allow_html=True)
        act_cols = st.columns([7, 1])
        with act_cols[1]:
            if st.button("Start renewal", key=f"ren_{c['id']}", type="primary"):
                state.start_renewal(c["id"])
                st.toast(f"Renewal task created for {emp['name']} · {c['document']}", icon="🔄")
                st.rerun()
    if not rows:
        st.markdown("<div style='padding:24px; text-align:center; color:#97a0c0;'>No items in this bucket.</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)


def _calendar_view(compliance, employees, today):
    # Show a 3-month strip starting from this month
    st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
    st.markdown('<div style="font-family:Manrope,sans-serif; font-size:16px; font-weight:700; color:#0b0f1e; margin-bottom:12px;">Renewals calendar — next 3 months</div>', unsafe_allow_html=True)
    year = today.year
    month = today.month
    cols = st.columns(3)
    for i in range(3):
        m = month + i
        y = year + (m - 1) // 12
        m = ((m - 1) % 12) + 1
        with cols[i]:
            _render_month(y, m, compliance, employees, today)
    st.markdown("</div>", unsafe_allow_html=True)


def _render_month(year, month, compliance, employees, today):
    events_by_day = {}
    for c in compliance:
        exp = date.fromisoformat(c["expiry_date"])
        if exp.year == year and exp.month == month:
            events_by_day.setdefault(exp.day, []).append(c)
    cal = calendar.monthcalendar(year, month)
    weekdays = ["M", "T", "W", "T", "F", "S", "S"]
    month_name = date(year, month, 1).strftime("%B %Y")

    html = f'<div style="font-family:Manrope,sans-serif; font-size:13px; font-weight:700; color:#141a2e; margin-bottom:8px;">{month_name}</div>'
    html += '<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px; font-size:10px; color:#97a0c0; text-align:center; font-weight:600;">'
    for w in weekdays:
        html += f'<div>{w}</div>'
    html += '</div>'
    html += '<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-top:6px;">'
    for week in cal:
        for day in week:
            if day == 0:
                html += '<div style="height:44px;"></div>'
            else:
                cell_date = date(year, month, day)
                d = (cell_date - today).days
                events = events_by_day.get(day, [])
                is_today = cell_date == today
                bg = "white"
                border = "1px solid #f4f5f9"
                color = "#141a2e"
                if events:
                    bucket = urgency_bucket(d)
                    if bucket == "overdue":
                        bg = "#fff1f2"; border = "1px solid rgba(244,63,94,0.30)"; color = "#881337"
                    elif bucket == "d30":
                        bg = "#fffbeb"; border = "1px solid rgba(245,158,11,0.30)"; color = "#78350f"
                    elif bucket == "d90":
                        bg = "#fdf9f0"; border = "1px solid rgba(201,147,38,0.30)"; color = "#7f581c"
                    else:
                        bg = "#ecfdf5"; border = "1px solid rgba(16,185,129,0.25)"; color = "#064e3b"
                today_ring = "box-shadow: 0 0 0 2px #0b0f1e;" if is_today else ""
                event_str = ""
                if events:
                    event_str = f'<div style="font-size:9px; font-weight:700; margin-top:2px;">{len(events)} due</div>'
                html += f'<div style="height:44px; border-radius:6px; padding:4px; background:{bg}; border:{border}; color:{color}; text-align:center; {today_ring}"><div style="font-size:11px; font-weight:600;">{day}</div>{event_str}</div>'
    html += '</div>'
    st.markdown(html, unsafe_allow_html=True)


def render():
    state.ensure_state()
    employees = state.get_employees()
    compliance = state.get_compliance()
    today = state.get_today()

    section_header(
        "Compliance",
        "Renewals Calendar",
        "Every visa, Emirates ID, labour card, insurance, and Ejari expiry — computed live from dates."
    )
    st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)

    _summary_strip(compliance, today)
    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    view = st.radio(
        "view", ["Table", "Calendar"], horizontal=True, label_visibility="collapsed",
        index=["Table", "Calendar"].index(st.session_state.compliance_view),
        key="compliance_view_radio",
    )
    st.session_state.compliance_view = view

    if view == "Table":
        _table_view(compliance, employees, today)
    else:
        _calendar_view(compliance, employees, today)
