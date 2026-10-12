import React, { useState } from 'react';
import { CalendarAdherenceDay } from '../types';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Heart, Award, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { playDispenserSound } from '../services/api';

interface AdherenceCalendarProps {
  days: CalendarAdherenceDay[];
  onToggleDayStatus: (date: string) => void;
  streakDays: number;
  adherencePercentage: number;
}

export const AdherenceCalendar: React.FC<AdherenceCalendarProps> = ({
  days,
  onToggleDayStatus,
  streakDays,
  adherencePercentage
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(days.find(d => d.status === 'today')?.date || days[10]?.date || '2026-10-11');
  const selectedDay = days.find(d => d.date === selectedDate) || days[0];

  const handleDayClick = (day: CalendarAdherenceDay) => {
    setSelectedDate(day.date);
    playDispenserSound('chime');
  };

  const handleMarkToday = () => {
    onToggleDayStatus(selectedDate);
    playDispenserSound('success');
  };

  return (
    <div className="space-y-6">
      {/* Top metrics strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Monthly Adherence Rate</div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono tabular-nums mt-0.5">
              {adherencePercentage}%
            </div>
            <div className="text-[11px] text-emerald-400">Target &gt;85% Achieved</div>
          </div>
          <Award className="w-8 h-8 text-cyan-400/80" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Consecutive Docking Streak</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5">
              {streakDays} Days
            </div>
            <div className="text-[11px] text-slate-400">Verified by Companion Dock</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400/80" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Mean Systolic Reduction</div>
            <div className="text-2xl font-extrabold text-teal-400 font-mono tabular-nums mt-0.5">
              -34 mmHg
            </div>
            <div className="text-[11px] text-teal-300">Down from 160 baseline</div>
          </div>
          <Heart className="w-8 h-8 text-teal-400/80" />
        </div>
      </div>

      {/* Main Calendar Grid and Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">October 2026 · Regimen Adherence Log</h3>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Taken
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Missed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" /> Today
              </span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Days Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank padding days for October 2026 (Starts on Thursday) */}
            <div className="h-16 rounded-xl bg-slate-950/20 border border-transparent" />
            <div className="h-16 rounded-xl bg-slate-950/20 border border-transparent" />
            <div className="h-16 rounded-xl bg-slate-950/20 border border-transparent" />
            <div className="h-16 rounded-xl bg-slate-950/20 border border-transparent" />

            {days.map((day) => {
              const isSelected = day.date === selectedDate;
              return (
                <button
                  key={day.date}
                  onClick={() => handleDayClick(day)}
                  className={`h-16 p-1.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : day.status === 'taken'
                      ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      : day.status === 'today'
                      ? 'bg-cyan-950/40 border-cyan-500/60'
                      : day.status === 'missed'
                      ? 'bg-red-950/20 border-red-800/40'
                      : 'bg-slate-950/30 border-slate-800/40 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                      {day.dayNumber}
                    </span>
                    {day.status === 'taken' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                    )}
                    {day.status === 'missed' && (
                      <span className="w-2 h-2 rounded-full bg-red-400 shadow-sm" />
                    )}
                    {day.status === 'today' && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {day.systolic ? `${day.systolic}/${day.diastolic}` : day.status === 'taken' ? '✓ Taken' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detail Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              Adherence Log Detail
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              {selectedDay.date} ({selectedDay.dayOfWeek})
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={`font-semibold font-mono ${
                selectedDay.status === 'taken' ? 'text-emerald-400' :
                selectedDay.status === 'missed' ? 'text-red-400' :
                selectedDay.status === 'today' ? 'text-cyan-400' : 'text-slate-500'
              }`}>
                {selectedDay.status === 'taken' ? '● Verified Taken' :
                 selectedDay.status === 'missed' ? '▲ Missed Dose' :
                 selectedDay.status === 'today' ? '★ Scheduled Today' : 'Upcoming'}
              </span>
            </div>

            {selectedDay.timeTaken && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Docking Time:</span>
                <span className="font-mono text-white font-medium">{selectedDay.timeTaken}</span>
              </div>
            )}

            {selectedDay.systolic && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Recorded BP:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedDay.systolic} / {selectedDay.diastolic} mmHg
                </span>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px]">Medications Dispensed:</div>
              <div className="text-white font-medium">Amlodipine 10mg + Losartan 50mg</div>
              <div className="text-[11px] text-slate-500 mt-1">{selectedDay.notes || 'Normal post-shift phone docking verification.'}</div>
            </div>

            <button
              onClick={handleMarkToday}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Toggle Intake Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
