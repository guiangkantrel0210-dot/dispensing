import React, { useState, useEffect } from 'react';
import { MedicationItem, MicroLesson, DispenseRecord } from '../types';
import { fetchMicroLesson, playDispenserSound, speakText } from '../services/api';
import { Volume2, VolumeX, Sparkles, AlertCircle, CheckCircle2, Pill, RefreshCw, Zap, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface DockSimulatorProps {
  medications: MedicationItem[];
  onDispense: (medIds: string[]) => void;
  dispenseHistory: DispenseRecord[];
  onNavigateToShifts: () => void;
  onNavigateToCaseStudy: () => void;
}

export const DockSimulator: React.FC<DockSimulatorProps> = ({
  medications,
  onDispense,
  dispenseHistory,
  onNavigateToShifts,
  onNavigateToCaseStudy
}) => {
  const [isDocked, setIsDocked] = useState<boolean>(true);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [dispensedPillsInTray, setDispensedPillsInTray] = useState<boolean>(false);
  const [highOutputSpeaker, setHighOutputSpeaker] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<'feeling_fine' | 'irregular_shifts' | 'generic_savings'>('feeling_fine');
  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [cancelSpeech, setCancelSpeech] = useState<(() => void) | null>(null);

  const [activeLesson, setActiveLesson] = useState<MicroLesson>({
    title: "Combating the 'Feeling Fine' Fallacy: Continuous Arterial Protection",
    audioScript: "Good evening, Andres. Even when your head feels clear and you feel completely fine, high blood pressure quietly strains your blood vessels like over-inflated tires on a hot asphalt highway. Taking your Amlodipine and Losartan today maintains vascular cushioning even without symptoms.",
    clinicalExplanation: "Hypertension is clinically silent. Asymptomatic blood pressure spikes (such as Andres's baseline of 160/100 mmHg) cause microvascular shear stress and severe cardiovascular event risk if doses are skipped during shift recovery.",
    keyTakeaway: "Amlodipine continuously relaxes peripheral arteries, while Losartan blocks renin-angiotensin vasoconstriction. Medication works in the background even when you feel 100%."
  });

  // Load lesson
  const loadLesson = async (topic: 'feeling_fine' | 'irregular_shifts' | 'generic_savings') => {
    setLessonLoading(true);
    if (cancelSpeech) cancelSpeech();
    setIsSpeaking(false);
    try {
      const result = await fetchMicroLesson(topic, 'Mr. Andres Gonzales', 'Evening Taxi Shift');
      setActiveLesson(result.lesson);
    } catch {
      // handled
    } finally {
      setLessonLoading(false);
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      if (cancelSpeech) cancelSpeech();
      setIsSpeaking(false);
    } else {
      if (highOutputSpeaker) {
        playDispenserSound('chime');
      }
      const stopper = speakText(activeLesson.audioScript, () => {
        setIsSpeaking(false);
      });
      setCancelSpeech(() => stopper);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      if (cancelSpeech) cancelSpeech();
    };
  }, [cancelSpeech]);

  const handleDispenseAction = () => {
    if (isDispensing) return;
    setIsDispensing(true);
    playDispenserSound('dispense');

    setTimeout(() => {
      setDispensedPillsInTray(true);
      playDispenserSound('success');
      onDispense(medications.map(m => m.id));
      setIsDispensing(false);
      setIsOverdue(false);
    }, 700);
  };

  const handleTakePills = () => {
    playDispenserSound('chime');
    setDispensedPillsInTray(false);
  };

  const leftMed = medications.find(m => m.compartment === 'left_ear') || medications[0];
  const rightMed = medications.find(m => m.compartment === 'right_ear') || medications[1];

  return (
    <div className="space-y-12">
      {/* Hero Product Proposition & Context */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-cyan-400">Activity 9.3</span>
              <span aria-hidden="true">·</span>
              <span>Dispensing 2 Solution</span>
              <span aria-hidden="true">·</span>
              <span>Hypertension Regimen Compliance</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Smartphone-Docked Medication Assistant
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              An accessible, cat-inspired smart dispenser utilizing docked smartphones as the primary computing engine. 
              Designed for patients like Mr. Andres Gonzales who battle irregular shifts, silent symptom illusions, and medication expenses.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsDocked(!isDocked)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  isDocked
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                {isDocked ? 'Docked State Active (Cat Mode)' : 'Dock Phone into Cat Body'}
              </button>

              <button
                onClick={() => {
                  const nextOverdue = !isOverdue;
                  setIsOverdue(nextOverdue);
                  if (nextOverdue) playDispenserSound('alert');
                }}
                className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  isOverdue
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {isOverdue ? 'Simulating Red OLED Alert (Overdue)' : 'Test Overdue Shift Alert'}
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <span>Target: Hypertension (<span className="text-emerald-400 font-mono tabular-nums">&lt;140/90 mmHg</span>)</span>
              <span aria-hidden="true">·</span>
              <span>Hardware Cost: <span className="text-cyan-400 font-semibold font-mono tabular-nums">$35-$45</span> vs <span className="text-slate-500 line-through">$300-$600</span></span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-950">
              <img
                src="/src/assets/images/maaoew_cat_dock_hero_1791764992582.jpg"
                alt="MAAAOEW Cat-inspired smart medication dispenser dock with docked smartphone"
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex justify-between items-center">
                <span>Cat Ears: Dual Rx Compartments</span>
                <span className="text-cyan-300 font-mono">Phone-As-Brain Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Simulator: The Smartphone Dock & The Cat Companion */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Cat Dispenser Hardware Mockup */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>MAAAOEW Companion Dock</span>
                {isDocked && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    ONLINE · PHONE DOCKED
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Smartphone acts as CPU, visual display, audio communicator, and network gateway.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighOutputSpeaker(!highOutputSpeaker)}
                title="Toggle High-Output Acoustic Speaker"
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  highOutputSpeaker ? 'bg-slate-800 text-cyan-400' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {highOutputSpeaker ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">90dB Speaker</span>
              </button>
            </div>
          </div>

          {/* Cat Hardware Body Shell */}
          <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 border-2 border-slate-700/80 shadow-2xl">
            {/* Top Cat Ears (Medication Compartments) */}
            <div className="flex justify-between items-end px-4 -mt-12 mb-4">
              {/* Left Cat Ear Compartment */}
              <div className="w-36 bg-slate-800/95 border-2 border-slate-700 rounded-t-2xl p-2.5 text-center shadow-lg relative group">
                <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <span>Slot A · Sorted ✓</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{leftMed?.name}</div>
                <div className="text-[11px] text-slate-300 font-mono tabular-nums">{leftMed?.dosage}</div>
                <div className="mt-1 text-[10px] text-slate-400 font-mono flex items-center justify-between px-1">
                  <span className="text-cyan-300">{leftMed?.pillsRemaining} Pres.</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400">{leftMed?.pillsDispensed || 2} Disp.</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all"
                    style={{ width: `${((leftMed?.pillsRemaining || 0) / (leftMed?.totalPills || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Right Cat Ear Compartment */}
              <div className="w-36 bg-slate-800/95 border-2 border-slate-700 rounded-t-2xl p-2.5 text-center shadow-lg relative group">
                <div className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <span>Slot B · Sorted ✓</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{rightMed?.name}</div>
                <div className="text-[11px] text-slate-300 font-mono tabular-nums">{rightMed?.dosage}</div>
                <div className="mt-1 text-[10px] text-slate-400 font-mono flex items-center justify-between px-1">
                  <span className="text-teal-300">{rightMed?.pillsRemaining} Pres.</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400">{rightMed?.pillsDispensed || 2} Disp.</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-teal-400 transition-all"
                    style={{ width: `${((rightMed?.pillsRemaining || 0) / (rightMed?.totalPills || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cat Face & Dock Bay */}
            <div className="relative bg-slate-950 rounded-2xl border border-slate-700 p-4 min-h-[340px] flex flex-col justify-between">
              {/* OLED Cat Eyes Indicators */}
              <div className="flex justify-between items-center px-6 pt-2">
                {/* Left Eye */}
                <div
                  className={`w-12 h-8 rounded-full border transition-all ${
                    isOverdue
                      ? 'bg-red-500/80 border-red-400 animate-oled-red shadow-lg shadow-red-500/50'
                      : isDocked
                      ? 'bg-cyan-500/80 border-cyan-300 animate-oled-amber shadow-md shadow-cyan-500/40'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                  style={{ borderRadius: '60% 40% 60% 40% / 50% 50% 50% 50%' }}
                />

                {/* Nose / Status Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-2 rounded-full ${isOverdue ? 'bg-red-400' : 'bg-cyan-400'}`} />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {isOverdue ? 'OVERDUE' : 'READY'}
                  </span>
                </div>

                {/* Right Eye */}
                <div
                  className={`w-12 h-8 rounded-full border transition-all ${
                    isOverdue
                      ? 'bg-red-500/80 border-red-400 animate-oled-red shadow-lg shadow-red-500/50'
                      : isDocked
                      ? 'bg-cyan-500/80 border-cyan-300 animate-oled-amber shadow-md shadow-cyan-500/40'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                  style={{ borderRadius: '40% 60% 40% 60% / 50% 50% 50% 50%' }}
                />
              </div>

              {/* Smartphone Screen Mounted in Dock */}
              <div className="my-3 mx-auto w-full max-w-[280px] bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-inner">
                {isDocked ? (
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                      <span>Dock Battery: 94% ⚡</span>
                      <span>Taxi Shift Sync: Active</span>
                    </div>

                    <div className="py-1">
                      <div className="text-xs text-slate-400">Prescription Dose Ready</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Amlodipine 10mg + Losartan 50mg
                      </div>
                      <div className="text-[11px] text-cyan-300 mt-0.5">
                        Shift Window: Post-Driving Recovery Dose
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-lg p-2 text-left border border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Target BP Goal:</span>
                        <span className="text-emerald-400 font-mono font-bold">&lt;140/90 mmHg</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="text-slate-400">Adherence Streak:</span>
                        <span className="text-cyan-400 font-mono font-bold">14 Days</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleDispenseAction}
                        disabled={isDispensing}
                        className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                          isDispensing
                            ? 'bg-slate-700 text-slate-400 cursor-wait'
                            : isOverdue
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/30'
                            : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-400/20'
                        }`}
                      >
                        {isDispensing ? 'Precision Motors Releasing...' : 'Dispense Prescribed Dose'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-xs font-semibold text-white">Smartphone Un-docked</div>
                    <p className="text-[11px] text-slate-400 px-2">
                      Dock your phone into the cat body to power the CPU, verify patient identity, and dispense medicine.
                    </p>
                    <button
                      onClick={() => setIsDocked(true)}
                      className="text-xs text-cyan-400 font-semibold underline mt-1"
                    >
                      Re-dock Phone
                    </button>
                  </div>
                )}
              </div>

              {/* Cat Mouth Dispenser Tray Area */}
              <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl p-3 text-center relative min-h-[70px] flex flex-col justify-center items-center">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Mouth Dispenser Tray (Safe Release Zone)
                </div>

                {dispensedPillsInTray ? (
                  <div className="flex items-center gap-3 mt-1.5 animate-dispense">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-emerald-500/40">
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-300 inline-block shadow-sm" title="Amlodipine 10mg" />
                      <span className="w-4 h-2.5 rounded-full bg-teal-400 inline-block shadow-sm" title="Losartan 50mg" />
                      <span className="text-xs font-semibold text-emerald-400 ml-1">Pills Dispensed!</span>
                    </div>

                    <button
                      onClick={handleTakePills}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirm Taken
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5" />
                    <span>Tray empty. Optical sensor standing by.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Base Dock & Charger Footing */}
            <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-slate-400">
              <span>Base Dock: Integrated 15W Fast Qi & USB-C</span>
              <span>Acoustic Chamber: 90dB Voice Prompt</span>
            </div>
          </div>
        </div>

        {/* Right Column: "Combating Feeling Fine Fallacy" & AI Audio Micro-Lesson */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Daily AI Audio Micro-Lesson</h3>
              </div>
              <span className="text-xs text-cyan-400 font-mono">Gemini AI Engine</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Combats the dangerous <strong className="text-white">"Feeling Fine" fallacy</strong> where hypertensive patients stop medication when asymptomatic, triggering silent stroke and cardiovascular risks.
            </p>

            {/* Topic Selectors */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setSelectedTopic('feeling_fine');
                  loadLesson('feeling_fine');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTopic === 'feeling_fine' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Feeling Fine Fallacy
              </button>
              <button
                onClick={() => {
                  setSelectedTopic('irregular_shifts');
                  loadLesson('irregular_shifts');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTopic === 'irregular_shifts' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shift Work BP Spikes
              </button>
              <button
                onClick={() => {
                  setSelectedTopic('generic_savings');
                  loadLesson('generic_savings');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTopic === 'generic_savings' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Generic Bioequivalence
              </button>
            </div>

            {/* Active Lesson Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold text-white leading-snug">
                  {activeLesson.title}
                </h4>
                <button
                  onClick={() => loadLesson(selectedTopic)}
                  disabled={lessonLoading}
                  title="Generate Fresh Micro-Lesson"
                  className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${lessonLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Audio Prompt Script */}
              <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs text-slate-200 leading-relaxed italic">
                "{activeLesson.audioScript}"
              </div>

              {/* Clinical Explanation */}
              <div className="text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Clinical Mechanism:</div>
                <p className="leading-relaxed">{activeLesson.clinicalExplanation}</p>
              </div>

              {/* Key Takeaway */}
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-cyan-300">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <span><strong>Takeaway:</strong> {activeLesson.keyTakeaway}</span>
              </div>

              {/* Voice Prompt Playback Button */}
              <div className="pt-2">
                <button
                  onClick={handleToggleSpeak}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSpeaking
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                  {isSpeaking ? 'Playing Voice Lesson Through Speaker...' : 'Play Audio Lesson (Simulate Cat Speaker)'}
                </button>
              </div>
            </div>

            {/* Economic Viability & Generic Substitution */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Monthly Medication Financial Relief</span>
                <span className="text-emerald-400 font-mono font-bold">-70% Drug Cost</span>
              </div>
              <p className="text-xs text-slate-400">
                Automated generic substitution prompts replace expensive brand names with bioequivalent Amlodipine & Losartan.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Brand Reference:</div>
                  <div className="text-slate-400 line-through">$64.00 / month</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-emerald-500/30">
                  <div className="text-emerald-400 text-[10px]">MAAAOEW Generic:</div>
                  <div className="text-white font-bold">$18.50 / month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={onNavigateToShifts}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors text-left group"
            >
              <div className="font-semibold text-white group-hover:text-cyan-400 flex items-center justify-between">
                <span>Shift Sync Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-slate-400 text-[11px] mt-1">Configure taxi driving hours & dynamic alerts.</p>
            </button>

            <button
              onClick={onNavigateToCaseStudy}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors text-left group"
            >
              <div className="font-semibold text-white group-hover:text-cyan-400 flex items-center justify-between">
                <span>Mr. Andres Case</span>
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <p className="text-slate-400 text-[11px] mt-1">Review 160/100 mmHg baseline & clinical proof.</p>
            </button>
          </div>
        </div>
      </section>

      {/* Recent Dispensing Log Strip */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recent Verified Dispense Events</h3>
          <span className="text-xs text-slate-400 font-mono">Optical Verification Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dispenseHistory.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{item.timestamp}</span>
                <span className="text-emerald-400 font-mono font-medium">✓ Dispensed & Docked</span>
              </div>
              <div className="text-slate-400">{item.medications.join(', ')}</div>
              <div className="text-[11px] text-slate-500">{item.notes}</div>
              {item.bloodPressureSystolic && (
                <div className="text-[11px] text-cyan-400 font-mono pt-1 border-t border-slate-800">
                  Recorded BP: {item.bloodPressureSystolic}/{item.bloodPressureDiastolic} mmHg
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
