import React, { useState } from 'react';
import { ClinicPatient } from '../types';
import { playDispenserSound } from '../services/api';
import { Stethoscope, CheckCircle2, AlertTriangle, Phone, Calendar, Send, Pill, Users, Sparkles, FileText, Check } from 'lucide-react';

export const PharmacyPortal: React.FC = () => {
  const [patients, setPatients] = useState<ClinicPatient[]>([
    {
      id: 'pt-1',
      name: 'Mr. Andres Gonzales',
      age: 60,
      occupation: 'Taxi Driver (Shift Worker)',
      phone: '+1 (555) 234-8901',
      baselineBP: '160/100 mmHg',
      currentBP: '126/82 mmHg',
      adherenceRate: 94,
      streakDays: 14,
      lastDispensed: 'Today 2:15 PM (Post-Shift)',
      refillDueDays: 8,
      shiftPattern: 'Split Shift (Morning + Evening Rush)',
      status: 'optimal',
      notes: 'Excellent adherence since MAAAOEW dock pairing. Feeling fine fallacy controlled by daily audio lessons.'
    },
    {
      id: 'pt-2',
      name: 'Elena Morales',
      age: 58,
      occupation: 'Hospital Night Nurse',
      phone: '+1 (555) 782-3490',
      baselineBP: '154/96 mmHg',
      currentBP: '132/86 mmHg',
      adherenceRate: 91,
      streakDays: 9,
      lastDispensed: 'Yesterday 8:00 AM (Post-Night Shift)',
      refillDueDays: 12,
      shiftPattern: 'Graveyard Shift (7 PM – 7 AM)',
      status: 'optimal',
      notes: 'Docked in bedroom nightstand. Cat OLED alerts wake her gently after day sleep.'
    },
    {
      id: 'pt-3',
      name: 'Robert Tanaka',
      age: 63,
      occupation: 'Freight Delivery Driver',
      phone: '+1 (555) 432-1188',
      baselineBP: '168/104 mmHg',
      currentBP: '144/92 mmHg',
      adherenceRate: 76,
      streakDays: 2,
      lastDispensed: '2 Days Ago 9:30 PM',
      refillDueDays: 3,
      shiftPattern: 'Long Haul Weekend Route',
      status: 'attention_needed',
      notes: 'Missed dosage on long haul route. Pharmacist follow-up outreach suggested.'
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-1');
  const [consultationStep, setConsultationStep] = useState<number>(1);
  const [pharmacistNoteText, setPharmacistNoteText] = useState<string>('');
  const [noteSentSuccess, setNoteSentSuccess] = useState<boolean>(false);
  const [refillOrderedPatientId, setRefillOrderedPatientId] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleSendPharmacistVoiceNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacistNoteText.trim()) return;
    playDispenserSound('success');
    setNoteSentSuccess(true);
    setTimeout(() => {
      setNoteSentSuccess(false);
      setPharmacistNoteText('');
    }, 2800);
  };

  const handleTriggerRefill = (patientId: string) => {
    playDispenserSound('chime');
    setRefillOrderedPatientId(patientId);
    setTimeout(() => {
      setPatients(prev =>
        prev.map(p =>
          p.id === patientId
            ? { ...p, refillDueDays: 30, status: 'optimal', notes: `${p.notes} [Bioequivalent generic 30-day refill batch auto-packaged]` }
            : p
        )
      );
      setRefillOrderedPatientId(null);
    }, 1500);
  };

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-cyan-400">Implementation Plan</span>
          <span aria-hidden="true">·</span>
          <span>Pharmacy & Clinic Dispensing Workflow</span>
          <span aria-hidden="true">·</span>
          <span>Continuous Adherence Supervision</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Community Pharmacy & Clinic Dispensing Portal
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Clinicians and community pharmacists prescribe and calibrate MAAAOEW units directly at the dispensary counter. Real-time telemetry notifies pharmacists when refills or shift adjustments are needed.
        </p>
      </div>

      {/* 3-Step Guided Clinic Dispensing Protocol (Slide 10 breakdown) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              <span>Standard Dispensing Protocol (Activity 9.3)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Countertop protocol for onboarding hypertensive shift-working patients.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setConsultationStep(1)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                consultationStep === 1 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 1: Consult & Load
            </button>
            <button
              onClick={() => setConsultationStep(2)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                consultationStep === 2 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 2: App Pairing
            </button>
            <button
              onClick={() => setConsultationStep(3)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                consultationStep === 3 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Step 3: Monitoring
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            {consultationStep === 1 && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  01. Initial Clinical Consultation
                </div>
                <h4 className="text-xl font-bold text-white">
                  Regimen Loading & Shift Pattern Assessment
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  The pharmacist assesses the driver's irregular work shifts and inspects prescription labels. Pharmacist loads <strong className="text-white">Amlodipine 10mg</strong> into the Left Ear compartment and <strong className="text-white">Losartan 50mg</strong> into the Right Ear compartment.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Dual Standard Prescription Bottle Latches Locked
                  </div>
                  <div className="text-slate-400">
                    Standard child-resistant bottles fit directly inside the cat ear cavities without repackaging, preserving original clinical barcodes and expiration dates.
                  </div>
                </div>
              </div>
            )}

            {consultationStep === 2 && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  02. App Pairing & Docking
                </div>
                <h4 className="text-xl font-bold text-white">
                  Phone Docking Setup & Shift Calibration
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Pharmacist guides the patient to install the MAAAOEW smartphone application. The smartphone connects via low-energy NFC/Bluetooth to the dock base and configures shift-based dynamic reminders.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Phone-As-Brain Synchronized
                  </div>
                  <div className="text-slate-400">
                    Patient places their smartphone into the dock. The phone's front screen immediately becomes the cat's communicative OLED face and vocal assistant.
                  </div>
                </div>
              </div>
            )}

            {consultationStep === 3 && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  03. Continuous Cloud Monitoring
                </div>
                <h4 className="text-xl font-bold text-white">
                  Cloud Gemini Adherence Tracking & Automated Refills
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  The cloud telemetry system tracks compliance metrics, verifies physical dock releases, and alerts the pharmacy when refills or clinical follow-ups are needed before medication runs out.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Community Clinic Generic Discount Program Active
                  </div>
                  <div className="text-slate-400">
                    Slashing recurring drug costs by up to 70% with automatic generic bioequivalence matching.
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setConsultationStep(s => (s % 3) + 1)}
                className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors"
              >
                Next Workflow Stage →
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
              <img
                src="/src/assets/images/pharmacist_consultation_1791765018602.jpg"
                alt="Pharmacist consulting patient and loading medication into cat smart dispenser"
                className="w-full h-72 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 flex justify-between">
                <span>Community Pharmacy Consultation Desk</span>
                <span className="text-cyan-300 font-mono">Prescription Ear Loading</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Clinic Patient Roster & Telemetry Console */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Patient List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Active Pharmacy Patients</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Hypertension Panel</span>
          </div>

          <div className="space-y-3">
            {patients.map(patient => {
              const isSelected = patient.id === selectedPatientId;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{patient.name}</div>
                      <div className="text-xs text-slate-400">{patient.occupation}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
                        {patient.adherenceRate}%
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Adherence</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Streak: <strong className="text-emerald-400 font-mono">{patient.streakDays}d</strong></span>
                    <span className="text-slate-400">BP: <strong className="text-white font-mono">{patient.currentBP}</strong></span>
                    <span className={`font-mono text-[11px] ${patient.status === 'optimal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {patient.status === 'optimal' ? '● On-Track' : '▲ Action Needed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Patient Adherence Profile & Actions */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xl font-bold text-white">{selectedPatient.name}</div>
              <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                <span>{selectedPatient.occupation}</span>
                <span>·</span>
                <span>{selectedPatient.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerRefill(selectedPatient.id)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Pill className="w-3.5 h-3.5" />
                {refillOrderedPatientId === selectedPatient.id ? 'Ordering Refill...' : 'Auto-Refill Batch'}
              </button>
            </div>
          </div>

          {/* Vitals & Adherence Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Baseline BP</div>
              <div className="font-mono text-red-400 font-bold text-sm">{selectedPatient.baselineBP}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Current BP</div>
              <div className="font-mono text-emerald-400 font-bold text-sm">{selectedPatient.currentBP}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Adherence Streak</div>
              <div className="font-mono text-cyan-400 font-bold text-sm">{selectedPatient.streakDays} Consecutive Days</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Refill Due In</div>
              <div className="font-mono text-white font-bold text-sm">{selectedPatient.refillDueDays} Days</div>
            </div>
          </div>

          {/* Shift Schedule & Clinical Notes */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Driver Shift Synchronized Pattern</span>
              <span className="text-cyan-300 font-mono">{selectedPatient.shiftPattern}</span>
            </div>
            <p className="text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
              {selectedPatient.notes}
            </p>
          </div>

          {/* Pharmacist Encouragement Note to Dock */}
          <form onSubmit={handleSendPharmacistVoiceNote} className="space-y-3">
            <label className="block text-xs font-bold text-white">
              Send Clinician Encouragement Note to Patient's Dock
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Great job keeping your adherence streak, Andres! Your BP is stabilizing nicely."
                value={pharmacistNoteText}
                onChange={(e) => setPharmacistNoteText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Transmit to Dock
              </button>
            </div>
            {noteSentSuccess && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                <Check className="w-3.5 h-3.5" /> Note transmitted to Mr. Gonzales's bedside dock speaker.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
