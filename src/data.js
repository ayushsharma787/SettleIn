// ---------------------------------------------------------------------------
// Ahlan demo data — all in-memory, no backend.
// ---------------------------------------------------------------------------

export const EMIRATES = {
  dubai: {
    label: 'Dubai',
    visaAuthority: 'GDRFA',
    health: 'DHA',
    utility: 'DEWA',
    tenancy: 'Ejari',
    tenancyStepTitle: 'Ejari / tenancy registration',
    education: 'KHDA',
    transportAuth: 'RTA',
    tenancyFee: 220,
    utilityDeposit: 2000,
    transport3mo: 1350,
  },
  abudhabi: {
    label: 'Abu Dhabi',
    visaAuthority: 'ICP',
    health: 'SEHA',
    utility: 'ADDC',
    tenancy: 'Tawtheeq',
    tenancyStepTitle: 'Tawtheeq / tenancy registration',
    education: 'ADEK',
    transportAuth: 'Abu Dhabi Police (TAMM)',
    tenancyFee: 105,
    utilityDeposit: 1000,
    transport3mo: 1150,
  },
  sharjah: {
    label: 'Sharjah',
    visaAuthority: 'GDRFA Sharjah',
    health: 'MOHAP',
    utility: 'SEWA',
    tenancy: 'Tenancy attestation',
    tenancyStepTitle: 'Tenancy contract attestation',
    education: 'SPEA',
    transportAuth: 'Sharjah Police (RTA services)',
    tenancyFee: 160,
    utilityDeposit: 2000,
    transport3mo: 950,
  },
}

// Token replacement: "{utility} setup" -> "DEWA setup" for the chosen emirate.
export function t(str, emirateKey) {
  const em = EMIRATES[emirateKey] || EMIRATES.dubai
  return str
    .replaceAll('{utility}', em.utility)
    .replaceAll('{tenancy}', em.tenancy)
    .replaceAll('{tenancyStepTitle}', em.tenancyStepTitle)
    .replaceAll('{visaAuthority}', em.visaAuthority)
    .replaceAll('{health}', em.health)
    .replaceAll('{education}', em.education)
    .replaceAll('{transportAuth}', em.transportAuth)
    .replaceAll('{emirate}', em.label)
}

// ---------------------------------------------------------------------------
// Step library — the full journey. Steps are filtered per profile and
// unlocked via `deps`.
// ---------------------------------------------------------------------------

export const STEP_LIBRARY = [
  {
    id: 'medical',
    icon: '🩺',
    title: 'Medical fitness test',
    subtitle: 'Blood test & chest X-ray at an approved center',
    deps: [],
    docs: [
      'Original passport',
      'Entry permit / visa application copy',
      '2 passport-size photos',
      'Payment card (AED 320 standard)',
    ],
    portal: 'Open {health} Medical Fitness Portal',
    time: 'Result in 48 hours (same-day with VIP)',
    wait: 'Walk-in queue right now: ~1–2 hours',
    mistake:
      'Don’t book your Emirates ID biometrics before the medical result is uploaded — the system will reject the appointment.',
  },
  {
    id: 'eid-bio',
    icon: '🪪',
    title: 'Emirates ID biometrics',
    subtitle: 'Fingerprints & photo at an ICP center',
    deps: ['medical'],
    docs: [
      'Original passport (copies not accepted)',
      'Entry permit / visa copy',
      'EID application form from typing center',
    ],
    portal: 'Open ICP Portal',
    time: '15–30 min appointment',
    wait: 'Appointment slots currently: 2–4 days out',
    mistake:
      'Bring your physical passport — a photocopy or phone photo is not accepted at the biometrics counter.',
  },
  {
    id: 'eid-issue',
    icon: '⏳',
    title: 'Emirates ID issuance',
    subtitle: 'Waiting period while your card is produced',
    deps: ['eid-bio'],
    docs: ['Application receipt / tracking number (PRAN)'],
    portal: 'Track on ICP Portal',
    time: '3–7 working days after biometrics',
    wait: 'Current average: ~5 working days',
    mistake:
      'Your card is delivered to an Emirates Post office, not your home — track the pickup branch so it isn’t returned.',
  },
  {
    id: 'visa-stamp',
    icon: '🛂',
    title: 'Residence visa stamping',
    subtitle: 'Residence visa linked to your passport',
    deps: ['eid-bio'],
    docs: [
      'Original passport (6+ months validity)',
      'Medical fitness certificate',
      'Health insurance policy',
      'Sponsor / employer documents',
    ],
    portal: 'Open {visaAuthority} Portal',
    time: '2–5 working days',
    wait: 'Current average: ~3 working days',
    mistake:
      'Check your passport has at least 6 months validity and two empty pages — expired margins are the #1 rejection reason.',
  },
  {
    id: 'bank',
    icon: '🏦',
    title: 'Personal bank account',
    subtitle: 'Salary account to receive your pay',
    deps: ['eid-issue'],
    docs: [
      'Emirates ID (or application receipt)',
      'Passport with residence visa',
      'Salary certificate or employment letter',
      'UAE mobile number',
    ],
    portal: 'Compare accounts on Central Bank list',
    time: 'Same day – 3 working days',
    wait: 'Digital banks: account live in ~15 minutes',
    mistake:
      'Many banks require a minimum salary certificate — check requirements before visiting the branch.',
    referrals: 'bank',
  },
  {
    id: 'housing',
    icon: '🏠',
    title: 'Housing search',
    subtitle: 'Find your long-term home',
    deps: ['visa-stamp'],
    docs: [
      'Passport & visa copy',
      'Emirates ID',
      'Salary certificate (for rent cheques)',
      'Cheque book or bank transfer setup',
    ],
    portal: 'Open {emirate} neighborhood guide',
    time: '1–3 weeks typical search',
    wait: 'Viewings usually bookable within 48 hours',
    mistake:
      'Never pay a deposit before viewing the unit and verifying the landlord’s title deed — rental scams target new arrivals.',
    referrals: 'housing',
  },
  {
    id: 'ejari',
    icon: '📄',
    title: '{tenancyStepTitle}',
    subtitle: 'Register your tenancy contract officially',
    deps: ['housing'],
    docs: [
      'Signed tenancy contract',
      'Landlord’s title deed copy',
      'Landlord’s passport / Emirates ID copy',
      'Your Emirates ID',
    ],
    portal: 'Open {tenancy} Portal',
    time: 'Same day (online)',
    wait: 'Instant certificate after payment (AED ~220)',
    mistake:
      'The contract must be registered in the tenant’s name — an unregistered contract blocks utility activation and school applications.',
  },
  {
    id: 'utilities',
    icon: '💡',
    title: '{utility} (utilities) setup',
    subtitle: 'Electricity & water activation',
    deps: ['ejari'],
    docs: [
      '{tenancy} certificate',
      'Emirates ID',
      'Premise number (on the front door / contract)',
    ],
    portal: 'Open {utility} Portal',
    time: 'Activation within 24 hours',
    wait: 'Online applications processed same day',
    mistake:
      'Pay the security deposit online immediately — activation only starts after the payment clears, not after the application.',
  },
  {
    id: 'internet',
    icon: '📶',
    title: 'Internet & mobile plan',
    subtitle: 'Home Wi-Fi and a UAE SIM',
    deps: ['ejari'],
    docs: ['Emirates ID', '{tenancy} certificate or tenancy contract'],
    portal: 'Open coverage checker',
    time: 'Install: 2–5 working days',
    wait: 'Installation slots: ~3 days out',
    mistake:
      'Check which provider is wired into your building first — most buildings are served by only one network.',
    referrals: 'telecom',
  },
  {
    id: 'insurance',
    icon: '🏥',
    title: 'Health insurance (verify / upgrade)',
    subtitle: 'Confirm coverage meets your needs',
    deps: ['visa-stamp'],
    docs: ['Emirates ID', 'Visa copy', 'Employer policy details (if provided)'],
    portal: 'Open {health} insurance check',
    time: '1–3 working days for new policies',
    wait: 'Employer plan verification: instant online',
    mistake:
      'Basic employer plans often exclude dependents — verify family coverage before stamping dependents’ visas.',
    referrals: 'insurance',
  },
  {
    id: 'school',
    icon: '🏫',
    title: 'School selection & application',
    subtitle: 'Find and apply to schools',
    deps: ['housing'],
    familyOnly: true,
    docs: [
      'Child’s passport & visa',
      'Child’s Emirates ID',
      'Previous school reports (attested)',
      'Vaccination records',
      'Transfer certificate (attested)',
    ],
    portal: 'Open {education} Portal',
    time: 'Applications: 2–6 weeks',
    wait: 'Mid-year seats: limited — apply to 3+ schools',
    mistake:
      'Attested transfer certificates from your home country take weeks — start the attestation before you fly.',
  },
  {
    id: 'license',
    icon: '🚗',
    title: 'Driving license conversion',
    titleLearn: 'Driving school & license',
    subtitle: 'Swap your foreign license for a UAE one',
    subtitleLearn: 'Enroll and take your UAE driving test',
    deps: ['eid-issue'],
    driveOnly: true,
    docs: [
      'Emirates ID',
      'Foreign license + legal translation',
      'Eye test certificate',
      'Passport-size photo',
    ],
    docsLearn: [
      'Emirates ID',
      'Eye test certificate',
      'Passport-size photos',
      'Training file from driving school',
    ],
    portal: 'Open {transportAuth} Portal',
    time: 'Same day if eligible for direct swap',
    timeLearn: '2–4 months (classes + tests)',
    wait: 'Eye test: walk-in at most opticians',
    mistake:
      'Direct swap only works if your license matches your nationality or an approved-country list — check eligibility before booking.',
  },
  {
    id: 'car',
    icon: '🚙',
    title: 'Car purchase / registration',
    subtitle: 'Buy, insure and register your car',
    deps: ['license'],
    driveOnly: true,
    docs: [
      'Emirates ID',
      'UAE driving license',
      'Car insurance policy',
      'Salary certificate (if financing)',
    ],
    portal: 'Open {transportAuth} Vehicle Licensing',
    time: 'Registration: same day',
    wait: 'Insurance quotes: instant online',
    mistake:
      'Budget 15–20% above the sticker price — registration, insurance and Salik (toll) tags add up quickly.',
  },
]

// ---------------------------------------------------------------------------
// Referral partners shown under specific steps.
// ---------------------------------------------------------------------------

export const PARTNERS = {
  bank: [
    { name: 'Emirates NBD', tag: '0 minimum balance for new expats', icon: '🏦' },
    { name: 'Wio Bank', tag: 'Digital account — open in 15 minutes', icon: '📱' },
    { name: 'Mashreq Neo', tag: 'Salary account with 2% cashback', icon: '💳' },
  ],
  telecom: [
    { name: 'du', tag: 'Expat starter plan AED 199/mo', icon: '📶' },
    { name: 'e& (Etisalat)', tag: 'Home Wi-Fi + mobile bundle AED 249/mo', icon: '🛜' },
    { name: 'Virgin Mobile', tag: 'No-contract SIM from AED 99/mo', icon: '📲' },
  ],
  insurance: [
    { name: 'Sukoon Insurance', tag: 'Expat plans from AED 550/year', icon: '🛡️' },
    { name: 'Daman', tag: 'Enhanced plans with direct billing', icon: '🏥' },
    { name: 'Cigna Global', tag: 'Worldwide cover incl. home country', icon: '🌍' },
  ],
  housing: [
    { name: 'Property Finder', tag: '15,000+ verified listings', icon: '🏠' },
    { name: 'Bayut', tag: 'TruCheck™ listings & area guides', icon: '🔑' },
    { name: 'Homely Movers', tag: 'Flat 10% off for Ahlan users', icon: '📦' },
  ],
}

// ---------------------------------------------------------------------------
// Questionnaire
// ---------------------------------------------------------------------------

export const QUESTIONS = [
  {
    key: 'family',
    icon: '👨‍👩‍👧',
    q: 'Who is moving with you?',
    options: [
      { value: 'single', label: 'Just me', icon: '🧳' },
      { value: 'couple', label: 'Me + partner', icon: '💑' },
      { value: 'family', label: 'Family with children', icon: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    key: 'visa',
    icon: '🛂',
    q: 'What type of visa do you have?',
    options: [
      { value: 'employer', label: 'Employer-sponsored', icon: '💼' },
      { value: 'freelance', label: 'Freelance', icon: '💻' },
      { value: 'golden', label: 'Golden Visa', icon: '✨' },
      { value: 'remote', label: 'Remote work', icon: '🌐' },
      { value: 'dependent', label: 'Dependent', icon: '👪' },
    ],
  },
  {
    key: 'emirate',
    icon: '🏙️',
    q: 'Which emirate are you settling in?',
    options: [
      { value: 'dubai', label: 'Dubai', icon: '🌆' },
      { value: 'abudhabi', label: 'Abu Dhabi', icon: '🕌' },
      { value: 'sharjah', label: 'Sharjah', icon: '📚' },
    ],
  },
  {
    key: 'tenancy',
    icon: '🏠',
    q: 'Do you have a place to live yet?',
    options: [
      { value: 'yes', label: 'Yes, signed a tenancy', icon: '✅' },
      { value: 'no', label: 'Not yet', icon: '🔍' },
      { value: 'temp', label: 'Temporary accommodation', icon: '🏨' },
    ],
  },
  {
    key: 'drive',
    icon: '🚗',
    q: 'Do you plan to drive in the UAE?',
    options: [
      { value: 'foreign', label: 'Yes — I have a foreign license', icon: '🪪' },
      { value: 'learn', label: 'Yes — I need to learn', icon: '🎓' },
      { value: 'no', label: 'No, not for now', icon: '🚇' },
    ],
  },
  {
    key: 'employerHandled',
    icon: '📋',
    q: 'Has your employer / PRO already handled your visa & Emirates ID?',
    options: [
      { value: 'yes', label: 'Yes, all done', icon: '🎉' },
      { value: 'progress', label: 'In progress', icon: '⏳' },
      { value: 'no', label: 'No, I’m on my own', icon: '🙋' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Demo personas
// ---------------------------------------------------------------------------

export const PRIYA = {
  name: 'Priya',
  fullName: 'Priya Sharma',
  meta: '29 · Graphic Designer · Dubai',
  answers: {
    family: 'single',
    visa: 'employer',
    emirate: 'dubai',
    tenancy: 'no',
    drive: 'foreign',
    employerHandled: 'yes',
  },
}

export const NEXA_EMPLOYEES = [
  {
    id: 'e1',
    name: 'Ahmed Hassan',
    role: 'Backend Engineer',
    visaLabel: 'Employer-sponsored',
    day: 12,
    stuck: true,
    stuckNote: 'No progress for 8 days',
    answers: { family: 'single', visa: 'employer', emirate: 'dubai', tenancy: 'no', drive: 'no', employerHandled: 'no' },
    completed: ['medical', 'eid-bio', 'eid-issue', 'visa-stamp', 'bank'],
    currentId: 'housing',
  },
  {
    id: 'e2',
    name: 'Fatima Al Rashid',
    role: 'Product Manager',
    visaLabel: 'Golden Visa',
    day: 34,
    answers: { family: 'family', visa: 'golden', emirate: 'dubai', tenancy: 'no', drive: 'foreign', employerHandled: 'no' },
    completed: ['medical', 'eid-bio', 'eid-issue', 'visa-stamp', 'bank', 'housing', 'ejari', 'utilities', 'internet', 'insurance', 'school'],
    currentId: 'license',
  },
  {
    id: 'e3',
    name: 'Chen Wei',
    role: 'Data Scientist',
    visaLabel: 'Employer-sponsored',
    day: 2,
    answers: { family: 'single', visa: 'employer', emirate: 'dubai', tenancy: 'no', drive: 'no', employerHandled: 'no' },
    completed: ['medical'],
    currentId: 'eid-bio',
  },
  {
    id: 'e4',
    name: 'Sarah Mitchell',
    role: 'UX Designer',
    visaLabel: 'Employer-sponsored',
    day: 18,
    answers: { family: 'couple', visa: 'employer', emirate: 'dubai', tenancy: 'no', drive: 'no', employerHandled: 'no' },
    completed: ['medical', 'eid-bio', 'eid-issue', 'visa-stamp', 'housing', 'ejari'],
    currentId: 'utilities',
  },
  {
    id: 'e5',
    name: 'James Okafor',
    role: 'DevOps Engineer',
    visaLabel: 'Employer-sponsored',
    day: 21,
    answers: { family: 'single', visa: 'employer', emirate: 'dubai', tenancy: 'no', drive: 'foreign', employerHandled: 'no' },
    completed: ['medical', 'eid-bio', 'eid-issue', 'visa-stamp', 'bank', 'housing'],
    currentId: 'ejari',
  },
  {
    id: 'e6',
    name: 'Maria Santos',
    role: 'Marketing Lead',
    visaLabel: 'Employer-sponsored',
    day: 41,
    answers: { family: 'single', visa: 'employer', emirate: 'dubai', tenancy: 'no', drive: 'no', employerHandled: 'no' },
    completed: ['medical', 'eid-bio', 'eid-issue', 'visa-stamp', 'bank', 'housing', 'ejari', 'utilities', 'internet', 'insurance'],
    currentId: null,
  },
]

// ---------------------------------------------------------------------------
// Cost calculator data (indicative demo figures, AED)
// ---------------------------------------------------------------------------

export const AREAS = {
  dubai: [
    { name: 'Dubai Marina', rent: 8500 },
    { name: 'JLT', rent: 7000 },
    { name: 'Business Bay', rent: 7500 },
    { name: 'Downtown Dubai', rent: 11000 },
    { name: 'JVC', rent: 5500 },
    { name: 'Silicon Oasis', rent: 4800 },
    { name: 'Deira', rent: 4200 },
  ],
  abudhabi: [
    { name: 'Al Reem Island', rent: 6500 },
    { name: 'Corniche', rent: 7500 },
    { name: 'Al Raha Beach', rent: 7000 },
    { name: 'Khalifa City', rent: 5000 },
    { name: 'Mussafah', rent: 3500 },
  ],
  sharjah: [
    { name: 'Al Majaz', rent: 3800 },
    { name: 'Al Khan', rent: 4000 },
    { name: 'Al Nahda', rent: 3500 },
    { name: 'Muwaileh', rent: 3000 },
  ],
}

export const FAMILY_RENT_FACTOR = { 1: 1, 2: 1.15, 3: 1.45, 4: 1.75 }

// ---------------------------------------------------------------------------
// Pricing tiers
// ---------------------------------------------------------------------------

export const TIERS = [
  {
    id: 'free',
    name: 'Guide',
    badge: 'Free',
    price: 'Free',
    priceNote: 'forever',
    tagline: 'Know exactly what to do next',
    features: [
      'Personalized sequenced roadmap',
      'Dependency mapping & step unlocking',
      'Per-step guidance, documents & portal links',
      'Progress tracking & notifications',
      'Recommended services',
      'Renewal reminders (visa, Emirates ID, insurance)',
    ],
    cta: 'Your current plan',
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: 'Most popular',
    price: 'AED 99',
    priceNote: 'one-time',
    tagline: '“The app does your paperwork”',
    features: [
      'Everything in Guide',
      'Auto-filled document packs (DEWA, Ejari, bank forms)',
      'Document vault & readiness checker',
      'Personalized 3-month cost calculator',
      'Bank, insurer & neighborhood comparisons',
      'Regulatory update alerts',
    ],
    cta: 'Preview: Cost calculator',
  },
  {
    id: 'concierge',
    name: 'Concierge',
    badge: 'White glove',
    price: 'AED 499',
    priceNote: 'one-time',
    tagline: '“A real person runs the errands”',
    features: [
      'Everything in Plus',
      'Dedicated named advisor for your journey',
      'Appointments booked for you (medical, EID, RTA)',
      'Housing shortlist & viewing coordination',
      'School application assistance (families)',
      'Document error-proofing before each submission',
      'Priority same-day support',
    ],
    cta: 'Talk to an advisor',
  },
]

export const ALACARTE = [
  { name: 'Book my appointments', price: 'AED 149', icon: '📅' },
  { name: 'School application help', price: 'AED 299', icon: '🏫' },
]
