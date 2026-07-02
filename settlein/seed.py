"""Seed roster, tasks, compliance items, activity feed for the Ahlan demo."""
from __future__ import annotations
from datetime import date, timedelta
from typing import Dict, List

from .engine import Status
from .steps import template_for

TODAY = date(2026, 7, 2)


def _d(delta: int) -> str:
    return (TODAY + timedelta(days=delta)).isoformat()


COMPANY = {
    "id": "meridian",
    "name": "Meridian Trading LLC",
    "headquarters": "Dubai, UAE",
    "logo": "MT",
    "employee_count": 62,
    "active_since": "2018",
}

TEAM = [
    {"id": "u1", "name": "Nadia Al-Farsi", "role": "HR Admin", "email": "nadia@meridian.ae", "initials": "NA"},
    {"id": "u2", "name": "Rohit Menon", "role": "PRO", "email": "rohit@meridian.ae", "initials": "RM"},
    {"id": "u3", "name": "Aisha Rahman", "role": "PRO", "email": "aisha@meridian.ae", "initials": "AR"},
    {"id": "u4", "name": "Marcus Weber", "role": "HR Admin", "email": "marcus@meridian.ae", "initials": "MW"},
    {"id": "u5", "name": "Farrah Idris", "role": "Viewer", "email": "farrah@meridian.ae", "initials": "FI"},
]

AGENCY_COST_PER_EMPLOYEE_AED = 8000


def _build_states(emp: dict, done_ids: List[str], in_progress_id=None, blocked_id=None) -> dict:
    step_statuses: Dict[str, str] = {}
    step_started_at: Dict[str, str] = {}
    step_completed_at: Dict[str, str] = {}
    step_due_dates: Dict[str, str] = {}
    for i, sid in enumerate(done_ids):
        step_statuses[sid] = Status.DONE
        step_completed_at[sid] = _d(-40 + i * 3)
        step_started_at[sid] = _d(-42 + i * 3)
    if in_progress_id:
        step_statuses[in_progress_id] = Status.IN_PROGRESS
        step_started_at[in_progress_id] = _d(-6)
        step_due_dates[in_progress_id] = _d(4)
    if blocked_id:
        step_statuses[blocked_id] = Status.BLOCKED
        step_started_at[blocked_id] = _d(-18)
        step_due_dates[blocked_id] = _d(-4)
    return dict(
        step_statuses=step_statuses,
        step_started_at=step_started_at,
        step_completed_at=step_completed_at,
        step_due_dates=step_due_dates,
    )


_roster_seed = [
    dict(
        id="e1", first="Ranjith", last="Krishnan", role="VP Engineering",
        nationality="Indian", visa_type="golden", emirate="Dubai", has_children=True,
        arrival=_d(-70), pro="u2", avatar_bg="#3f4a70",
        done=["golden_visa_nomination", "entry_permit", "medical_test",
              "emirates_id_biometrics", "visa_stamping", "emirates_id_issued",
              "bank_account", "housing_search", "tenancy_contract",
              "health_insurance", "ejari"],
        in_progress="dewa",
    ),
    dict(
        id="e2", first="Sofia", last="Marchetti", role="Design Consultant",
        nationality="Italian", visa_type="freelance", emirate="Dubai", has_children=False,
        arrival=_d(-32), pro="u3", avatar_bg="#a5751f",
        done=["freelance_permit", "medical_test", "emirates_id_biometrics",
              "emirates_id_issued"],
        in_progress="bank_account",
    ),
    dict(
        id="e3", first="Ahmed", last="Salah", role="Senior Accountant",
        nationality="Egyptian", visa_type="employer", emirate="Dubai", has_children=True,
        arrival=_d(-45), pro="u2", avatar_bg="#2ec4b6",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued"],
        in_progress="bank_account",
    ),
    dict(
        id="e4", first="Priya", last="Sharma", role="Marketing Manager",
        nationality="Indian", visa_type="employer", emirate="Dubai", has_children=True,
        arrival=_d(-58), pro="u3", avatar_bg="#c99326",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued",
              "bank_account", "housing_search", "tenancy_contract", "ejari"],
        in_progress="school_enrollment",
    ),
    dict(
        id="e5", first="Yusuf", last="Al-Nahyan", role="Regional Sales Director",
        nationality="Jordanian", visa_type="employer", emirate="Abu Dhabi", has_children=False,
        arrival=_d(-38), pro="u2", avatar_bg="#1e2740",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued"],
        in_progress="housing_search",
    ),
    dict(
        id="e6", first="Chen", last="Wei", role="Data Engineer",
        nationality="Chinese", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(-24), pro="u2", avatar_bg="#7f581c",
        done=["entry_permit", "medical_test", "emirates_id_biometrics"],
        blocked="visa_stamping",
    ),
    dict(
        id="e7", first="Olumide", last="Adebayo", role="DevOps Lead",
        nationality="Nigerian", visa_type="employer", emirate="Dubai", has_children=True,
        arrival=_d(-16), pro="u3", avatar_bg="#3f4a70",
        done=["entry_permit"],
        blocked="medical_test",
    ),
    dict(
        id="e8", first="Elena", last="Volkova", role="Product Manager",
        nationality="Russian", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(-110), pro="u2", avatar_bg="#2b3556",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued",
              "bank_account", "housing_search", "tenancy_contract",
              "ejari", "dewa", "health_insurance", "driving_licence"],
    ),
    dict(
        id="e9", first="Karim", last="Boujelbene", role="CFO",
        nationality="Tunisian", visa_type="golden", emirate="Dubai", has_children=True,
        arrival=_d(-140), pro="u2", avatar_bg="#c99326",
        done=["golden_visa_nomination", "entry_permit", "medical_test",
              "emirates_id_biometrics", "visa_stamping", "emirates_id_issued",
              "bank_account", "housing_search", "tenancy_contract",
              "ejari", "dewa", "health_insurance", "school_enrollment",
              "driving_licence"],
    ),
    dict(
        id="e10", first="Maya", last="Nakamura", role="UX Researcher",
        nationality="Japanese", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(-95), pro="u3", avatar_bg="#a5751f",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued",
              "bank_account", "housing_search", "tenancy_contract",
              "ejari", "dewa", "health_insurance", "driving_licence"],
    ),
    dict(
        id="e11", first="Diego", last="Fernandez", role="Backend Engineer",
        nationality="Argentinian", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(12), pro="u2", avatar_bg="#1e2740",
        done=[],
        in_progress="entry_permit",
    ),
    dict(
        id="e12", first="Layla", last="Haddad", role="Legal Counsel",
        nationality="Lebanese", visa_type="employer", emirate="Dubai", has_children=True,
        arrival=_d(20), pro="u3", avatar_bg="#7f581c",
        done=[],
        in_progress="entry_permit",
    ),
    dict(
        id="e13", first="Thomas", last="Brennan", role="Sales Lead",
        nationality="Irish", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(-8), pro="u2", avatar_bg="#2ec4b6",
        done=["entry_permit", "medical_test"],
        in_progress="emirates_id_biometrics",
    ),
    dict(
        id="e14", first="Nora", last="Petersen", role="Head of People",
        nationality="Danish", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(-50), pro="u3", avatar_bg="#3f4a70",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued",
              "bank_account"],
        in_progress="housing_search",
    ),
    dict(
        id="e15", first="Ravi", last="Iyer", role="Full-Stack Engineer",
        nationality="Indian", visa_type="employer", emirate="Dubai", has_children=False,
        arrival=_d(-42), pro="u2", avatar_bg="#c99326",
        done=["entry_permit", "medical_test", "emirates_id_biometrics",
              "visa_stamping", "labour_contract", "emirates_id_issued",
              "bank_account", "housing_search"],
        in_progress="tenancy_contract",
    ),
    dict(
        id="e16", first="Fatima", last="Al-Mansouri", role="Operations Analyst",
        nationality="Moroccan", visa_type="employer", emirate="Abu Dhabi", has_children=True,
        arrival=_d(-30), pro="u3", avatar_bg="#a5751f",
        done=["entry_permit", "medical_test", "emirates_id_biometrics"],
        in_progress="visa_stamping",
    ),
]


def _build_employees() -> List[dict]:
    result = []
    for raw in _roster_seed:
        emp = {
            "id": raw["id"],
            "name": f'{raw["first"]} {raw["last"]}',
            "first_name": raw["first"],
            "last_name": raw["last"],
            "initials": raw["first"][0] + raw["last"][0],
            "role": raw["role"],
            "nationality": raw["nationality"],
            "visa_type": raw["visa_type"],
            "emirate": raw["emirate"],
            "has_children": raw["has_children"],
            "arrival_date": raw["arrival"],
            "assigned_pro": raw["pro"],
            "avatar_bg": raw["avatar_bg"],
        }
        emp.update(_build_states(emp, raw.get("done", []), raw.get("in_progress"), raw.get("blocked")))
        emp["step_docs"] = {}
        result.append(emp)
    return result


EMPLOYEES = _build_employees()


COMPLIANCE_ITEMS = [
    {"id": "c1", "employee_id": "e8", "document": "Residence Visa", "expiry_date": _d(-8)},
    {"id": "c2", "employee_id": "e10", "document": "Emirates ID", "expiry_date": _d(-2)},
    {"id": "c3", "employee_id": "e9", "document": "Health Insurance", "expiry_date": _d(11)},
    {"id": "c4", "employee_id": "e8", "document": "Emirates ID", "expiry_date": _d(22)},
    {"id": "c5", "employee_id": "e10", "document": "Residence Visa", "expiry_date": _d(28)},
    {"id": "c6", "employee_id": "e4", "document": "Labour Card", "expiry_date": _d(35)},
    {"id": "c7", "employee_id": "e9", "document": "Emirates ID", "expiry_date": _d(44)},
    {"id": "c8", "employee_id": "e4", "document": "Ejari Certificate", "expiry_date": _d(51)},
    {"id": "c9", "employee_id": "e8", "document": "Labour Card", "expiry_date": _d(62)},
    {"id": "c10", "employee_id": "e10", "document": "Health Insurance", "expiry_date": _d(71)},
    {"id": "c11", "employee_id": "e15", "document": "Residence Visa", "expiry_date": _d(78)},
    {"id": "c12", "employee_id": "e9", "document": "Labour Card", "expiry_date": _d(84)},
    {"id": "c13", "employee_id": "e4", "document": "Residence Visa", "expiry_date": _d(96)},
    {"id": "c14", "employee_id": "e14", "document": "Emirates ID", "expiry_date": _d(105)},
    {"id": "c15", "employee_id": "e5", "document": "Health Insurance", "expiry_date": _d(120)},
    {"id": "c16", "employee_id": "e3", "document": "Labour Card", "expiry_date": _d(135)},
    {"id": "c17", "employee_id": "e2", "document": "Freelance Permit", "expiry_date": _d(150)},
    {"id": "c18", "employee_id": "e1", "document": "Golden Visa", "expiry_date": _d(1420)},
    {"id": "c19", "employee_id": "e9", "document": "Golden Visa", "expiry_date": _d(2100)},
    {"id": "c20", "employee_id": "e10", "document": "Ejari Certificate", "expiry_date": _d(180)},
    {"id": "c21", "employee_id": "e8", "document": "Ejari Certificate", "expiry_date": _d(210)},
    {"id": "c22", "employee_id": "e15", "document": "Labour Card", "expiry_date": _d(240)},
    {"id": "c23", "employee_id": "e14", "document": "Residence Visa", "expiry_date": _d(295)},
    {"id": "c24", "employee_id": "e4", "document": "Health Insurance", "expiry_date": _d(340)},
    {"id": "c25", "employee_id": "e3", "document": "Health Insurance", "expiry_date": _d(400)},
    {"id": "c26", "employee_id": "e5", "document": "Emirates ID", "expiry_date": _d(455)},
    {"id": "c27", "employee_id": "e16", "document": "Health Insurance", "expiry_date": _d(520)},
]

TASKS = [
    {"id": "t1", "employee_id": "e1", "step_id": "dewa", "title": "Book DEWA connection appointment", "owner_id": "u2", "due_date": _d(3), "status": "open", "priority": "medium"},
    {"id": "t2", "employee_id": "e2", "step_id": "bank_account", "title": "Follow up with Emirates NBD relationship manager", "owner_id": "u3", "due_date": _d(1), "status": "open", "priority": "high"},
    {"id": "t3", "employee_id": "e3", "step_id": "bank_account", "title": "Collect salary certificate for ADCB", "owner_id": "u1", "due_date": _d(2), "status": "open", "priority": "medium"},
    {"id": "t4", "employee_id": "e4", "step_id": "school_enrollment", "title": "Submit KHDA transfer certificate", "owner_id": "u3", "due_date": _d(6), "status": "open", "priority": "medium"},
    {"id": "t5", "employee_id": "e5", "step_id": "housing_search", "title": "Shortlist 3 apartments in Al Reem", "owner_id": "u2", "due_date": _d(5), "status": "open", "priority": "low"},
    {"id": "t6", "employee_id": "e6", "step_id": "visa_stamping", "title": "Reschedule GDRFA appointment — passport issue", "owner_id": "u2", "due_date": _d(-2), "status": "blocked", "priority": "high"},
    {"id": "t7", "employee_id": "e7", "step_id": "medical_test", "title": "DHA rejected — arrange re-test at Al Barsha", "owner_id": "u3", "due_date": _d(-1), "status": "blocked", "priority": "high"},
    {"id": "t8", "employee_id": "e11", "step_id": "entry_permit", "title": "Upload passport photo (min 600x600)", "owner_id": "u4", "due_date": _d(2), "status": "open", "priority": "high"},
    {"id": "t9", "employee_id": "e12", "step_id": "entry_permit", "title": "Complete MOHRE offer letter signature", "owner_id": "u1", "due_date": _d(4), "status": "open", "priority": "medium"},
    {"id": "t10", "employee_id": "e13", "step_id": "emirates_id_biometrics", "title": "Book ICP biometrics slot", "owner_id": "u2", "due_date": _d(1), "status": "open", "priority": "medium"},
    {"id": "t11", "employee_id": "e14", "step_id": "housing_search", "title": "Confirm short-term let in Dubai Marina", "owner_id": "u3", "due_date": _d(3), "status": "open", "priority": "low"},
    {"id": "t12", "employee_id": "e15", "step_id": "tenancy_contract", "title": "Landlord to counter-sign tenancy contract", "owner_id": "u2", "due_date": _d(2), "status": "open", "priority": "medium"},
    {"id": "t13", "employee_id": "e16", "step_id": "visa_stamping", "title": "Submit medical certificate to ICP Abu Dhabi", "owner_id": "u3", "due_date": _d(4), "status": "open", "priority": "medium"},
    {"id": "t14", "employee_id": "e1", "step_id": "dewa", "title": "Set up direct debit for DEWA", "owner_id": "u2", "due_date": _d(7), "status": "open", "priority": "low"},
    {"id": "t15", "employee_id": "e8", "step_id": "renewal", "title": "Renew Elena Volkova residence visa (overdue)", "owner_id": "u2", "due_date": _d(-3), "status": "blocked", "priority": "high"},
    {"id": "t16", "employee_id": "e10", "step_id": "renewal", "title": "Renew Maya Nakamura Emirates ID", "owner_id": "u3", "due_date": _d(1), "status": "open", "priority": "high"},
    {"id": "t17", "employee_id": "e3", "step_id": "housing_search", "title": "Share family-friendly compound options in Mirdif", "owner_id": "u1", "due_date": _d(6), "status": "open", "priority": "low"},
]

ACTIVITY = [
    {"id": "a1", "ts": _d(0), "actor_id": "u2", "employee_id": "e1", "message": "marked Ejari Registration as Done for Ranjith Krishnan"},
    {"id": "a2", "ts": _d(0), "actor_id": "u3", "employee_id": "e2", "message": "started bank account application for Sofia Marchetti"},
    {"id": "a3", "ts": _d(-1), "actor_id": "u1", "employee_id": "e11", "message": "created onboarding record for Diego Fernandez"},
    {"id": "a4", "ts": _d(-1), "actor_id": "u2", "employee_id": "e6", "message": "flagged Chen Wei visa stamping as Blocked (passport reissue)"},
    {"id": "a5", "ts": _d(-2), "actor_id": "u3", "employee_id": "e4", "message": "uploaded Priya Sharma school transfer certificate"},
    {"id": "a6", "ts": _d(-2), "actor_id": "u2", "employee_id": "e13", "message": "completed Medical Fitness Test for Thomas Brennan"},
    {"id": "a7", "ts": _d(-3), "actor_id": "u3", "employee_id": "e7", "message": "DHA reported rescreen required for Olumide Adebayo"},
    {"id": "a8", "ts": _d(-3), "actor_id": "u2", "employee_id": "e14", "message": "completed bank account for Nora Petersen"},
    {"id": "a9", "ts": _d(-4), "actor_id": "u1", "employee_id": "e12", "message": "created onboarding record for Layla Haddad"},
]
