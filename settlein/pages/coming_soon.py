"""Coming soon — Phase 2 stubs, one page per module chosen from sidebar."""
from __future__ import annotations
import streamlit as st
import streamlit.components.v1 as components


STUBS = {
    "Employee mobile app": ("📱", "A companion app for relocating employees to track their onboarding, upload documents, and receive PRO nudges."),
    "Referral marketplace": ("🤝", "Vetted school, housing, moving, and legal partners with negotiated corporate rates — inside the flow."),
    "HRMS integrations": ("🔌", "One-click sync with Bayzat, Zoho People, Darwinbox, and BambooHR. Onboardings arrive pre-populated."),
    "Government portal APIs": ("🏛️", "Direct writes to GDRFA, ICP, and MOHRE via approved integrator pathways — no more manual form uploads."),
    "Bulk CSV import": ("📤", "Import an entire cohort of new hires in one CSV. Templates per visa type. Auto-provisions the roadmap."),
    "PRO agency portal": ("🧑‍💼", "External PRO agencies work inside Ahlan, not email chains. Assignments, SLAs, and receipts, in one place."),
}


def render(module_name: str):
    icon, blurb = STUBS.get(module_name, ("🚧", "Coming soon."))
    components.html(
        f"""
        <div class="stub-hero" style="padding:56px 32px; text-align:center; background:linear-gradient(135deg,#0b0f1e 0%,#1e2740 100%); color:white; border-radius:24px; font-family:'Inter',sans-serif;">
          <div id="stub-tag" style="display:inline-flex; align-items:center; gap:8px; padding:6px 14px; background:rgba(223,174,65,0.20); color:#f3dea3; border:1px solid rgba(223,174,65,0.30); border-radius:999px; font-size:12px; font-weight:600; margin-bottom:22px;">
            🔒 Coming in Phase 2
          </div>
          <div id="stub-icon" style="font-size:64px; margin-bottom:12px;">{icon}</div>
          <h1 id="stub-title" style="font-family:'Manrope',sans-serif; font-size:36px; font-weight:800; letter-spacing:-0.02em; color:white; margin:0 0 12px;">{module_name}</h1>
          <p id="stub-blurb" style="color:#c7cce0; font-size:15px; max-width:520px; margin:0 auto; line-height:1.55;">{blurb}</p>
          <div id="stub-cta" style="margin-top:26px; display:inline-flex; gap:10px;">
            <div style="padding:10px 18px; background:#c99326; color:#0b0f1e; border-radius:10px; font-weight:600; font-size:13px;">Notify me when live</div>
            <div style="padding:10px 18px; background:rgba(255,255,255,0.08); color:#e6e9f2; border:1px solid rgba(255,255,255,0.12); border-radius:10px; font-weight:600; font-size:13px;">Learn more</div>
          </div>
        </div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&display=swap">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
        <script>
          if (typeof gsap !== "undefined") {{
            const tl = gsap.timeline();
            tl.from("#stub-icon", {{scale:0.6, opacity:0, duration:0.5, ease:"back.out(1.4)"}});
            tl.from("#stub-title", {{y:12, opacity:0, duration:0.4}}, "-=0.15");
            tl.from("#stub-blurb", {{y:8, opacity:0, duration:0.4}}, "-=0.2");
            tl.from("#stub-cta > div", {{y:8, opacity:0, duration:0.35, stagger:0.08}}, "-=0.15");
          }}
        </script>
        """,
        height=460,
    )
