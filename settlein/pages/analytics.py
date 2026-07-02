"""Analytics — Plotly charts + Chart.js embed + auto insight."""
from __future__ import annotations
from datetime import date
import streamlit as st
import streamlit.components.v1 as components
import plotly.graph_objects as go
import json

from .. import state
from ..derived import (
    avg_days_per_step, slowest_step, onboardings_per_month, urgency_counts,
    completed_onboardings, active_onboardings,
)
from ..steps import STEP_CATALOG
from ..seed import AGENCY_COST_PER_EMPLOYEE_AED
from ..ui import section_header


def _insight(employees, compliance, today):
    sid, days = slowest_step(employees)
    if sid and sid in STEP_CATALOG:
        st.markdown(
            f'<div class="ahlan-card-sand" style="display:flex; align-items:flex-start; gap:14px;">'
            f'<div style="width:40px; height:40px; border-radius:10px; background:rgba(11,15,30,0.10); display:flex; align-items:center; justify-content:center; font-size:20px;">💡</div>'
            f'<div><div style="font-size:11px; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; color:#7f581c;">Insight</div>'
            f'<div style="font-family:Manrope,sans-serif; font-size:18px; font-weight:700; color:#0b0f1e; margin-top:2px;">'
            f'{STEP_CATALOG[sid].name} is your slowest step — avg {days} days.</div>'
            f'<div style="font-size:13px; color:#3f4a70; margin-top:4px;">'
            f'Owned by {STEP_CATALOG[sid].responsible} at {STEP_CATALOG[sid].portal}. Escalate PROs or pre-empt with earlier document collection to unblock the chain.</div>'
            f'</div></div>',
            unsafe_allow_html=True,
        )


def _avg_days_chart(employees):
    data = avg_days_per_step(employees)
    labels = [STEP_CATALOG[k].name for k in data if k in STEP_CATALOG]
    values = [data[k] for k in data if k in STEP_CATALOG]
    # Sort desc
    combined = sorted(zip(labels, values), key=lambda x: x[1], reverse=True)
    labels, values = zip(*combined) if combined else ([], [])
    fig = go.Figure()
    colors = ["#f43f5e" if v == max(values or [0]) else "#3f4a70" for v in values]
    fig.add_trace(go.Bar(
        y=list(labels), x=list(values), orientation="h",
        marker=dict(color=colors),
        text=[f"{v}d" for v in values], textposition="outside",
        textfont=dict(color="#141a2e", size=11),
        hovertemplate="<b>%{y}</b><br>%{x} days avg<extra></extra>",
    ))
    fig.update_layout(
        height=380, margin=dict(l=10, r=30, t=10, b=10),
        plot_bgcolor="white", paper_bgcolor="white",
        xaxis=dict(showgrid=True, gridcolor="#f4f5f9", tickfont=dict(color="#626d94", size=10)),
        yaxis=dict(autorange="reversed", tickfont=dict(color="#141a2e", size=11)),
    )
    return fig


def _monthly_chart(employees):
    data = onboardings_per_month(employees)
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=[d["month"] for d in data], y=[d["count"] for d in data],
        mode="lines+markers",
        line=dict(color="#c99326", width=3, shape="spline"),
        marker=dict(size=8, color="#c99326", line=dict(color="white", width=2)),
        fill="tozeroy", fillcolor="rgba(201,147,38,0.10)",
        hovertemplate="<b>%{x}</b><br>%{y} onboardings<extra></extra>",
    ))
    fig.update_layout(
        height=260, margin=dict(l=10, r=10, t=10, b=10),
        plot_bgcolor="white", paper_bgcolor="white",
        xaxis=dict(showgrid=False, tickfont=dict(color="#626d94", size=10)),
        yaxis=dict(showgrid=True, gridcolor="#f4f5f9", tickfont=dict(color="#626d94", size=10)),
    )
    return fig


def _cost_chart(employees):
    data = onboardings_per_month(employees)
    cumulative = []
    total = 0
    for d in data:
        total += d["count"] * AGENCY_COST_PER_EMPLOYEE_AED
        cumulative.append({"month": d["month"], "aed": total})
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=[d["month"] for d in cumulative], y=[d["aed"] for d in cumulative],
        mode="lines+markers", line=dict(color="#10b981", width=3, shape="spline"),
        marker=dict(size=8, color="#10b981", line=dict(color="white", width=2)),
        fill="tozeroy", fillcolor="rgba(16,185,129,0.14)",
        hovertemplate="<b>%{x}</b><br>AED %{y:,.0f} saved<extra></extra>",
    ))
    fig.update_layout(
        height=260, margin=dict(l=10, r=10, t=10, b=10),
        plot_bgcolor="white", paper_bgcolor="white",
        xaxis=dict(showgrid=False, tickfont=dict(color="#626d94", size=10)),
        yaxis=dict(showgrid=True, gridcolor="#f4f5f9", tickfont=dict(color="#626d94", size=10), tickformat=","),
    )
    return fig


def _risk_donut_html(compliance, today):
    """Chart.js embedded donut — interactive, animated."""
    buckets = urgency_counts(compliance, today)
    labels = ["Overdue", "Due < 30d", "Due < 90d", "OK"]
    values = [buckets["overdue"], buckets["d30"], buckets["d90"], buckets["ok"]]
    colors = ["#f43f5e", "#f59e0b", "#c99326", "#10b981"]
    total = sum(values) or 1
    fallback_legend = "".join(
        f'<div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f4f5f9;">'
        f'<div style="display:flex; align-items:center; gap:8px;"><span style="width:10px; height:10px; border-radius:2px; background:{colors[i]};"></span>'
        f'<span style="font-size:12px; color:#3f4a70;">{labels[i]}</span></div>'
        f'<span style="font-size:12px; font-weight:600; color:#141a2e;">{values[i]}</span>'
        f'</div>'
        for i in range(len(labels))
    )
    return f"""
    <div style="padding:16px; background:white; border-radius:16px; border:1px solid #e6e9f2; height:340px; font-family:'Inter',sans-serif;">
      <div style="font-family:Manrope,sans-serif; font-size:16px; font-weight:700; color:#0b0f1e; margin-bottom:6px;">Compliance risk breakdown</div>
      <div style="font-size:11px; color:#626d94; margin-bottom:14px;">Live from expiry dates — Chart.js</div>
      <canvas id="riskDonut" style="max-height:220px;"></canvas>
      <div id="riskFallback" style="display:none; margin-top:8px;">{fallback_legend}</div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1"></script>
    <script>
      if (typeof Chart === "undefined") {{
        document.getElementById("riskDonut").style.display = "none";
        document.getElementById("riskFallback").style.display = "block";
      }} else {{
      const ctx = document.getElementById('riskDonut');
      new Chart(ctx, {{
        type: 'doughnut',
        data: {{
          labels: {json.dumps(labels)},
          datasets: [{{
            data: {json.dumps(values)},
            backgroundColor: {json.dumps(colors)},
            borderColor: 'white', borderWidth: 3, hoverOffset: 8,
          }}]
        }},
        options: {{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {{
            legend: {{
              position: 'bottom',
              labels: {{ font: {{ family: 'Inter', size: 11 }}, color: '#3f4a70', boxWidth: 10, boxHeight: 10 }}
            }},
            tooltip: {{
              backgroundColor: '#0b0f1e', titleFont: {{ family: 'Manrope', size: 13 }},
              bodyFont: {{ family: 'Inter', size: 12 }}, padding: 10, cornerRadius: 8,
              callbacks: {{ label: (c) => c.label + ': ' + c.raw }}
            }}
          }},
          animation: {{ animateRotate: true, animateScale: true, duration: 800 }}
        }}
      }});
      }}
    </script>
    """


def render():
    state.ensure_state()
    employees = state.get_employees()
    compliance = state.get_compliance()
    today = state.get_today()

    section_header("Insights", "Analytics", "Where the chain slows down, what it saves, and where the risk sits.")
    st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)

    _insight(employees, compliance, today)
    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    top_l, top_r = st.columns([1.4, 1])
    with top_l:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown('<div style="font-family:Manrope,sans-serif; font-size:16px; font-weight:700; color:#0b0f1e;">Avg days per step — where are the bottlenecks?</div>', unsafe_allow_html=True)
        st.markdown('<div style="font-size:12px; color:#626d94; margin-bottom:8px;">The slowest step is highlighted. Hover for exact counts.</div>', unsafe_allow_html=True)
        st.plotly_chart(_avg_days_chart(employees), use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with top_r:
        components.html(_risk_donut_html(compliance, today), height=380)

    st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)

    bot_l, bot_r = st.columns(2)
    with bot_l:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown('<div style="font-family:Manrope,sans-serif; font-size:16px; font-weight:700; color:#0b0f1e;">Onboardings per month</div>', unsafe_allow_html=True)
        st.plotly_chart(_monthly_chart(employees), use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)
    with bot_r:
        st.markdown('<div class="ahlan-card">', unsafe_allow_html=True)
        st.markdown('<div style="font-family:Manrope,sans-serif; font-size:16px; font-weight:700; color:#0b0f1e;">Cost saved vs agency (cumulative AED)</div>', unsafe_allow_html=True)
        st.plotly_chart(_cost_chart(employees), use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)
