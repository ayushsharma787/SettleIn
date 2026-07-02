"""Custom CSS + design tokens for Ahlan.

Confident, product-y palette: deep navy ink, warm sand accents, teal
highlight, generous whitespace. Not the default Streamlit look.
"""
import streamlit as st


COLORS = {
    "ink_50": "#f4f5f9",
    "ink_100": "#e6e9f2",
    "ink_200": "#c7cce0",
    "ink_300": "#97a0c0",
    "ink_400": "#626d94",
    "ink_500": "#3f4a70",
    "ink_600": "#2b3556",
    "ink_700": "#1e2740",
    "ink_800": "#141a2e",
    "ink_900": "#0b0f1e",
    "sand_200": "#f3dea3",
    "sand_300": "#ebc76b",
    "sand_400": "#dfae41",
    "sand_500": "#c99326",
    "sand_600": "#a5751f",
    "sand_700": "#7f581c",
    "teal": "#2ec4b6",
    "emerald_500": "#10b981",
    "amber_500": "#f59e0b",
    "rose_500": "#f43f5e",
    "blue_500": "#3b82f6",
}


STATUS_COLORS = {
    "done": {"bg": "rgba(16,185,129,0.10)", "fg": "#047857", "ring": "rgba(16,185,129,0.30)", "dot": "#10b981", "label": "Done"},
    "in_progress": {"bg": "rgba(59,130,246,0.10)", "fg": "#1d4ed8", "ring": "rgba(59,130,246,0.30)", "dot": "#3b82f6", "label": "In Progress"},
    "available": {"bg": "rgba(223,174,65,0.18)", "fg": "#7f581c", "ring": "rgba(201,147,38,0.40)", "dot": "#c99326", "label": "Available"},
    "locked": {"bg": "#e6e9f2", "fg": "#3f4a70", "ring": "#c7cce0", "dot": "#97a0c0", "label": "Locked"},
    "blocked": {"bg": "rgba(244,63,94,0.10)", "fg": "#be123c", "ring": "rgba(244,63,94,0.30)", "dot": "#f43f5e", "label": "Blocked"},
    "awaiting_employee": {"bg": "rgba(245,158,11,0.12)", "fg": "#92400e", "ring": "rgba(245,158,11,0.30)", "dot": "#f59e0b", "label": "Awaiting Employee"},
}


STAGE_COLORS = {
    "Pre-Arrival": "#c99326",
    "Immigration": "#dfae41",
    "Identity": "#3f4a70",
    "Banking & Housing": "#2b3556",
    "Utilities & Insurance": "#2ec4b6",
    "Completed": "#10b981",
}


CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');

html, body, [class*="css"], .stApp {
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif !important;
    color: #141a2e;
}

.stApp {
    background: #f4f5f9;
}

h1, h2, h3, h4, .display {
    font-family: 'Manrope', 'Inter', sans-serif !important;
    color: #0b0f1e;
    letter-spacing: -0.01em;
}

/* Sidebar polish */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0b0f1e 0%, #141a2e 100%) !important;
    border-right: 1px solid #1e2740;
}
section[data-testid="stSidebar"] * {
    color: #e6e9f2 !important;
}
section[data-testid="stSidebar"] .stRadio label {
    color: #e6e9f2 !important;
}
section[data-testid="stSidebar"] label {
    font-size: 13px;
}
section[data-testid="stSidebar"] .stSelectbox label,
section[data-testid="stSidebar"] .stMultiSelect label {
    color: #97a0c0 !important;
    font-size: 11px !important;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 600;
}
section[data-testid="stSidebar"] .stSelectbox > div > div,
section[data-testid="stSidebar"] .stMultiSelect > div > div {
    background: #1e2740 !important;
    border-color: #2b3556 !important;
    color: #e6e9f2 !important;
}
section[data-testid="stSidebar"] .stButton > button {
    width: 100%;
    background: transparent !important;
    color: #e6e9f2 !important;
    border: 1px solid transparent !important;
    text-align: left !important;
    padding: 0.5rem 0.75rem !important;
    border-radius: 8px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    justify-content: flex-start !important;
    transition: all 0.15s ease !important;
}
section[data-testid="stSidebar"] .stButton > button:hover {
    background: rgba(255,255,255,0.05) !important;
    color: #ffffff !important;
}
section[data-testid="stSidebar"] .stButton > button:focus {
    box-shadow: none !important;
}
section[data-testid="stSidebar"] .stButton[data-active="true"] > button,
section[data-testid="stSidebar"] .active-nav > button {
    background: rgba(223,174,65,0.18) !important;
    color: #f3dea3 !important;
    border-color: rgba(223,174,65,0.25) !important;
}

/* Main content padding */
.main .block-container {
    padding-top: 1.5rem !important;
    padding-bottom: 3rem !important;
    max-width: 1500px !important;
}

/* Cards */
.ahlan-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 0 rgba(20, 26, 46, 0.04);
    border: 1px solid #e6e9f2;
}
.ahlan-card-dark {
    background: linear-gradient(135deg, #0b0f1e 0%, #1e2740 100%);
    color: white;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid #1e2740;
}
.ahlan-card-sand {
    background: linear-gradient(135deg, #faf0d8 0%, #f3dea3 100%);
    color: #0b0f1e;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(201,147,38,0.25);
}
.ahlan-card-teal {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #064e3b;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(16,185,129,0.20);
}
.ahlan-card-rose {
    background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
    color: #881337;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(244,63,94,0.20);
}

/* KPI cards */
.kpi { border-radius: 18px; padding: 22px; position: relative; overflow: hidden; }
.kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
.kpi-value { font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.kpi-label { font-size: 13px; opacity: 0.85; margin-top: 4px; font-weight: 500; }
.kpi-sub { font-size: 11px; opacity: 0.65; margin-top: 8px; }

.kpi-ink { background: #0b0f1e; color: white; }
.kpi-ink .kpi-icon { background: rgba(223,174,65,0.20); color: #f3dea3; }
.kpi-sand { background: linear-gradient(135deg, #faf0d8, #f3dea3); color: #0b0f1e; }
.kpi-sand .kpi-icon { background: white; color: #7f581c; }
.kpi-teal { background: #ecfdf5; color: #064e3b; border: 1px solid rgba(16,185,129,0.15); }
.kpi-teal .kpi-icon { background: white; color: #047857; }
.kpi-rose { background: #fff1f2; color: #881337; border: 1px solid rgba(244,63,94,0.15); }
.kpi-rose .kpi-icon { background: white; color: #be123c; }

/* Chips */
.chip {
    display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 999px; border: 1px solid transparent;
    white-space: nowrap;
}
.chip-dot { width: 6px; height: 6px; border-radius: 999px; }

.chip-done { background: rgba(16,185,129,0.10); color: #047857; border-color: rgba(16,185,129,0.30); }
.chip-in_progress { background: rgba(59,130,246,0.10); color: #1d4ed8; border-color: rgba(59,130,246,0.30); }
.chip-available { background: rgba(223,174,65,0.18); color: #7f581c; border-color: rgba(201,147,38,0.40); }
.chip-locked { background: #e6e9f2; color: #3f4a70; border-color: #c7cce0; }
.chip-blocked { background: rgba(244,63,94,0.10); color: #be123c; border-color: rgba(244,63,94,0.30); }
.chip-awaiting_employee { background: rgba(245,158,11,0.12); color: #92400e; border-color: rgba(245,158,11,0.30); }

.chip-neutral { background: #e6e9f2; color: #2b3556; border-color: #c7cce0; }

/* Avatar */
.avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; color: white; font-weight: 600; }
.avatar-sm { width: 28px; height: 28px; font-size: 10px; }
.avatar-md { width: 36px; height: 36px; font-size: 12px; }
.avatar-lg { width: 48px; height: 48px; font-size: 14px; }
.avatar-xl { width: 72px; height: 72px; font-size: 22px; }

/* Employee card in kanban */
.emp-card {
    background: white; padding: 14px; border-radius: 12px; border: 1px solid #e6e9f2;
    box-shadow: 0 1px 0 rgba(20,26,46,0.03); transition: all 0.15s ease;
    margin-bottom: 10px;
}
.emp-card:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(20,26,46,0.08); border-color: #c7cce0; }
.emp-card.blocked { border-color: rgba(244,63,94,0.35); }
.emp-card .row1 { display: flex; align-items: center; gap: 10px; }
.emp-card .name { font-weight: 600; font-size: 13px; color: #141a2e; }
.emp-card .role { font-size: 11px; color: #626d94; }
.emp-card .tags { display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap; }
.emp-card .footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid #f4f5f9; }
.emp-card .step-name { font-weight: 500; font-size: 12px; color: #1e2740; }
.emp-card .foot-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.emp-card .days { font-size: 10px; color: #626d94; }

.kanban-column {
    background: white; border-radius: 16px; padding: 14px; border: 1px solid #e6e9f2;
    min-height: 500px;
}
.kanban-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 12px; margin-bottom: 10px; border-bottom: 1px solid #f4f5f9;
}
.kanban-header .title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #141a2e; }
.kanban-header .count { background: #f4f5f9; color: #3f4a70; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }

/* Roadmap */
.roadmap { position: relative; }
.roadmap-item {
    display: flex; gap: 16px; padding: 14px 0; position: relative;
}
.roadmap-item:not(:last-child)::after {
    content: ''; position: absolute; left: 18px; top: 44px; bottom: -14px;
    width: 2px; background: #e6e9f2;
}
.roadmap-item.done:not(:last-child)::after { background: #10b981; }
.roadmap-dot {
    width: 38px; height: 38px; border-radius: 999px; display: flex;
    align-items: center; justify-content: center; font-weight: 700; font-size: 13px;
    flex-shrink: 0; z-index: 1; border: 3px solid white; box-shadow: 0 0 0 2px #e6e9f2;
}
.roadmap-item.done .roadmap-dot { background: #10b981; color: white; box-shadow: 0 0 0 2px #10b981; }
.roadmap-item.in_progress .roadmap-dot { background: #3b82f6; color: white; box-shadow: 0 0 0 2px #3b82f6; }
.roadmap-item.available .roadmap-dot { background: #dfae41; color: #0b0f1e; box-shadow: 0 0 0 2px #dfae41; }
.roadmap-item.locked .roadmap-dot { background: #e6e9f2; color: #97a0c0; }
.roadmap-item.blocked .roadmap-dot { background: #f43f5e; color: white; box-shadow: 0 0 0 2px #f43f5e; }

.roadmap-body { flex: 1; }
.roadmap-title { font-weight: 600; font-size: 14px; color: #141a2e; }
.roadmap-meta { font-size: 12px; color: #626d94; margin-top: 2px; }
.roadmap-doc { font-size: 11px; padding: 2px 8px; border-radius: 6px; background: #f4f5f9; color: #3f4a70; margin-right: 4px; }
.roadmap-doc.received { background: #d1fae5; color: #047857; }
.roadmap-doc.missing { background: #fee2e2; color: #991b1b; }

/* Compliance summary */
.urgency-tile { padding: 14px 16px; border-radius: 12px; }
.urgency-tile .count { font-size: 26px; font-weight: 700; font-family: 'Manrope', sans-serif; }
.urgency-tile .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; }
.urgency-overdue { background: #fff1f2; color: #881337; border: 1px solid rgba(244,63,94,0.20); }
.urgency-30 { background: #fffbeb; color: #78350f; border: 1px solid rgba(245,158,11,0.25); }
.urgency-90 { background: #fdf9f0; color: #7f581c; border: 1px solid rgba(201,147,38,0.30); }
.urgency-ok { background: #ecfdf5; color: #064e3b; border: 1px solid rgba(16,185,129,0.20); }

/* Compliance table row */
.compliance-row {
    display: grid; grid-template-columns: 2.5fr 1.5fr 1fr 1fr 1fr;
    padding: 14px 16px; align-items: center; border-bottom: 1px solid #f4f5f9;
    font-size: 13px;
}
.compliance-row:hover { background: #f4f5f9; }

/* Coming soon page */
.stub-hero { padding: 60px 40px; text-align: center; background: linear-gradient(135deg, #0b0f1e 0%, #1e2740 100%); color: white; border-radius: 24px; }
.stub-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(223,174,65,0.20); color: #f3dea3; border: 1px solid rgba(223,174,65,0.30); border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }

/* Section header */
.eyebrow { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: #a5751f; }
.section-title { font-size: 28px; font-weight: 700; color: #0b0f1e; margin-top: 4px; font-family: 'Manrope', sans-serif; letter-spacing: -0.02em; }
.section-sub { color: #626d94; font-size: 13px; margin-top: 6px; }

/* Utility */
.hstack { display: flex; align-items: center; gap: 10px; }
.small { font-size: 12px; color: #626d94; }

/* Fix button styling in main content */
.stApp .main .stButton > button {
    background: white;
    color: #141a2e;
    border: 1px solid #c7cce0;
    border-radius: 8px;
    font-weight: 500;
    padding: 6px 14px;
    font-size: 13px;
    transition: all 0.15s ease;
}
.stApp .main .stButton > button:hover {
    background: #f4f5f9;
    border-color: #97a0c0;
}
.stApp .main .stButton > button[kind="primary"] {
    background: #c99326;
    color: white;
    border-color: #c99326;
}
.stApp .main .stButton > button[kind="primary"]:hover {
    background: #a5751f;
    border-color: #a5751f;
}

/* Fix metric styling */
[data-testid="stMetric"] {
    background: white;
    padding: 16px 20px;
    border-radius: 14px;
    border: 1px solid #e6e9f2;
}

/* Tabs */
.stTabs [data-baseweb="tab-list"] {
    gap: 4px;
    background: #e6e9f2;
    padding: 4px;
    border-radius: 12px;
}
.stTabs [data-baseweb="tab"] {
    background: transparent;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #3f4a70;
}
.stTabs [aria-selected="true"] {
    background: white !important;
    color: #0b0f1e !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

/* Animations */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeInUp 0.3s ease-out; }

@keyframes unlockFlash {
    0% { background: rgba(46,196,182,0); box-shadow: 0 0 0 0 rgba(46,196,182,0); }
    30% { background: rgba(46,196,182,0.18); box-shadow: 0 0 0 6px rgba(46,196,182,0.15); }
    100% { background: rgba(46,196,182,0); box-shadow: 0 0 0 0 rgba(46,196,182,0); }
}
.unlock-flash { animation: unlockFlash 1.4s ease; border-radius: 12px; }

@keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(59,130,246,0); }
}
.pulse-active { animation: pulseGlow 2s ease-in-out infinite; }

/* Alerts row */
.alert-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    border-radius: 10px; transition: background 0.15s ease;
}
.alert-row:hover { background: #f4f5f9; }
.alert-row .dot { width: 8px; height: 8px; border-radius: 999px; flex-shrink: 0; }

/* Nav pill (topbar) */
.company-pill {
    display: inline-flex; align-items: center; gap: 10px; background: white;
    padding: 6px 12px 6px 6px; border-radius: 999px; border: 1px solid #e6e9f2;
}
.company-pill .logo {
    width: 32px; height: 32px; background: #0b0f1e; color: #f3dea3;
    display: flex; align-items: center; justify-content: center;
    border-radius: 999px; font-weight: 700; font-family: 'Manrope', sans-serif; font-size: 12px;
}
.company-pill .info { line-height: 1.2; }
.company-pill .name { font-size: 13px; font-weight: 600; color: #141a2e; }
.company-pill .meta { font-size: 10px; color: #626d94; }

/* Bell */
.bell-btn {
    position: relative; width: 40px; height: 40px; background: white;
    border-radius: 12px; border: 1px solid #e6e9f2; display: inline-flex;
    align-items: center; justify-content: center; font-size: 18px;
}
.bell-badge {
    position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px;
    background: #f43f5e; color: white; border-radius: 999px; display: inline-flex;
    align-items: center; justify-content: center; font-size: 11px; font-weight: 700;
    padding: 0 5px;
}
</style>
"""


def inject_css():
    st.markdown(CSS, unsafe_allow_html=True)
