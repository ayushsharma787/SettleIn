import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TopBar } from '../components/PhoneFrame.jsx';
import { Calculator as CalcIcon } from 'lucide-react';

// Rough first-3-months cost model (AED). Demo figures, not financial advice.
const EMIRATE_FACTOR = { Dubai: 1, 'Abu Dhabi': 0.95, Sharjah: 0.7 };

const AREAS = {
  Dubai: [
    { name: 'Dubai Marina', rent: 95000 },
    { name: 'JLT', rent: 82000 },
    { name: 'Business Bay', rent: 90000 },
    { name: 'Silicon Oasis', rent: 58000 },
    { name: 'JVC', rent: 62000 },
  ],
  'Abu Dhabi': [
    { name: 'Al Reem Island', rent: 88000 },
    { name: 'Khalifa City', rent: 70000 },
    { name: 'Corniche', rent: 95000 },
    { name: 'Al Raha Beach', rent: 92000 },
  ],
  Sharjah: [
    { name: 'Al Majaz', rent: 48000 },
    { name: 'Al Nahda', rent: 42000 },
    { name: 'Aljada', rent: 55000 },
  ],
};

const FAMILY_SIZES = ['1', '2', '3', '4+'];

function aed(n) {
  return 'AED ' + Math.round(n).toLocaleString();
}

export function Calculator() {
  const { goBack, answers } = useApp();
  const [emirate, setEmirate] = useState(answers.emirate && AREAS[answers.emirate] ? answers.emirate : 'Dubai');
  const [family, setFamily] = useState('1');
  const areaList = AREAS[emirate];
  const [area, setArea] = useState(areaList[0].name);

  const breakdown = useMemo(() => {
    const list = AREAS[emirate];
    const selected = list.find((a) => a.name === area) || list[0];
    const annualRent = selected.rent;
    const factor = EMIRATE_FACTOR[emirate];
    const size = family === '4+' ? 4 : parseInt(family, 10);
    const hasKids = size >= 3;

    const deposit = annualRent * 0.05; // 5% security deposit
    const ejari = 220;
    const dewa = emirate === 'Sharjah' ? 2000 : emirate === 'Abu Dhabi' ? 1500 : 2000 + (size > 2 ? 1000 : 0);
    const internet = 350 + 314; // setup + first month bundle
    const insurance = 700 * size * factor;
    const school = hasKids ? 12000 : 0; // term deposit / registration
    const transport = 1200 * factor + (size > 2 ? 600 : 0);
    const agencyFee = annualRent * 0.05;

    const rows = [
      { label: 'Security deposit (5% rent)', value: deposit },
      { label: 'Agency fee (5% rent)', value: agencyFee },
      { label: 'Ejari / tenancy registration', value: ejari },
      { label: 'DEWA / utilities deposit', value: dewa },
      { label: 'Internet & mobile setup', value: internet },
      { label: `Health insurance (${size} ${size > 1 ? 'people' : 'person'})`, value: insurance },
      ...(hasKids ? [{ label: 'School registration deposit', value: school }] : []),
      { label: 'Transport (3 months)', value: transport },
    ];
    const total = rows.reduce((s, r) => s + r.value, 0);
    return { rows, total };
  }, [emirate, area, family]);

  const onEmirate = (e) => {
    setEmirate(e);
    setArea(AREAS[e][0].name);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <TopBar title="Cost calculator" onBack={goBack} />
      <div className="px-5 py-5 screen-in">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <CalcIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900">First 3 months in the UAE</div>
            <div className="text-xs text-slate-500">Adjust the inputs — totals update live.</div>
          </div>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Emirate</label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {Object.keys(AREAS).map((e) => (
                <button
                  key={e}
                  onClick={() => onEmirate(e)}
                  className={`rounded-xl py-2 text-sm font-bold transition ${
                    emirate === e ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Family size</label>
            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {FAMILY_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setFamily(s)}
                  className={`rounded-xl py-2 text-sm font-bold transition ${
                    family === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Preferred area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1.5 w-full rounded-xl bg-slate-100 border-0 py-2.5 px-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-brand-400"
            >
              {areaList.map((a) => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {breakdown.rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-600">{r.label}</span>
                <span className="text-sm font-bold text-slate-800 tabular-nums">{aed(r.value)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-4 bg-brand-600 text-white">
            <span className="font-bold">Estimated total</span>
            <span className="text-xl font-extrabold tabular-nums">{aed(breakdown.total)}</span>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-slate-400 text-center">
          Indicative figures for planning. Actual costs vary by landlord & provider.
        </div>
      </div>
    </div>
  );
}
