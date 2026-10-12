import React, { useState, useEffect } from 'react';
import { CalendarAdherenceDay, PharmacyStore, DockSettings, MedicationItem, PillInventoryEvent } from '../types';
import { AdherenceCalendar } from './AdherenceCalendar';
import { PharmacyMap } from './PharmacyMap';
import { SettingsOptionsBar } from './SettingsOptionsBar';
import { VoiceChatMenu } from './VoiceChatMenu';
import { PillSortingTracker } from './PillSortingTracker';
import { BatteryCharging, Clock, Pill, Calendar as CalendarIcon, MapPin, Settings, Zap, Volume2, ShieldCheck, ArrowRight, Play, AlertCircle, Mic, Layers, Box } from 'lucide-react';
import { playDispenserSound } from '../services/api';

interface IntroductionDashboardProps {
  medications: MedicationItem[];
  inventoryEvents: PillInventoryEvent[];
  onRestock: (compartment: 'left_ear' | 'right_ear' | 'both', quantity: number) => void;
  onAuditVerification: () => void;
  calendarDays: CalendarAdherenceDay[];
  onToggleDayStatus: (date: string) => void;
  pharmacies: PharmacyStore[];
  selectedPharmacyId: string;
  onSelectPharmacy: (id: string) => void;
  onReserveRefill: (pharmacy: PharmacyStore) => void;
  settings: DockSettings;
  onUpdateSettings: (newSettings: Partial<DockSettings>) => void;
  onTriggerDispense: () => void;
  onNavigateToSimulator: () => void;
  onNavigateToCaseStudy: () => void;
}

export const IntroductionDashboard: React.FC<IntroductionDashboardProps> = ({
  medications,
  inventoryEvents,
  onRestock,
  onAuditVerification,
  calendarDays,
  onToggleDayStatus,
  pharmacies,
  selectedPharmacyId,
  onSelectPharmacy,
  onReserveRefill,
  settings,
  onUpdateSettings,
  onTriggerDispense,
  onNavigateToSimulator,
  onNavigateToCaseStudy
}) => {
  // Option selection: 'calendar' | 'maps' | 'settings' | 'voice' | 'sorting' | 'all'
  const [activeOption, setActiveOption] = useState<'calendar' | 'maps' | 'settings' | 'voice' | 'sorting' | 'all'>('all');

  // Battery status & simulation
  const [batteryLevel, setBatteryLevel] = useState<number>(96);
  const [isCharging, setIsCharging] = useState<boolean>(true);

  // Countdown timer calculation (countdown to next scheduled dose at 21:15 today)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 48,
    seconds: 35
  });

  const totalPillsPresent = medications.reduce((sum, m) => sum + (m.pillsRemaining || 0), 0);
  const totalPillsDispensed = medications.reduce((sum, m) => sum + (m.pillsDispensed || 0), 0);

  // Ticking countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n: number) => n.toString().padStart(2, '0');

  const handleQuickDoseClick = () => {
    playDispenserSound('dispense');
    onTriggerDispense();
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP INTRODUCTION HERO HUD: Battery Charge + Next Pill Countdown + Cat Companion State */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Block: Welcome & Companion State */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>MAAAOEW COMPANION DOCK · ONLINE</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Good Evening, Andres
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Your smartphone is docked as the primary computing engine. Next hypertension regimen is scheduled for your post-shift recovery window.
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveOption('voice')}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Talk to MAAAOEW</span>
              </button>

              <button
                onClick={onNavigateToSimulator}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-slate-700/60"
              >
                <span>Cat Face Dock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onNavigateToCaseStudy}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700/60"
              >
                Mr. Andres Case Study
              </button>
            </div>
          </div>

          {/* Right Block: Live Hardware Telemetry (Battery Charge & Countdown) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CARD 1: Battery Charge Telemetry */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BatteryCharging className="w-4 h-4 text-emerald-400" />
                  Dock Battery Power
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Fast Qi 15W
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
                  {batteryLevel}%
                </span>
                <span className="text-xs text-emerald-400 font-medium">Charging</span>
              </div>

              {/* Visual Battery Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1">
                <span>Phone: Docked in Base</span>
                <span>Power: 9.1V / 1.6A</span>
              </div>
            </div>

            {/* CARD 2: Live Countdown on Next Pill to Take */}
            <div className="bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-5 space-y-3 shadow-lg shadow-cyan-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Next Pill Countdown
                </span>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Dose Window Active
                </span>
              </div>

              {/* Digital Countdown Timer */}
              <div className="font-mono text-3xl md:text-4xl font-extrabold text-cyan-400 tabular-nums tracking-tight">
                {formatDigits(timeLeft.hours)}
                <span className="text-slate-600">:</span>
                {formatDigits(timeLeft.minutes)}
                <span className="text-slate-600">:</span>
                {formatDigits(timeLeft.seconds)}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-white truncate">
                  Amlodipine 10mg + Losartan 50mg
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Scheduled: 21:15 (Post-Shift)</span>
                  <span className="text-emerald-400 font-semibold font-mono">Ear Compartments Ready</span>
                </div>
              </div>

              <button
                onClick={handleQuickDoseClick}
                className="w-full mt-1 py-2 px-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-400/20 flex items-center justify-center gap-1.5"
              >
                <Pill className="w-3.5 h-3.5" />
                Dispense Dose Early
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE CORE OPTIONS SELECTOR (Calendar, Maps, Settings) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Primary System Options
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an option below to manage adherence, find generic refills, or adjust dock settings.
            </p>
          </div>

          {/* Interactive Option Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveOption('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeOption === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Overview Console
            </button>
            <button
              onClick={() => setActiveOption('calendar')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeOption === 'calendar'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              a) Adherence Calendar
            </button>
            <button
              onClick={() => setActiveOption('maps')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeOption === 'maps'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              b) Pharmacy Maps & Prices
            </button>
            <button
              onClick={() => setActiveOption('settings')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeOption === 'settings'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              c) Settings Bar
            </button>
            <button
              onClick={() => setActiveOption('voice')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeOption === 'voice'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Voice Chat Menu
            </button>
            <button
              onClick={() => setActiveOption('sorting')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeOption === 'sorting'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Pill Sorting & Inventory
            </button>
          </div>
        </div>

        {/* Dynamic Display Based on Selected Option */}
        {activeOption === 'sorting' && (
          <PillSortingTracker
            medications={medications}
            inventoryEvents={inventoryEvents}
            onRestock={onRestock}
            onAuditVerification={onAuditVerification}
          />
        )}

        {activeOption === 'voice' && (
          <VoiceChatMenu
            batteryLevel={batteryLevel}
            onTriggerDispense={onTriggerDispense}
            onNavigateTab={(tab) => {
              if (tab === 'calendar') setActiveOption('calendar');
              if (tab === 'maps') setActiveOption('maps');
              if (tab === 'settings') setActiveOption('settings');
            }}
            isDocked={true}
            highOutputSpeaker={settings.highOutputMode}
          />
        )}

        {activeOption === 'calendar' && (
          <AdherenceCalendar
            days={calendarDays}
            onToggleDayStatus={onToggleDayStatus}
            streakDays={14}
            adherencePercentage={94}
          />
        )}

        {activeOption === 'maps' && (
          <PharmacyMap
            pharmacies={pharmacies}
            selectedPharmacyId={selectedPharmacyId}
            onSelectPharmacy={onSelectPharmacy}
            onReserveRefill={onReserveRefill}
          />
        )}

        {activeOption === 'settings' && (
          <SettingsOptionsBar
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onCalibrateMotors={() => {
              playDispenserSound('dispense');
            }}
          />
        )}

        {/* Overview Mode: Shows previews of all options side-by-side */}
        {activeOption === 'all' && (
          <div className="space-y-10">
            {/* Top Interactive Voice Assistant Banner */}
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Hands-Free Voice Recognition & Speech Chat</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">Ready</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Speak directly to your docked phone or tap voice intent shortcuts to dispense doses and ask questions.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveOption('voice')}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                Open Voice Chat Menu →
              </button>
            </div>

            {/* Embedded Live Voice Chat Menu Component */}
            <div className="pt-2">
              <VoiceChatMenu
                batteryLevel={batteryLevel}
                onTriggerDispense={onTriggerDispense}
                onNavigateTab={(tab) => {
                  if (tab === 'calendar') setActiveOption('calendar');
                  if (tab === 'maps') setActiveOption('maps');
                  if (tab === 'settings') setActiveOption('settings');
                }}
                isDocked={true}
                highOutputSpeaker={settings.highOutputMode}
              />
            </div>

            {/* Option Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Option Voice Chat Card */}
              <div
                onClick={() => setActiveOption('voice')}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">VOICE AI</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Voice Chat Menu
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Voice commands to dispense, check battery, and chat hands-free.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">90dB Speaker</span>
                  <span className="text-cyan-300">Open Voice →</span>
                </div>
              </div>

              {/* Option A: Calendar Card */}
              <div
                onClick={() => setActiveOption('calendar')}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">OPTION A</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Adherence Calendar
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Track daily ingestion compliance and 14-day streak.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Streak: <strong className="text-emerald-400">14d</strong></span>
                  <span className="text-cyan-300">Open Tracker →</span>
                </div>
              </div>

              {/* Option B: Pharmacy Map & Prices Card */}
              <div
                onClick={() => setActiveOption('maps')}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">OPTION B</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Pharmacy Maps
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Find nearest dispensaries and compare generic prices.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Generic: <strong className="text-emerald-400">$18.50</strong></span>
                  <span className="text-emerald-400">View Map →</span>
                </div>
              </div>

              {/* Option C: Settings Bar Card */}
              <div
                onClick={() => setActiveOption('settings')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">OPTION C</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    Settings Bar
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Control 90dB speaker boost, OLED eyes, and calibrations.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Speaker: <strong className="text-cyan-400">{settings.highOutputMode ? '90dB' : 'Norm'}</strong></span>
                  <span className="text-amber-400">Options →</span>
                </div>
              </div>

              {/* Option Pill Sorting & Inventory Card */}
              <div
                onClick={() => setActiveOption('sorting')}
                className="bg-slate-900 border border-slate-800 hover:border-teal-400 rounded-2xl p-5 space-y-3 cursor-pointer transition-all hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-teal-400 font-bold">INVENTORY</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                    Pill Sorting & Count
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Tracks pills present ({totalPillsPresent}) vs dispensed ({totalPillsDispensed}).
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Present: <strong className="text-teal-300">{totalPillsPresent}</strong></span>
                  <span className="text-teal-400">Chutes →</span>
                </div>
              </div>
            </div>

            {/* Embedded Live Adherence Calendar Section */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-cyan-400" />
                  <span>Adherence Tracker (October 2026)</span>
                </h3>
                <button
                  onClick={() => setActiveOption('calendar')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Expand Full Calendar View →
                </button>
              </div>
              <AdherenceCalendar
                days={calendarDays}
                onToggleDayStatus={onToggleDayStatus}
                streakDays={14}
                adherencePercentage={94}
              />
            </div>

            {/* Embedded Live Pharmacy Map Section */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Nearby Pharmacies & Cost Savings</span>
                </h3>
                <button
                  onClick={() => setActiveOption('maps')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Expand Full Map & Price Matrix →
                </button>
              </div>
              <PharmacyMap
                pharmacies={pharmacies}
                selectedPharmacyId={selectedPharmacyId}
                onSelectPharmacy={onSelectPharmacy}
                onReserveRefill={onReserveRefill}
              />
            </div>

            {/* Embedded Settings Bar */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-400" />
                  <span>Hardware Preferences</span>
                </h3>
                <button
                  onClick={() => setActiveOption('settings')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Manage All Settings →
                </button>
              </div>
              <SettingsOptionsBar
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                onCalibrateMotors={() => playDispenserSound('dispense')}
              />
            </div>

            {/* Embedded Pill Sorting & Inventory Section */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-400" />
                  <span>Pill Sorting & Compartment Inventory</span>
                </h3>
                <button
                  onClick={() => setActiveOption('sorting')}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                >
                  Expand Full Chute Diagnostics →
                </button>
              </div>
              <PillSortingTracker
                medications={medications}
                inventoryEvents={inventoryEvents}
                onRestock={onRestock}
                onAuditVerification={onAuditVerification}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
