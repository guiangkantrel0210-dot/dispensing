import React, { useState } from 'react';
import { Cpu, Smartphone, Volume2, Pill, Zap, Eye, ShieldCheck, ChevronRight } from 'lucide-react';
import { playDispenserSound } from '../services/api';

export const HardwareExplorer: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<'brain' | 'ears' | 'mouth' | 'speaker' | 'oled'>('brain');

  const components = [
    {
      id: 'brain' as const,
      name: 'Phone-As-Brain Docking Bay',
      kicker: 'Computing Engine & Cloud Gateway',
      summary: 'Dock your existing phone directly into the cat body. The phone acts as CPU, visual retina display, audio synthesizer, and network gateway.',
      specs: [
        'Zero redundant processor: Eliminates $60+ onboard CPU motherboard',
        'High-resolution OLED screen provided by docked phone display',
        'Cellular 4G/5G and Wi-Fi internet bridged natively through smartphone',
        'Direct connection to Cloud Gemini AI adherence engine'
      ],
      interactiveAction: 'Test Dock Communication Sync'
    },
    {
      id: 'ears' as const,
      name: 'Cat Ear Dual Rx Compartments',
      kicker: 'Standard Prescription Bottle Retention',
      summary: 'Dedicated compartments inside the sculpted cat ears hold dual standard prescription bottles without requiring messy pill repackaging.',
      specs: [
        'Standard 30-dram and 40-dram pharmacy bottle compatibility',
        'Left Ear: Amlodipine 10mg compartment with rotary latch',
        'Right Ear: Losartan 50mg compartment with rotary latch',
        'Preserves original tamper-evident pharmacy labels and barcodes'
      ],
      interactiveAction: 'Test Bottle Lock Verification'
    },
    {
      id: 'mouth' as const,
      name: 'Mouth Dispenser Mechanism',
      kicker: 'Safe Precision Dispensing Tray',
      summary: 'Automated micro-stepper motor releases the exact prescribed dosage into an accessible open mouth tray upon verified phone docking.',
      specs: [
        'Dual optical infrared gate sensors verify pill drop count',
        'Safety interlock: Dispenses only when patient phone is locked in dock',
        'Food-grade antimicrobial silicone delivery chute',
        'Accessible ergonomic tray designed for arthritis and tremor safety'
      ],
      interactiveAction: 'Test Precision Pill Drop'
    },
    {
      id: 'oled' as const,
      name: 'OLED Visual Alert Eyes',
      kicker: 'Ambient Peripheral Signaling',
      summary: 'Eyes illuminate in distinct color codes. Ambient amber for upcoming dosing windows, vibrant pulsing red when dosage is overdue.',
      specs: [
        'Red OLED Alert (625nm): Pierces dark bedroom and peripheral vision',
        'Amber Breather: Gentle circadian wake-up reminder',
        'Cyan/Teal confirmation: Verified ingestion visual cue',
        'Ultra-low power consumption (<0.2W LED array)'
      ],
      interactiveAction: 'Cycle OLED Alert Codes'
    },
    {
      id: 'speaker' as const,
      name: 'Acoustic Base Speaker Chamber',
      kicker: 'High-Decibel Voice Guidance',
      summary: 'High-decibel acoustic sound chamber engineered to penetrate severe fatigue, bedroom distance, and noisy post-shift environments.',
      specs: [
        'Acoustic reflex resonant cavity tuned for 300Hz - 4kHz human vocal clarity',
        'High-decibel voice output (~85–90 dB peak capability)',
        'Delivers Gemini AI daily voice micro-lessons and bedtime alerts',
        'Volume adapts automatically based on ambient noise profile'
      ],
      interactiveAction: 'Test Acoustic Speaker Resonance'
    }
  ];

  const current = components.find(c => c.id === activeComponent) || components[0];

  const handleTestHardwareAction = () => {
    if (activeComponent === 'brain') playDispenserSound('success');
    if (activeComponent === 'ears') playDispenserSound('chime');
    if (activeComponent === 'mouth') playDispenserSound('dispense');
    if (activeComponent === 'oled') playDispenserSound('alert');
    if (activeComponent === 'speaker') playDispenserSound('chime');
  };

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-cyan-400">Hardware Innovation</span>
          <span aria-hidden="true">·</span>
          <span>Integrated System Components</span>
          <span aria-hidden="true">·</span>
          <span>Slide 3 & 4 Architecture</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          The MAAAOEW Companion Dock Design
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
          Traditional medical robots cost hundreds of dollars due to redundant processors and touchscreens. MAAAOEW’s phone-as-brain architecture offloads complexity to the user's existing device, keeping hardware costs at $35–$45.
        </p>
      </div>

      {/* Component Tabs & Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation List */}
        <div className="lg:col-span-4 space-y-2">
          {components.map((comp) => {
            const isActive = comp.id === activeComponent;
            return (
              <button
                key={comp.id}
                onClick={() => setActiveComponent(comp.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs text-cyan-400 font-mono">{comp.kicker}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{comp.name}</div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Component Specs Panel */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                {current.kicker}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                {current.name}
              </h3>
            </div>

            <button
              onClick={handleTestHardwareAction}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              {current.interactiveAction}
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {current.summary}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Engineering Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.specs.map((spec, i) => (
                <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Dock Diagram Card */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span>Base Dimensions: 180mm × 145mm × 210mm</span>
            <span>Total Hardware BOM: &lt;$22.50</span>
            <span className="text-emerald-400 font-mono">Target Retail: $39.99</span>
          </div>
        </div>
      </div>
    </div>
  );
};
