"""Ahlan — the relocation & compliance OS for UAE employers.

Entry point. Configures the page, injects Ahlan's design tokens, renders
the sidebar navigation, and dispatches to module pages.
"""
from __future__ import annotations
import streamlit as st

from settlein import state
from settlein.styles import inject_css
from settlein.derived import alerts_count
from settlein.pages import (
    overview, pipeline, employee_detail, compliance, tasks,
    documents, analytics, settings, coming_soon,
)


st.set_page_config(
    page_title="Ahlan — Relocation & Compliance OS",
    page_icon="🌙",
    layout="wide",
    initial_sidebar_state="expanded",
)

inject_css()
state.ensure_state()


# ------- Sidebar -----------------------------------------------------------

PRIMARY_NAV = [
    ("Overview",              "🏠"),
    ("Pipeline",              "🧭"),
    ("Employee Detail",       "👤"),
    ("Compliance",            "📅"),
    ("Tasks",                 "✔︎"),
    ("Documents",             "📎"),
    ("Analytics",             "📊"),
    ("Settings",              "⚙︎"),
]

PHASE2_NAV = [
    "Employee mobile app",
    "Referral marketplace",
    "HRMS integrations",
    "Government portal APIs",
    "Bulk CSV import",
    "PRO agency portal",
]


def render_sidebar():
    with st.sidebar:
        st.markdown(
            """
            <div style="display:flex; align-items:center; gap:10px; padding:6px 4px 18px; border-bottom:1px solid #1e2740; margin-bottom:14px;">
                <div style="width:38px; height:38px; border-radius:10px;
                            background:linear-gradient(135deg,#dfae41,#a5751f);
                            color:#0b0f1e; font-family:'Manrope',sans-serif;
                            font-weight:800; font-size:20px;
                            display:flex; align-items:center; justify-content:center;">
                    ٲ
                </div>
                <div style="line-height:1.15;">
                    <div style="font-family:'Manrope',sans-serif; font-weight:800; color:white; font-size:17px;">Ahlan</div>
                    <div style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#f3dea3; font-weight:600;">for Business</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown(
            '<div style="padding:0 4px 6px; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#97a0c0; font-weight:700;">Workspace</div>',
            unsafe_allow_html=True,
        )
        st.markdown(
            """
            <div style="padding:10px 12px; background:rgba(255,255,255,0.04); border:1px solid #1e2740; border-radius:10px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:32px; height:32px; border-radius:8px; background:#f3dea3; color:#0b0f1e; font-weight:800; font-family:'Manrope',sans-serif; font-size:12px; display:flex; align-items:center; justify-content:center;">MT</div>
                    <div style="line-height:1.15;">
                        <div style="font-size:12px; font-weight:600; color:white;">Meridian Trading LLC</div>
                        <div style="font-size:10px; color:#97a0c0;">Dubai · 62 employees</div>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown(
            '<div style="padding:0 4px 6px; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#97a0c0; font-weight:700;">Navigate</div>',
            unsafe_allow_html=True,
        )

        for label, icon in PRIMARY_NAV:
            active = st.session_state.nav == label
            # Streamlit doesn't let us conditionally style buttons based on active state
            # without hacks. We approximate via type=primary.
            if st.button(f"{icon}   {label}", key=f"nav_{label}", use_container_width=True, type="primary" if active else "secondary"):
                st.session_state.nav = label
                st.rerun()

        st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)
        st.markdown(
            '<div style="padding:0 4px 6px; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#97a0c0; font-weight:700;">Coming soon</div>',
            unsafe_allow_html=True,
        )
        for name in PHASE2_NAV:
            if st.button(f"🔒   {name}", key=f"cs_{name}", use_container_width=True):
                st.session_state.nav = "ComingSoon"
                st.session_state.coming_soon_module = name
                st.rerun()

        st.markdown("<div style='height:20px'></div>", unsafe_allow_html=True)
        st.markdown(
            """
            <div style="padding:14px; background:rgba(255,255,255,0.03); border:1px solid #1e2740; border-radius:12px;">
                <div style="font-size:12px; font-weight:700; color:white; margin-bottom:4px;">Onboarding OS</div>
                <div style="font-size:11px; color:#97a0c0; line-height:1.5;">Every step from Entry Permit to DEWA, orchestrated in one flow — with a real dependency engine.</div>
            </div>
            """,
            unsafe_allow_html=True,
        )


# ------- Topbar (alerts / search) ------------------------------------------

def render_topbar():
    employees = state.get_employees()
    compliance = state.get_compliance()
    today = state.get_today()
    alerts_n = alerts_count(employees, compliance, today)

    top_l, top_m, top_r = st.columns([2.6, 3, 2])
    with top_l:
        st.markdown(
            f"""
            <div class="company-pill">
                <div class="logo">MT</div>
                <div class="info"><div class="name">Meridian Trading LLC</div><div class="meta">Dubai · 62 employees</div></div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with top_m:
        query = st.text_input("Search employees", placeholder="🔎  Search employees or roles…", label_visibility="collapsed", key="topbar_search")
        if query and len(query) >= 2:
            matches = [e for e in employees if query.lower() in e["name"].lower() or query.lower() in e["role"].lower()][:5]
            if matches:
                for e in matches:
                    if st.button(f"→ {e['name']} · {e['role']}", key=f"srch_{e['id']}"):
                        st.session_state.selected_employee_id = e["id"]
                        st.session_state.nav = "Employee Detail"
                        st.rerun()
    with top_r:
        alert_style = "background:#f43f5e; color:white;" if alerts_n > 0 else "background:#e6e9f2; color:#3f4a70;"
        st.markdown(
            f"""
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:10px;">
                <div class="bell-btn">🔔
                    {"<span class='bell-badge' style='"+alert_style+"'>"+str(alerts_n)+"</span>" if alerts_n > 0 else ""}
                </div>
                <div style="display:flex; align-items:center; gap:8px; padding:4px 10px 4px 4px; background:white; border-radius:999px; border:1px solid #e6e9f2;">
                    <div class="avatar avatar-md" style="background:linear-gradient(135deg,#dfae41,#a5751f); color:#0b0f1e;">NA</div>
                    <div style="line-height:1.2;">
                        <div style="font-size:12px; font-weight:600; color:#141a2e;">Nadia Al-Farsi</div>
                        <div style="font-size:10px; color:#626d94;">HR Admin</div>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )


# ------- Dispatch ----------------------------------------------------------

def dispatch():
    nav = st.session_state.nav
    if nav == "Overview":
        overview.render()
    elif nav == "Pipeline":
        pipeline.render()
    elif nav == "Employee Detail":
        employee_detail.render()
    elif nav == "Compliance":
        compliance.render()
    elif nav == "Tasks":
        tasks.render()
    elif nav == "Documents":
        documents.render()
    elif nav == "Analytics":
        analytics.render()
    elif nav == "Settings":
        settings.render()
    elif nav == "ComingSoon":
        coming_soon.render(st.session_state.get("coming_soon_module", "Employee mobile app"))
    else:
        overview.render()


render_sidebar()
render_topbar()
st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)
dispatch()
