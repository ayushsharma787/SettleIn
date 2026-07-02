"""Overview dashboard — landing page."""
from __future__ import annotations
import streamlit as st
import streamlit.components.v1 as components
import plotly.graph_objects as go
from datetime import datetime

from .. import state
from ..derived import (
    active_onboardings, completed_onboardings, avg_time_to_complete,
    compliance_alerts, attention_list, stage_counts,
)
from ..engine import current_step, days_in_stage, Status
from ..steps import PIPELINE_STAGES
from ..styles import STAGE_COLORS
from ..ui import kpi_card, section_header, render_alert_row, avatar
from ..seed import AGENCY_COST_PER_EMPLOYEE_AED


def _animated_hero(name: str, today):
    formatted_date = today.strftime("%A, %d %B %Y")
    components.html(
        f"""
        <div id="ahlan-hero" style="padding:0; margin:0; font-family:'Manrope',sans-serif;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.18em; color:#a5751f;" class="ah-eyebrow">Ahlan · Overview</div>
          <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:16px;">
            <div>
              <h1 style="font-family:'Manrope',sans-serif; font-size:34px; font-weight:800; color:#0b0f1e; margin:6px 0 4px; letter-spacing:-0.02em;" class="ah-title">
                <span id="ah-greeting">Ahlan wa sahlan</span>, {name}.
              </h1>
              <div style="color:#626d94; font-size:13px;" class="ah-sub">Here's what's moving across relocation and compliance at Meridian Trading today.</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#97a0c0; font-weight:700;">Today</div>
              <div style="font-size:13px; font-weight:600; color:#141a2e;">{formatted_date}</div>
            </div>
          </div>
        </div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
        <script>
          if (typeof gsap !== "undefined") {{
            gsap.from(".ah-eyebrow", {{opacity:0, y:-6, duration:0.4, ease:"power2.out"}});
            gsap.from(".ah-title", {{opacity:0, y:10, duration:0.55, ease:"power2.out", delay:0.05}});
            gsap.from(".ah-sub", {{opacity:0, y:8, duration:0.5, ease:"power2.out", delay:0.15}});
            const greeting = document.getElementById("ah-greeting");
            const phrases = ["Ahlan wa sahlan", "Good morning", "Marhaba"];
            let i = 0;
            setInterval(() => {{
              i = (i + 1) % phrases.length;
              gsap.to(greeting, {{opacity:0, y:-4, duration:0.25, onComplete: () => {{
                greeting.textContent = phrases[i];
                gsap.to(greeting, {{opacity:1, y:0, duration:0.25}});
              }}}});
            }}, 3200);
          }}
        </script>
        """,
        height=115,
    )


def render():
    state.ensure_state()
    employees = state.get_employees()
    compliance = state.get_compliance()
    activity = state.get_activity()
    team = state.get_team()
    today = state.get_today()

    _animated_hero("Nadia", today)

    active = active_onboardings(employees)
    completed = completed_onboardings(employees)
    avg_days = avg_time_to_complete(employees)
    alerts_90 = len(compliance_alerts(compliance, today, 90))
    cost_saved = (active + completed) * AGENCY_COST_PER_EMPLOYEE_AED

    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        kpi_card("👥", "Active Onboardings", str(active), f"{completed} completed all-time", "ink")
    with c2:
        kpi_card("⏱️", "Avg. Time-to-Complete", f"{avg_days}d", "Entry permit → driving licence", "sand")
    with c3:
        kpi_card("⚠︎", "Compliance Alerts", str(alerts_90), "Expiring in next 90 days", "rose")
    with c4:
        kpi_card("💵", "Est. Cost Saved", f"AED {cost_saved/1000:.0f}k", f"vs agency @ AED {AGENCY_COST_PER_EMPLOYEE_AED:,}/hire", "teal")

    st.markdown("<div style='height:20px'></div>", unsafe_allow_html=True)

    left, right = st.columns([2, 1])

    with left:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown(
            '<div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px;">'
            '<div><div style="font-family:Manrope,sans-serif; font-size:17px; font-weight:700; color:#0b0f1e;">Pipeline distribution</div>'
            '<div style="font-size:12px; color:#626d94;">Where every relocating employee sits right now.</div></div>'
            '</div>',
            unsafe_allow_html=True,
        )
        counts = stage_counts(employees)
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=PIPELINE_STAGES,
            y=[counts.get(s, 0) for s in PIPELINE_STAGES],
            marker=dict(color=[STAGE_COLORS[s] for s in PIPELINE_STAGES], line=dict(width=0)),
            text=[counts.get(s, 0) for s in PIPELINE_STAGES],
            textposition="outside",
            textfont=dict(family="Manrope", size=12, color="#141a2e"),
            hovertemplate="<b>%{x}</b><br>%{y} employees<extra></extra>",
        ))
        fig.update_layout(
            height=260,
            margin=dict(l=10, r=10, t=20, b=10),
            plot_bgcolor="white",
            paper_bgcolor="white",
            xaxis=dict(showgrid=False, tickfont=dict(color="#626d94", size=11)),
            yaxis=dict(showgrid=True, gridcolor="#f4f5f9", tickfont=dict(color="#626d94", size=11)),
            showlegend=False,
        )
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with right:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown(
            '<div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">'
            '<div style="width:32px; height:32px; background:#fff1f2; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#be123c;">⚠︎</div>'
            '<div><div style="font-family:Manrope,sans-serif; font-size:17px; font-weight:700; color:#0b0f1e;">Attention needed</div>'
            '<div style="font-size:11px; color:#626d94;">Overdue steps + upcoming expiries</div></div>'
            '</div>',
            unsafe_allow_html=True,
        )
        atts = attention_list(employees, compliance, today)
        for a in atts[:6]:
            st.markdown(render_alert_row(a), unsafe_allow_html=True)
            if st.button("Open ↗", key=f"att_{a['id']}", use_container_width=False):
                st.session_state.selected_employee_id = a["employee"]["id"]
                st.session_state.nav = "Employee Detail"
                st.rerun()
        if not atts:
            st.markdown("<div class='small' style='padding:16px; text-align:center;'>All clear.</div>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("<div style='height:20px'></div>", unsafe_allow_html=True)

    lb, rb = st.columns([2, 1])
    with lb:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown(
            '<div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">'
            '<div style="width:32px; height:32px; background:#ecfdf5; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#047857;">✓</div>'
            '<div><div style="font-family:Manrope,sans-serif; font-size:17px; font-weight:700; color:#0b0f1e;">In-flight this week</div>'
            '<div style="font-size:11px; color:#626d94;">Employees actively working through a step</div></div>'
            '</div>',
            unsafe_allow_html=True,
        )
        in_flight = [e for e in employees if current_step(e) and current_step(e).status != Status.DONE]
        cols = st.columns(2)
        for idx, e in enumerate(in_flight[:6]):
            s = current_step(e)
            days = days_in_stage(e, today)
            with cols[idx % 2]:
                html = (
                    f'<div style="display:flex; gap:10px; align-items:center; padding:12px; background:#f4f5f9; border-radius:12px; margin-bottom:8px;">'
                    f'{avatar(e["name"], e["initials"], e["avatar_bg"], "md")}'
                    f'<div style="min-width:0;">'
                    f'<div style="font-size:13px; font-weight:600; color:#141a2e;">{e["name"]}</div>'
                    f'<div style="font-size:11px; color:#626d94;">{s.name} · day {max(1, days)}</div>'
                    f'</div></div>'
                )
                st.markdown(html, unsafe_allow_html=True)
                if st.button(f"View {e['first_name']}", key=f"if_{e['id']}"):
                    st.session_state.selected_employee_id = e["id"]
                    st.session_state.nav = "Employee Detail"
                    st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    with rb:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown(
            '<div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">'
            '<div style="width:32px; height:32px; background:#faf0d8; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#7f581c;">📡</div>'
            '<div style="font-family:Manrope,sans-serif; font-size:17px; font-weight:700; color:#0b0f1e;">Recent activity</div>'
            '</div>',
            unsafe_allow_html=True,
        )
        for a in activity[:8]:
            ts = datetime.fromisoformat(a["ts"]).strftime("%d %b")
            actor = next((t for t in team if t["id"] == a["actor_id"]), None)
            actor_name = actor["name"].split()[0] if actor else "system"
            st.markdown(
                f'<div style="padding:8px 0; border-bottom:1px solid #f4f5f9;">'
                f'<div style="font-size:13px; color:#1e2740;"><b>{actor_name}</b> {a["message"]}</div>'
                f'<div style="font-size:10px; color:#97a0c0; margin-top:2px;">{ts}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )
        st.markdown("</div>", unsafe_allow_html=True)
