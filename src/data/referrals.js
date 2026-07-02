// Partner recommendations surfaced at monetizable steps.
// "Connect me" triggers an explicit-consent modal — this is the referral mechanic.

export const REFERRALS = {
  bank: {
    heading: 'Recommended banks for new expats',
    partners: [
      { id: 'enbd', name: 'Emirates NBD', tagline: 'AED 0 minimum balance for new expats', perk: 'Salary account · same-day card' },
      { id: 'mashreq', name: 'Mashreq Neo', tagline: 'Fully digital account in minutes', perk: 'No branch visit required' },
      { id: 'adcb', name: 'ADCB', tagline: 'Cashback on everyday spending', perk: 'Free account with salary transfer' },
    ],
  },
  housing: {
    heading: 'Trusted places to find your home',
    partners: [
      { id: 'bayut', name: 'Bayut', tagline: 'Verified listings across the UAE', perk: 'TruCheck™ verified ads' },
      { id: 'propertyfinder', name: 'Property Finder', tagline: 'Largest choice of rentals', perk: 'Neighbourhood guides' },
      { id: 'houza', name: 'Houza', tagline: 'Agent-free direct listings', perk: 'Lower agency fees' },
    ],
  },
  telecom: {
    heading: 'Mobile & home internet plans',
    partners: [
      { id: 'du', name: 'du', tagline: 'Expat starter plan AED 199/mo', perk: 'Home + mobile bundle' },
      { id: 'etisalat', name: 'etisalat by e&', tagline: 'eLife fibre up to 1 Gbps', perk: 'Free installation offer' },
      { id: 'virgin', name: 'Virgin Mobile', tagline: 'Contract-free SIM from AED 55', perk: 'Manage everything in-app' },
    ],
  },
  insurance: {
    heading: 'Health insurance you can upgrade to',
    partners: [
      { id: 'daman', name: 'Daman', tagline: 'Enhanced expat health plans', perk: 'Wide hospital network' },
      { id: 'sukoon', name: 'Sukoon', tagline: 'Maternity & dental add-ons', perk: 'Fast digital claims' },
      { id: 'giggulf', name: 'GIG Gulf', tagline: 'Family cover from AED 700/yr', perk: 'Direct billing partners' },
    ],
  },
};
