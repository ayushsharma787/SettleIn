import React, { useEffect } from 'react'

// ---- tiny inline icons ----------------------------------------------------

export const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const LockIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 118 0v4" />
  </svg>
)

export const BackIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const ChevronIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const MenuIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ExternalIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <path d="M15 3h6v6" />
    <path d="M10 14L21 3" />
  </svg>
)

// ---- shared components ----------------------------------------------------

export function Header({ title, subtitle, onBack, right }) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-100">
      <div className="flex items-center gap-2 px-4 h-14">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="-ml-2 p-2 rounded-full text-stone-500 hover:bg-stone-100 active:scale-95 transition"
          >
            <BackIcon />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-stone-900 truncate leading-tight">{title}</div>
          {subtitle ? (
            <div className="text-xs text-stone-500 truncate">{subtitle}</div>
          ) : null}
        </div>
        {right}
      </div>
    </div>
  )
}

export function ProgressBar({ pct, className = '', track = 'bg-stone-200' }) {
  return (
    <div className={`h-2 rounded-full overflow-hidden ${track} ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700 ease-out"
        style={{ width: `${Math.max(pct, 2)}%` }}
      />
    </div>
  )
}

export function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-stone-900/50 fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm m-3 mb-4 bg-white rounded-3xl shadow-2xl modal-in overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="absolute bottom-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="toast-in bg-stone-900 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-xl max-w-full">
        {toast}
      </div>
    </div>
  )
}

export function Logo({ size = 'md', light = false }) {
  const dims = size === 'lg' ? 'w-20 h-20 text-4xl rounded-[1.75rem]' : 'w-9 h-9 text-lg rounded-xl'
  return (
    <div
      className={`${dims} flex items-center justify-center font-extrabold shadow-lg shadow-teal-600/20 ${
        light ? 'bg-white text-teal-600' : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
      }`}
    >
      A
    </div>
  )
}
