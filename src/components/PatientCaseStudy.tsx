import React, { useState } from 'react';
import { User, Activity, DollarSign, Clock, ShieldAlert, Heart, TrendingDown, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';

export const PatientCaseStudy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'evidence' | 'cost'>('profile');
  const [systolicInput, setSystolicInput] = useState<number>(126);
  const [diastolicInput, setDiastolicInput] = useState<number>(82);
  const [loggedReadings, setLoggedReadings] = useState<Array<{ date: string; sys: number; dia: number; status: string }>>([
    { date: 'Baseline (Pre-MAAAOEW)', sys: 160, dia: 100, status: 'Stage 2 Hypertension (Uncontrolled)' },
    { date: 'Week 2 Docking', sys: 148, dia: 94, status: 'Stage 1 Hypertension (Transition)' },
    { date: 'Week 4 Docking', sys: 138, dia: 88, status: 'Target Range (&lt;140/90 Goal)' },
    { date: 'Week 6 (Current)', sys: 126, dia: 82, status: 'Optimal Hemodynamic Stability' },
  ]);

  const handleLogReading = (e: React.FormEvent) => {
    e.preventDefault();
    const isGoal = systolicInput < 140 && diastolicInput < 90;
    const newEntry = {
      date: 'Today (Verified Log)',
      sys: systolicInput,
      dia: diastolicInput,
      status: isGoal ? 'Optimal Hemodynamic Stability (<140/90)' : 'Elevated (Review Shift Sync)'
    };
    setLoggedReadings([newEntry, ...loggedReadings]);
  };

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-cyan-400">Clinical Baseline</span>
          <span aria-hidden="true">·</span>
          <span>Patient Case Study: Mr. Andres Gonzales</span>
          <span aria-hidden="true">·</span>
          <span>Literature-Backed Outcomes</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Empowering Real Patients: From 160/100 to Safe Control
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Mr. Gonzales is representative of millions of working-class patients with hypertension. High work stress, unpredictable taxi driving schedules, symptom misconception, and recurring drug costs lead to dangerous non-adherence.
        </p>
      </div>

      {/* Segmented Controls for Sub-views */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'profile' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          Patient Profile & Regimen
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'evidence' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          Literature & BP Trajectory
        </button>
        <button
          onClick={() => setActiveTab('cost')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'cost' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          Hardware Cost Economics
        </button>
      </div>

      {/* Tab 1: Profile & Barriers */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Patient Card & Portrait */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                <img
                  src="/src/assets/images/patient_taxi_driver_1791765006549.jpg"
                  alt="Mr. Andres Gonzales, 60-year-old taxi driver"
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Mr. Andres Gonzales</span>
                  <span className="font-mono text-cyan-300">Taxi Fleet #408</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Demographics:</span>
                  <span className="text-white font-medium">60-year-old male · Lives Alone</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Occupation:</span>
                  <span className="text-white font-medium">City Taxi Driver (12-hr Shifts)</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Baseline Blood Pressure:</span>
                  <span className="text-red-400 font-mono font-bold text-sm">160 / 100 mmHg</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Prescribed Daily Regimen:</span>
                  <span className="text-emerald-400 font-medium">Amlodipine 10mg + Losartan 50mg</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Adherence with MAAAOEW:</span>
                  <span className="text-cyan-400 font-mono font-bold">94% Adherent (Last 60 Days)</span>
                </div>
              </div>
            </div>

            {/* The 3 Primary Barriers to Adherence */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Primary Clinical Barriers to Adherence</span>
              </h3>

              <div className="space-y-4">
                {/* Barrier 1 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      1. Irregular Work Hours
                    </span>
                    <span className="text-xs text-cyan-300 font-mono">Shift Sync Solution</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hectic, unpredictable taxi shifts trigger frequent forgetfulness. Traditional fixed 8:00 AM alarms fire when Mr. Gonzales is navigating congested highways with passengers.
                  </p>
                  <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <strong className="text-slate-300">MAAAOEW Intervention:</strong> Phone docking at bedtime or post-shift activates dynamic reminder window.
                  </div>
                </div>

                {/* Barrier 2 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-400" />
                      2. Symptom Illusion ("Feeling Fine Fallacy")
                    </span>
                    <span className="text-xs text-red-300 font-mono">Gemini AI Solution</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Stops medication whenever feeling "under control". Silent hypertension causes no somatic pain, giving the illusion that vascular protection is no longer required.
                  </p>
                  <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <strong className="text-slate-300">MAAAOEW Intervention:</strong> Daily high-output voice micro-lessons explain that Amlodipine & Losartan maintain vascular elasticity even during symptom-free days.
                  </div>
                </div>

                {/* Barrier 3 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      3. Financial Strain & Refill Friction
                    </span>
                    <span className="text-xs text-emerald-300 font-mono">Generic Clinic Program</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    High anxiety regarding recurring refill expenses causes intentional pill splitting or skipping days to make prescription bottles last longer.
                  </p>
                  <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <strong className="text-slate-300">MAAAOEW Intervention:</strong> Auto-links with community clinics for bioequivalent generics, slashing monthly cost by 70% ($18.50 vs $64.00) with automatic refill alerts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clinical Evidence & BP Progress */}
      {activeTab === 'evidence' && (
        <div className="space-y-8">
          {/* Top Clinical Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 font-mono tabular-nums">
                +60%
              </div>
              <div className="text-sm font-bold text-white">Increase in Patient Adherence</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Using interactive smartphone pill reminders and docked physical confirmation (PMC3869130 / PMC6843901).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-teal-400 font-mono tabular-nums">
                83.5%
              </div>
              <div className="text-sm font-bold text-white">Smartphone Holding Rate</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chronic disease patients handle their smartphones constantly, making docked app alerts significantly more effective than standalone hardware.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 font-mono tabular-nums">
                &lt;140/90
              </div>
              <div className="text-sm font-bold text-white">Blood Pressure Control Goal</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated reminder interventions achieve statistically significant reductions in systolic pressure to reach target goals.
              </p>
            </div>
          </div>

          {/* Blood Pressure Progression Tracking */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Mr. Gonzales's Blood Pressure Trajectory</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Longitudinal monitoring tracking progression from stage 2 hypertension to goal.
                </p>
              </div>

              {/* Quick Log Form */}
              <form onSubmit={handleLogReading} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Sys"
                  value={systolicInput}
                  onChange={(e) => setSystolicInput(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono text-center"
                  min={80}
                  max={220}
                />
                <span className="text-slate-500">/</span>
                <input
                  type="number"
                  placeholder="Dia"
                  value={diastolicInput}
                  onChange={(e) => setDiastolicInput(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono text-center"
                  min={50}
                  max={130}
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded transition-colors whitespace-nowrap"
                >
                  Log BP
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {loggedReadings.map((reading, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-white">{reading.date}</span>
                    <div className="text-slate-400">{reading.status}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="font-mono text-base font-bold tabular-nums">
                      <span className={reading.sys >= 140 ? 'text-red-400' : 'text-emerald-400'}>
                        {reading.sys}
                      </span>
                      <span className="text-slate-500"> / </span>
                      <span className={reading.dia >= 90 ? 'text-red-400' : 'text-emerald-400'}>
                        {reading.dia}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">mmHg</span>
                    </div>

                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${reading.sys >= 140 ? 'bg-red-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, ((200 - reading.sys) / 70) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hardware Cost Economics */}
      {activeTab === 'cost' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Smart Offloading Keeps Hardware Ultra-Affordable</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Commercial medical adherence robots fail because they pack expensive touchscreens, cellular SIM contracts, redundant compute chips, and complex internal robotics into the unit. MAAAOEW re-uses the smartphone the patient already owns.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traditional Robots */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                    Traditional Smart Robots
                  </span>
                  <span className="text-xs text-slate-500">Obsolete Architecture</span>
                </div>

                <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
                  $300 – $600
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Requires expensive onboard processors, custom screens, cellular modems, and complex robotics. Unaffordable for low-income patients.
                </p>

                <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2 text-red-300/80">
                    ✕ Custom LCD/OLED touchscreen hardware costs ($85+)
                  </li>
                  <li className="flex items-center gap-2 text-red-300/80">
                    ✕ Dedicated cellular radio modem + monthly subscription ($15/mo)
                  </li>
                  <li className="flex items-center gap-2 text-red-300/80">
                    ✕ Standalone CPU & memory motherboards ($60+)
                  </li>
                  <li className="flex items-center gap-2 text-red-300/80">
                    ✕ Single-purpose medical stigmatizing appearance
                  </li>
                </ul>
              </div>

              {/* MAAAOEW Docking System */}
              <div className="bg-slate-950 border-2 border-cyan-500/60 rounded-2xl p-6 space-y-4 shadow-xl shadow-cyan-500/5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    MAAAOEW Docking System
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">Ultra-Affordable</span>
                </div>

                <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
                  $35 – $45
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Uses simple microchips for cloud communication. Leverages patient's smartphone CPU and pre-existing Gemini AI model.
                </p>

                <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">
                    ✓ Zero custom screen cost: Uses docked smartphone retina display
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">
                    ✓ Zero cellular contract: Uses home WiFi or phone 4G/5G connection
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">
                    ✓ Offloads AI processing to smartphone CPU + Cloud Gemini
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400 font-medium">
                    ✓ Dual-utility as nightstand phone charger (normalizes companion)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
