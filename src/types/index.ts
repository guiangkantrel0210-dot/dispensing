export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  compartment: 'left_ear' | 'right_ear';
  schedule: string;
  instructions: string;
  pillsRemaining: number;
  totalPills: number;
  pillsDispensed: number;
  pillShape: string;
  pillColor: string;
  pillImprint: string;
  sortingSlotStatus: 'verified_correct' | 'mismatch_warning' | 'calibrating';
  lotNumber: string;
  expiryDate: string;
  isBioequivalentGeneric: boolean;
  brandEquivalent: string;
  genericCost: number;
  brandCost: number;
}

export interface PillInventoryEvent {
  id: string;
  timestamp: string;
  type: 'dispensed' | 'restocked' | 'sorted_audit' | 'manual_correction';
  compartment: 'left_ear' | 'right_ear' | 'both';
  medicationName: string;
  pillsChanged: number;
  pillsRemainingAfter: number;
  opticalSensorVerified: boolean;
  notes: string;
}

export interface ShiftSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  recommendedDoseWindow: string;
  isCurrent: boolean;
}

export interface DispenseRecord {
  id: string;
  timestamp: string;
  medications: string[];
  status: 'taken' | 'dispensed' | 'missed';
  notes: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
}

export interface MicroLesson {
  title: string;
  audioScript: string;
  clinicalExplanation: string;
  keyTakeaway: string;
}

export interface ClinicPatient {
  id: string;
  name: string;
  age: number;
  occupation: string;
  phone: string;
  baselineBP: string;
  currentBP: string;
  adherenceRate: number; // percentage
  streakDays: number;
  lastDispensed: string;
  refillDueDays: number;
  shiftPattern: string;
  status: 'optimal' | 'attention_needed' | 'refill_ready';
  notes: string;
}

export interface PharmacyStore {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  drivingMinutes: number;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  amlodipineGenericPrice: number;
  amlodipineBrandPrice: number;
  losartanGenericPrice: number;
  losartanBrandPrice: number;
  comboGenericTotal: number;
  discountProgramName: string;
  inStock: boolean;
}

export interface CalendarAdherenceDay {
  date: string;
  dayNumber: number;
  dayOfWeek: string;
  status: 'taken' | 'missed' | 'today' | 'upcoming';
  timeTaken?: string;
  systolic?: number;
  diastolic?: number;
  notes?: string;
}

export interface DockSettings {
  speakerVolume: number;
  highOutputMode: boolean;
  oledAlertsEnabled: boolean;
  oledColor: 'amber' | 'red' | 'cyan';
  autoDispenseOnDock: boolean;
  voiceLessonsEnabled: boolean;
  syncWithClinic: boolean;
  activeShiftId: string;
}
