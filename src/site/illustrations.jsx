// Lightweight stylized SVG illustrations for the story. Brand teal + warm ink.

export function Cloud({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 80" className={className} style={style} fill="none" aria-hidden>
      <path
        d="M40 60c-16 0-28-11-28-25S24 10 40 10c6 0 12 2 16 6 5-9 15-16 27-16 16 0 29 12 30 27 12 1 21 10 21 22 0 6-5 11-11 11H40z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Plane({ className = '', style }) {
  return (
    <svg viewBox="0 0 220 120" className={className} style={style} fill="none" aria-hidden>
      {/* contrail */}
      <path d="M0 70 C60 66 90 64 150 62" stroke="currentColor" strokeOpacity="0.18" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 16" />
      <g>
        <path d="M60 62 L182 52 C196 51 208 56 208 62 C208 68 196 73 182 72 L60 66 Z" fill="#0e6f62" />
        <path d="M120 58 L150 30 L162 31 L150 60 Z" fill="#0d8b78" />
        <path d="M120 66 L150 92 L162 91 L152 64 Z" fill="#0d8b78" />
        <path d="M175 55 L196 50 L205 58 L196 66 L178 64 Z" fill="#17a892" />
        <circle cx="96" cy="62" r="3" fill="#d3f5ec" />
        <circle cx="110" cy="62" r="3" fill="#d3f5ec" />
        <circle cx="124" cy="62" r="3" fill="#d3f5ec" />
        <path d="M188 60 h14" stroke="#75d7c4" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// India — India Gate + palm, warm ochre
export function IndiaSkyline({ className = '', style }) {
  return (
    <svg viewBox="0 0 320 200" className={className} style={style} fill="none" aria-hidden preserveAspectRatio="xMidYMax meet">
      <g fill="#e6a23c" fillOpacity="0.9">
        <rect x="128" y="70" width="64" height="120" rx="4" />
        <path d="M128 70 q32 -34 64 0 Z" />
        <rect x="120" y="150" width="80" height="40" rx="3" />
        <rect x="138" y="96" width="16" height="94" rx="6" fill="#c9821f" />
        <rect x="166" y="96" width="16" height="94" rx="6" fill="#c9821f" />
      </g>
      <g fill="#d98a2b" fillOpacity="0.75">
        <rect x="30" y="120" width="40" height="70" rx="3" />
        <rect x="80" y="140" width="30" height="50" rx="3" />
        <rect x="230" y="130" width="34" height="60" rx="3" />
        <rect x="272" y="150" width="26" height="40" rx="3" />
      </g>
      {/* palm */}
      <g stroke="#b26f18" strokeWidth="4" strokeLinecap="round">
        <path d="M292 190 V150" />
        <path d="M292 150 q-18 -8 -30 -2" />
        <path d="M292 150 q18 -8 30 -2" />
        <path d="M292 150 q-8 -16 -20 -20" />
        <path d="M292 150 q8 -16 20 -20" />
      </g>
    </svg>
  );
}

// Dubai — Burj Khalifa + towers, teal
export function DubaiSkyline({ className = '', style }) {
  return (
    <svg viewBox="0 0 320 220" className={className} style={style} fill="none" aria-hidden preserveAspectRatio="xMidYMax meet">
      <g fill="#0e6f62" fillOpacity="0.9">
        {/* Burj Khalifa */}
        <path d="M150 210 L156 40 L160 16 L164 40 L170 210 Z" />
        <rect x="150" y="120" width="20" height="90" fill="#0d8b78" />
      </g>
      <g fill="#0d8b78" fillOpacity="0.85">
        <rect x="60" y="120" width="26" height="90" rx="2" />
        <rect x="92" y="150" width="22" height="60" rx="2" />
        <path d="M188 210 V96 q14 -6 28 0 V210 Z" />
        <rect x="228" y="130" width="24" height="80" rx="2" />
      </g>
      <g fill="#17a892" fillOpacity="0.8">
        <rect x="24" y="150" width="28" height="60" rx="2" />
        <path d="M120 210 V110 l14 -12 14 12 V210 Z" />
        <rect x="262" y="150" width="30" height="60" rx="3" />
        <rect x="298" y="168" width="18" height="42" rx="2" />
      </g>
      {/* windows */}
      <g fill="#d3f5ec" fillOpacity="0.6">
        <rect x="156" y="70" width="8" height="60" />
        <rect x="66" y="130" width="14" height="6" />
        <rect x="66" y="146" width="14" height="6" />
        <rect x="234" y="140" width="12" height="6" />
        <rect x="234" y="154" width="12" height="6" />
      </g>
    </svg>
  );
}

export function PassportStamp({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="none" aria-hidden>
      <circle cx="60" cy="60" r="52" stroke="#0d8b78" strokeWidth="4" strokeDasharray="4 6" opacity="0.9" />
      <circle cx="60" cy="60" r="40" stroke="#0d8b78" strokeWidth="3" opacity="0.7" />
      <path d="M42 60 l12 12 l24 -26" stroke="#0d8b78" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="60" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0d8b78" fontFamily="Plus Jakarta Sans">U A E</text>
      <text x="60" y="98" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0d8b78" fontFamily="Plus Jakarta Sans">ENTRY · DXB</text>
    </svg>
  );
}

// Person with keys in front of a home — finale
export function PriyaWithKeys({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 240" className={className} style={style} fill="none" aria-hidden>
      {/* door frame */}
      <rect x="40" y="30" width="120" height="200" rx="8" fill="#edfbf7" stroke="#abe9db" strokeWidth="3" />
      <rect x="58" y="52" width="84" height="178" rx="6" fill="#d3f5ec" />
      <circle cx="128" cy="145" r="4" fill="#0e6f62" />
      {/* person */}
      <circle cx="100" cy="120" r="22" fill="#3f2a1e" />
      <path d="M78 118 a22 22 0 0 1 44 0 v6 h-44 z" fill="#2a1b12" />
      <rect x="80" y="140" width="40" height="70" rx="16" fill="#0d8b78" />
      <circle cx="100" cy="126" r="14" fill="#e8b98f" />
      {/* arm holding keys up */}
      <path d="M118 150 q22 -6 26 -28" stroke="#e8b98f" strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(140 116)">
        <circle cx="0" cy="0" r="6" fill="none" stroke="#dfae41" strokeWidth="3" />
        <path d="M4 4 l10 10" stroke="#dfae41" strokeWidth="3" strokeLinecap="round" />
        <path d="M10 10 l4 -2 M13 13 l4 -2" stroke="#dfae41" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
