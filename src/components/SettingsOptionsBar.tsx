import React from 'react';
import { DockSettings } from '../types';
import { Settings, Volume2, Bell, Zap, Radio, RefreshCw, Check, Shield } from 'lucide-react';
import { playDispenserSound } from '../services/api';

interface SettingsOptionsBarProps {
  settings: DockSettings;
  onUpdateSettings: (newSettings: Partial<DockSettings>) => void;
  onCalibrateMotors: () => void;
}

export const SettingsOptionsBar: React.FC<SettingsOptionsBarProps> = ({
  settings,
  onUpdateSettings,
  onCalibrateMotors
}) => {
  const [saveToast, setSaveToast] = React.useState<boolean>(false);

  const handleToggle = (key: keyof DockSettings, value: unknown) => {
    onUpdateSettings({ [key]: value });
    playDispenserSound('chime');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>Companion Dock Settings & Options</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Hardware preferences, multi-sensory alert intensity, and pharmacy cloud integration.
          </p>
        </div>

        {saveToast && (
          <div className="text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40">
            <Check className="w-3.5 h-3.5" /> Preferences Saved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* Audio / Speaker Settings */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Acoustic Speaker Chamber
            </span>
            <span className="text-cyan-400 font-mono font-semibold">
              {settings.highOutputMode ? '90 dB (Traffic Boost)' : 'Normal'}
            </span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Boosts voice volume through the cat base chamber to pierce heavy traffic fatigue and background noise.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-slate-300">High-Output 90dB Mode</span>
            <button
              onClick={() => handleToggle('highOutputMode', !settings.highOutputMode)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.highOutputMode ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.highOutputMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Master Volume</span>
              <span className="font-mono">{settings.speakerVolume}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.speakerVolume}
              onChange={(e) => handleToggle('speakerVolume', Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* OLED Visual Alerts */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              OLED Cat Eye Visuals
            </span>
            <span className="text-amber-400 font-mono font-semibold">
              {settings.oledAlertsEnabled ? 'Active' : 'Muted'}
            </span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Eyes and base flash in vibrant red when shift dosage is overdue, switching to gentle amber when docked.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-slate-300">Overdue Red Flasher</span>
            <button
              onClick={() => handleToggle('oledAlertsEnabled', !settings.oledAlertsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.oledAlertsEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.oledAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-300">Voice Micro-Lessons</span>
            <button
              onClick={() => handleToggle('voiceLessonsEnabled', !settings.voiceLessonsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.voiceLessonsEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.voiceLessonsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hardware & Cloud Sync */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Hardware & Cloud Telemetry
            </span>
            <span className="text-emerald-400 font-mono font-semibold">Online</span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Syncs verified ingestion timestamps directly to the community clinic for automated generic refills.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-slate-300">Auto-Refill Clinic Sync</span>
            <button
              onClick={() => handleToggle('syncWithClinic', !settings.syncWithClinic)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.syncWithClinic ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.syncWithClinic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={onCalibrateMotors}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Calibrate Ear Stepper Motors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
