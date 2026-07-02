// Emirate-specific official portal labels. Keys map to steps' portalKey.
// Links are placeholder (#) — Ahlan navigates, it does not transact.

const PORTALS = {
  Dubai: {
    eid: 'Open ICP Portal',
    visa: 'Open GDRFA Portal',
    tenancy: 'Open Ejari Portal',
    utilities: 'Open DEWA Portal',
    health: 'Open DHA Portal',
    education: 'Open KHDA Portal',
    transport: 'Open RTA Portal',
  },
  'Abu Dhabi': {
    eid: 'Open ICP Portal',
    visa: 'Open ICP Portal',
    tenancy: 'Open Tawtheeq Portal',
    utilities: 'Open ADDC Portal',
    health: 'Open DOH Portal',
    education: 'Open ADEK Portal',
    transport: 'Open ITC Portal',
  },
  Sharjah: {
    eid: 'Open ICP Portal',
    visa: 'Open GDRFA Portal',
    tenancy: 'Open Sharjah Municipality Portal',
    utilities: 'Open SEWA Portal',
    health: 'Open MOHAP Portal',
    education: 'Open SPEA Portal',
    transport: 'Open Sharjah Police Portal',
  },
};

export function portalLabel(emirate, portalKey) {
  if (!portalKey) return null;
  const set = PORTALS[emirate] || PORTALS.Dubai;
  return set[portalKey] || 'Open Official Portal';
}
