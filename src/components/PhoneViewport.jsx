// A self-contained phone "device". Its scroll container uses transform:translateZ(0)
// so any position:fixed inside anchors to the device, not the page — letting the
// full app screens live inside a small pinned mockup or a large interactive overlay.
export const DEVICE_W = 384;
export const DEVICE_H = 812;

export function PhoneViewport({ children, interactive = true, glow = false }) {
  return (
    <div
      className={`relative bg-slate-900 rounded-[2.75rem] p-2.5 shadow-2xl shadow-slate-900/30 ${glow ? 'ring-4 ring-brand-400/30' : ''}`}
      style={{ width: DEVICE_W, height: DEVICE_H }}
    >
      <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-white">
        {/* notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-50 pointer-events-none" />
        <div
          className={`phone-scroll h-full w-full overflow-y-auto overflow-x-hidden ${
            interactive ? '' : 'pointer-events-none select-none'
          }`}
          style={{ transform: 'translateZ(0)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
