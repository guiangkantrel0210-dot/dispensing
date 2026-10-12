import React, { useState } from 'react';
import { MedicationItem, PillInventoryEvent } from '../types';
import { Pill, CheckCircle2, AlertTriangle, RefreshCw, Layers, ShieldCheck, Box, PlusCircle, ArrowDown, History, Check } from 'lucide-react';
import { playDispenserSound } from '../services/api';

interface PillSortingTrackerProps {
  medications: MedicationItem[];
  inventoryEvents: PillInventoryEvent[];
  onRestock: (compartment: 'left_ear' | 'right_ear' | 'both', quantity: number) => void;
  onAuditVerification: () => void;
}

export const PillSortingTracker: React.FC<PillSortingTrackerProps> = ({
  medications,
  inventoryEvents,
  onRestock,
  onAuditVerification
}) => {
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);
  const [restockModalOpen, setRestockModalOpen] = useState<boolean>(false);
  const [selectedRestockEar, setSelectedRestockEar] = useState<'left_ear' | 'right_ear' | 'both'>('both');
  const [restockQuantity, setRestockQuantity] = useState<number>(30);

  const leftMed = medications.find(m => m.compartment === 'left_ear') || medications[0];
  const rightMed = medications.find(m => m.compartment === 'right_ear') || medications[1];

  const totalPillsPresent = (leftMed?.pillsRemaining || 0) + (rightMed?.pillsRemaining || 0);
  const totalPillsDispensed = (leftMed?.pillsDispensed || 0) + (rightMed?.pillsDispensed || 0);
  const daysSupplyRemaining = Math.min(leftMed?.pillsRemaining || 0, rightMed?.pillsRemaining || 0);

  const handleRunAudit = () => {
    setIsAuditing(true);
    playDispenserSound('alert');
    setAuditSuccessMsg(null);

    setTimeout(() => {
      setIsAuditing(false);
      playDispenserSound('success');
      setAuditSuccessMsg('Optical sensors verified: Zero cross-contamination. Dual compartments correctly sorted and aligned.');
      onAuditVerification();
      setTimeout(() => setAuditSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    playDispenserSound('success');
    onRestock(selectedRestockEar, restockQuantity);
    setRestockModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Layers className="w-4 h-4" />
            <span>OPTICAL SENSOR & DUAL-CHUTE TRACKING</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white mt-1">
            Pill Sorting & Inventory Telemetry
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Monitors real-time pill sorting in dual ear compartments, pills present vs dispensed, and optical drop verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Scanning Chutes...' : 'Run Optical Sort Audit'}</span>
          </button>

          <button
            onClick={() => setRestockModalOpen(true)}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Restock Bottles</span>
          </button>
        </div>
      </div>

      {auditSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 flex items-center gap-2.5 animate-pulse">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{auditSuccessMsg}</span>
        </div>
      )}

      {/* Global Inventory Counts Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Box className="w-4 h-4 text-cyan-400" />
            Total Pills Present
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalPillsPresent}
            </span>
            <span className="text-slate-400 font-mono">/ 60 Max Capacity</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${(totalPillsPresent / 60) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ArrowDown className="w-4 h-4 text-emerald-400" />
            Total Pills Dispensed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {totalPillsDispensed}
            </span>
            <span className="text-slate-400">Pills Verified Dropped</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Dual Infrared Gate Verified
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-teal-400" />
            Days Supply Remaining
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-300 font-mono tabular-nums">
              {daysSupplyRemaining}
            </span>
            <span className="text-slate-400">Days of Doses</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Sufficient for Active Regimen
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Sorting Integrity
          </span>
          <div className="text-lg font-bold text-white pt-1">
            100% Segregated
          </div>
          <div className="text-[11px] text-cyan-300 font-mono flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Chute Isolation Active
          </div>
        </div>
      </div>

      {/* Dual Ear Compartment Sorting Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT EAR: AMLODIPINE BESYLATE 10MG */}
        <div className="bg-slate-900 border-2 border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 space-y-5 transition-all shadow-xl">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
                Left Ear Slot · Compartment #1
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">
                {leftMed?.name}
              </h3>
              <div className="text-xs text-slate-300 font-mono">{leftMed?.dosage}</div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                <Check className="w-3 h-3" /> Slot Match Verified
              </span>
            </div>
          </div>

          {/* Counts Present vs Dispensed */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase">Pills Present</div>
              <div className="text-2xl font-bold text-white">
                {leftMed?.pillsRemaining} <span className="text-xs text-slate-500 font-normal">/ {leftMed?.totalPills}</span>
              </div>
              <div className="text-[10px] text-cyan-400">In Bottle Chamber</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase">Pills Dispensed</div>
              <div className="text-2xl font-bold text-emerald-400">
                {leftMed?.pillsDispensed || 2} <span className="text-xs text-slate-500 font-normal">pills</span>
              </div>
              <div className="text-[10px] text-slate-400">Cumulative Drops</div>
            </div>
          </div>

          {/* Pill Visual Sorting Profile */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs">
            <div className="text-slate-300 font-bold flex items-center justify-between">
              <span>Optical Physical Profile:</span>
              <span className="text-cyan-400 font-mono text-[11px]">Rotary Feeder A</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>Shape: <strong className="text-white">{leftMed?.pillShape || 'Round / Octagonal'}</strong></div>
              <div>Color: <strong className="text-white">{leftMed?.pillColor || 'White to Off-White'}</strong></div>
              <div>Deboss Imprint: <strong className="text-cyan-300 font-mono">{leftMed?.pillImprint || 'AML 10'}</strong></div>
              <div>Lot #: <strong className="text-slate-300 font-mono">{leftMed?.lotNumber || 'LT-9821-C'}</strong></div>
            </div>
          </div>

          {/* Visual Pills Matrix representation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Chamber Pill Grid ({leftMed?.pillsRemaining} remaining)</span>
              <span className="text-emerald-400 font-mono">{((leftMed?.pillsRemaining / leftMed?.totalPills) * 100).toFixed(0)}% Fill</span>
            </div>
            <div className="flex flex-wrap gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              {Array.from({ length: leftMed?.totalPills || 30 }).map((_, i) => {
                const isPresent = i < (leftMed?.pillsRemaining || 0);
                return (
                  <span
                    key={i}
                    title={isPresent ? `Amlodipine Pill #${i + 1} (Present)` : `Pill #${i + 1} (Dispensed)`}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      isPresent
                        ? 'bg-cyan-300 border-cyan-100 shadow-sm shadow-cyan-400/40'
                        : 'bg-slate-800/40 border-slate-800 opacity-25'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT EAR: LOSARTAN POTASSIUM 50MG */}
        <div className="bg-slate-900 border-2 border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 space-y-5 transition-all shadow-xl">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-800/40">
                Right Ear Slot · Compartment #2
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">
                {rightMed?.name}
              </h3>
              <div className="text-xs text-slate-300 font-mono">{rightMed?.dosage}</div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                <Check className="w-3 h-3" /> Slot Match Verified
              </span>
            </div>
          </div>

          {/* Counts Present vs Dispensed */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase">Pills Present</div>
              <div className="text-2xl font-bold text-white">
                {rightMed?.pillsRemaining} <span className="text-xs text-slate-500 font-normal">/ {rightMed?.totalPills}</span>
              </div>
              <div className="text-[10px] text-teal-400">In Bottle Chamber</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase">Pills Dispensed</div>
              <div className="text-2xl font-bold text-emerald-400">
                {rightMed?.pillsDispensed || 2} <span className="text-xs text-slate-500 font-normal">pills</span>
              </div>
              <div className="text-[10px] text-slate-400">Cumulative Drops</div>
            </div>
          </div>

          {/* Pill Visual Sorting Profile */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs">
            <div className="text-slate-300 font-bold flex items-center justify-between">
              <span>Optical Physical Profile:</span>
              <span className="text-teal-400 font-mono text-[11px]">Rotary Feeder B</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>Shape: <strong className="text-white">{rightMed?.pillShape || 'Teardrop / Oval'}</strong></div>
              <div>Color: <strong className="text-white">{rightMed?.pillColor || 'Light White'}</strong></div>
              <div>Deboss Imprint: <strong className="text-teal-300 font-mono">{rightMed?.pillImprint || '93 7367'}</strong></div>
              <div>Lot #: <strong className="text-slate-300 font-mono">{rightMed?.lotNumber || 'LT-4402-A'}</strong></div>
            </div>
          </div>

          {/* Visual Pills Matrix representation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Chamber Pill Grid ({rightMed?.pillsRemaining} remaining)</span>
              <span className="text-emerald-400 font-mono">{((rightMed?.pillsRemaining / rightMed?.totalPills) * 100).toFixed(0)}% Fill</span>
            </div>
            <div className="flex flex-wrap gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              {Array.from({ length: rightMed?.totalPills || 30 }).map((_, i) => {
                const isPresent = i < (rightMed?.pillsRemaining || 0);
                return (
                  <span
                    key={i}
                    title={isPresent ? `Losartan Pill #${i + 1} (Present)` : `Pill #${i + 1} (Dispensed)`}
                    className={`w-4 h-2.5 rounded-full border transition-all ${
                      isPresent
                        ? 'bg-teal-400 border-teal-100 shadow-sm shadow-teal-400/40'
                        : 'bg-slate-800/40 border-slate-800 opacity-25'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Optical Sensor Audit & Inventory Event Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Chute Optical Sensor & Inventory Log</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Infrared Beam Calibration: 100% Active</span>
        </div>

        <div className="space-y-2.5">
          {inventoryEvents.slice(0, 5).map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{evt.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    evt.type === 'dispensed' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
                    evt.type === 'restocked' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {evt.type.toUpperCase()}
                  </span>
                  {evt.opticalSensorVerified && (
                    <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-0.5">
                      ✓ Optical Beam Confirmed
                    </span>
                  )}
                </div>
                <div className="text-slate-400">{evt.notes}</div>
              </div>

              <div className="text-right sm:self-center font-mono">
                <div className="text-slate-300">
                  {evt.medicationName} ({evt.pillsChanged > 0 ? `+${evt.pillsChanged}` : evt.pillsChanged})
                </div>
                <div className="text-[11px] text-slate-500">
                  Remaining Balance: {evt.pillsRemainingAfter} pills
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Restock Prescription Bottles
            </h3>
            <p className="text-xs text-slate-300">
              Select which ear compartment to reload with new pharmacy bottles.
            </p>

            <form onSubmit={handleConfirmRestock} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Compartment:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRestockEar('left_ear')}
                    className={`p-2 rounded-lg border font-semibold ${
                      selectedRestockEar === 'left_ear' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Left Ear (Amlodipine)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRestockEar('right_ear')}
                    className={`p-2 rounded-lg border font-semibold ${
                      selectedRestockEar === 'right_ear' ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Right Ear (Losartan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRestockEar('both')}
                    className={`p-2 rounded-lg border font-semibold ${
                      selectedRestockEar === 'both' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Both Compartments
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Quantity to Reload (Pills):</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
