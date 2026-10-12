import React, { useState } from 'react';
import { MedicationItem, ShiftSchedule, DispenseRecord, CalendarAdherenceDay, PharmacyStore, DockSettings, PillInventoryEvent } from './types';
import { Navbar, NavigationTab } from './components/Navbar';
import { IntroductionDashboard } from './components/IntroductionDashboard';
import { DockSimulator } from './components/DockSimulator';
import { ShiftEngine } from './components/ShiftEngine';
import { PatientCaseStudy } from './components/PatientCaseStudy';
import { PharmacyPortal } from './components/PharmacyPortal';
import { HardwareExplorer } from './components/HardwareExplorer';
import { Footer } from './components/Footer';
import { playDispenserSound } from './services/api';
import { Pill, CheckCircle2, X } from 'lucide-react';

export default function App() {
  // First Introduction UI as default
  const [activeTab, setActiveTab] = useState<NavigationTab>('intro');

  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'med-amlodipine',
      name: 'Amlodipine Besylate',
      dosage: '10 mg daily',
      compartment: 'left_ear',
      schedule: 'Once daily upon shift return',
      instructions: 'Calcium channel blocker for vascular relaxation',
      pillsRemaining: 28,
      totalPills: 30,
      pillsDispensed: 2,
      pillShape: 'Round / Octagonal',
      pillColor: 'White',
      pillImprint: 'AML 10',
      sortingSlotStatus: 'verified_correct',
      lotNumber: 'LT-9821-C',
      expiryDate: '11/2027',
      isBioequivalentGeneric: true,
      brandEquivalent: 'Norvasc',
      genericCost: 7.50,
      brandCost: 28.00
    },
    {
      id: 'med-losartan',
      name: 'Losartan Potassium',
      dosage: '50 mg daily',
      compartment: 'right_ear',
      schedule: 'Once daily upon shift return',
      instructions: 'Angiotensin II receptor antagonist for arterial protection',
      pillsRemaining: 28,
      totalPills: 30,
      pillsDispensed: 2,
      pillShape: 'Teardrop / Oval',
      pillColor: 'Light White',
      pillImprint: '93 7367',
      sortingSlotStatus: 'verified_correct',
      lotNumber: 'LT-4402-A',
      expiryDate: '09/2027',
      isBioequivalentGeneric: true,
      brandEquivalent: 'Cozaar',
      genericCost: 11.00,
      brandCost: 36.00
    }
  ]);

  // Pill sorting & inventory events history
  const [inventoryEvents, setInventoryEvents] = useState<PillInventoryEvent[]>([
    {
      id: 'inv-1',
      timestamp: 'Today · 2:15 PM',
      type: 'dispensed',
      compartment: 'both',
      medicationName: 'Amlodipine 10mg + Losartan 50mg',
      pillsChanged: -2,
      pillsRemainingAfter: 56,
      opticalSensorVerified: true,
      notes: 'Dual beam optical interlock confirmed drop into mouth tray.'
    },
    {
      id: 'inv-2',
      timestamp: 'Yesterday · 9:45 PM',
      type: 'dispensed',
      compartment: 'both',
      medicationName: 'Amlodipine 10mg + Losartan 50mg',
      pillsChanged: -2,
      pillsRemainingAfter: 58,
      opticalSensorVerified: true,
      notes: 'Nightstand post-shift recovery dose verified by infrared gate.'
    },
    {
      id: 'inv-3',
      timestamp: 'Oct 01, 2026 · 10:00 AM',
      type: 'restocked',
      compartment: 'both',
      medicationName: 'Initial Prescription Bottles',
      pillsChanged: 60,
      pillsRemainingAfter: 60,
      opticalSensorVerified: true,
      notes: 'Pharmacist consultation loaded and sealed dual ear compartments.'
    }
  ]);

  // Calendar adherence tracker data for October 2026
  const [calendarDays, setCalendarDays] = useState<CalendarAdherenceDay[]>([
    { date: '2026-10-01', dayNumber: 1, dayOfWeek: 'Thu', status: 'taken', timeTaken: '21:18', systolic: 138, diastolic: 88, notes: 'Nightstand dock drop verified.' },
    { date: '2026-10-02', dayNumber: 2, dayOfWeek: 'Fri', status: 'taken', timeTaken: '21:30', systolic: 136, diastolic: 86, notes: 'Voice micro-lesson completed.' },
    { date: '2026-10-03', dayNumber: 3, dayOfWeek: 'Sat', status: 'taken', timeTaken: '22:05', systolic: 134, diastolic: 85, notes: 'Late weekend shift return.' },
    { date: '2026-10-04', dayNumber: 4, dayOfWeek: 'Sun', status: 'taken', timeTaken: '20:45', systolic: 130, diastolic: 84, notes: 'Bedtime docking.' },
    { date: '2026-10-05', dayNumber: 5, dayOfWeek: 'Mon', status: 'taken', timeTaken: '21:10', systolic: 132, diastolic: 84, notes: 'Split shift commute.' },
    { date: '2026-10-06', dayNumber: 6, dayOfWeek: 'Tue', status: 'taken', timeTaken: '21:22', systolic: 128, diastolic: 82, notes: 'Arterial relaxation verified.' },
    { date: '2026-10-07', dayNumber: 7, dayOfWeek: 'Wed', status: 'missed', notes: 'Double overtime shift; delayed docking.' },
    { date: '2026-10-08', dayNumber: 8, dayOfWeek: 'Thu', status: 'taken', timeTaken: '21:15', systolic: 134, diastolic: 86, notes: 'Resumed regimen promptly.' },
    { date: '2026-10-09', dayNumber: 9, dayOfWeek: 'Fri', status: 'taken', timeTaken: '21:40', systolic: 128, diastolic: 82, notes: 'OLED amber reminder confirmed.' },
    { date: '2026-10-10', dayNumber: 10, dayOfWeek: 'Sat', status: 'taken', timeTaken: '22:10', systolic: 126, diastolic: 80, notes: 'Night shift return.' },
    { date: '2026-10-11', dayNumber: 11, dayOfWeek: 'Sun', status: 'today', timeTaken: '21:15 (Scheduled)', systolic: 124, diastolic: 80, notes: 'Docked and charging.' },
    { date: '2026-10-12', dayNumber: 12, dayOfWeek: 'Mon', status: 'upcoming' },
    { date: '2026-10-13', dayNumber: 13, dayOfWeek: 'Tue', status: 'upcoming' },
    { date: '2026-10-14', dayNumber: 14, dayOfWeek: 'Wed', status: 'upcoming' },
    { date: '2026-10-15', dayNumber: 15, dayOfWeek: 'Thu', status: 'upcoming' },
    { date: '2026-10-16', dayNumber: 16, dayOfWeek: 'Fri', status: 'upcoming' },
    { date: '2026-10-17', dayNumber: 17, dayOfWeek: 'Sat', status: 'upcoming' },
    { date: '2026-10-18', dayNumber: 18, dayOfWeek: 'Sun', status: 'upcoming' },
    { date: '2026-10-19', dayNumber: 19, dayOfWeek: 'Mon', status: 'upcoming' },
    { date: '2026-10-20', dayNumber: 20, dayOfWeek: 'Tue', status: 'upcoming' },
    { date: '2026-10-21', dayNumber: 21, dayOfWeek: 'Wed', status: 'upcoming' },
    { date: '2026-10-22', dayNumber: 22, dayOfWeek: 'Thu', status: 'upcoming' },
    { date: '2026-10-23', dayNumber: 23, dayOfWeek: 'Fri', status: 'upcoming' },
    { date: '2026-10-24', dayNumber: 24, dayOfWeek: 'Sat', status: 'upcoming' },
    { date: '2026-10-25', dayNumber: 25, dayOfWeek: 'Sun', status: 'upcoming' },
    { date: '2026-10-26', dayNumber: 26, dayOfWeek: 'Mon', status: 'upcoming' },
    { date: '2026-10-27', dayNumber: 27, dayOfWeek: 'Tue', status: 'upcoming' },
    { date: '2026-10-28', dayNumber: 28, dayOfWeek: 'Wed', status: 'upcoming' },
    { date: '2026-10-29', dayNumber: 29, dayOfWeek: 'Thu', status: 'upcoming' },
    { date: '2026-10-30', dayNumber: 30, dayOfWeek: 'Fri', status: 'upcoming' },
    { date: '2026-10-31', dayNumber: 31, dayOfWeek: 'Sat', status: 'upcoming' }
  ]);

  // Nearest Pharmacies with Price Comparison
  const [pharmacies] = useState<PharmacyStore[]>([
    {
      id: 'rx-1',
      name: 'City Center Community Pharmacy',
      address: '452 Mission Street, Suite 102',
      distanceMiles: 0.8,
      drivingMinutes: 3,
      lat: 37.7891,
      lng: -122.4014,
      phone: '(415) 555-0142',
      hours: 'Mon-Sun: 7:00 AM - 11:00 PM',
      amlodipineGenericPrice: 7.50,
      amlodipineBrandPrice: 28.00,
      losartanGenericPrice: 11.00,
      losartanBrandPrice: 36.00,
      comboGenericTotal: 18.50,
      discountProgramName: 'City MediShare Community Subsidy',
      inStock: true
    },
    {
      id: 'rx-2',
      name: 'Gonzales District Clinic Dispensary',
      address: '890 Harrison Ave, Ground Fl',
      distanceMiles: 1.4,
      drivingMinutes: 5,
      lat: 37.7785,
      lng: -122.4068,
      phone: '(415) 555-0189',
      hours: 'Mon-Sat: 8:00 AM - 9:00 PM',
      amlodipineGenericPrice: 6.50,
      amlodipineBrandPrice: 28.00,
      losartanGenericPrice: 9.50,
      losartanBrandPrice: 36.00,
      comboGenericTotal: 16.00,
      discountProgramName: 'Municipal Chronic Disease Assistance',
      inStock: true
    },
    {
      id: 'rx-3',
      name: 'Metro Rx Health & Transit Hub',
      address: '1220 Market Blvd (Near Taxi Queue)',
      distanceMiles: 2.1,
      drivingMinutes: 7,
      lat: 37.7762,
      lng: -122.4172,
      phone: '(415) 555-0211',
      hours: '24 Hours / 7 Days (Drive-Thru)',
      amlodipineGenericPrice: 8.00,
      amlodipineBrandPrice: 29.00,
      losartanGenericPrice: 11.20,
      losartanBrandPrice: 36.00,
      comboGenericTotal: 19.20,
      discountProgramName: 'Transit Worker Care Partnership',
      inStock: true
    },
    {
      id: 'rx-4',
      name: 'St. Jude Community Health Pharmacy',
      address: '305 Valencia Street',
      distanceMiles: 3.2,
      drivingMinutes: 11,
      lat: 37.7681,
      lng: -122.4221,
      phone: '(415) 555-0377',
      hours: 'Mon-Fri: 8:00 AM - 8:00 PM',
      amlodipineGenericPrice: 7.00,
      amlodipineBrandPrice: 27.50,
      losartanGenericPrice: 10.50,
      losartanBrandPrice: 35.00,
      comboGenericTotal: 17.50,
      discountProgramName: 'Community Access Rx Tier 1',
      inStock: true
    }
  ]);

  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('rx-1');

  // Dock Settings Options Bar State
  const [settings, setSettings] = useState<DockSettings>({
    speakerVolume: 85,
    highOutputMode: true,
    oledAlertsEnabled: true,
    oledColor: 'amber',
    autoDispenseOnDock: true,
    voiceLessonsEnabled: true,
    syncWithClinic: true,
    activeShiftId: 'shift-split'
  });

  const [shifts, setShifts] = useState<ShiftSchedule[]>([
    {
      id: 'shift-split',
      name: 'Split Shift (Morning + Evening Rush)',
      startTime: '06:00',
      endTime: '21:00',
      description: 'Hectic taxi shifts with 4-hr afternoon break. Highly irregular fatigue spikes.',
      recommendedDoseWindow: '21:15 – 22:30 (Upon Nightstand Phone Docking)',
      isCurrent: true
    },
    {
      id: 'shift-morning',
      name: 'Early Morning Transit Shift',
      startTime: '05:00',
      endTime: '13:30',
      description: 'Airport & morning commute queues. Peak driving concentration required.',
      recommendedDoseWindow: '14:00 – 15:00 (Post-Shift Rest)',
      isCurrent: false
    },
    {
      id: 'shift-night',
      name: 'Nightclub & Airport Night Run',
      startTime: '18:00',
      endTime: '03:00',
      description: 'Late night city driving. Critical to prevent overnight hypertensive spikes.',
      recommendedDoseWindow: '03:15 – 04:00 (Bedtime Docking)',
      isCurrent: false
    }
  ]);

  const [activeShiftId, setActiveShiftId] = useState<string>('shift-split');

  const [dispenseHistory, setDispenseHistory] = useState<DispenseRecord[]>([
    {
      id: 'rec-1',
      timestamp: 'Today · 2:15 PM',
      medications: ['Amlodipine 10mg', 'Losartan 50mg'],
      status: 'taken',
      notes: 'Docked after split shift rush. Optical sensor verified drop.',
      bloodPressureSystolic: 126,
      bloodPressureDiastolic: 82
    },
    {
      id: 'rec-2',
      timestamp: 'Yesterday · 9:45 PM',
      medications: ['Amlodipine 10mg', 'Losartan 50mg'],
      status: 'taken',
      notes: 'Evening bedtime dock verified. Voice lesson listened.',
      bloodPressureSystolic: 130,
      bloodPressureDiastolic: 84
    },
    {
      id: 'rec-3',
      timestamp: '2 Days Ago · 10:10 PM',
      medications: ['Amlodipine 10mg', 'Losartan 50mg'],
      status: 'taken',
      notes: 'Bedtime docking verified by companion sensor.',
      bloodPressureSystolic: 132,
      bloodPressureDiastolic: 86
    }
  ]);

  const [quickDispenseModalOpen, setQuickDispenseModalOpen] = useState<boolean>(false);
  const [modalDispensed, setModalDispensed] = useState<boolean>(false);

  const handleDispense = (medIds: string[]) => {
    setMedications(prev =>
      prev.map(med => {
        if (medIds.includes(med.id) && med.pillsRemaining > 0) {
          return {
            ...med,
            pillsRemaining: med.pillsRemaining - 1,
            pillsDispensed: (med.pillsDispensed || 0) + 1
          };
        }
        return med;
      })
    );

    const now = new Date();
    const timeStr = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newRecord: DispenseRecord = {
      id: `rec-${Date.now()}`,
      timestamp: timeStr,
      medications: ['Amlodipine 10mg', 'Losartan 50mg'],
      status: 'taken',
      notes: 'Verified docking release into cat mouth tray.',
      bloodPressureSystolic: 124,
      bloodPressureDiastolic: 80
    };

    setDispenseHistory(prev => [newRecord, ...prev]);

    // Inventory event log
    const newInvEvent: PillInventoryEvent = {
      id: `inv-${Date.now()}`,
      timestamp: timeStr,
      type: 'dispensed',
      compartment: 'both',
      medicationName: 'Amlodipine 10mg + Losartan 50mg',
      pillsChanged: -2,
      pillsRemainingAfter: medications.reduce((sum, m) => sum + m.pillsRemaining, 0) - 2,
      opticalSensorVerified: true,
      notes: 'Dual optical gate beam verified 1x Amlodipine + 1x Losartan release.'
    };
    setInventoryEvents(prev => [newInvEvent, ...prev]);

    // Also mark calendar today as taken
    setCalendarDays(prev =>
      prev.map(d =>
        d.status === 'today'
          ? { ...d, status: 'taken', timeTaken: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), systolic: 124, diastolic: 80 }
          : d
      )
    );
  };

  const handleRestock = (compartment: 'left_ear' | 'right_ear' | 'both', quantity: number) => {
    setMedications(prev =>
      prev.map(med => {
        if (compartment === 'both' || med.compartment === compartment) {
          return {
            ...med,
            pillsRemaining: Math.min(med.totalPills, med.pillsRemaining + quantity)
          };
        }
        return med;
      })
    );

    const now = new Date();
    const timeStr = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const compLabel = compartment === 'left_ear' ? 'Left Ear (Amlodipine)' : compartment === 'right_ear' ? 'Right Ear (Losartan)' : 'Both Compartments';

    const newInvEvent: PillInventoryEvent = {
      id: `inv-${Date.now()}`,
      timestamp: timeStr,
      type: 'restocked',
      compartment,
      medicationName: compLabel,
      pillsChanged: quantity,
      pillsRemainingAfter: 30,
      opticalSensorVerified: true,
      notes: `Restocked ${quantity} pills into ${compLabel}. Barcode and lot confirmed.`
    };
    setInventoryEvents(prev => [newInvEvent, ...prev]);
  };

  const handleAuditVerification = () => {
    const now = new Date();
    const timeStr = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newInvEvent: PillInventoryEvent = {
      id: `inv-${Date.now()}`,
      timestamp: timeStr,
      type: 'sorted_audit',
      compartment: 'both',
      medicationName: 'Dual Ear Sensor Diagnostic',
      pillsChanged: 0,
      pillsRemainingAfter: medications.reduce((sum, m) => sum + m.pillsRemaining, 0),
      opticalSensorVerified: true,
      notes: 'Optical chute audit confirmed 100% sorting integrity and correct slot orientation.'
    };
    setInventoryEvents(prev => [newInvEvent, ...prev]);
  };

  const handleToggleCalendarDay = (date: string) => {
    setCalendarDays(prev =>
      prev.map(d => {
        if (d.date === date) {
          const nextStatus = d.status === 'taken' ? 'missed' : 'taken';
          return {
            ...d,
            status: nextStatus,
            timeTaken: nextStatus === 'taken' ? '21:15 (Manual Verification)' : undefined
          };
        }
        return d;
      })
    );
  };

  const handleModalDispense = () => {
    playDispenserSound('dispense');
    setModalDispensed(true);
    handleDispense(medications.map(m => m.id));
    setTimeout(() => {
      playDispenserSound('success');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickDispense={() => {
          setModalDispensed(false);
          setQuickDispenseModalOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* FIRST INTRODUCTION UI: Default screen containing:
            - Battery Charge & Dock Telemetry
            - Countdown on Next Pill to Take
            - Options:
              a) Calendar Adherence Tracker
              b) Maps Nearest Pharmacist & Price Comparison
              c) Settings/Options Bar
        */}
        {activeTab === 'intro' && (
          <IntroductionDashboard
            medications={medications}
            inventoryEvents={inventoryEvents}
            onRestock={handleRestock}
            onAuditVerification={handleAuditVerification}
            calendarDays={calendarDays}
            onToggleDayStatus={handleToggleCalendarDay}
            pharmacies={pharmacies}
            selectedPharmacyId={selectedPharmacyId}
            onSelectPharmacy={setSelectedPharmacyId}
            onReserveRefill={(pharmacy) => {
              console.log('Refill reserved:', pharmacy.name);
            }}
            settings={settings}
            onUpdateSettings={(newSettings) => {
              setSettings(prev => ({ ...prev, ...newSettings }));
            }}
            onTriggerDispense={() => handleDispense(medications.map(m => m.id))}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToCaseStudy={() => setActiveTab('casestudy')}
          />
        )}

        {/* Deep Dive Views */}
        {activeTab === 'simulator' && (
          <DockSimulator
            medications={medications}
            onDispense={handleDispense}
            dispenseHistory={dispenseHistory}
            onNavigateToShifts={() => setActiveTab('shifts')}
            onNavigateToCaseStudy={() => setActiveTab('casestudy')}
          />
        )}

        {activeTab === 'shifts' && (
          <ShiftEngine
            shifts={shifts}
            activeShiftId={activeShiftId}
            onSelectShift={setActiveShiftId}
            onUpdateShift={(updated) => {
              setShifts(prev => prev.map(s => s.id === updated.id ? updated : s));
            }}
          />
        )}

        {activeTab === 'casestudy' && <PatientCaseStudy />}

        {activeTab === 'pharmacy' && <PharmacyPortal />}

        {activeTab === 'hardware' && <HardwareExplorer />}
      </main>

      <Footer onSelectTab={setActiveTab} />

      {/* Quick Test Dispense Modal */}
      {quickDispenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setQuickDispenseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Companion Hardware Test
              </div>
              <h3 className="text-xl font-bold text-white">
                Mouth Dispenser Test Cycle
              </h3>
              <p className="text-xs text-slate-300">
                Trigger physical motor drop of prescribed dual regimen (Amlodipine 10mg + Losartan 50mg) into the cat mouth tray.
              </p>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Left Ear:</span>
                <span className="text-white font-semibold">Amlodipine Besylate 10mg</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Right Ear:</span>
                <span className="text-white font-semibold">Losartan Potassium 50mg</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Verification:</span>
                <span className="text-emerald-400 font-mono">Smartphone Dock Interlock Verified</span>
              </div>
            </div>

            {modalDispensed ? (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-emerald-300">
                  Dose Successfully Dispensed & Logged!
                </div>
                <p className="text-xs text-slate-300">
                  Pills released into mouth tray. Recorded to adherence telemetry and calendar tracker.
                </p>
                <button
                  onClick={() => setQuickDispenseModalOpen(false)}
                  className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Close & View Dashboard
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setQuickDispenseModalOpen(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalDispense}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Pill className="w-4 h-4" />
                  Trigger Dispense
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
