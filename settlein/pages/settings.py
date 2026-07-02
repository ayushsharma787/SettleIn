"""Settings — team/roles + read-only step templates."""
from __future__ import annotations
import streamlit as st

from .. import state
from ..steps import STEP_CATALOG, template_for
from ..ui import avatar, section_header, chip


ROLE_COLOR = {
    "HR Admin": ("#e0e7ff", "#3730a3"),
    "PRO": ("#faf0d8", "#7f581c"),
    "Viewer": ("#e6e9f2", "#3f4a70"),
}


def render():
    state.ensure_state()
    team = state.get_team()

    section_header("Configure", "Settings", "Team access and step templates that power the dependency engine.")
    st.markdown("<div style='height:14px'></div>", unsafe_allow_html=True)

    tab_team, tab_templates, tab_reset = st.tabs(["Team & roles", "Step templates", "Demo controls"])

    with tab_team:
        st.markdown('<div class="ahlan-card" style="padding:0;">', unsafe_allow_html=True)
        st.markdown(
            '<div style="display:grid; grid-template-columns:2fr 1.4fr 2fr 1.2fr; padding:12px 18px; '
            'font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:#626d94; font-weight:700; '
            'background:#f4f5f9; border-radius:16px 16px 0 0;">'
            '<div>Team member</div><div>Role</div><div>Email</div><div>Access</div>'
            '</div>',
            unsafe_allow_html=True,
        )
        for m in team:
            bg, fg = ROLE_COLOR.get(m["role"], ("#e6e9f2", "#3f4a70"))
            st.markdown(
                f'<div style="display:grid; grid-template-columns:2fr 1.4fr 2fr 1.2fr; padding:14px 18px; '
                f'align-items:center; border-bottom:1px solid #f4f5f9; font-size:13px;">'
                f'<div style="display:flex; align-items:center; gap:10px;">{avatar(m["name"], m["initials"], "#2b3556", "sm")}'
                f'<span style="font-weight:600;">{m["name"]}</span></div>'
                f'<div><span class="chip" style="background:{bg}; color:{fg}; border-color:{bg};">{m["role"]}</span></div>'
                f'<div style="color:#3f4a70;">{m["email"]}</div>'
                f'<div style="color:#626d94; font-size:12px;">Full workspace</div>'
                f'</div>',
                unsafe_allow_html=True,
            )
        st.markdown("</div>", unsafe_allow_html=True)

    with tab_templates:
        st.markdown('<div class="small" style="margin-bottom:14px;">Step templates are the source of truth for the dependency engine. Read-only view — the engine is configurable, editing UI is planned for Phase 2.</div>', unsafe_allow_html=True)
        cols = st.columns(3)
        for i, (visa, emirate, has_kids, label) in enumerate([
            ("employer", "Dubai", False, "Employer-sponsored · Dubai"),
            ("golden", "Dubai", True, "Golden visa · Dubai · Family"),
            ("freelance", "Dubai", False, "Freelance · Dubai"),
        ]):
            with cols[i]:
                steps, deps = template_for(visa, emirate, has_kids)
                st.markdown(f'<div class="ahlan-card">', unsafe_allow_html=True)
                st.markdown(f'<div style="font-family:Manrope,sans-serif; font-size:14px; font-weight:700; color:#0b0f1e; margin-bottom:4px;">{label}</div>', unsafe_allow_html=True)
                st.markdown(f'<div style="font-size:11px; color:#626d94; margin-bottom:12px;">{len(steps)} steps</div>', unsafe_allow_html=True)
                for idx, sid in enumerate(steps):
                    stp = STEP_CATALOG[sid]
                    prereq_str = ""
                    if deps[sid]:
                        prereq_str = f'<div style="font-size:10px; color:#97a0c0; margin-top:2px;">needs: {", ".join(STEP_CATALOG[p].name for p in deps[sid])}</div>'
                    st.markdown(
                        f'<div style="padding:8px 10px; background:#f4f5f9; border-radius:8px; margin-bottom:6px;">'
                        f'<div style="font-size:12px; font-weight:600; color:#141a2e;">{idx+1}. {stp.name}</div>'
                        f'<div style="font-size:10px; color:#7f581c;">{stp.portal} · {stp.responsible}</div>'
                        f'{prereq_str}'
                        f'</div>',
                        unsafe_allow_html=True,
                    )
                st.markdown("</div>", unsafe_allow_html=True)

    with tab_reset:
        st.markdown(
            '<div class="ahlan-card">'
            '<div style="font-family:Manrope,sans-serif; font-size:16px; font-weight:700; color:#0b0f1e; margin-bottom:6px;">Demo controls</div>'
            '<div style="font-size:12px; color:#626d94; margin-bottom:14px;">Reset the in-memory session state back to the seeded snapshot.</div>'
            '</div>',
            unsafe_allow_html=True,
        )
        if st.button("Reset demo data", type="primary"):
            state.reset_all()
            st.toast("Session state reset to seed.", icon="↻")
            st.rerun()
