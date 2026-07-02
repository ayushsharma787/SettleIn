"""Step catalog + per-visa-type templates + base dependency graph.

The dependency engine treats this as the single source of truth: which steps
exist, which portal owns them, who's responsible, and what unlocks what.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List


@dataclass(frozen=True)
class StepDef:
    id: str
    name: str
    stage: str
    portal: str
    responsible: str
    processing_days: int
    required_docs: List[str] = field(default_factory=list)


STEP_CATALOG: Dict[str, StepDef] = {
    "entry_permit": StepDef(
        "entry_permit", "Entry Permit", "Pre-Arrival",
        "GDRFA / ICP", "PRO", 5, ["Passport copy", "Photo", "Offer letter"],
    ),
    "medical_test": StepDef(
        "medical_test", "Medical Fitness Test", "Immigration",
        "DHA / SEHA", "Employee", 3, ["Passport", "Entry permit"],
    ),
    "emirates_id_biometrics": StepDef(
        "emirates_id_biometrics", "Emirates ID Biometrics", "Identity",
        "ICP", "Employee", 2, ["Passport", "Entry permit"],
    ),
    "visa_stamping": StepDef(
        "visa_stamping", "Residence Visa Stamping", "Identity",
        "GDRFA / ICP", "PRO", 4, ["Passport", "Medical certificate"],
    ),
    "labour_contract": StepDef(
        "labour_contract", "Labour Contract", "Identity",
        "MOHRE", "HR", 3, ["Offer letter", "Emirates ID"],
    ),
    "emirates_id_issued": StepDef(
        "emirates_id_issued", "Emirates ID Card Issued", "Identity",
        "ICP", "PRO", 5, ["Biometrics receipt"],
    ),
    "bank_account": StepDef(
        "bank_account", "Bank Account", "Banking & Housing",
        "Emirates NBD / ADCB", "Employee", 4,
        ["Emirates ID", "Salary certificate", "Passport"],
    ),
    "housing_search": StepDef(
        "housing_search", "Housing Search", "Banking & Housing",
        "Bayut / Property Finder", "Employee", 14, [],
    ),
    "tenancy_contract": StepDef(
        "tenancy_contract", "Tenancy Contract", "Banking & Housing",
        "Landlord", "Employee", 2,
        ["Passport", "Emirates ID", "Salary certificate"],
    ),
    "ejari": StepDef(
        "ejari", "Ejari Registration", "Utilities & Insurance",
        "Dubai Land Department", "PRO", 2,
        ["Tenancy contract", "Emirates ID", "Passport"],
    ),
    "dewa": StepDef(
        "dewa", "DEWA Connection", "Utilities & Insurance",
        "DEWA", "Employee", 1, ["Ejari certificate", "Emirates ID"],
    ),
    "addc": StepDef(
        "addc", "ADDC Connection", "Utilities & Insurance",
        "ADDC", "Employee", 1, ["Tenancy contract", "Emirates ID"],
    ),
    "health_insurance": StepDef(
        "health_insurance", "Health Insurance", "Utilities & Insurance",
        "DHA / Daman", "HR", 3, ["Emirates ID", "Passport"],
    ),
    "school_enrollment": StepDef(
        "school_enrollment", "School Enrollment", "Utilities & Insurance",
        "KHDA / ADEK", "Employee", 10,
        ["Emirates ID", "Previous school transcripts", "Vaccination card"],
    ),
    "driving_licence": StepDef(
        "driving_licence", "Driving Licence", "Utilities & Insurance",
        "RTA", "Employee", 7, ["Emirates ID", "Home country licence"],
    ),
    "freelance_permit": StepDef(
        "freelance_permit", "Freelance Permit", "Pre-Arrival",
        "DET / Freezone", "HR", 7, ["Portfolio", "Passport", "CV"],
    ),
    "golden_visa_nomination": StepDef(
        "golden_visa_nomination", "Golden Visa Nomination", "Pre-Arrival",
        "ICP", "HR", 21,
        ["Salary certificate (AED 30k+)", "Attested degree", "Passport"],
    ),
}

# Base dependency edges (successor -> prerequisites)
_BASE_DEPENDENCIES: Dict[str, List[str]] = {
    "entry_permit": [],
    "medical_test": ["entry_permit"],
    "emirates_id_biometrics": ["entry_permit"],
    "visa_stamping": ["medical_test", "emirates_id_biometrics"],
    "labour_contract": ["visa_stamping"],
    "emirates_id_issued": ["emirates_id_biometrics", "visa_stamping"],
    "bank_account": ["emirates_id_issued"],
    "housing_search": ["entry_permit"],
    "tenancy_contract": ["housing_search", "bank_account"],
    "ejari": ["tenancy_contract"],
    "dewa": ["ejari"],
    "addc": ["tenancy_contract"],
    "health_insurance": ["emirates_id_issued"],
    "school_enrollment": ["emirates_id_issued"],
    "driving_licence": ["emirates_id_issued"],
}

PIPELINE_STAGES = [
    "Pre-Arrival",
    "Immigration",
    "Identity",
    "Banking & Housing",
    "Utilities & Insurance",
    "Completed",
]


def template_for(visa_type: str, emirate: str, has_children: bool):
    """Build (steps, deps) for an employee.

    Freelance replaces entry_permit with freelance_permit as the root.
    Golden adds golden_visa_nomination as a predecessor to entry_permit.
    Emirate switches the utility branch (Dubai=Ejari+DEWA, other=ADDC).
    """
    if visa_type == "freelance":
        steps = [
            "freelance_permit", "medical_test", "emirates_id_biometrics",
            "emirates_id_issued", "bank_account", "housing_search",
            "tenancy_contract", "health_insurance", "driving_licence",
        ]
    elif visa_type == "golden":
        steps = [
            "golden_visa_nomination", "entry_permit", "medical_test",
            "emirates_id_biometrics", "visa_stamping", "emirates_id_issued",
            "bank_account", "housing_search", "tenancy_contract",
            "health_insurance", "driving_licence",
        ]
    else:  # employer-sponsored
        steps = [
            "entry_permit", "medical_test", "emirates_id_biometrics",
            "visa_stamping", "labour_contract", "emirates_id_issued",
            "bank_account", "housing_search", "tenancy_contract",
            "health_insurance", "driving_licence",
        ]

    if emirate == "Dubai":
        steps += ["ejari", "dewa"]
    else:
        steps += ["addc"]

    if has_children:
        steps.append("school_enrollment")

    deps: Dict[str, List[str]] = {}
    for sid in steps:
        base = list(_BASE_DEPENDENCIES.get(sid, []))
        if visa_type == "freelance":
            base = ["freelance_permit" if d == "entry_permit" else d for d in base]
        if visa_type == "golden" and sid == "entry_permit":
            base = ["golden_visa_nomination"]
        deps[sid] = [d for d in base if d in steps]

    return steps, deps


VISA_LABEL = {
    "employer": "Employer-sponsored",
    "freelance": "Freelance",
    "golden": "Golden",
}
