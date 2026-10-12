import React, { useState } from 'react';
import { ShiftSchedule } from '../types';
import { fetchShiftAdvice, playDispenserSound } from '../services/api';
import { Clock, Car, Sparkles, BellRing, Sun, Moon, Split, Volume2, ShieldCheck, Check } from 'lucide-react';

interface ShiftEngineProps {
  shifts: ShiftSchedule[];
  activeShiftId: string;
  onSelectShift: (id: string) => void;
  onUpdateShift: (shift: ShiftSchedule) => void;
}

export const ShiftEngine: React.FC<ShiftEngineProps> = ({
  shifts,
  activeShiftId,
  onSelectShift
}) => {
  const [activeShift, setActiveShift] = useState<ShiftSchedule>(
    shifts.find(s => s.id === activeShiftId) || shifts[0]
  );
  const [adviceLoading, setAdviceLoading] = useState<boolean>(false);
  const [customAdvice, setCustomAdvice] = useState<string>(
    "For taxi drivers on erratic split schedules, docking your phone immediately upon parking activates the recovery dose. This stabilizes arterial resistance before nocturnal sleep."
  );
  const [testedStep, setTestedStep] = useState<number | null>(null);

  const handleShiftChange = async (shift: ShiftSchedule) => {
    setActiveShift(shift);
    onSelectShift(shift.id);
    setAdviceLoading(true);
    try {
      const advice = await fetchShiftAdvice(shift.name, 'Yesterday 8:30 PM', '136/84 mmHg');
      setCustomAdvice(advice);
    } catch {
      // handled
    } finally {
      setAdviceLoading(false);
    }
  };

  const testAlertStep = (stepNumber: number) => {
    setTestedStep(stepNumber);
    if (stepNumber === 1) {
      playDispenserSound('chime');
    } else if (stepNumber === 2) {
      playDispenserSound('alert');
    } else if (stepNumber === 3) {
      playDispenserSound('chime');
    } else if (stepNumber === 4) {
      playDispenserSound('dispense');
    }
  };

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-cyan-400">01. Dynamic Alarm Engine</span>
          <span aria-hidden="true">·</span>
          <span>Shift-Syncing for Irregular Work Hours</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Hypertension Protection</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Multi-Sensory Alerts for Irregular Shifts
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Rigid clock-based alarms fail taxi drivers and shift workers. MAAAOEW’s Dynamic Alarm Engine adapts to daily taxi shifts, synchronizing dosage windows with phone docking cycles when the driver returns home.
        </p>
      </div>

      {/* Shift Selection & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shift Presets */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-cyan-400" />
              <span>Mr. Gonzales’s Shift Presets</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3">
            {shifts.map((shift) => {
              const isSelected = activeShift.id === shift.id;
              return (
                <div
                  key={shift.id}
                  onClick={() => handleShiftChange(shift)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white text-sm">
                      {shift.name.includes('Morning') && <Sun className="w-4 h-4 text-amber-400" />}
                      {shift.name.includes('Night') && <Moon className="w-4 h-4 text-indigo-400" />}
                      {shift.name.includes('Split') && <Split className="w-4 h-4 text-cyan-400" />}
                      <span>{shift.name}</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                      {shift.startTime} – {shift.endTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {shift.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Recommended Dose Window:</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {shift.recommendedDoseWindow}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cloud Gemini Advisory Card */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Cloud Gemini Circadian Advisory
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">
                {adviceLoading ? 'Calculating...' : 'Dynamic Shift Sync'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              "{customAdvice}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Patient: Mr. Andres Gonzales (Taxi Fleet #408)</span>
              <span>Regimen: Amlodipine 10mg + Losartan 50mg</span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Sensory Alert Sequence Workflow (Slide 6 breakdown) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BellRing className="w-5 h-5 text-cyan-400" />
              <span>4-Stage Multi-Sensory Alert Sequence</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Physical Verification</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike standard phone alarms that are easily swiped away while driving or exhausted, MAAAOEW activates progressive physical cues that require docking verification.
          </p>

          <div className="space-y-3.5">
            {/* Step 1 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                    01
                  </span>
                  <span className="text-sm font-semibold text-white">Shift Sync · Dynamic Alarm Engine</span>
                </div>
                <button
                  onClick={() => testAlertStep(1)}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded transition-colors"
                >
                  Test Step
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adapts to daily taxi schedules rather than rigid clock hours. As soon as shift hours conclude, the docking window opens.
              </p>
              {testedStep === 1 && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono pt-1">
                  <Check className="w-3.5 h-3.5" /> Shift window calibrated. Timer armed.
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/60">
                    02
                  </span>
                  <span className="text-sm font-semibold text-white">Visual Flash · Red OLED Alert</span>
                </div>
                <button
                  onClick={() => testAlertStep(2)}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 rounded transition-colors"
                >
                  Test Step
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eyes and dock base illuminate in vibrant red when dosage is overdue, creating high-salience ambient awareness even from across the room.
              </p>
              {testedStep === 2 && (
                <div className="text-[11px] text-red-400 flex items-center gap-1 font-mono pt-1 animate-pulse">
                  <BellRing className="w-3.5 h-3.5" /> Red OLED indicators flashing (Overdue Warning).
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60">
                    03
                  </span>
                  <span className="text-sm font-semibold text-white">Voice Prompt · High-Output Acoustic Speaker</span>
                </div>
                <button
                  onClick={() => testAlertStep(3)}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded transition-colors"
                >
                  Test Step
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Speaks clear audible instructions directly through the cat base chamber, cutting through traffic fatigue and domestic background noise.
              </p>
              {testedStep === 3 && (
                <div className="text-[11px] text-amber-300 flex items-center gap-1 font-mono pt-1">
                  <Volume2 className="w-3.5 h-3.5" /> High-output speaker triggered: "Dock phone to release dose."
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                    04
                  </span>
                  <span className="text-sm font-semibold text-white">Mouth Release · Safe Physical Dispense</span>
                </div>
                <button
                  onClick={() => testAlertStep(4)}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded transition-colors"
                >
                  Test Step
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pills release into the mouth tray only upon patient docking verification, ensuring pills never spill or dispense unattended.
              </p>
              {testedStep === 4 && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Precision latch opened: Amlodipine + Losartan in tray.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
